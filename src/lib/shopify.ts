/* ═══════════════════════════════════════════════════════════════
   GOLD MOUF DOG — Shopify Storefront API

   Read-only product access plus cart writes. The token here is
   public by design: it ships in the client bundle and can do
   nothing but read published products and build carts. The admin
   token lives only in scripts/ and never reaches the browser.

   Cart lines resolve through src/data/shopify-variants.json, the
   SKU → variant map that scripts/shopify-import.mjs writes on every
   import. That keeps checkout a single round-trip with no lookup.
   ═══════════════════════════════════════════════════════════════ */

import variantData from '@/data/shopify-variants.json'

const DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined
const VERSION = (import.meta.env.VITE_SHOPIFY_API_VERSION as string | undefined) ?? '2025-01'

const VARIANTS = variantData.variants as Record<string, string>

/** False when the store credentials are absent — callers fall back to
 *  the by-hand order flow rather than showing a broken checkout. */
export const shopifyReady = Boolean(DOMAIN && TOKEN)

/** The Shopify variant id for a client SKU, if that SKU was imported. */
export function variantIdFor(sku: string | undefined): string | undefined {
  return sku ? VARIANTS[sku] : undefined
}

export class ShopifyError extends Error {}

async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!shopifyReady) throw new ShopifyError('Shopify storefront credentials are not configured')

  let res: Response
  try {
    res = await fetch(`https://${DOMAIN}/api/${VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
    })
  } catch {
    throw new ShopifyError('Could not reach Shopify. Check your connection and try again.')
  }

  if (!res.ok) throw new ShopifyError(`Shopify returned ${res.status}`)

  const body = (await res.json()) as { data?: T; errors?: { message: string }[] }
  if (body.errors?.length) throw new ShopifyError(body.errors[0].message)
  if (!body.data) throw new ShopifyError('Shopify returned an empty response')
  return body.data
}

/* ── Live catalog ───────────────────────────────────────────────── */

export interface LiveVariant {
  sku: string
  price: number
  available: boolean
}

/** What Shopify currently says about a piece, keyed by handle. The import
 *  writes handle = catalog slug, so that is the join back to local data. */
export interface LiveProduct {
  handle: string
  title: string
  image?: string
  gallery: string[]
  /** lowest variant price — what the PLP and PDP quote */
  price: number
  available: boolean
  variants: LiveVariant[]
}

const PRODUCTS = `
  query liveCatalog($cursor: String) {
    products(first: 60, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes {
        handle
        title
        images(first: 8) { nodes { url } }
        variants(first: 20) {
          nodes { sku availableForSale price { amount } }
        }
      }
    }
  }`

interface ProductsResult {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null }
    nodes: {
      handle: string
      title: string
      images: { nodes: { url: string }[] }
      variants: { nodes: { sku: string | null; availableForSale: boolean; price: { amount: string } }[] }
    }[]
  }
}

/**
 * Everything published to the storefront, keyed by handle.
 *
 * This is what lets the client re-shoot a piece or move a price in Shopify
 * admin and have the site follow without a redeploy. Callers treat a
 * rejection as "Shopify is unreachable" and fall back to local catalog data.
 */
export async function fetchLiveCatalog(): Promise<Map<string, LiveProduct>> {
  const live = new Map<string, LiveProduct>()
  let cursor: string | null = null

  do {
    const { products }: ProductsResult = await storefront<ProductsResult>(PRODUCTS, { cursor })

    for (const node of products.nodes) {
      const variants: LiveVariant[] = node.variants.nodes
        .filter((v): v is typeof v & { sku: string } => Boolean(v.sku))
        .map((v) => ({ sku: v.sku, price: Number(v.price.amount), available: v.availableForSale }))

      // A product with no priced variant tells us nothing useful — skip it
      // so the local catalog keeps its own price rather than showing zero.
      const prices = variants.map((v) => v.price).filter((n) => Number.isFinite(n) && n > 0)
      if (!prices.length) continue

      const images = node.images.nodes.map((i) => i.url)
      live.set(node.handle, {
        handle: node.handle,
        title: node.title,
        image: images[0],
        gallery: images.slice(1),
        price: Math.min(...prices),
        available: variants.some((v) => v.available),
        variants,
      })
    }

    cursor = products.pageInfo.hasNextPage ? products.pageInfo.endCursor : null
  } while (cursor)

  return live
}

/* ── Cart ───────────────────────────────────────────────────────── */

const CART_CREATE = `
  mutation cartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }`

export interface CheckoutLine {
  sku?: string
  qty: number
}

interface CartCreateResult {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null
    userErrors: { field: string[] | null; message: string }[]
  }
}

/**
 * Trade cart lines for a Shopify checkout URL.
 *
 * Lines without a SKU — custom grill builds — carry no Shopify
 * variant and are returned as `unsellable` so the caller can route
 * them to the by-hand quote flow instead of dropping them silently.
 */
export async function createCheckout(lines: CheckoutLine[]): Promise<{
  checkoutUrl: string
  unsellable: CheckoutLine[]
}> {
  const sellable: { merchandiseId: string; quantity: number }[] = []
  const unsellable: CheckoutLine[] = []

  for (const line of lines) {
    const merchandiseId = variantIdFor(line.sku)
    if (merchandiseId) sellable.push({ merchandiseId, quantity: line.qty })
    else unsellable.push(line)
  }

  if (!sellable.length) throw new ShopifyError('Nothing in the bag can be checked out online')

  const { cartCreate } = await storefront<CartCreateResult>(CART_CREATE, { lines: sellable })
  if (cartCreate.userErrors.length) throw new ShopifyError(cartCreate.userErrors[0].message)
  if (!cartCreate.cart) throw new ShopifyError('Shopify did not return a checkout')

  return { checkoutUrl: cartCreate.cart.checkoutUrl, unsellable }
}
