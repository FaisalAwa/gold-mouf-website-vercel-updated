/* ═══════════════════════════════════════════════════════════════
   GOLD MOUF DOG — Site configuration (single source of truth)
   Real values from _workspace/BRAIN.md (Written Content + Requirements).
   ═══════════════════════════════════════════════════════════════ */

export const SITE = {
  brand: 'GoldMoufDog',
  legalName: 'GoldMoufDog Custom Grillz & Jewelry LLC',
  founder: 'Svmba',
  founderHandle: '@_Svmba',
  established: 2014,
  /** where it started — the founder's origin story */
  foundedCity: 'Atlanta, GA',
  /** current home base, per client: keep this general (Alabama / the South) */
  base: 'Alabama',
  serves: ['Atlanta, GA', 'Tuscaloosa, AL'],
  domain: 'goldmoufdogandco.com',
  tagline: 'Where Your Smile Becomes Your Signature.',
  subTagline: 'Custom Crafted. Precision Fit. Built To Shine.',
  contact: {
    email: 'Goldmoufdogandco@gmail.com',
    phone: '(404) 716-4734',
    phoneHref: 'tel:+14047164734',
  },
  socials: {
    instagram: { label: '@_Svmba', href: 'https://instagram.com/_svmba' },
    tiktok: { label: '@goldmoufdog8', href: 'https://www.tiktok.com/@goldmoufdog8' },
  },
  props: [
    'Custom-Fit Grillz',
    'Handmade Jewelry',
    'Premium Materials',
    'Secure Ordering',
    'International Shipping',
  ],
} as const

// Policy microcopy surfaced on PDP / cart (from client GRILLZ + Jewelry policies).
export const POLICY = {
  allSalesFinal: 'All custom pieces are made to order and final sale.',
  defectWindow: '7-day window to report a manufacturing defect.',
  moldRequired: 'Grillz require a dental mold. A kit ships to you, or visit the shop in Alabama.',
  shipping: 'Insured shipping. International orders welcome.',
} as const

export type LegalDoc = 'grillz-policy' | 'jewelry-policy' | 'return-policy' | 'privacy' | 'terms' | 'shipping'
