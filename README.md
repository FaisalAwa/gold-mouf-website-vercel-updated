# GoldMoufDog — Custom Grillz & Jewelry

Custom-fit grillz + handmade jewelry storefront for **GoldMoufDog Custom Grillz & Jewelry LLC** (Atlanta, est. 2014).
Headless React storefront with a live **tooth-map grill builder** priced to the real silver spot.

> _Where Your Smile Becomes Your Signature._

## Stack
React 19 · Vite 8 · TypeScript · Tailwind 4 (CSS config) · GSAP + ScrollTrigger · Lenis (desktop-only) · Framer Motion · React Router 7.

## Run
```bash
npm install
npm run dev      # localhost:5173
npm run build    # tsc -b && vite build
npm run preview
```

## Signature system
- **ToothMap** (`src/components/ToothMap.tsx`) — the dental-arch SVG motif, reused as the builder selector, the hero panel, and the loading screen.
- **Live silver engine** (`src/data/silver.ts`) — SILVER-first metals ticker + `estimateGrillPrice()` so grill pricing moves with the spot.
- **Configurator** (`src/pages/Configurator.tsx`) — tap teeth, pick metal/finish/presets, live gold price bar, add-to-cart.

## Structure
`src/data/` catalog · silver · site · testimonials · shopify-variants · `src/lib/shopify` · `src/context/CartContext` · `src/components/` chrome + UI kit · `src/pages/` Home · Configurator · Shop · Product · Cart · Story · Contact · Legal · NotFound.

## Catalog & Shopify
The client sheet in `products/` is the source of truth for every SKU, price,
description and spec. Two scripts read it, so the site and the store can never
disagree:

```bash
npm run catalog         # sheet → src/data/catalog.ts
npm run shopify:plan    # show what an import would write
npm run shopify:import  # upsert products + photos into Shopify
```

`scripts/lib/catalog.mjs` holds the per-SKU presentation config — site category,
shop-filter buckets, subtitle. Edit it — never `src/data/catalog.ts`, which is
generated.

Photos are matched to SKUs by filename, not by a mapping table:

    public/assets/products/<category>/<sku lowercased>.<webp|jpg|jpeg|png>

with extra angles suffixed `-2`, `-3`, `-4`. Drop a correctly named file in and
the next `npm run catalog` picks it up; a SKU with no file renders the branded
placeholder and is tagged `needs-photography` in Shopify. `webp` wins when a SKU
has more than one format on disk, but any of the four is accepted so a client
can hand over whatever the camera produced.

The import is idempotent on product handle, so re-run it whenever the sheet
changes. It also writes `src/data/shopify-variants.json`, the SKU → variant map
`/cart` uses to build a real Shopify checkout in one round-trip.

### What Shopify owns at runtime

`src/lib/live-catalog.ts` overlays what the store currently publishes onto the
generated catalog, joined on handle = slug. Photography, price and availability
come from Shopify, so the client can re-shoot a piece or move a price in admin
and the site follows without a deploy. Everything Shopify has no place for —
category, tone, subtitle, highlights, the sheet's spec rows — stays local.

The generated catalog renders on the first paint, so nothing waits on the
network, and a slow or unreachable Shopify just means nothing gets overlaid.
When a live photo has the same filename as the local one, the local copy is
kept — same pixels, no second download.

Credentials live in `.env.local` (see `.env.example`). The storefront token is
public by design; the admin token must never carry a `VITE_` prefix or Vite will
inline it into the browser bundle.

## Before go-live (see `../_workspace/PLACEHOLDERS.md`)
Remove the Shopify store password (Online Store → Preferences → Restrict access)
— it currently blocks checkout → photography for the 3 SKUs tagged
`needs-photography` → metals API key → Shopify Inbox chat → swap testimonials →
Lighthouse/axe.

## Deploy
Vercel. `vercel.json` provides SPA rewrites + immutable `/assets/**` caching.
