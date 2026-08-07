/* ═══════════════════════════════════════════════════════════════
   Push the client catalog into Shopify.

   Idempotent: keyed on product handle via productSet, so re-running
   after a sheet edit updates in place instead of duplicating. Safe
   to run as often as the sheet changes.

     node scripts/shopify-import.mjs --dry-run   # plan only
     node scripts/shopify-import.mjs             # write to Shopify
     node scripts/shopify-import.mjs --only=GMD-PND-CRS-MOI-925-WH

   Pieces are made to order, so inventory tracking stays off and
   every variant remains purchasable.
   ═══════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildProducts } from './lib/catalog.mjs'
import { ROOT } from './lib/sheet.mjs'
import { admin, stageUpload, DOMAIN } from './lib/shopify.mjs'

const args = process.argv.slice(2)
const DRY = args.includes('--dry-run')
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').split('=')[1]

const VENDOR = 'GoldMoufDog'
const PRODUCT_TYPE = {
  earrings: 'Earrings', pendants: 'Pendants', chains: 'Chains',
  watches: 'Watches', 'belt-buckles': 'Belt Buckles',
}
/** Channels the headless storefront and the Shop app read from. */
const PUBLISH_TO = ['Online Store', 'Goldmouf Headless', 'Shop']

/* ── Field shaping ──────────────────────────────────────────────── */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** The sheet's copy, plus its own spec bullets, as the Shopify listing body. */
function descriptionHtml(p) {
  const bullets = p.highlights.map((h) => `    <li>${esc(h)}</li>`).join('\n')
  return `<p>${esc(p.description)}</p>\n  <ul>\n${bullets}\n  </ul>`
}

/**
 * Shipping weight in grams. The sheet gives a range for the heavier
 * pieces ("140-165 grams") — take the top of it so postage is never
 * under-quoted. Stone-led rows carry carat, not mass: those return
 * null rather than a guessed number.
 */
function grams(weight) {
  if (!weight) return null
  const nums = weight.match(/[\d.]+/g)
  if (!nums || !/gram/i.test(weight)) return null
  return Math.max(...nums.map(Number))
}

function tagsFor(p) {
  return [
    p.collection,
    p.metal,
    p.finish,
    PRODUCT_TYPE[p.category],
    'Made to order',
    ...(p.image ? [] : ['needs-photography']),
  ].filter(Boolean)
}

/* The spec rows, mirrored onto the product so Shopify admin and any
   other channel carry the same detail the PDP shows. Definitions are
   created up front (see ensureDefinitions) — without one, a metafield
   stays invisible to the Storefront API. */
const METAFIELDS = [
  ['collection', 'Client collection'],
  ['metal_detail', 'Metal'],
  ['finish', 'Finish'],
  ['stones', 'Stones'],
  ['carat_spec', 'Total carat'],
  ['dimensions', 'Size'],
  ['gram_weight', 'Weight'],
  ['subtitle', 'Subtitle'],
]

function metafieldsFor(p) {
  const values = {
    collection: p.collection,
    metal_detail: p.metalDetail,
    finish: p.finish,
    stones: p.stones,
    carat_spec: p.caratSpec,
    dimensions: p.dimensions,
    gram_weight: p.weight,
    subtitle: p.subtitle,
  }
  return METAFIELDS
    .filter(([key]) => values[key])
    .map(([key]) => ({ namespace: 'gmd', key, value: values[key], type: 'single_line_text_field' }))
}

/** One variant per option combination; single-option pieces get Shopify's default. */
function variantsFor(p, weightGrams) {
  const inventoryItem = {
    tracked: false,
    requiresShipping: true,
    ...(weightGrams ? { measurement: { weight: { value: weightGrams, unit: 'GRAMS' } } } : {}),
  }
  const base = {
    price: String(p.price),
    taxable: true,
    inventoryPolicy: 'CONTINUE',
  }

  if (!p.options?.length) {
    return {
      productOptions: [{ name: 'Title', values: [{ name: 'Default Title' }] }],
      variants: [{
        ...base,
        sku: p.sku,
        optionValues: [{ optionName: 'Title', name: 'Default Title' }],
        inventoryItem: { ...inventoryItem, sku: p.sku },
      }],
    }
  }

  const option = p.options[0]
  return {
    productOptions: [{ name: option.name, values: option.values.map((name) => ({ name })) }],
    variants: option.values.map((value) => {
      // Matches the variantSku the PDP builds when adding to cart.
      const sku = `${p.sku}-${value}`
      return {
        ...base,
        sku,
        optionValues: [{ optionName: option.name, name: value }],
        inventoryItem: { ...inventoryItem, sku },
      }
    }),
  }
}

/* ── Queries ────────────────────────────────────────────────────── */

const Q_PUBLICATIONS = `{ publications(first: 25) { nodes { id name } } }`

const Q_COLLECTION = `
  query($handle: String!) {
    collectionByHandle(handle: $handle) { id }
  }`

const M_COLLECTION_CREATE = `
  mutation($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection { id }
      userErrors { field message }
    }
  }`

const M_PRODUCT_SET = `
  mutation($input: ProductSetInput!, $identifier: ProductSetIdentifiers!) {
    productSet(input: $input, identifier: $identifier, synchronous: true) {
      product { id handle title variants(first: 20) { nodes { id sku } } }
      userErrors { field message }
    }
  }`

const M_PUBLISH = `
  mutation($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      publishable { availablePublicationsCount { count } }
      userErrors { field message }
    }
  }`

const Q_DEFINITIONS = `
  query {
    metafieldDefinitions(first: 50, ownerType: PRODUCT, namespace: "gmd") {
      nodes { key }
    }
  }`

const M_DEFINITION_CREATE = `
  mutation($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition { id key }
      userErrors { field message code }
    }
  }`

/* ── Run ────────────────────────────────────────────────────────── */

const handleize = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const { products, problems } = buildProducts()
if (problems.length) {
  for (const p of problems) console.error('  ! ' + p)
  throw new Error('Refusing to import while the sheet and catalog config disagree')
}

const queue = ONLY ? products.filter((p) => p.sku === ONLY) : products
if (!queue.length) throw new Error(ONLY ? `No SKU matching ${ONLY}` : 'Nothing to import')

console.log(`${DRY ? 'PLAN' : 'IMPORT'} → ${DOMAIN}`)
console.log(`${queue.length} SKUs · ${queue.filter((p) => p.image).length} with photography\n`)

if (DRY) {
  for (const p of queue) {
    const { variants } = variantsFor(p, grams(p.weight))
    console.log(`${p.sku}`)
    console.log(`  handle    ${p.slug}`)
    console.log(`  title     ${p.name}`)
    console.log(`  price     $${p.price} · ${variants.length} variant${variants.length > 1 ? 's' : ''}`)
    console.log(`  weight    ${grams(p.weight) ? grams(p.weight) + ' g' : '— (sheet gives carat, not mass)'}`)
    console.log(`  images    ${[p.image, ...(p.gallery ?? [])].filter(Boolean).length || 'none — tagged needs-photography'}`)
    console.log(`  tags      ${tagsFor(p).join(', ')}`)
  }
  console.log('\nDry run — nothing written.')
  process.exit(0)
}

// Publications the products get published to.
const { publications } = await admin(Q_PUBLICATIONS)
const targets = publications.nodes.filter((n) => PUBLISH_TO.includes(n.name))
const publishInput = targets.map((t) => ({ publicationId: t.id }))
console.log(`Publishing to: ${targets.map((t) => t.name).join(', ')}\n`)

// Metafield definitions must exist before the values mean anything:
// an undefined metafield is invisible to the Storefront API and shows
// up unlabelled in admin.
const existing = new Set((await admin(Q_DEFINITIONS)).metafieldDefinitions.nodes.map((n) => n.key))
for (const [key, name] of METAFIELDS) {
  if (existing.has(key)) continue
  await admin(M_DEFINITION_CREATE, {
    definition: {
      name, namespace: 'gmd', key,
      type: 'single_line_text_field',
      ownerType: 'PRODUCT',
      // `gmd` is not an app-reserved namespace, so admin access is fixed
      // at the merchant-editable default and only storefront is ours to set.
      access: { storefront: 'PUBLIC_READ' },
    },
  })
  console.log(`  + metafield   gmd.${key}`)
}

// The client's own collection names, as Shopify collections. These are
// published to the same channels, or the storefront cannot read them.
const collectionIds = new Map()
for (const name of [...new Set(queue.map((p) => p.collection))].sort()) {
  const handle = handleize(name)
  const found = await admin(Q_COLLECTION, { handle })
  let id = found.collectionByHandle?.id
  if (!id) {
    id = (await admin(M_COLLECTION_CREATE, { input: { title: name, handle } })).collectionCreate.collection.id
    console.log(`  + collection  ${name}`)
  }
  await admin(M_PUBLISH, { id, input: publishInput })
  collectionIds.set(name, id)
}
console.log()

// Stage each photo once, even when two SKUs were to share one.
const staged = new Map()
async function resourceUrl(path) {
  if (!staged.has(path)) staged.set(path, await stageUpload(path))
  return staged.get(path)
}

/* SKU → variant id, written out for the storefront so a cart line
   resolves to a real checkout line with no runtime lookup. Merged
   rather than replaced, so a --only run cannot wipe the rest. */
const VARIANT_MAP = join(ROOT, 'src', 'data', 'shopify-variants.json')
const variantIds = (() => {
  try { return JSON.parse(readFileSync(VARIANT_MAP, 'utf8')).variants ?? {} } catch { return {} }
})()

let created = 0
const failures = []

for (const p of queue) {
  try {
    const photos = [p.image, ...(p.gallery ?? [])].filter(Boolean)
    const files = []
    for (const photo of photos) {
      files.push({
        originalSource: await resourceUrl(photo),
        contentType: 'IMAGE',
        alt: `${p.name} — ${p.metalDetail}`,
      })
    }

    const { productOptions, variants } = variantsFor(p, grams(p.weight))

    const { productSet } = await admin(M_PRODUCT_SET, {
      identifier: { handle: p.slug },
      input: {
        handle: p.slug,
        title: p.name,
        descriptionHtml: descriptionHtml(p),
        vendor: VENDOR,
        productType: PRODUCT_TYPE[p.category],
        status: 'ACTIVE',
        tags: tagsFor(p),
        collections: [collectionIds.get(p.collection)].filter(Boolean),
        metafields: metafieldsFor(p),
        productOptions,
        variants,
        ...(files.length ? { files } : {}),
      },
    })

    const product = productSet.product
    await admin(M_PUBLISH, { id: product.id, input: publishInput })

    for (const v of product.variants.nodes) if (v.sku) variantIds[v.sku] = v.id

    created++
    const photoNote = photos.length ? `${photos.length} photo${photos.length > 1 ? 's' : ''}` : 'NO PHOTO'
    console.log(
      `  ✓ ${String(created).padStart(2)}/${queue.length}  ${p.sku.padEnd(24)} ` +
      `$${String(p.price).padEnd(5)} ${String(product.variants.nodes.length).padStart(2)}v  ${photoNote}`,
    )
  } catch (err) {
    failures.push({ sku: p.sku, message: err.message })
    console.error(`  ✗ ${p.sku}: ${err.message}`)
  }
}

writeFileSync(
  VARIANT_MAP,
  JSON.stringify({ domain: DOMAIN, variants: variantIds }, null, 2) + '\n',
  'utf8',
)

console.log(`\n${created}/${queue.length} products live on ${DOMAIN}`)
console.log(`${Object.keys(variantIds).length} variant ids → src/data/shopify-variants.json`)
if (failures.length) {
  console.error(`\n${failures.length} failed:`)
  for (const f of failures) console.error(`  ${f.sku}  ${f.message}`)
  process.exitCode = 1
}
