/* ═══════════════════════════════════════════════════════════════
   The catalog, as data.

   The client sheet owns SKU / title / price / description /
   collection / carat + gram + size specs. This file owns the
   presentation layer the sheet does not carry: which photo on disk
   shows the piece, the site category, and the metal + finish
   buckets the shop filters use.

   Nothing here invents a material claim. `metalDetail` quotes the
   sheet's own wording — plated stays "plated", coated stays
   "coated" — so neither the PDP nor Shopify ever upgrades a finish
   into solid gold.

   Consumed by build-catalog.mjs (writes src/data/catalog.ts) and
   shopify-import.mjs (pushes the same rows to Shopify), so the two
   can never drift apart.
   ═══════════════════════════════════════════════════════════════ */

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { readSheet, ROOT } from './sheet.mjs'

/* ── Material vocabulary ────────────────────────────────────────
   Coarse, filterable buckets. The exact claim lives in metalDetail. */
const SILVER = { metal: '925 Silver', metalDetail: '925 sterling silver · rhodium plated' }
const SILVER_BLACK = { metal: '925 Silver', metalDetail: '925 sterling silver · black rhodium plated' }
const GOLD_PLATED = { metal: 'Gold-Plated', metalDetail: 'High-polish yellow gold plating' }
const WG10 = { metal: '10K White Gold', metalDetail: 'Genuine 10K white gold' }
const YG10 = { metal: '10K Yellow Gold', metalDetail: 'Genuine 10K yellow gold' }
const RG10 = { metal: '10K Rose Gold', metalDetail: 'Genuine 10K rose gold' }

const MOISS = { finish: 'Iced (Moissanite VVS)', stones: 'D Color VVS1 moissanite' }
const MOISS_BLACK = { finish: 'Iced (Moissanite VVS)', stones: 'Black round brilliant moissanite' }
const LAB = { finish: 'Iced (Lab Diamond)', stones: 'F-G Color VS1-VS2 lab-grown diamond' }

/* ── Photography ────────────────────────────────────────────────
   Product photos are named after the SKU they show:

     public/assets/products/<category>/<sku lowercased>.webp

   with extra angles suffixed -2, -3, -4. That convention is why this
   file carries no photo mapping: drop `gmd-er-ld-hex-rg103.webp` into
   the earrings folder and that SKU picks it up on the next build. A
   SKU with no matching file renders the branded placeholder instead. */

const photoPath = (category, name) => `/assets/products/${category}/${name}.webp`
const onDisk = (path) => existsSync(join(ROOT, 'public', path))

function resolvePhotos(sku, category) {
  const stem = sku.toLowerCase()
  const main = photoPath(category, stem)
  if (!onDisk(main)) return { image: null, gallery: null }

  const gallery = []
  for (let i = 2; ; i++) {
    const angle = photoPath(category, `${stem}-${i}`)
    if (!onDisk(angle)) break
    gallery.push(angle)
  }
  return { image: main, gallery: gallery.length ? gallery : null }
}

/* ── Per-SKU presentation config ──────────────────────────────── */
const CONFIG = {
  /* ── Earrings · moissanite in 925 ───────────────────────────── */
  'GMD-MOE-150-RD-925-WH': {
    slug: 'classic-round-stud-earrings', category: 'earrings', tone: 'iced', bestseller: true,
    ...SILVER, ...MOISS,
    subtitle: 'Round brilliant solitaire studs · matched pair',
    design: 'Round brilliant solitaire in a four-prong basket',
    size: '5.2 mm face · sold as a matched pair',
  },
  'GMD-MOE-084-SQ-925-WH': {
    slug: 'square-cluster-stud-earrings', category: 'earrings', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Square cluster studs · matched pair',
    design: 'Square cluster that reads as one larger centre stone',
    size: '4.5 mm face · sold as a matched pair',
  },
  'GMD-MOE-212-CRH-925-WH': {
    slug: 'cross-drop-hoop-earrings', category: 'earrings', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Pavé cross drops on stone-lined hoops',
    design: 'Pavé cross suspended from a stone-lined hinged hoop',
    size: '33 mm drop · click-lock hoop closure',
  },
  'GMD-MOE-0266-STR-925-WH': {
    slug: 'star-stud-earrings', category: 'earrings', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Micro-pavé star studs · matched pair',
    design: 'Micro-pavé celestial star silhouette',
    size: '2.8 mm face · sold as a matched pair',
  },
  'GMD-MOE-100-EM-925-WH': {
    slug: 'emerald-cut-stud-earrings', category: 'earrings', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Emerald step-cut solitaire studs · pair',
    design: 'Emerald step-cut solitaire in a four-prong basket',
    size: '4.8 mm face · sold as a matched pair',
  },
  'GMD-MOE-154-FLR-925-WH': {
    slug: 'flower-cluster-stud-earrings', category: 'earrings', tone: 'iced', bestseller: true,
    ...SILVER, ...MOISS,
    subtitle: 'Flower-cluster halo studs · matched pair',
    design: 'Floral cluster halo of round brilliant stones',
    size: '4.8 mm face · sold as a matched pair',
  },

  /* ── Earrings · Signature Moissanite ────────────────────────── */
  'GMD-ER-MOI-RND-SS096': {
    slug: 'round-cluster-stud-earrings', category: 'earrings', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Round cluster studs · matched pair',
    design: 'Round cluster set to read as a larger solitaire',
    size: '4.8 mm face · sold as a matched pair',
  },
  'GMD-ER-MOI-HEX-SS0788': {
    slug: 'hexagon-cluster-stud-earrings-925', category: 'earrings', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Hexagon cluster studs · matched pair',
    design: 'Geometric hexagon cluster silhouette',
    size: '4.5 mm face · sold as a matched pair',
  },
  'GMD-ER-MOI-PAVE-SS0426': {
    slug: 'round-pave-stud-earrings', category: 'earrings', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Fully pavé round studs · matched pair',
    design: 'Fully pavé-set round face',
    size: '4 mm face · sold as a matched pair',
  },

  /* ── Earrings · Luxe Lab Diamond in 10K gold ────────────────── */
  'GMD-ER-LD-FLR-RG1583': {
    slug: 'rose-gold-lab-diamond-flower-cluster-studs', category: 'earrings', tone: 'gold',
    ...RG10, ...LAB,
    subtitle: '15.83 CTW flower cluster · 10K rose gold',
    design: 'Flower cluster of round brilliant lab diamonds',
    size: '6 mm face · 37.7 g the pair',
  },
  'GMD-ER-LD-FLR-WG287': {
    slug: 'white-gold-lab-diamond-flower-cluster-studs', category: 'earrings', tone: 'silver',
    ...WG10, ...LAB,
    subtitle: '2.87 CTW flower cluster · 10K white gold',
    design: 'Flower cluster of round brilliant lab diamonds',
    size: '5 mm face · 4.4 g the pair',
  },
  'GMD-ER-LD-FLR-YG398': {
    slug: 'yellow-gold-lab-diamond-flower-cluster-studs', category: 'earrings', tone: 'gold',
    ...YG10, ...LAB,
    subtitle: '3.98 CTW flower cluster · 10K yellow gold',
    design: 'Flower cluster of round brilliant lab diamonds',
    size: '6 mm face · 6.4 g the pair',
  },
  'GMD-ER-LD-HEX-WG109': {
    slug: 'white-gold-lab-diamond-hexagon-studs', category: 'earrings', tone: 'silver',
    ...WG10, ...LAB,
    subtitle: '1.09 CTW hexagon cluster · 10K white gold',
    design: 'Geometric hexagon cluster silhouette',
    size: '4.5 mm face · 2.0 g the pair',
  },
  'GMD-ER-LD-HEX-RG103': {
    slug: 'rose-gold-lab-diamond-hexagon-studs', category: 'earrings', tone: 'gold',
    ...RG10, ...LAB,
    subtitle: '1.03 CTW hexagon cluster · 10K rose gold',
    design: 'Geometric hexagon cluster silhouette',
    size: '4.5 mm face · 2.0 g the pair',
  },
  'GMD-ER-LD-HEX-YG101': {
    slug: 'yellow-gold-lab-diamond-hexagon-studs', category: 'earrings', tone: 'gold',
    ...YG10, ...LAB,
    subtitle: '1.01 CTW hexagon cluster · 10K yellow gold',
    design: 'Geometric hexagon cluster silhouette',
    size: '4.5 mm face · 1.9 g the pair',
  },
  'GMD-ER-LD-SOL-WG108': {
    slug: 'white-gold-lab-diamond-solitaire-studs', category: 'earrings', tone: 'silver',
    ...WG10, ...LAB,
    subtitle: '1.08 CTW solitaire studs · 10K white gold',
    design: 'Classic four-prong round brilliant solitaire',
    size: '5.5 mm face · 1.5 g the pair',
  },
  'GMD-ER-LD-SOL-YG110': {
    slug: 'yellow-gold-lab-diamond-solitaire-studs', category: 'earrings', tone: 'gold',
    ...YG10, ...LAB,
    subtitle: '1.10 CTW solitaire studs · 10K yellow gold',
    design: 'Classic four-prong round brilliant solitaire',
    size: '5.5 mm face · 1.6 g the pair',
  },

  /* ── Pendants ───────────────────────────────────────────────── */
  'GMD-PND-CRS-MOI-925-WH': {
    slug: 'iced-cross-pendant', category: 'pendants', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Fully iced cross · pavé bail',
    design: 'Hand-set cross, iced front to edge',
    size: '23 mm · pavé bail fits chains up to 8 mm',
  },
  'GMD-PND-NUM-MOI-925-WH': {
    slug: 'iced-number-pendant', category: 'pendants', tone: 'iced', bestseller: true,
    ...SILVER, ...MOISS,
    subtitle: 'Any digit 0-9 · pavé bail',
    options: [{ name: 'Number', values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }],
    design: 'Your digit, hand-set front to edge',
    size: '45 mm · pavé bail fits chains up to 10 mm',
  },
  'GMD-PND-PH-MOI-925-WH': {
    slug: 'iced-praying-hands-pendant', category: 'pendants', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Sculpted praying hands · fully iced',
    design: 'Sculpted praying hands under a full set of stones',
    size: '58 mm · pavé bail fits chains up to 10 mm',
  },
  'GMD-PND-SOD-MOI-925-WH': {
    slug: 'iced-star-of-david-pendant', category: 'pendants', tone: 'iced',
    ...SILVER, finish: 'Iced (Moissanite VVS)', stones: 'D Color VVS1 round brilliant + baguette moissanite',
    subtitle: 'Six-point star · baguette + round mix',
    design: 'Six-point star mixing baguette and round cuts',
    size: '52 mm · pavé bail fits chains up to 10 mm',
  },
  'GMD-PND-UZI-MOI-925-WH': {
    slug: 'iced-uzi-pendant', category: 'pendants', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Statement iced silhouette',
    design: 'Uzi-inspired silhouette, hand-set front to edge',
    size: '65 mm · pavé bail fits chains up to 10 mm',
  },

  /* ── Chains ─────────────────────────────────────────────────── */
  'GMD-CHN-BMCL-1224-BK': {
    slug: 'black-moissanite-cuban-chain', category: 'chains', tone: 'iced', bestseller: true,
    ...SILVER_BLACK, ...MOISS_BLACK,
    subtitle: '12 mm closed-link Cuban · 24 inch',
    design: 'Closed-link Cuban, every link hand-set',
    size: '12 mm wide · 24 in · double safety box clasp',
  },

  /* ── Watches · custom G-SHOCK ───────────────────────────────── */
  'GMD-WAT-GSH-MOI-SLV': {
    slug: 'silver-moissanite-gshock', category: 'watches', tone: 'iced', bestseller: true,
    ...SILVER, ...MOISS,
    subtitle: 'Hand-set micro pavé bezel + band',
    design: 'Authentic Casio G-SHOCK, hand-set in micro pavé',
    size: '48.5 mm case · black resin strap',
  },
  'GMD-WAT-GSH-MOI-SLV-BLK': {
    slug: 'silver-moissanite-gshock-black-band', category: 'watches', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Black dial + black resin band',
    design: 'Authentic Casio G-SHOCK, fully hand-set',
    size: '45.4 mm case · black resin strap',
  },
  'GMD-WAT-GSH-MOI-OLV-BT': {
    slug: 'silver-moissanite-bluetooth-gshock-olive', category: 'watches', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Bluetooth Tough Solar · olive band',
    design: 'Casio Bluetooth Tough Solar G-SHOCK, fully hand-set',
    size: '48.5 mm case · olive resin band',
  },
  'GMD-WAT-GSH-RED-ND': {
    slug: 'red-diamond-gshock', category: 'watches', tone: 'iced',
    metal: 'Custom G-SHOCK', metalDetail: 'Authentic Casio G-SHOCK platform',
    finish: 'Iced (Natural Diamond)', stones: '100% natural G-H color VS/SI single-cut diamond',
    subtitle: 'Red dial · fully iced natural diamond bezel',
    design: 'Red analog-digital dial under a hand-set iced bezel',
    size: '48.5 mm case · 60-70 g',
  },
  'GMD-WAT-GSH-RG450-ND': {
    slug: 'rose-gold-diamond-gshock', category: 'watches', tone: 'gold',
    metal: 'Custom G-SHOCK', metalDetail: 'High-polish rose gold coating on an authentic Casio G-SHOCK',
    finish: 'Iced (Natural Diamond)', stones: '4.50 CTW natural VS1 baguette + round brilliant diamond',
    subtitle: '4.50 CTW natural diamond · rose gold',
    design: 'Baguette and round brilliant diamonds, hand-set',
    size: '50 mm case · black resin strap',
  },
  'GMD-WAT-GSH-YG450-ND': {
    slug: 'yellow-gold-diamond-gshock', category: 'watches', tone: 'gold',
    metal: 'Custom G-SHOCK', metalDetail: 'High-polish yellow gold coating on an authentic Casio G-SHOCK',
    finish: 'Iced (Natural Diamond)', stones: '4.50 CTW natural VS1 baguette + round brilliant diamond',
    subtitle: '4.50 CTW natural diamond · yellow gold',
    design: 'Baguette and round brilliant diamonds, hand-set',
    size: '50 mm case · black resin strap',
  },
  'GMD-WAT-GSH-WG450-ND': {
    slug: 'white-gold-diamond-gshock', category: 'watches', tone: 'silver',
    metal: 'Custom G-SHOCK', metalDetail: 'White gold finish on an authentic Casio G-SHOCK',
    finish: 'Iced (Natural Diamond)', stones: '4.50 CTW natural VS1 baguette + round brilliant diamond',
    subtitle: '4.50 CTW natural diamond · white gold',
    design: 'Baguette and round brilliant diamonds, hand-set',
    size: '50 mm case · black resin strap',
  },

  /* ── Belt buckles ───────────────────────────────────────────── */
  'GMD-BBK-MOI-YG': {
    slug: 'yellow-gold-iced-belt-buckle', category: 'belt-buckles', tone: 'gold', bestseller: true,
    ...GOLD_PLATED, ...MOISS,
    subtitle: 'Openwork cross scroll · fits 1.5 in belts',
    design: 'Openwork cross scroll, hand-set stone by stone',
    size: '3.30 in (84 mm) · fits standard 1.5 in belts',
  },
  'GMD-BBK-MOI-925-WH': {
    slug: 'iced-belt-buckle-silver', category: 'belt-buckles', tone: 'iced',
    ...SILVER, ...MOISS,
    subtitle: 'Openwork cross scroll · fits 1.5 in belts',
    design: 'Openwork cross-inspired scroll, hand-set stone by stone',
    size: '3.30 in (84 mm) · fits standard 1.5 in belts',
  },
}

export const CATEGORY_ORDER = ['grills', 'earrings', 'pendants', 'chains', 'watches', 'belt-buckles']

/** Normalized rows, ready for either consumer. `problems` is non-empty
 *  when the sheet and this file disagree — callers should fail loudly. */
export function buildProducts() {

const rows = readSheet()
const products = []
const problems = []

for (const row of rows) {
  const cfg = CONFIG[row.sku]
  if (!cfg) { problems.push(`No presentation config for SKU ${row.sku}`); continue }
  if (!row.price) { problems.push(`No price for SKU ${row.sku}`); continue }

  // The sheet puts carat spec in the weight column for stone-led pieces
  // and gram weight there for the metal-led ones. Split on what it says.
  const spec = row.weight
  const isCarat = /ctw|\bct\b/i.test(spec)
  const caratSpec = isCarat ? spec.replace(/\s*\*\s*/, ' · ') : null
  const weight = isCarat ? null : spec.replace(/(\d)-(\d)/, '$1–$2')

  const { image, gallery } = resolvePhotos(row.sku, cfg.category)

  products.push({
    id: row.sku.toLowerCase(),
    slug: cfg.slug,
    sku: row.sku,
    name: row.title,
    category: cfg.category,
    collection: row.collection,
    price: row.price,
    metal: cfg.metal,
    metalDetail: cfg.metalDetail,
    finish: cfg.finish,
    stones: cfg.stones,
    caratSpec,
    weight,
    dimensions: row.dimensions || null,
    subtitle: cfg.subtitle,
    description: row.description,
    highlights: [cfg.design, cfg.stones, cfg.metalDetail, cfg.size].filter(Boolean),
    image,
    gallery,
    options: cfg.options || null,
    madeToOrder: true,
    bestseller: cfg.bestseller || false,
    tone: cfg.tone,
  })
}

/* Photo-backed pieces lead their category; the rest keep sheet order. */
products.sort((a, b) => {
  const cat = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  if (cat !== 0) return cat
  return Number(!!b.image) - Number(!!a.image)
})

  return { products, problems }
}
