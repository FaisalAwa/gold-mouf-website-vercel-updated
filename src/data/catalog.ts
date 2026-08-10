/* ═══════════════════════════════════════════════════════════════
   GOLD MOUF DOG — Catalog

   GENERATED from the client product sheet. Do not hand-edit:
   run `node scripts/build-catalog.mjs` after the sheet changes.
   Photography mapping + shop-filter buckets live in that script.

   32 SKUs · 32 with photography on disk.
   ═══════════════════════════════════════════════════════════════ */

export type CategorySlug =
  | 'grills'
  | 'earrings'
  | 'pendants'
  | 'chains'
  | 'watches'
  | 'belt-buckles'

/** Coarse buckets used by the shop filters. The exact, sheet-accurate
 *  claim (plated vs solid, coated vs cast) lives in `metalDetail`. */
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
  return `/shop/${slug}`
}

/* ── Products — real client catalog. Grills has none (builder-led,
      /configurator). Within a category, photographed pieces lead. ── */

export const PRODUCTS: Product[] = [
  /* ── EARRINGS — 17 SKUs, 17 with photography ── */
  {
    id: 'gmd-moe-150-rd-925-wh',
    slug: 'classic-round-stud-earrings',
    sku: 'GMD-MOE-150-RD-925-WH',
    name: 'Classic Round Stud Earrings',
    category: 'earrings',
    collection: 'GoldMoufDog Essentials Collection',
    price: 175,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    caratSpec: '1.50 CTW · 0.75 CT each earring',
    dimensions: '5.2 mm',
    tone: 'iced',
    image: '/assets/products/earrings/gmd-moe-150-rd-925-wh.webp',
    madeToOrder: true,
    bestseller: true,
    subtitle: 'Round brilliant solitaire studs · matched pair',
    description: 'Experience timeless luxury with these 1.50 CTW Round Brilliant Moissanite Stud Earrings crafted from genuine 925 Sterling Silver and finished in premium rhodium plating for lasting brilliance. Each earring features a dazzling 0.75-carat D Color VVS1 Moissanite secured in a classic four-prong basket setting, maximizing light reflection and fire. Designed for everyday wear while offering the look of high-end diamond studs, these earrings are lightweight, hypoallergenic, and perfect for both men and women. Whether worn casually or for special occasions, these classic studs deliver exceptional sparkle at an outstanding value.',
    highlights: ['Round brilliant solitaire in a four-prong basket', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '5.2 mm face · sold as a matched pair'],
  },
  {
    id: 'gmd-moe-084-sq-925-wh',
    slug: 'square-cluster-stud-earrings',
    sku: 'GMD-MOE-084-SQ-925-WH',
    name: 'Square Cluster Stud Earrings',
    category: 'earrings',
    collection: 'GoldMoufDog Essentials Collection',
    price: 175,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    caratSpec: '0.84 CTW · 0.42 CT each earring',
    dimensions: '4.5 mm',
    tone: 'iced',
    image: '/assets/products/earrings/gmd-moe-084-sq-925-wh.webp',
    madeToOrder: true,
    subtitle: 'Square cluster studs · matched pair',
    description: 'Add timeless brilliance to your jewelry collection with these 0.84 CTW Square Cluster Moissanite Stud Earrings, crafted in genuine 925 Sterling Silver with a premium rhodium finish for enhanced shine and durability. Each earring features a cluster of sparkling D Color VVS1 Moissanite stones, creating the appearance of a larger center stone while maximizing fire and brilliance. The classic square silhouette offers a modern, luxurious look that\'s perfect for everyday wear or special occasions. Lightweight, hypoallergenic, and expertly crafted, these earrings provide exceptional sparkle at an incredible value.',
    highlights: ['Square cluster that reads as one larger centre stone', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '4.5 mm face · sold as a matched pair'],
  },
  {
    id: 'gmd-moe-212-crh-925-wh',
    slug: 'cross-drop-hoop-earrings',
    sku: 'GMD-MOE-212-CRH-925-WH',
    name: 'Cross Drop Hoop Earrings',
    category: 'earrings',
    collection: 'GoldMoufDog Faith Collection',
    price: 175,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    caratSpec: '2.12 CTW · 1.06 CT each earring',
    dimensions: '33 mm',
    tone: 'iced',
    image: '/assets/products/earrings/gmd-moe-212-crh-925-wh.webp',
    madeToOrder: true,
    subtitle: 'Pavé cross drops on stone-lined hoops',
    description: 'Showcase your faith with luxury and brilliance in these 2.12 CTW Moissanite Cross Drop Hoop Earrings. Crafted from genuine 925 Sterling Silver and finished with a premium rhodium plating, each earring features a sparkling pave-set cross suspended from a stone-lined hinged hoop. The premium D Color VVS1 Moissanite stones deliver exceptional fire and brilliance, offering the luxurious appearance of fine diamond jewelry. Designed with a secure click-lock hoop closure, these earrings are comfortable enough for everyday wear while making a bold statement for special occasions. Perfect for both men and women, these cross earrings blend timeless symbolism with modern luxury.',
    highlights: ['Pavé cross suspended from a stone-lined hinged hoop', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '33 mm drop · click-lock hoop closure'],
  },
  {
    id: 'gmd-moe-0266-str-925-wh',
    slug: 'star-stud-earrings',
    sku: 'GMD-MOE-0266-STR-925-WH',
    name: 'Star Stud Earrings',
    category: 'earrings',
    collection: 'GoldMoufDog Celestial Collection',
    price: 130,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    caratSpec: '0.266 CTW · 0.133 CT per earring',
    dimensions: '2.8 mm',
    tone: 'iced',
    image: '/assets/products/earrings/gmd-moe-0266-str-925-wh.webp',
    madeToOrder: true,
    subtitle: 'Micro-pavé star studs · matched pair',
    description: 'Shine bright with these elegant 0.266 CTW Star Moissanite Stud Earrings, expertly crafted from genuine 925 Sterling Silver and finished with premium rhodium plating for lasting brilliance. Each star-shaped stud is adorned with D Color VVS1 Moissanite stones in a micro pave setting, creating exceptional sparkle in a delicate celestial design. Lightweight, hypoallergenic, and versatile, these earrings are perfect for everyday wear while adding a subtle touch of luxury. Their timeless star silhouette makes them a thoughtful gift or a stylish addition to any jewelry collection.',
    highlights: ['Micro-pavé celestial star silhouette', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '2.8 mm face · sold as a matched pair'],
  },
  {
    id: 'gmd-moe-100-em-925-wh',
    slug: 'emerald-cut-stud-earrings',
    sku: 'GMD-MOE-100-EM-925-WH',
    name: 'Emerald Cut Stud Earrings',
    category: 'earrings',
    collection: 'GoldMoufDog Signature Collection',
    price: 130,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    caratSpec: '1.00 CTW · 0.50 CT per earring',
    dimensions: '4.8 mm',
    tone: 'iced',
    image: '/assets/products/earrings/gmd-moe-100-em-925-wh.webp',
    madeToOrder: true,
    subtitle: 'Emerald step-cut solitaire studs · pair',
    description: 'Refined and sophisticated, these 1.00 CTW Emerald Cut Moissanite Stud Earrings are crafted from genuine 925 Sterling Silver with a brilliant rhodium finish for lasting shine. Each earring showcases a 0.50-carat D Color VVS1 Emerald Cut Moissanite, securely held in a classic four-prong basket setting that highlights the stone\'s elegant step-cut facets and mirror-like brilliance. Designed for those who appreciate timeless luxury, these minimalist stud earrings offer exceptional sparkle and versatility, making them perfect for both everyday wear and formal occasions.',
    highlights: ['Emerald step-cut solitaire in a four-prong basket', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '4.8 mm face · sold as a matched pair'],
  },
  {
    id: 'gmd-moe-154-flr-925-wh',
    slug: 'flower-cluster-stud-earrings',
    sku: 'GMD-MOE-154-FLR-925-WH',
    name: 'Flower Cluster Stud Earrings',
    category: 'earrings',
    collection: 'GoldMoufDog Blossom Collection',
    price: 175,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    caratSpec: '1.54 CTW · 0.77 CT per earring',
    dimensions: '4.8 mm',
    tone: 'iced',
    image: '/assets/products/earrings/gmd-moe-154-flr-925-wh.webp',
    madeToOrder: true,
    bestseller: true,
    subtitle: 'Flower-cluster halo studs · matched pair',
    description: 'Bloom with brilliance in these 1.54 CTW Flower Cluster Moissanite Stud Earrings, beautifully crafted from genuine 925 Sterling Silver and finished with a premium rhodium plating for exceptional shine and durability. Each earring features a floral cluster of D Color VVS1 Round Brilliant Moissanite stones, creating the illusion of a larger center stone while delivering breathtaking sparkle from every angle. Elegant enough for formal occasions yet subtle enough for everyday wear, these flower-inspired studs are lightweight, hypoallergenic, and designed to complement any jewelry collection.',
    highlights: ['Floral cluster halo of round brilliant stones', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '4.8 mm face · sold as a matched pair'],
  },
  {
    id: 'gmd-er-ld-flr-rg1583',
    slug: 'rose-gold-lab-diamond-flower-cluster-studs',
    sku: 'GMD-ER-LD-FLR-RG1583',
    name: 'Luxury Rose Gold Lab Diamond Flower Cluster Stud Earrings - 15.83 CTW',
    category: 'earrings',
    collection: 'GoldMoufDog Luxe Diamond Collection',
    price: 4000,
    metal: '10K Rose Gold',
    metalDetail: 'Genuine 10K rose gold',
    finish: 'Iced (Lab Diamond)',
    stones: 'F-G Color VS1-VS2 lab-grown diamond',
    weight: '37.7 Grams',
    dimensions: '6 mm',
    tone: 'gold',
    image: '/assets/products/earrings/gmd-er-ld-flr-rg1583.webp',
    madeToOrder: true,
    subtitle: '15.83 CTW flower cluster · 10K rose gold',
    description: 'Radiate brilliance with the Luxury Rose Gold Lab Diamond Flower Cluster Stud Earrings, expertly crafted in genuine 10K Rose Gold and set with an incredible 15.83 carats of premium lab-grown diamonds. Designed in a timeless flower cluster silhouette, each earring features multiple Round Brilliant Cut F-G Color VS1-VS2 lab diamonds arranged to maximize sparkle and create the appearance of a larger center stone. With a substantial 37.7-gram weight and 10 mm face, these earrings offer exceptional presence while maintaining elegant sophistication. Perfect for both everyday luxury and formal occasions, they combine sustainable diamonds with premium craftsmanship.',
    highlights: ['Flower cluster of round brilliant lab diamonds', 'F-G Color VS1-VS2 lab-grown diamond', 'Genuine 10K rose gold', '6 mm face · 37.7 g the pair'],
  },
  {
    id: 'gmd-er-ld-flr-wg287',
    slug: 'white-gold-lab-diamond-flower-cluster-studs',
    sku: 'GMD-ER-LD-FLR-WG287',
    name: 'Luxury White Gold Lab Diamond Flower Cluster Stud Earrings - 2.87 CTW',
    category: 'earrings',
    collection: 'GoldMoufDog Luxe Diamond Collection',
    price: 3500,
    metal: '10K White Gold',
    metalDetail: 'Genuine 10K white gold',
    finish: 'Iced (Lab Diamond)',
    stones: 'F-G Color VS1-VS2 lab-grown diamond',
    weight: '4.4 Grams',
    dimensions: '5 mm',
    tone: 'silver',
    image: '/assets/products/earrings/gmd-er-ld-flr-wg287.jpg',
    madeToOrder: true,
    subtitle: '2.87 CTW flower cluster · 10K white gold',
    description: 'Timeless elegance meets exceptional brilliance with these 10K White Gold Lab Diamond Flower Cluster Stud Earrings. Crafted from genuine 10K White Gold, each earring showcases a beautifully designed flower cluster composed of premium F-G Color VS1-VS2 Lab-Grown Diamonds, totaling 2.87 carats. The classic floral design creates the appearance of a larger center diamond while maximizing sparkle from every angle. Lightweight yet luxurious at 4.4 grams, these earrings are perfect for everyday wear or special occasions, offering the beauty of fine diamonds with modern sustainability.',
    highlights: ['Flower cluster of round brilliant lab diamonds', 'F-G Color VS1-VS2 lab-grown diamond', 'Genuine 10K white gold', '5 mm face · 4.4 g the pair'],
  },
  {
    id: 'gmd-er-ld-flr-yg398',
    slug: 'yellow-gold-lab-diamond-flower-cluster-studs',
    sku: 'GMD-ER-LD-FLR-YG398',
    name: 'Luxury Yellow Gold Lab Diamond Flower Cluster Stud Earrings - 3.98 CTW',
    category: 'earrings',
    collection: 'GoldMoufDog Luxe Diamond Collection',
    price: 3899,
    metal: '10K Yellow Gold',
    metalDetail: 'Genuine 10K yellow gold',
    finish: 'Iced (Lab Diamond)',
    stones: 'F-G Color VS1-VS2 lab-grown diamond',
    weight: '6.4 Grams',
    dimensions: '6 mm',
    tone: 'gold',
    image: '/assets/products/earrings/gmd-er-ld-flr-yg398.webp',
    madeToOrder: true,
    subtitle: '3.98 CTW flower cluster · 10K yellow gold',
    description: 'Make a statement with these 10K Yellow Gold Lab Diamond Flower Cluster Stud Earrings, expertly crafted from genuine 10K Yellow Gold and featuring an impressive 3.98 total carats of premium lab-grown diamonds. Designed in a luxurious flower cluster silhouette, each earring showcases brilliant Round Cut F-G Color VS1-VS2 lab diamonds arranged to maximize fire and brilliance. With a substantial 6.4-gram weight and a bold 10 mm profile, these earrings deliver exceptional sparkle while remaining comfortable enough for everyday wear. Their timeless floral design makes them a versatile addition to any fine jewelry collection.',
    highlights: ['Flower cluster of round brilliant lab diamonds', 'F-G Color VS1-VS2 lab-grown diamond', 'Genuine 10K yellow gold', '6 mm face · 6.4 g the pair'],
  },
  {
    id: 'gmd-er-ld-hex-wg109',
    slug: 'white-gold-lab-diamond-hexagon-studs',
    sku: 'GMD-ER-LD-HEX-WG109',
    name: 'Luxury White Gold Lab Diamond Hexagon Cluster Stud Earrings - 1.09 CTW',
    category: 'earrings',
    collection: 'GoldMoufDog Luxe Diamond Collection',
    price: 1000,
    metal: '10K White Gold',
    metalDetail: 'Genuine 10K white gold',
    finish: 'Iced (Lab Diamond)',
    stones: 'F-G Color VS1-VS2 lab-grown diamond',
    weight: '2.0 Grams',
    dimensions: '4.5 mm',
    tone: 'silver',
    image: '/assets/products/earrings/gmd-er-ld-hex-wg109.webp',
    madeToOrder: true,
    subtitle: '1.09 CTW hexagon cluster · 10K white gold',
    description: 'Refined, modern, and brilliantly crafted, these 10K White Gold Lab Diamond Hexagon Cluster Stud Earrings are the perfect combination of everyday luxury and timeless elegance. Crafted from genuine 10K White Gold, each earring features a geometric hexagon silhouette adorned with 1.09 total carats of premium F-G Color VS1-VS2 Lab-Grown Diamonds. The cluster arrangement enhances the visual size and sparkle of each earring while maintaining a lightweight profile of just 2.0 grams, making them comfortable enough for all-day wear. Their clean hexagonal design offers a contemporary twist on the classic diamond stud.',
    highlights: ['Geometric hexagon cluster silhouette', 'F-G Color VS1-VS2 lab-grown diamond', 'Genuine 10K white gold', '4.5 mm face · 2.0 g the pair'],
  },
  {
    id: 'gmd-er-ld-hex-rg103',
    slug: 'rose-gold-lab-diamond-hexagon-studs',
    sku: 'GMD-ER-LD-HEX-RG103',
    name: 'Luxury Rose Gold Lab Diamond Hexagon Cluster Stud Earrings - 1.03 CTW',
    category: 'earrings',
    collection: 'GoldMoufDog Luxe Diamond Collection',
    price: 1000,
    metal: '10K Rose Gold',
    metalDetail: 'Genuine 10K rose gold',
    finish: 'Iced (Lab Diamond)',
    stones: 'F-G Color VS1-VS2 lab-grown diamond',
    weight: '2.0 Grams',
    dimensions: '4.5 mm',
    tone: 'gold',
    image: '/assets/products/earrings/gmd-er-ld-hex-rg103.jpg',
    madeToOrder: true,
    subtitle: '1.03 CTW hexagon cluster · 10K rose gold',
    description: 'Designed for effortless elegance, these 10K Rose Gold Lab Diamond Hexagon Cluster Stud Earrings feature a contemporary hexagon silhouette accented with 1.03 total carats of premium lab-grown diamonds. Crafted in genuine 10K Rose Gold, the warm gold tone beautifully complements the brilliant F-G Color VS1-VS2 diamonds, creating exceptional sparkle from every angle. Weighing just 2.0 grams, these lightweight earrings offer everyday comfort while delivering the luxurious appearance of a larger diamond through their expertly arranged cluster design. Perfect for both casual wear and special occasions, they\'re a timeless addition to any jewelry collection.',
    highlights: ['Geometric hexagon cluster silhouette', 'F-G Color VS1-VS2 lab-grown diamond', 'Genuine 10K rose gold', '4.5 mm face · 2.0 g the pair'],
  },
  {
    id: 'gmd-er-ld-hex-yg101',
    slug: 'yellow-gold-lab-diamond-hexagon-studs',
    sku: 'GMD-ER-LD-HEX-YG101',
    name: 'Luxury Yellow Gold Lab Diamond Hexagon Cluster Stud Earrings - 1.01 CTW',
    category: 'earrings',
    collection: 'GoldMoufDog Luxe Diamond Collection',
    price: 1000,
    metal: '10K Yellow Gold',
    metalDetail: 'Genuine 10K yellow gold',
    finish: 'Iced (Lab Diamond)',
    stones: 'F-G Color VS1-VS2 lab-grown diamond',
    weight: '1.9 Grams',
    dimensions: '4.5 mm',
    tone: 'gold',
    image: '/assets/products/earrings/gmd-er-ld-hex-yg101.webp',
    madeToOrder: true,
    subtitle: '1.01 CTW hexagon cluster · 10K yellow gold',
    description: 'Refined and timeless, these 10K Yellow Gold Lab Diamond Hexagon Cluster Stud Earrings are crafted in genuine 10K Yellow Gold and feature 1.01 total carats of premium F-G Color VS1-VS2 Lab-Grown Diamonds. The elegant hexagon cluster design maximizes brilliance, creating the appearance of a larger center stone while maintaining a sleek, modern silhouette. Lightweight at just 1.9 grams, these earrings are designed for all-day comfort without sacrificing luxury. Whether worn alone or paired with other fine jewelry, they provide the perfect finishing touch for any occasion.',
    highlights: ['Geometric hexagon cluster silhouette', 'F-G Color VS1-VS2 lab-grown diamond', 'Genuine 10K yellow gold', '4.5 mm face · 1.9 g the pair'],
  },
  {
    id: 'gmd-er-ld-sol-wg108',
    slug: 'white-gold-lab-diamond-solitaire-studs',
    sku: 'GMD-ER-LD-SOL-WG108',
    name: 'Luxury White Gold Lab Diamond Solitaire Stud Earrings - 1.08 CTW',
    category: 'earrings',
    collection: 'GoldMoufDog Luxe Diamond Collection',
    price: 750,
    metal: '10K White Gold',
    metalDetail: 'Genuine 10K white gold',
    finish: 'Iced (Lab Diamond)',
    stones: 'F-G Color VS1-VS2 lab-grown diamond',
    weight: '1.5 Grams',
    dimensions: '5.5 mm',
    tone: 'silver',
    image: '/assets/products/earrings/gmd-er-ld-sol-wg108.webp',
    madeToOrder: true,
    subtitle: '1.08 CTW solitaire studs · 10K white gold',
    description: 'Timeless, elegant, and designed for everyday luxury, these 10K White Gold Lab Diamond Solitaire Stud Earrings feature 1.08 total carats of premium Round Brilliant Cut Lab-Grown Diamonds. Expertly set in a classic four-prong solitaire setting, each diamond is showcased to maximize brilliance and fire while offering a clean, sophisticated look. Crafted from genuine 10K White Gold and weighing only 1.5 grams, these lightweight earrings provide exceptional comfort without sacrificing sparkle. A staple piece for any fine jewelry collection, they\'re perfect for daily wear or special occasions.',
    highlights: ['Classic four-prong round brilliant solitaire', 'F-G Color VS1-VS2 lab-grown diamond', 'Genuine 10K white gold', '5.5 mm face · 1.5 g the pair'],
  },
  {
    id: 'gmd-er-ld-sol-yg110',
    slug: 'yellow-gold-lab-diamond-solitaire-studs',
    sku: 'GMD-ER-LD-SOL-YG110',
    name: 'Luxury Yellow Gold Lab Diamond Solitaire Stud Earrings - 1.10 CTW',
    category: 'earrings',
    collection: 'GoldMoufDog Luxe Diamond Collection',
    price: 750,
    metal: '10K Yellow Gold',
    metalDetail: 'Genuine 10K yellow gold',
    finish: 'Iced (Lab Diamond)',
    stones: 'F-G Color VS1-VS2 lab-grown diamond',
    weight: '1.6 Grams',
    dimensions: '5.5 mm',
    tone: 'gold',
    image: '/assets/products/earrings/gmd-er-ld-sol-yg110.webp',
    madeToOrder: true,
    subtitle: '1.10 CTW solitaire studs · 10K yellow gold',
    description: 'Elevate your everyday style with these 10K Yellow Gold Lab Diamond Solitaire Stud Earrings, expertly crafted from genuine 10K Yellow Gold and set with 1.10 total carats of premium Round Brilliant Cut Lab-Grown Diamonds. The timeless four-prong solitaire setting highlights each diamond\'s exceptional brilliance, making these earrings a refined staple for any jewelry collection. Weighing just 1.6 grams, these lightweight studs offer superior comfort while delivering the luxurious sparkle of fine diamonds. Whether worn daily or reserved for special occasions, they provide a classic look that never goes out of style.',
    highlights: ['Classic four-prong round brilliant solitaire', 'F-G Color VS1-VS2 lab-grown diamond', 'Genuine 10K yellow gold', '5.5 mm face · 1.6 g the pair'],
  },
  {
    id: 'gmd-er-moi-hex-ss0788',
    slug: 'hexagon-cluster-stud-earrings-925',
    sku: 'GMD-ER-MOI-HEX-SS0788',
    name: 'Luxury 925 Sterling Silver Moissanite Hexagon Cluster Stud Earrings - 0.788 CTW',
    category: 'earrings',
    collection: 'GoldMoufDog Signature Moissanite Collection',
    price: 130,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    caratSpec: '0.788 CTW',
    dimensions: '4.5 mm',
    tone: 'iced',
    image: '/assets/products/earrings/gmd-er-moi-hex-ss0788.webp',
    madeToOrder: true,
    subtitle: 'Hexagon cluster studs · matched pair',
    description: 'Designed with modern sophistication, these 925 Sterling Silver Moissanite Hexagon Cluster Stud Earrings feature 0.788 total carats of premium D Color VVS1 Moissanite. The unique hexagon cluster design enhances the brilliance of each stone, creating the appearance of a larger center while maintaining a clean and contemporary aesthetic. Crafted from genuine 925 Sterling Silver with a durable high-polish rhodium finish, these earrings provide exceptional sparkle, lasting durability, and lightweight comfort. Perfect for everyday wear or special occasions, they are a timeless addition to any jewelry collection.',
    highlights: ['Geometric hexagon cluster silhouette', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '4.5 mm face · sold as a matched pair'],
  },
  {
    id: 'gmd-er-moi-rnd-ss096',
    slug: 'round-cluster-stud-earrings',
    sku: 'GMD-ER-MOI-RND-SS096',
    name: 'Luxury 925 Sterling Silver Moissanite Round Cluster Stud Earrings - 0.96 CTW',
    category: 'earrings',
    collection: 'GoldMoufDog Signature Moissanite Collection',
    price: 130,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    caratSpec: '0.96 CTW',
    dimensions: '4.8 mm',
    tone: 'iced',
    image: '/assets/products/earrings/gmd-er-moi-rnd-ss096.webp',
    madeToOrder: true,
    subtitle: 'Round cluster studs · matched pair',
    description: 'Elevate your everyday style with the GoldMoufDog 925 Sterling Silver Moissanite Round Cluster Stud Earrings. Featuring 0.96 total carats of premium D Color VVS1 Moissanite, these earrings are designed with a brilliant round cluster that creates the appearance of a larger solitaire while maximizing fire and sparkle. Expertly crafted from genuine 925 Sterling Silver and finished with durable rhodium plating, these earrings provide exceptional shine, lasting durability, and comfortable everyday wear. Whether worn casually or for special occasions, they deliver a luxury look without compromise.',
    highlights: ['Round cluster set to read as a larger solitaire', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '4.8 mm face · sold as a matched pair'],
  },
  {
    id: 'gmd-er-moi-pave-ss0426',
    slug: 'round-pave-stud-earrings',
    sku: 'GMD-ER-MOI-PAVE-SS0426',
    name: 'Luxury 925 Sterling Silver Moissanite Round Pave Stud Earrings - 0.426 CTW',
    category: 'earrings',
    collection: 'GoldMoufDog Signature Moissanite Collection',
    price: 150,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    caratSpec: '0.426 CTW',
    dimensions: '4 mm',
    tone: 'iced',
    image: '/assets/products/earrings/gmd-er-moi-pave-ss0426.webp',
    madeToOrder: true,
    subtitle: 'Fully pavé round studs · matched pair',
    description: 'Add effortless brilliance to your everyday collection with the GoldMoufDog 925 Sterling Silver Moissanite Round Pave Stud Earrings. Featuring 0.426 total carats of premium D Color VVS1 Moissanite, these earrings showcase a fully pave-set round face that delivers exceptional sparkle from every angle. Crafted from genuine 925 Sterling Silver with a durable rhodium finish, these studs offer a luxurious appearance while remaining lightweight and comfortable for daily wear. Their timeless design makes them perfect whether worn alone or paired with other jewelry.',
    highlights: ['Fully pavé-set round face', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '4 mm face · sold as a matched pair'],
  },

  /* ── PENDANTS — 5 SKUs, 5 with photography ── */
  {
    id: 'gmd-pnd-crs-moi-925-wh',
    slug: 'iced-cross-pendant',
    sku: 'GMD-PND-CRS-MOI-925-WH',
    name: 'Classic Iced Moissanite Cross Pendant',
    category: 'pendants',
    collection: 'GoldMoufDog Faith Collection',
    price: 325,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    weight: '8–10 grams',
    dimensions: '23 mm',
    tone: 'iced',
    image: '/assets/products/pendants/gmd-pnd-crs-moi-925-wh.webp',
    madeToOrder: true,
    subtitle: 'Fully iced cross · pavé bail',
    description: 'Express your faith in luxury with the Classic Iced Moissanite Cross Pendant, crafted from genuine 925 Sterling Silver and finished with a premium rhodium plating for long-lasting brilliance. This timeless cross design is fully hand-set with D Color VVS1 Round Brilliant Moissanite stones, creating exceptional sparkle from every angle. The pendant features a large pave-set bail that accommodates chains up to 8 mm, making it perfect for pairing with Cuban, tennis, or rope chains. Whether worn as a daily symbol of faith or as a statement piece, this pendant combines elegance, durability, and premium craftsmanship.',
    highlights: ['Hand-set cross, iced front to edge', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '23 mm · pavé bail fits chains up to 8 mm'],
  },
  {
    id: 'gmd-pnd-num-moi-925-wh',
    slug: 'iced-number-pendant',
    sku: 'GMD-PND-NUM-MOI-925-WH',
    name: 'Iced Moissanite Number Pendant',
    category: 'pendants',
    collection: 'GoldMoufDog Signature Collection',
    price: 325,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    weight: '9–12 grams',
    dimensions: '45 mm',
    tone: 'iced',
    image: '/assets/products/pendants/gmd-pnd-num-moi-925-wh.webp',
    gallery: ['/assets/products/pendants/gmd-pnd-num-moi-925-wh-2.webp', '/assets/products/pendants/gmd-pnd-num-moi-925-wh-3.webp', '/assets/products/pendants/gmd-pnd-num-moi-925-wh-4.webp'],
    options: [{ name: 'Number', values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }],
    madeToOrder: true,
    bestseller: true,
    subtitle: 'Any digit 0-9 · pavé bail',
    description: 'Personalize your style with the Iced Moissanite Number Pendant, crafted from genuine 925 Sterling Silver and finished with a premium rhodium plating for lasting brilliance. Each pendant is fully hand-set with D Color VVS1 Round Brilliant Moissanite stones, creating exceptional fire and a luxurious diamond-like appearance. Designed with a large pave-set bail, this pendant fits chains up to 10 mm wide, making it ideal for pairing with Cuban, tennis, rope, or Franco chains. Available in numbers 0-9, it\'s the perfect way to represent a jersey number, lucky number, birth year, or meaningful milestone.',
    highlights: ['Your digit, hand-set front to edge', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '45 mm · pavé bail fits chains up to 10 mm'],
  },
  {
    id: 'gmd-pnd-ph-moi-925-wh',
    slug: 'iced-praying-hands-pendant',
    sku: 'GMD-PND-PH-MOI-925-WH',
    name: 'Iced Praying Hands Pendant',
    category: 'pendants',
    collection: 'GoldMoufDog Faith Collection',
    price: 550,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    weight: '18–22 grams',
    dimensions: '58 mm',
    tone: 'iced',
    image: '/assets/products/pendants/gmd-pnd-ph-moi-925-wh.webp',
    madeToOrder: true,
    subtitle: 'Sculpted praying hands · fully iced',
    description: 'Honor faith and craftsmanship with the Iced Praying Hands Moissanite Pendant, expertly crafted from genuine 925 Sterling Silver and finished with a brilliant rhodium plating. This symbolic pendant features a detailed praying hands design, fully hand-set with premium D Color VVS1 Round Brilliant Moissanite stones for unmatched brilliance and a luxurious diamond-like appearance. Designed with a large pave-set bail that accommodates chains up to 10 mm, this pendant pairs perfectly with Cuban, tennis, rope, or Franco chains. Whether worn as a daily reminder of faith or as a standout luxury piece, this pendant blends meaningful symbolism with exceptional craftsmanship.',
    highlights: ['Sculpted praying hands under a full set of stones', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '58 mm · pavé bail fits chains up to 10 mm'],
  },
  {
    id: 'gmd-pnd-sod-moi-925-wh',
    slug: 'iced-star-of-david-pendant',
    sku: 'GMD-PND-SOD-MOI-925-WH',
    name: 'Iced Star of David Pendant',
    category: 'pendants',
    collection: 'GoldMoufDog Faith Collection',
    price: 550,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 round brilliant + baguette moissanite',
    weight: '16–20 grams',
    dimensions: '52 mm',
    tone: 'iced',
    image: '/assets/products/pendants/gmd-pnd-sod-moi-925-wh.webp',
    madeToOrder: true,
    subtitle: 'Six-point star · baguette + round mix',
    description: 'Celebrate faith with exceptional craftsmanship in the Iced Star of David Moissanite Pendant. Expertly crafted from genuine 925 Sterling Silver and finished with a premium rhodium plating, this pendant showcases the iconic Star of David in a luxurious design. The pendant features a combination of D Color VVS1 Round Brilliant and Baguette Cut Moissanite stones, creating incredible brilliance, depth, and dimension. A large pave-set bail allows the pendant to pair perfectly with chains up to 10 mm, making it an eye-catching centerpiece for any jewelry collection. Designed for those who appreciate meaningful symbolism and premium luxury, this pendant is suitable for everyday wear or special occasions.',
    highlights: ['Six-point star mixing baguette and round cuts', 'D Color VVS1 round brilliant + baguette moissanite', '925 sterling silver · rhodium plated', '52 mm · pavé bail fits chains up to 10 mm'],
  },
  {
    id: 'gmd-pnd-uzi-moi-925-wh',
    slug: 'iced-uzi-pendant',
    sku: 'GMD-PND-UZI-MOI-925-WH',
    name: 'Iced Uzi Pendant',
    category: 'pendants',
    collection: 'GoldMoufDog Urban Collection',
    price: 550,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    weight: '22–28 grams',
    dimensions: '65 mm',
    tone: 'iced',
    image: '/assets/products/pendants/gmd-pnd-uzi-moi-925-wh.webp',
    madeToOrder: true,
    subtitle: 'Statement iced silhouette',
    description: 'Make a bold statement with the Iced Uzi Moissanite Pendant, crafted from genuine 925 Sterling Silver and finished in a brilliant rhodium plating. This detailed pendant features an Uzi-inspired silhouette, fully hand-set with premium D Color VVS1 Round Brilliant Moissanite stones that deliver exceptional fire and a luxurious diamond-like appearance. Designed with a large pave-set bail, this pendant fits chains up to 10 mm, making it the perfect centerpiece for Cuban, tennis, rope, or Franco chains. Combining precision craftsmanship with modern streetwear style, this pendant is designed for those who appreciate standout jewelry.',
    highlights: ['Uzi-inspired silhouette, hand-set front to edge', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '65 mm · pavé bail fits chains up to 10 mm'],
  },

  /* ── CHAINS — 1 SKU, 1 with photography ── */
  {
    id: 'gmd-chn-bmcl-1224-bk',
    slug: 'black-moissanite-cuban-chain',
    sku: 'GMD-CHN-BMCL-1224-BK',
    name: 'Black Moissanite Closed Link Cuban Chain',
    category: 'chains',
    collection: 'GoldMoufDog Elite Collection',
    price: 1500,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · black rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'Black round brilliant moissanite',
    weight: '220–260 grams',
    dimensions: '12 mm',
    tone: 'iced',
    image: '/assets/products/chains/gmd-chn-bmcl-1224-bk.webp',
    madeToOrder: true,
    bestseller: true,
    subtitle: '12 mm closed-link Cuban · 24 inch',
    description: 'Turn heads with the Black Moissanite Closed Link Cuban Chain, crafted from genuine 925 Sterling Silver and finished in a sleek black rhodium plating. Measuring 12mm wide and 24 inches long, this chain is fully hand-set with premium black round brilliant moissanite stones, delivering a bold, modern look with exceptional brilliance. The closed-link Cuban design creates a seamless appearance, while the secure double safety box clasp ensures durability for everyday wear. Whether worn alone or paired with a pendant, this luxury chain is designed for those who appreciate distinctive craftsmanship and standout style.',
    highlights: ['Closed-link Cuban, every link hand-set', 'Black round brilliant moissanite', '925 sterling silver · black rhodium plated', '12 mm wide · 24 in · double safety box clasp'],
  },

  /* ── WATCHES · custom G-SHOCK — 7 SKUs, 7 with photography ── */
  {
    id: 'gmd-wat-gsh-red-nd',
    slug: 'red-diamond-gshock',
    sku: 'GMD-WAT-GSH-RED-ND',
    name: 'Red Diamond G-Shock Watch | Single Cut Natural VS/SI Diamonds',
    category: 'watches',
    collection: 'GoldMoufDog Luxury Timepieces Collection',
    price: 3400,
    metal: 'Custom G-SHOCK',
    metalDetail: 'Authentic Casio G-SHOCK platform',
    finish: 'Iced (Natural Diamond)',
    stones: '100% natural G-H color VS/SI single-cut diamond',
    weight: '60–70 grams',
    dimensions: '48.5 mm',
    tone: 'iced',
    image: '/assets/products/watches/gmd-wat-gsh-red-nd.webp',
    madeToOrder: true,
    subtitle: 'Red dial · fully iced natural diamond bezel',
    description: 'Stand out with the Custom Red Diamond G-Shock Watch, a bold fusion of iconic G-Shock durability and luxury craftsmanship. This custom timepiece features a vibrant red analog-digital dial surrounded by a hand-set bezel fully iced with 100% natural G-H color VS/SI single-cut diamonds, creating exceptional brilliance from every angle. Built on the legendary G-Shock platform, this watch maintains its rugged durability while delivering an unmistakable luxury aesthetic. Whether you\'re dressing for everyday wear or making a statement at a special event, this custom diamond watch combines performance, reliability, and high-end style.',
    highlights: ['Red analog-digital dial under a hand-set iced bezel', '100% natural G-H color VS/SI single-cut diamond', 'Authentic Casio G-SHOCK platform', '48.5 mm case · 60-70 g'],
  },
  {
    id: 'gmd-wat-gsh-rg450-nd',
    slug: 'rose-gold-diamond-gshock',
    sku: 'GMD-WAT-GSH-RG450-ND',
    name: 'Rose Gold Diamond G-SHOCK Watch | 4.50 CTW Natural VS1 Diamonds',
    category: 'watches',
    collection: 'GoldMoufDog Luxury Timepieces Collection',
    price: 2500,
    metal: 'Custom G-SHOCK',
    metalDetail: 'High-polish rose gold coating on an authentic Casio G-SHOCK',
    finish: 'Iced (Natural Diamond)',
    stones: '4.50 CTW natural VS1 baguette + round brilliant diamond',
    weight: '95–110 grams',
    dimensions: '50 mm',
    tone: 'gold',
    image: '/assets/products/watches/gmd-wat-gsh-rg450-nd.webp',
    madeToOrder: true,
    subtitle: '4.50 CTW natural diamond · rose gold',
    description: 'Experience luxury with the Custom Rose Gold Diamond G-SHOCK Watch, built on an authentic Casio G-SHOCK platform and customized with 4.50 carats of hand-set natural VS1 diamonds. Featuring a striking combination of baguette-cut and round brilliant-cut diamonds, this timepiece offers exceptional brilliance while maintaining the legendary toughness of G-SHOCK. Finished in a rich high-polish rose gold coating and paired with a black resin strap, this custom watch blends durability with premium craftsmanship. Whether worn daily or reserved for special occasions, it\'s a standout piece designed to command attention.',
    highlights: ['Baguette and round brilliant diamonds, hand-set', '4.50 CTW natural VS1 baguette + round brilliant diamond', 'High-polish rose gold coating on an authentic Casio G-SHOCK', '50 mm case · black resin strap'],
  },
  {
    id: 'gmd-wat-gsh-yg450-nd',
    slug: 'yellow-gold-diamond-gshock',
    sku: 'GMD-WAT-GSH-YG450-ND',
    name: 'Yellow Gold Diamond G-SHOCK Watch | 4.50 CTW Natural VS1 Diamonds',
    category: 'watches',
    collection: 'GoldMoufDog Luxury Timepieces Collection',
    price: 2500,
    metal: 'Custom G-SHOCK',
    metalDetail: 'High-polish yellow gold coating on an authentic Casio G-SHOCK',
    finish: 'Iced (Natural Diamond)',
    stones: '4.50 CTW natural VS1 baguette + round brilliant diamond',
    weight: '95–110 grams',
    dimensions: '50 mm',
    tone: 'gold',
    image: '/assets/products/watches/gmd-wat-gsh-yg450-nd.webp',
    madeToOrder: true,
    subtitle: '4.50 CTW natural diamond · yellow gold',
    description: 'The Custom Yellow Gold Diamond G-SHOCK Watch combines legendary G-SHOCK toughness with exceptional luxury craftsmanship. Built on an authentic Casio G-SHOCK platform, this custom timepiece is expertly hand-set with 4.50 carats of natural VS1 diamonds, featuring a striking combination of baguette-cut and round brilliant-cut stones for maximum brilliance and depth. Finished in a rich high-polish yellow gold coating and paired with a durable black resin strap, this watch delivers the perfect balance of rugged performance and premium style. Whether you\'re elevating your everyday look or making a statement at a special event, this custom G-SHOCK is designed to stand out.',
    highlights: ['Baguette and round brilliant diamonds, hand-set', '4.50 CTW natural VS1 baguette + round brilliant diamond', 'High-polish yellow gold coating on an authentic Casio G-SHOCK', '50 mm case · black resin strap'],
  },
  {
    id: 'gmd-wat-gsh-wg450-nd',
    slug: 'white-gold-diamond-gshock',
    sku: 'GMD-WAT-GSH-WG450-ND',
    name: 'White Gold Diamond G-SHOCK Watch | 4.50 CTW Natural VS1 Diamonds',
    category: 'watches',
    collection: 'GoldMoufDog Luxury Timepieces Collection',
    price: 2500,
    metal: 'Custom G-SHOCK',
    metalDetail: 'White gold finish on an authentic Casio G-SHOCK',
    finish: 'Iced (Natural Diamond)',
    stones: '4.50 CTW natural VS1 baguette + round brilliant diamond',
    weight: '95–110 grams',
    dimensions: '50 mm',
    tone: 'silver',
    image: '/assets/products/watches/gmd-wat-gsh-wg450-nd.webp',
    madeToOrder: true,
    subtitle: '4.50 CTW natural diamond · white gold',
    description: 'The Custom White Gold Diamond G-SHOCK Watch blends iconic G-SHOCK durability with premium jewelry craftsmanship. Built on an authentic Casio G-SHOCK platform, this custom timepiece is meticulously hand-set with 4.50 carats of natural VS1 diamonds, featuring an eye-catching combination of baguette-cut and round brilliant-cut diamonds for exceptional brilliance and depth. Finished in a brilliant white gold finish and paired with a durable black resin strap, this luxury watch delivers bold style without sacrificing the legendary toughness G-SHOCK is known for. Whether worn daily or reserved for special occasions, it\'s designed to stand out.',
    highlights: ['Baguette and round brilliant diamonds, hand-set', '4.50 CTW natural VS1 baguette + round brilliant diamond', 'White gold finish on an authentic Casio G-SHOCK', '50 mm case · black resin strap'],
  },
  {
    id: 'gmd-wat-gsh-moi-slv-blk',
    slug: 'silver-moissanite-gshock-black-band',
    sku: 'GMD-WAT-GSH-MOI-SLV-BLK',
    name: 'Silver Moissanite G-SHOCK Watch | Black Band',
    category: 'watches',
    collection: 'GoldMoufDog Luxury Timepieces Collection',
    price: 850,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    weight: '85–100 grams',
    dimensions: '45.4 mm',
    tone: 'iced',
    image: '/assets/products/watches/gmd-wat-gsh-moi-slv-blk.webp',
    madeToOrder: true,
    subtitle: 'Black dial + black resin band',
    description: 'Experience luxury and durability with the Custom Silver Moissanite G-SHOCK Watch. Built on an authentic Casio G-SHOCK platform, this custom timepiece is fully hand-set with premium D Color VVS1 Moissanite stones, delivering exceptional brilliance and a diamond-like appearance. Finished in genuine 925 Sterling Silver with a durable rhodium plating, this watch pairs a sleek black analog-digital dial with a comfortable black resin strap, creating the perfect blend of rugged performance and luxury style. Whether worn daily or for special occasions, this custom G-SHOCK is designed to stand out.',
    highlights: ['Authentic Casio G-SHOCK, fully hand-set', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '45.4 mm case · black resin strap'],
  },
  {
    id: 'gmd-wat-gsh-moi-olv-bt',
    slug: 'silver-moissanite-bluetooth-gshock-olive',
    sku: 'GMD-WAT-GSH-MOI-OLV-BT',
    name: 'Silver Moissanite Bluetooth G-SHOCK Watch | Olive Band',
    category: 'watches',
    collection: 'GoldMoufDog Luxury Timepieces Collection',
    price: 900,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    weight: '90–105 grams',
    dimensions: '48.5 mm',
    tone: 'iced',
    image: '/assets/products/watches/gmd-wat-gsh-moi-olv-bt.webp',
    madeToOrder: true,
    subtitle: 'Bluetooth Tough Solar · olive band',
    description: 'Experience cutting-edge technology and luxury craftsmanship with the Custom Silver Moissanite Bluetooth G-SHOCK Watch. Built on an authentic Casio Bluetooth Tough Solar G-SHOCK, this custom timepiece is fully hand-set with premium D Color VVS1 Moissanite stones, delivering exceptional brilliance while maintaining the rugged reliability G-SHOCK is known for. The striking olive green dial and matching resin band create a unique military-inspired look, while Bluetooth(R) connectivity and Tough Solar technology provide modern convenience. Finished in genuine 925 Sterling Silver with a brilliant rhodium plating, this watch is designed for those who demand both performance and luxury.',
    highlights: ['Casio Bluetooth Tough Solar G-SHOCK, fully hand-set', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '48.5 mm case · olive resin band'],
  },
  {
    id: 'gmd-wat-gsh-moi-slv',
    slug: 'silver-moissanite-gshock',
    sku: 'GMD-WAT-GSH-MOI-SLV',
    name: 'Silver Moissanite G-SHOCK Watch',
    category: 'watches',
    collection: 'GoldMoufDog Luxury Timepieces Collection',
    price: 850,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    weight: '85–100 grams',
    dimensions: '48.5 mm',
    tone: 'iced',
    image: '/assets/products/watches/gmd-wat-gsh-moi-slv.webp',
    madeToOrder: true,
    bestseller: true,
    subtitle: 'Hand-set micro pavé bezel + band',
    description: 'Upgrade your wrist game with the Custom Silver Moissanite G-SHOCK Watch, built on an authentic Casio G-SHOCK platform and fully customized with premium D Color VVS1 Moissanite stones. The hand-set micro pave design delivers brilliant diamond-like sparkle while maintaining the rugged durability and reliability that G-SHOCK is known for. Finished in genuine 925 Sterling Silver with a brilliant rhodium finish, this custom watch features a sleek black analog-digital dial paired with a durable black resin strap, making it perfect for everyday wear or luxury streetwear styling.',
    highlights: ['Authentic Casio G-SHOCK, hand-set in micro pavé', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '48.5 mm case · black resin strap'],
  },

  /* ── BELT BUCKLES — 2 SKUs, 2 with photography ── */
  {
    id: 'gmd-bbk-moi-925-wh',
    slug: 'iced-belt-buckle-silver',
    sku: 'GMD-BBK-MOI-925-WH',
    name: 'Luxury Iced Out Belt Buckle',
    category: 'belt-buckles',
    collection: 'GoldMoufDog Luxury Accessories Collection',
    price: 875,
    metal: '925 Silver',
    metalDetail: '925 sterling silver · rhodium plated',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    weight: '140–165 grams',
    dimensions: '3.30 in (84 mm)',
    tone: 'iced',
    image: '/assets/products/belt-buckles/gmd-bbk-moi-925-wh.webp',
    madeToOrder: true,
    subtitle: 'Openwork cross scroll · fits 1.5 in belts',
    description: 'Make a bold statement with this Luxury Iced Moissanite Belt Buckle, expertly crafted from genuine 925 Sterling Silver and fully handset with premium D Color VVS1 Moissanite stones. Featuring an intricate openwork cross-inspired scroll design, this buckle combines timeless craftsmanship with exceptional brilliance, creating a standout luxury accessory. Finished with a high-polish rhodium plating for enhanced shine and durability, the buckle is designed to fit standard 1.5-inch belts and offers the look and fire of fine diamond jewelry at a fraction of the cost. Whether paired with designer denim or formal attire, this piece delivers unmatched style and sophistication.',
    highlights: ['Openwork cross-inspired scroll, hand-set stone by stone', 'D Color VVS1 moissanite', '925 sterling silver · rhodium plated', '3.30 in (84 mm) · fits standard 1.5 in belts'],
  },
  {
    id: 'gmd-bbk-moi-yg',
    slug: 'yellow-gold-iced-belt-buckle',
    sku: 'GMD-BBK-MOI-YG',
    name: 'Luxury Yellow Gold Iced Out Belt Buckle',
    category: 'belt-buckles',
    collection: 'GoldMoufDog Luxury Accessories Collection',
    price: 1050,
    metal: 'Gold-Plated',
    metalDetail: 'High-polish yellow gold plating',
    finish: 'Iced (Moissanite VVS)',
    stones: 'D Color VVS1 moissanite',
    weight: '140–165 grams',
    dimensions: '3.30 in (84 mm)',
    tone: 'gold',
    image: '/assets/products/belt-buckles/gmd-bbk-moi-yg.webp',
    madeToOrder: true,
    bestseller: true,
    subtitle: 'Openwork cross scroll · fits 1.5 in belts',
    description: 'Elevate your look with the Luxury Yellow Gold Iced Moissanite Designer Belt Buckle, a statement accessory designed for those who appreciate premium craftsmanship and bold style. Featuring an intricate openwork cross scroll design, this buckle is meticulously hand-set with D Color VVS1 Round Brilliant Moissanite stones that deliver exceptional brilliance and fire. Finished in a rich high-polish yellow gold plating, this buckle combines timeless elegance with modern luxury. Designed to fit standard 1.5-inch belts, it\'s the perfect finishing touch for designer streetwear, western fashion, or formal attire.',
    highlights: ['Openwork cross scroll, hand-set stone by stone', 'D Color VVS1 moissanite', 'High-polish yellow gold plating', '3.30 in (84 mm) · fits standard 1.5 in belts'],
  },
]

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
