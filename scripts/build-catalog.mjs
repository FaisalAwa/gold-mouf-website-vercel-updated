/* ═══════════════════════════════════════════════════════════════
   Write src/data/catalog.ts from the client product sheet.

   The rows themselves come from lib/catalog.mjs, which the Shopify
   import also reads — so the site and the store can never disagree
   about a price, a spec, or which photo belongs to which SKU.

     node scripts/build-catalog.mjs
   ═══════════════════════════════════════════════════════════════ */

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT } from './lib/sheet.mjs'
import { buildProducts, CATEGORY_ORDER } from './lib/catalog.mjs'

const { products, problems } = buildProducts()

/* ── Emit ───────────────────────────────────────────────────────── */

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const arr = (xs) => `[${xs.map(q).join(', ')}]`

function emit(p) {
  const f = [
    `id: ${q(p.id)}`,
    `slug: ${q(p.slug)}`,
    `sku: ${q(p.sku)}`,
    `name: ${q(p.name)}`,
    `category: ${q(p.category)}`,
    `collection: ${q(p.collection)}`,
    `price: ${p.price}`,
    `metal: ${q(p.metal)}`,
    `metalDetail: ${q(p.metalDetail)}`,
    `finish: ${q(p.finish)}`,
    p.stones && `stones: ${q(p.stones)}`,
    p.caratSpec && `caratSpec: ${q(p.caratSpec)}`,
    p.weight && `weight: ${q(p.weight)}`,
    p.dimensions && `dimensions: ${q(p.dimensions)}`,
    `tone: ${q(p.tone)}`,
    p.image ? `image: ${q(p.image)}` : null,
    p.gallery && `gallery: ${arr(p.gallery)}`,
    p.options && `options: [{ name: ${q(p.options[0].name)}, values: ${arr(p.options[0].values)} }]`,
    `madeToOrder: ${p.madeToOrder}`,
    p.bestseller && `bestseller: true`,
    `subtitle: ${q(p.subtitle)}`,
    `description: ${q(p.description)}`,
    `highlights: ${arr(p.highlights)}`,
  ].filter(Boolean)
  return `  {\n${f.map((l) => `    ${l},`).join('\n')}\n  },`
}

const byCat = {}
for (const p of products) (byCat[p.category] ||= []).push(p)

const LABEL = {
  earrings: 'EARRINGS', pendants: 'PENDANTS', chains: 'CHAINS',
  watches: 'WATCHES · custom G-SHOCK', 'belt-buckles': 'BELT BUCKLES',
}

const blocks = CATEGORY_ORDER.filter((c) => byCat[c]).map((c) => {
  const withPhoto = byCat[c].filter((p) => p.image).length
  const head = `  /* ── ${LABEL[c]} — ${byCat[c].length} SKU${byCat[c].length > 1 ? 's' : ''}, ${withPhoto} with photography ── */`
  return `${head}\n${byCat[c].map(emit).join('\n')}`
}).join('\n\n')

const header = `/* ═══════════════════════════════════════════════════════════════
   GOLD MOUF DOG — Catalog

   GENERATED from the client product sheet. Do not hand-edit:
   run \`node scripts/build-catalog.mjs\` after the sheet changes.
   Photography mapping + shop-filter buckets live in that script.

   ${products.length} SKUs · ${products.filter((p) => p.image).length} with photography on disk.
   ═══════════════════════════════════════════════════════════════ */

export type CategorySlug =
  | 'grills'
  | 'earrings'
  | 'pendants'
  | 'chains'
  | 'watches'
  | 'belt-buckles'

/** Coarse buckets used by the shop filters. The exact, sheet-accurate
 *  claim (plated vs solid, coated vs cast) lives in \`metalDetail\`. */
export type Metal =
  | '925 Silver'
  | 'Gold-Plated'
  | '10K White Gold'
  | '10K Yellow Gold'
  | '10K Rose Gold'
  | 'Custom G-SHOCK'

export type Finish =
  | 'Iced (Moissanite VVS)'
  | 'Iced (Lab Diamond)'
  | 'Iced (Natural Diamond)'
  | 'Solid'
  | 'Half & Half'
  | 'Two-Tone'
  | 'Open Face'

export interface Category {
  slug: CategorySlug
  name: string
  tagline: string
  /** short PLP intro line */
  blurb: string
  /** ordering weight on nav/home (lower = earlier) */
  order: number
  /** grills is the hero category — routes to the builder */
  hero?: boolean
}

export interface ProductOption {
  name: string
  values: string[]
}

export interface Product {
  id: string
  slug: string
  /** client SKU — also the key that resolves this piece to its Shopify variant */
  sku: string
  name: string
  category: CategorySlug
  /** the client's own collection name, e.g. "GoldMoufDog Faith Collection" */
  collection: string
  price: number
  compareAt?: number
  metal: Metal
  /** exact material wording from the client sheet */
  metalDetail: string
  finish: Finish
  stones?: string
  /** carat spec from the sheet, e.g. "1.50 CTW · 0.75 CT each earring" */
  caratSpec?: string
  /** gram weight from the sheet, e.g. "18–22 grams" */
  weight?: string
  /** face size, drop or length from the sheet, e.g. "23 mm" */
  dimensions?: string
  /** one-line PLP subtitle */
  subtitle: string
  description: string
  highlights: string[]
  /** absolute path under /public; when missing, a branded placeholder renders */
  image?: string
  gallery?: string[]
  /** buyer-selected options, e.g. the number pendant's 0-9 digit */
  options?: ProductOption[]
  /** teeth count for grills (drives price + tooth-map preview) */
  teeth?: number
  madeToOrder: boolean
  bestseller?: boolean
  /** metal tone used by the placeholder + swatch UI */
  tone: 'gold' | 'silver' | 'iced' | 'twotone'
}

export const CATEGORIES: Category[] = [
  { slug: 'grills', name: 'Grillz', tagline: 'Custom-fit, precision-set', blurb: 'Solid, iced, or half-and-half, molded to your exact bite. Design yours on the live builder.', order: 1, hero: true },
  { slug: 'earrings', name: 'Earrings', tagline: 'Iced studs & drops', blurb: 'Iced studs, clusters, and drops in 925 silver and 10K gold. Sold as matched pairs, hand-set stone by stone.', order: 2 },
  { slug: 'pendants', name: 'Pendants', tagline: 'Iced charms & custom pieces', blurb: 'Crosses, custom numbers, and statement pieces, fully iced and finished in-house.', order: 3 },
  { slug: 'chains', name: 'Chains', tagline: 'Iced Cuban link', blurb: 'Iced links to carry the pendants, set and locked by hand in 925 silver.', order: 4 },
  { slug: 'watches', name: 'Watches', tagline: 'Iced & customized', blurb: 'Authentic Casio G-SHOCKs rebuilt with hand-set iced bezels and bands.', order: 5 },
  { slug: 'belt-buckles', name: 'Belt Buckles', tagline: 'Iced statement buckles', blurb: 'Bold iced buckles, hand-set stone by stone and built to be seen.', order: 6 },
]

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

/** every category routes to its PLP */
export function categoryHref(slug: CategorySlug): string {
  return \`/shop/\${slug}\`
}

/* ── Products — real client catalog. Grills has none (builder-led,
      /configurator). Within a category, photographed pieces lead. ── */

export const PRODUCTS: Product[] = [
${blocks}
]
`

const footer = `
export function productsByCategory(slug: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category === slug)
}

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function productBySku(sku: string): Product | undefined {
  return PRODUCTS.find((p) => p.sku === sku)
}

export function bestsellers(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.bestseller).slice(0, limit)
}

/** Related pulls from the same category, photographed pieces first. */
export function related(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit)
}

/** Simple USD formatter used across PLP/PDP/cart. */
export function formatPrice(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}
`

writeFileSync(join(ROOT, 'src', 'data', 'catalog.ts'), header + footer, 'utf8')

const withPhoto = products.filter((p) => p.image).length
console.log(`catalog.ts → ${products.length} SKUs (${withPhoto} photographed, ${products.length - withPhoto} awaiting photography)`)
for (const c of CATEGORY_ORDER) {
  if (!byCat[c]) continue
  console.log(`  ${c.padEnd(14)} ${String(byCat[c].length).padStart(2)} SKUs · ${byCat[c].filter((p) => p.image).length} photographed`)
}
if (problems.length) {
  console.log('\nPROBLEMS:')
  for (const p of problems) console.log('  ! ' + p)
  process.exitCode = 1
}
