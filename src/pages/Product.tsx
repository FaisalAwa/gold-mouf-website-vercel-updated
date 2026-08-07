import '@/styles/product.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Section, Eyebrow, Heading, Btn, Rule, ProductMedia, ProductCard, Marquee } from '@/components'
import { productBySlug, categoryBySlug, related, formatPrice } from '@/data/catalog'
import { SITE, POLICY } from '@/data/site'
import { HOOKS } from '@/data/phrases'
import { TESTIMONIALS } from '@/data/testimonials'
import { useCart } from '@/context/CartContext'
import { useLive, useLiveList, useVariantAvailable } from '@/lib/live-catalog'

function Check() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: 3 }}>
      <path d="M2.5 7.5l3 3 6-7" stroke="var(--c-accent)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Small trust icons — single accent stroke, no fill. */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }} stroke="var(--c-accent)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}
const ICON_SHIP = <Icon><path d="M12 3l7 3v5c0 4.4-3 7.4-7 8.5C8 18.4 5 15.4 5 11V6l7-3z" /><path d="M9 12l2 2 4-4" /></Icon>
const ICON_METAL = <Icon><path d="M12 4l6 5-6 11-6-11 6-5z" /><path d="M6 9h12" /></Icon>
const ICON_LOUPE = <Icon><circle cx={10} cy={10} r={6} /><path d="M20 20l-4.6-4.6" /></Icon>
const ICON_PIN = <Icon><path d="M12 21c4-4.6 6-8.1 6-11a6 6 0 10-12 0c0 2.9 2 6.4 6 11z" /><circle cx={12} cy={10} r={2} /></Icon>

/* Pick the most relevant operator-authorized testimonial for the category;
   fall back to a general craftsmanship quote (no fabricated metrics). */
function pickTestimonial(category: string) {
  const rx: Record<string, RegExp> = {
    grills: /grill|bottom|top|fang|full set/i,
    chains: /cuban|chain|link|rope|franco/i,
    pendants: /medallion|pendant|initial|photo|cross|star|uzi|number/i,
    earrings: /stud|hoop|cluster/i,
    watches: /watch|bezel|dial|g-shock|gshock/i,
  }
  const re = rx[category]
  return (re && TESTIMONIALS.find((t) => re.test(t.piece))) || TESTIMONIALS[2]
}

export default function Product() {
  const { slug } = useParams()
  // Shopify owns the photo and the price; everything else is local. Quoting
  // the live price also keeps the PDP from promising less than checkout takes.
  const p = useLive(slug ? productBySlug(slug) : undefined)
  const { add, justAdded } = useCart()
  const navigate = useNavigate()

  // Live social proof: seeded 3–15, nudged ±1 roughly every 8s.
  const [viewers, setViewers] = useState(() => 3 + Math.floor(Math.random() * 13))
  useEffect(() => {
    const id = window.setInterval(() => {
      setViewers((v) => Math.min(15, Math.max(3, v + (Math.random() < 0.5 ? -1 : 1))))
    }, 8000)
    return () => window.clearInterval(id)
  }, [])

  // Buyer-selected options (the number pendant's 0-9 digit). The choice is
  // stamped with the slug it belongs to, so navigating to another piece
  // falls back to its own defaults without an effect resetting state.
  const [picked, setPicked] = useState<{ slug?: string; values: Record<string, string> }>({ values: {} })
  const chosenFor = picked.slug === slug ? picked.values : {}
  const choose = (name: string, value: string) =>
    setPicked({ slug, values: { ...chosenFor, [name]: value } })

  /* Option selection. Variant SKUs are the base SKU plus the chosen values —
     the same naming the Shopify import uses, so a cart line always resolves
     to exactly one variant at checkout. Derived above the not-found guard
     because the hooks below it cannot run conditionally. */
  const options = p?.options ?? []
  const valueOf = (name: string, values: string[]) => chosenFor[name] ?? values[0]
  const chosen = options.map((o) => valueOf(o.name, o.values))
  const variantSku = p ? (chosen.length ? `${p.sku}-${chosen.join('-')}` : p.sku) : ''

  const inStock = useVariantAvailable(p?.slug ?? '', variantSku)
  const rel = useLiveList(useMemo(() => (p ? related(p) : []), [p]))

  // Sticky mobile buy-bar: reveal once the inline CTA scrolls above the viewport.
  const ctaRef = useRef<HTMLDivElement>(null)
  const [showBar, setShowBar] = useState(false)
  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [p])

  if (!p) {
    return (
      <Section pad="lg">
        <Eyebrow>Shop</Eyebrow>
        <Heading level={1} style={{ marginTop: 12 }}>Piece not found</Heading>
        <p style={{ marginTop: 14, color: 'var(--c-ink-muted)', maxWidth: 520, fontSize: 'var(--t-sub)' }}>
          This one may have sold or moved. Everything in stock is in the shop.
        </p>
        <div style={{ marginTop: 24 }}>
          <Btn to="/shop">Back to the shop</Btn>
        </div>
      </Section>
    )
  }

  const cat = categoryBySlug(p.category)
  const optionLabel = options.map((o, i) => `${o.name} ${chosen[i]}`).join(' · ')
  const cartKey = chosen.length ? `${p.slug}--${chosen.join('-')}` : p.slug

  const added = justAdded === cartKey
  const hasCompare = typeof p.compareAt === 'number' && p.compareAt > p.price
  const savings = hasCompare ? (p.compareAt as number) - p.price : 0
  const isGrills = p.category === 'grills'
  const hook = isGrills ? HOOKS.fit : p.tone === 'iced' ? HOOKS.craft : HOOKS.metal
  const testimonial = pickTestimonial(p.category)
  const guarantee = `${HOOKS.guarantee.replace(/\.$/, '')}. ${POLICY.defectWindow}`

  /* Every line comes straight off the client sheet. Rows the sheet
     leaves blank for this piece drop out rather than render empty. */
  const specs = (
    [
      ['Collection', p.collection],
      ['Metal', p.metalDetail],
      ['Finish', p.finish],
      ['Stones', p.stones],
      ['Total carat', p.caratSpec],
      ['Weight', p.weight],
      ['Size', p.dimensions],
      ['SKU', p.sku],
      ['Made to order', p.madeToOrder ? 'Yes, built to your spec' : 'Ready to ship'],
    ] as [string, string | undefined][]
  ).filter((row): row is [string, string] => Boolean(row[1]))

  const policyLines = [
    POLICY.allSalesFinal,
    POLICY.defectWindow,
    ...(isGrills ? [POLICY.moldRequired] : []),
    POLICY.shipping,
  ]

  const trust: { icon: ReactNode; label: string }[] = [
    { icon: ICON_SHIP, label: 'Insured shipping' },
    { icon: ICON_METAL, label: 'Solid metal or gold-plated' },
    { icon: ICON_LOUPE, label: 'Loupe-checked before ship' },
    { icon: ICON_PIN, label: `Southern-made since ${SITE.established}` },
  ]

  const steps: [string, string][] = [
    ['Mold or kit', `A mold kit ships to you, or slide through the shop in ${SITE.base}.`],
    ['We build it', 'Cast in solid metal and hand-finished to your exact bite.'],
    ['Ship insured', 'Loupe-checked, then shipped to your door fully insured.'],
  ]

  const addToCart = () =>
    add({
      key: cartKey,
      sku: variantSku,
      title: p.name,
      subtitle: [optionLabel, p.metalDetail].filter(Boolean).join(' · '),
      price: p.price,
      image: p.image,
      href: `/product/${p.slug}`,
      kind: 'product',
      tone: p.tone,
      madeToOrder: p.madeToOrder,
    })

  const buyNow = () => {
    addToCart()
    navigate('/cart')
  }

  return (
    <>
      <Section pad="md">
        <div className="pdp-grid">
          {/* ── Gallery ─────────────────────────────────────────── */}
          <div className="pdp-gallery">
            <ProductMedia product={p} ratio="4 / 5" />
            {p.gallery && p.gallery.length > 0 && (
              <div className="pdp-thumbs">
                {p.gallery.map((src, i) => (
                  <div key={src} className="pdp-thumb">
                    <img src={src} alt={`${p.name} view ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ─────────────────────────────────────────── */}
          <div className="pdp-details">
            <Eyebrow>
              <Link to={`/shop/${p.category}`} style={{ color: 'inherit' }}>{cat?.name ?? 'Shop'}</Link>
            </Eyebrow>

            <Heading level={1} style={{ marginTop: 10 }}>{p.name}</Heading>

            {/* Brand hook */}
            <p className="pdp-hook">{hook}</p>

            <p style={{ marginTop: 12, color: 'var(--c-ink-muted)', fontSize: 'var(--t-sub)', lineHeight: 1.5 }}>
              {p.subtitle}
            </p>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
              <span
                className="font-head"
                style={{ fontSize: 'var(--t-h3)', fontWeight: 700, color: 'var(--c-ink)', fontVariantNumeric: 'tabular-nums' }}
              >
                {formatPrice(p.price)}
              </span>
              {hasCompare && (
                <>
                  <span style={{ fontSize: 'var(--t-sub)', color: 'var(--c-ink-faint)', textDecoration: 'line-through' }}>
                    {formatPrice(p.compareAt as number)}
                  </span>
                  <span style={{ fontSize: 'var(--t-small)', fontWeight: 600, color: 'var(--c-accent-deep)' }}>
                    Save {formatPrice(savings)}
                  </span>
                </>
              )}
            </div>

            {/* Honest financing framing (no wired provider) */}
            {p.price >= 1000 && (
              <p style={{ marginTop: 6, fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)' }}>
                or ask about splitting it up
              </p>
            )}

            {/* Honest urgency */}
            <p className="pdp-urgency">
              {p.madeToOrder
                ? 'Made to order · 2 to 6 week build. Reserve your spot.'
                : 'Ready to ship. Hand-made in small batches.'}
            </p>

            {/* Live viewers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 10 }}>
              <span className="pdp-pulse" aria-hidden />
              <span style={{ fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)', fontVariantNumeric: 'tabular-nums' }}>
                {viewers} people viewing this piece
              </span>
            </div>

            {/* Buyer-selected options — e.g. which digit the number pendant is */}
            {options.map((o) => (
              <div key={o.name} className="pdp-options" role="group" aria-label={o.name}>
                <span className="pdp-options-label">
                  {o.name}
                  <b>{valueOf(o.name, o.values)}</b>
                </span>
                <div className="pdp-options-row">
                  {o.values.map((v) => {
                    const isOn = valueOf(o.name, o.values) === v
                    return (
                      <button
                        key={v}
                        type="button"
                        className={`pdp-option${isOn ? ' is-on' : ''}`}
                        aria-pressed={isOn}
                        onClick={() => choose(o.name, v)}
                      >
                        {v}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* CTAs */}
            <div className="pdp-cta" ref={ctaRef}>
              <div className="pdp-cta-row">
                <Btn variant="accent" onClick={addToCart} full disabled={!inStock}>
                  {!inStock ? 'Sold out' : added ? 'Added ✓' : 'Add to cart'}
                </Btn>
                <Btn variant="solid" onClick={buyNow} full disabled={!inStock}>Buy it now</Btn>
              </div>
              <div className="pdp-cta-foot">
                <Link to="/cart" className="pdp-viewbag">View bag</Link>
                <span className="pdp-payplan">Payment plans available, just ask.</span>
              </div>
            </div>

            {isGrills && (
              <p style={{ marginTop: 14, fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)' }}>
                Want it fully custom?{' '}
                <Link to="/configurator" style={{ color: 'var(--c-accent-deep)', fontWeight: 600 }}>Design your own set</Link>.
              </p>
            )}

            <div style={{ margin: 'var(--s-sm) 0' }}><Rule /></div>

            {/* Description */}
            <p style={{ fontSize: 'var(--t-body)', color: 'var(--c-ink)', lineHeight: 1.65, maxWidth: 560 }}>
              {p.description}
            </p>

            {/* Highlights */}
            {p.highlights.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'grid', gap: 10 }}>
                {p.highlights.map((h) => (
                  <li key={h} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 'var(--t-body)', color: 'var(--c-ink)' }}>
                    <Check />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* How your order works (grills) */}
            {isGrills && (
              <div className="pdp-steps">
                {steps.map(([title, body], i) => (
                  <div key={title} className="pdp-step">
                    <span className="pdp-step-n">{i + 1}</span>
                    <span className="pdp-step-title">{title}</span>
                    <span className="pdp-step-body">{body}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trust row + guarantee */}
            <div className="pdp-trust">
              {trust.map((t) => (
                <div key={t.label} className="pdp-trust-item">
                  {t.icon}
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
            <p className="pdp-guarantee">{guarantee}</p>

            {/* Testimonial — confidence at the decision point */}
            <figure className="pdp-quote">
              <span className="pdp-quote-mark" aria-hidden>“</span>
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption>
                {testimonial.name} · {testimonial.city}
                <span className="pdp-quote-piece"> ({testimonial.piece})</span>
              </figcaption>
            </figure>

            {/* Spec table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 'var(--s-sm)' }}>
              <tbody>
                {specs.map(([k, v]) => (
                  <tr key={k} style={{ borderTop: '1px solid var(--c-line)' }}>
                    <th
                      scope="row"
                      style={{
                        textAlign: 'left',
                        padding: '12px 12px 12px 0',
                        fontFamily: 'var(--f-head)',
                        fontSize: 'var(--t-label)',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--c-ink-faint)',
                        whiteSpace: 'nowrap',
                        verticalAlign: 'top',
                        width: '38%',
                      }}
                    >
                      {k}
                    </th>
                    <td style={{ padding: '12px 0', fontSize: 'var(--t-body)', color: 'var(--c-ink)' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Policy microcopy */}
            <div
              style={{
                marginTop: 'var(--s-sm)',
                padding: '16px 18px',
                background: 'var(--c-surface-2)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {policyLines.map((line) => (
                <p key={line} style={{ fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)', lineHeight: 1.5, margin: '2px 0' }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Catchphrase band ────────────────────────────────────── */}
      <Marquee />

      {/* ── Related ─────────────────────────────────────────────── */}
      {rel.length > 0 && (
        <Section soft pad="md">
          <Eyebrow>More in {cat?.name ?? 'the case'}</Eyebrow>
          <Heading level={2} style={{ marginTop: 12, marginBottom: 'var(--s-sm)' }}>Pairs with this</Heading>
          <div className="pdp-related-grid">
            {rel.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </Section>
      )}

      {/* ── Sticky mobile buy-bar ───────────────────────────────── */}
      <div className={`pdp-buybar${showBar ? ' is-visible' : ''}`}>
        <div className="pdp-buybar-info">
          <span className="pdp-buybar-name">{p.name}</span>
          <span className="pdp-buybar-price">{formatPrice(p.price)}</span>
        </div>
        <Btn variant="accent" onClick={addToCart} style={{ flexShrink: 0 }} disabled={!inStock}>
          {!inStock ? 'Sold out' : added ? 'Added ✓' : 'Add to cart'}
        </Btn>
      </div>
    </>
  )
}
