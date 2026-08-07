/* ═══════════════════════════════════════════════════════════════
   GOLD MOUF DOG — Live catalog overlay (context + hooks)

   The generated catalog in src/data/catalog.ts stays the source of
   truth for everything Shopify does not hold: category, tone,
   subtitle, highlights, the sheet's spec rows. Shopify owns the
   things the client changes without a developer — photography,
   price, availability — and these hooks lay those over the top.

   Local data renders on the first paint, so nothing waits on the
   network, and if Shopify is slow or down the site simply keeps
   showing what shipped in the build.

   The provider lives in src/context/LiveCatalog.tsx.
   ═══════════════════════════════════════════════════════════════ */

import { createContext, useContext, useMemo } from 'react'
import { PRODUCTS } from '@/data/catalog'
import type { Product } from '@/data/catalog'
import type { LiveProduct } from '@/lib/shopify'

export type LiveStatus = 'idle' | 'loading' | 'ready' | 'offline'

export interface LiveCatalogAPI {
  status: LiveStatus
  /** live record for a catalog slug, if Shopify published one */
  get: (slug: string) => LiveProduct | undefined
}

export const LiveCatalogContext = createContext<LiveCatalogAPI>({
  status: 'idle',
  get: () => undefined,
})

/* ── Merge ──────────────────────────────────────────────────────── */

/** "…/gmd-moe-150-rd-925-wh.webp?v=123" → "gmd-moe-150-rd-925-wh" */
function fileStem(url: string): string {
  const name = url.split('?')[0].split('/').pop() ?? ''
  return name.replace(/\.[a-z0-9]+$/i, '').toLowerCase()
}

/**
 * Shopify serves the same photo we shipped, so when the filenames match
 * we keep the local copy: identical pixels, already on disk, and no second
 * download the moment the fetch lands. A piece re-shot in admin arrives
 * under a different name and is taken from the CDN.
 */
function preferLocal(cdnUrl: string, localPaths: string[]): string {
  const stem = fileStem(cdnUrl)
  return localPaths.find((path) => fileStem(path) === stem) ?? cdnUrl
}

function merge(product: Product, live: LiveProduct | undefined): Product {
  if (!live) return product

  const localPhotos = [product.image, ...(product.gallery ?? [])].filter(Boolean) as string[]
  const livePhotos = [live.image, ...live.gallery].filter(Boolean) as string[]
  const photos = livePhotos.length ? livePhotos.map((url) => preferLocal(url, localPhotos)) : localPhotos

  return {
    ...product,
    price: live.price,
    image: photos[0],
    gallery: photos.length > 1 ? photos.slice(1) : undefined,
  }
}

/* ── Hooks ──────────────────────────────────────────────────────── */

/** A catalog product with Shopify's current photo and price laid over it. */
export function useLive(product: Product): Product
export function useLive(product: Product | undefined): Product | undefined
export function useLive(product: Product | undefined): Product | undefined {
  const { get } = useContext(LiveCatalogContext)
  return useMemo(() => (product ? merge(product, get(product.slug)) : undefined), [product, get])
}

/** The list form — same merge, applied across a PLP or a carousel. */
export function useLiveList(products: Product[]): Product[] {
  const { get } = useContext(LiveCatalogContext)
  return useMemo(() => products.map((product) => merge(product, get(product.slug))), [products, get])
}

/** The whole catalog, merged. For surfaces that slice it their own way. */
export function useLiveCatalog(): Product[] {
  return useLiveList(PRODUCTS)
}

/** Whether Shopify answered — used to gate stock-dependent UI. */
export function useLiveStatus(): LiveStatus {
  return useContext(LiveCatalogContext).status
}

/** Live availability for one variant SKU; true until Shopify says otherwise. */
export function useVariantAvailable(slug: string, sku: string): boolean {
  const { get } = useContext(LiveCatalogContext)
  const live = get(slug)
  if (!live) return true
  const variant = live.variants.find((v) => v.sku === sku)
  return variant ? variant.available : live.available
}
