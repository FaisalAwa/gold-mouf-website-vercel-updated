/* /legal/:doc — five documents. Grillz + Jewelry policy reflect the real
   made-to-order / final-sale / 7-day-defect terms; privacy, terms, shipping
   are standard small-LLC copy. Single readable column, ~68ch measure. */
import { useParams, Link } from 'react-router-dom'
import { Section, Eyebrow, Heading, Btn } from '@/components'
import { SITE } from '@/data/site'
import type { LegalDoc } from '@/data/site'

interface Block {
  h?: string
  p?: string
  list?: string[]
}
interface Doc {
  title: string
  intro: string
  blocks: Block[]
}

const UPDATED = 'Updated 2026'

const DOCS: Record<LegalDoc, Doc> = {
  'grillz-policy': {
    title: 'Grillz Policy',
    intro:
      'Every grill we make is cut, cast, and set to your own mouth. Because of that, the terms below are specific. Read them before you order.',
    blocks: [
      {
        h: 'Made to order & final sale',
        p: 'All grillz are custom fabricated to your dental mold once your order is confirmed. A custom piece cannot be resold or restocked, so all grillz sales are final. There are no returns, exchanges, or refunds after production begins.',
      },
      {
        h: 'Your dental mold',
        p: 'Grillz require an accurate dental mold. A mold kit ships to you with instructions, or you can visit the shop in Alabama to have one taken. Fit accuracy depends on the quality of the mold you submit. Follow the instructions exactly and let it set fully before you return it.',
      },
      {
        h: 'Manufacturing defects',
        p: 'You have a 7-day window from delivery to report a genuine manufacturing defect: a loose stone, a casting flaw, or a fault in the workmanship. Reach out within that window with photos and we will make it right. This does not cover damage from wear, misuse, improper cleaning, or a fit issue caused by an inaccurate mold.',
      },
      {
        h: 'Fit & care',
        p: 'Your grill is made to seat over your natural teeth. Do not force it. Remove your grillz before eating, drinking, or sleeping, and clean them gently with a soft brush and warm water. Iced pieces should be kept away from harsh chemicals and ultrasonic cleaners.',
      },
      {
        h: 'Turnaround',
        p: 'Most custom grillz are built in roughly 2 to 6 weeks from the day we receive a usable mold, depending on the metal, the finish, and the stone work. We confirm a timeline with you before production starts.',
      },
    ],
  },
  'jewelry-policy': {
    title: 'Jewelry Policy',
    intro:
      'Our jewelry is handmade to order. The terms below apply to chains, pendants, earrings, and every other piece in the case.',
    blocks: [
      {
        h: 'Made to order & final sale',
        p: 'Custom and personalized jewelry is built to your specifications once your order is confirmed. These pieces are final sale (no returns, exchanges, or refunds) because they are made specifically for you.',
      },
      {
        h: 'Materials & natural variation',
        p: 'We work in solid 925 silver and 10K, 14K, and 18K gold, with natural and lab-grown stones. Because each piece is made by hand, small variations in finish, weight, and stone character are part of the work, not a defect.',
      },
      {
        h: 'Manufacturing defects',
        p: 'You have a 7-day window from delivery to report a genuine manufacturing defect. Send photos within that window and we will repair or remake the piece. This does not cover normal wear, accidental damage, or loss.',
      },
      {
        h: 'Sizing & personalization',
        p: 'Ring sizes, chain lengths, engraving, and any personalization are produced from the details you provide. Please confirm those details carefully before ordering. A piece made correctly to the specs you submitted is not eligible for return.',
      },
      {
        h: 'Care',
        p: 'Store pieces separately, keep them away from harsh chemicals, and clean with a soft cloth. We are happy to advise on maintenance for any piece we have made.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro:
      'This policy explains what information GoldMoufDog collects, how we use it, and the choices you have. We keep it simple because we collect only what we need to build and ship your order.',
    blocks: [
      {
        h: 'What we collect',
        p: 'When you order or reach out, we collect the details you give us: your name, contact information, shipping address, order and fit specifications, and any messages you send. Payment is handled by our payment processor. We do not store full card numbers.',
      },
      {
        h: 'How we use it',
        p: 'We use your information to build your piece, take payment, ship your order, provide support, and reply to your questions. If you have asked to hear from us, we may occasionally share news about new work.',
      },
      {
        h: 'Sharing',
        p: 'We do not sell your information. We share it only with the service providers we need to complete your order (such as our payment and shipping partners) and only to the extent required to do their job, or when the law requires it.',
      },
      {
        h: 'Cookies',
        p: 'Our site uses standard cookies and similar tools to keep the store working, remember your bag, and understand how the site is used. You can control cookies through your browser settings.',
      },
      {
        h: 'Your choices',
        p: 'You can ask us what information we hold, request a correction, or ask us to delete it, subject to any records we are required to keep. To make a request, contact us using the details below.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro:
      'These terms govern your use of the GoldMoufDog website and any order you place with us. By using the site or placing an order, you agree to them.',
    blocks: [
      {
        h: 'Orders & pricing',
        p: 'Prices are shown in U.S. dollars and may change without notice. Because our pieces are made in precious metal, quoted prices can move with live metal markets until an order is confirmed. We confirm the final price and specifications with you before production begins.',
      },
      {
        h: 'Custom work',
        p: 'Custom grillz and made-to-order jewelry are final sale. Please review the Grillz Policy and Jewelry Policy, which are part of these terms, before you order.',
      },
      {
        h: 'Accuracy',
        p: 'We work hard to describe our pieces accurately, but handmade work varies and screens render metal and stones differently. Product images are representative, not exact.',
      },
      {
        h: 'Intellectual property',
        p: 'The GoldMoufDog name, logo, images, and site content belong to us and may not be copied or reused without permission.',
      },
      {
        h: 'Limitation of liability',
        p: 'To the extent allowed by law, our liability for any order is limited to the amount you paid for that order. We are not responsible for indirect or incidental losses.',
      },
      {
        h: 'Governing law',
        p: 'These terms are governed by the laws of the State of Georgia.',
      },
    ],
  },
  shipping: {
    title: 'Shipping',
    intro:
      'How and when your order reaches you. Custom work takes time to make. The timelines below start once a piece is built, not the day you order.',
    blocks: [
      {
        h: 'Processing time',
        p: 'Custom grillz and made-to-order jewelry are typically built in roughly 2 to 6 weeks, depending on the metal, finish, and stone work. Grillz timelines start once we receive a usable dental mold. We confirm a timeline with you before production.',
      },
      {
        h: 'Insured shipping',
        p: 'Finished orders ship insured with tracking. You will receive a tracking number once your piece is on its way.',
      },
      {
        h: 'International orders',
        p: 'We ship internationally. Any import duties, taxes, or customs fees are set by the destination country and are the responsibility of the buyer.',
      },
      {
        h: 'Delivery issues',
        p: 'Check the details you provide at checkout. We ship to the address given. If a package is marked delivered but you cannot locate it, contact us and we will help you open a claim with the carrier.',
      },
    ],
  },
}

const INDEX: { slug: LegalDoc; label: string }[] = [
  { slug: 'grillz-policy', label: 'Grillz Policy' },
  { slug: 'jewelry-policy', label: 'Jewelry Policy' },
  { slug: 'shipping', label: 'Shipping' },
  { slug: 'privacy', label: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms of Service' },
]

export default function Legal() {
  const { doc } = useParams()
  const content = doc && doc in DOCS ? DOCS[doc as LegalDoc] : undefined

  if (!content) {
    return (
      <Section pad="lg">
        <div style={{ maxWidth: '68ch' }}>
          <Eyebrow>Legal</Eyebrow>
          <Heading level={1} style={{ margin: '14px 0 16px' }}>
            Policies & terms
          </Heading>
          <p style={{ color: 'var(--c-ink-muted)', fontSize: 'var(--t-sub)', marginBottom: 'var(--s-sm)' }}>
            The full set of GoldMoufDog policies. The grillz and jewelry policies cover custom orders. Read those
            before you buy.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {INDEX.map((d) => (
              <Btn key={d.slug} to={`/legal/${d.slug}`} variant="ghost" style={{ justifyContent: 'space-between' }}>
                {d.label}
                <span aria-hidden>→</span>
              </Btn>
            ))}
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section pad="lg">
      <article style={{ maxWidth: '68ch' }}>
        <Eyebrow>Legal · {UPDATED}</Eyebrow>
        <Heading level={1} style={{ margin: '14px 0 16px' }}>
          {content.title}
        </Heading>
        <p style={{ color: 'var(--c-ink-muted)', fontSize: 'var(--t-sub)', lineHeight: 1.65, marginBottom: 'var(--s-sm)' }}>
          {content.intro}
        </p>

        {content.blocks.map((b) => (
          <div key={b.h ?? b.p} style={{ marginBottom: 'var(--s-sm)' }}>
            {b.h && (
              <h2
                className="font-head"
                style={{ fontSize: 'var(--t-h3)', fontWeight: 700, color: 'var(--c-ink)', marginBottom: 10 }}
              >
                {b.h}
              </h2>
            )}
            {b.p && (
              <p style={{ fontSize: 'var(--t-body)', color: 'var(--c-ink-muted)', lineHeight: 1.7 }}>{b.p}</p>
            )}
            {b.list && (
              <ul style={{ margin: '10px 0 0', paddingLeft: 20 }}>
                {b.list.map((li) => (
                  <li key={li} style={{ fontSize: 'var(--t-body)', color: 'var(--c-ink-muted)', lineHeight: 1.7, marginBottom: 6 }}>
                    {li}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <hr style={{ height: 1, border: 0, background: 'var(--c-line)', margin: 'var(--s-sm) 0' }} />
        <p style={{ fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)', lineHeight: 1.6 }}>
          Questions about this policy? Email{' '}
          <a href={`mailto:${SITE.contact.email}`} style={{ color: 'var(--c-accent-deep)' }}>
            {SITE.contact.email}
          </a>{' '}
          or text{' '}
          <a href={SITE.contact.phoneHref} style={{ color: 'var(--c-accent-deep)' }}>
            {SITE.contact.phone}
          </a>
          .
        </p>
        <p style={{ marginTop: 'var(--s-sm)' }}>
          <Link to="/legal/grillz-policy" style={{ fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)' }}>
            ← All policies
          </Link>
        </p>
      </article>
    </Section>
  )
}
