/* ═══════════════════════════════════════════════════════════════
   GOLD MOUF DOG — Testimonials
   Operator-authorized placeholder testimonials (realistic first-name +
   city, swappable). To be replaced with real reviews — tracked in
   PLACEHOLDERS.md P08. HONEST-COPY guard: no invented press, no verified
   metrics, no real named people.
   ═══════════════════════════════════════════════════════════════ */

export interface Testimonial {
  name: string
  city: string
  piece: string
  quote: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Marcus',
    city: 'Atlanta, GA',
    piece: 'Bottom 6 · 10K Gold',
    quote:
      'Sent my mold in on a Monday, had the set two weeks later and it snapped on like it grew there. First custom that actually fit right.',
  },
  {
    name: 'Deja',
    city: 'Tuscaloosa, AL',
    piece: 'Iced Studs · Lab VVS',
    quote:
      'I was nervous ordering online but they texted me through the whole thing. The studs are brighter in person than the photos.',
  },
  {
    name: 'Andre',
    city: 'Atlanta, GA',
    piece: 'Top 8 Iced · VS Diamonds',
    quote:
      'You can feel the difference when the stones are actually hand-set. Every prong is tight. Worth the wait.',
  },
  {
    name: 'Rico',
    city: 'Marietta, GA',
    piece: 'Cuban Link · 10K Gold, 10mm',
    quote:
      'They weighed the chain in front of me and priced it to the gold that day. No games. That earned my trust.',
  },
  {
    name: 'Tamia',
    city: 'Birmingham, AL',
    piece: 'Custom Medallion · 10K Gold',
    quote:
      'Brought them a picture of my grandfather and they turned it into a pendant I will never take off. Cried when I opened it.',
  },
  {
    name: 'Jalen',
    city: 'Atlanta, GA',
    piece: 'Full Set Iced · Lab VVS',
    quote:
      'Full set, top and bottom. Took six weeks and every check-in they sent a photo of the progress. Elite service.',
  },
]
