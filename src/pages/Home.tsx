import '@/styles/home.css'
import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Container,
  Section,
  Eyebrow,
  Heading,
  Btn,
  Marquee,
  ProductCard,
  ProductMedia,
  HeroSlider,
} from '@/components'
import { GrillReveal } from '@/components/GrillReveal'
import { HeroGrillStage } from '@/components/HeroGrill'
import type { CategorySlug, Product } from '@/data/catalog'
import { CATEGORIES, categoryBySlug, categoryHref, formatPrice } from '@/data/catalog'
import { useLiveCatalog } from '@/lib/live-catalog'
import { useLiveMetals, estimateGrillPrice, PRESETS } from '@/data/silver'
import { SITE } from '@/data/site'
import { BADGE_LINE, HOOKS } from '@/data/phrases'
import { TESTIMONIALS } from '@/data/testimonials'

/* full-bleed hero backdrop — genuinely dark, moody studio shots so the
   light hero copy always has real contrast to sit on */
const HERO_SLIDES = [
  '/assets/hero/slide-grillz.webp',
  '/assets/hero/slide-chain.webp',
  '/assets/hero/slide-sparkle.webp',
  '/assets/hero/slide-workshop.webp',
]

/* catchphrases cycled in the hero — the client's own hooks, rotated one at a time */
const HERO_HOOKS = [BADGE_LINE, HOOKS.fit, HOOKS.metal, HOOKS.craft, HOOKS.since, HOOKS.guarantee]

/* rotating catchphrase line — swaps every few seconds, still (no layout jump) when reduced-motion */
function HeroCatchphrase({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || phrases.length < 2) return
    const id = window.setInterval(() => setI((n) => (n + 1) % phrases.length), 3400)
    return () => window.clearInterval(id)
  }, [reduce, phrases.length])

  if (reduce) return <p className="font-display gmd-hero3d-badge">{phrases[0]}</p>

  return (
    <p className="font-display gmd-hero3d-badge" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[i]}
          style={{ display: 'inline-block' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {phrases[i]}
        </motion.span>
      </AnimatePresence>
    </p>
  )
}

/* small arrow that nudges right on a loop — used on the "Browse" CTA */
function NudgeArrow() {
  const reduce = useReducedMotion()
  return (
    <motion.svg
      width={15}
      height={15}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ marginLeft: 2, verticalAlign: -2 }}
      animate={reduce ? undefined : { x: [0, 4, 0] }}
      transition={reduce ? undefined : { duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path d="M1 8h12M9 4l4 4-4 4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  )
}

/* small uppercase meta label, reused across sections */
const LABEL: CSSProperties = {
  fontFamily: 'var(--f-head)',
  fontSize: 'var(--t-label)',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
}

/* subtle, once-only fade-up for below-the-fold blocks (reduced-motion safe) */
function Reveal({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const reduce = useReducedMotion()
  if (reduce) return <div style={style}>{children}</div>
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

/* the flagship piece per category — priciest reads as the most representative */
function representative(list: Product[], slug: CategorySlug): Product {
  const inCategory = list.filter((p) => p.category === slug)
  return inCategory.reduce((best, p) => (p.price > best.price ? p : best), inCategory[0])
}

const TRIO: { slug: CategorySlug; to: string; cta: string }[] = [
  { slug: 'grills', to: '/configurator', cta: 'Design yours' },
  { slug: 'earrings', to: '/shop/earrings', cta: 'Shop earrings' },
  { slug: 'pendants', to: '/shop/pendants', cta: 'Shop pendants' },
]

/* real grill product shot standing in for the builder-led grillz category (no PLP product) */
const GRILL_MEDIA = '/assets/grill/hero.webp'

export default function Home() {
  // One merged copy of the catalog feeds every product surface on the page,
  // so a photo or price changed in Shopify admin shows up here too.
  const catalog = useLiveCatalog()
  const { silver } = useLiveMetals()
  const [presetIdx, setPresetIdx] = useState(2) // default 10 × 10

  // hero readout quotes the live full-set price
  const heroPrice = estimateGrillPrice(28, '925 Silver', 'Solid', silver.price)

  // builder teaser — the spine centerpiece
  const preset = PRESETS[presetIdx]
  const presetQuote = estimateGrillPrice(preset.teeth, '925 Silver', 'Solid', silver.price)

  const spot = silver.price.toFixed(2)
  const gain = silver.changePct >= 0
  const pctStr = `${gain ? '+' : ''}${silver.changePct.toFixed(2)}%`
  const pctColor = gain ? 'var(--c-up)' : 'var(--c-down)'

  return (
    <>
      {/* ── HERO — full-bleed image slider, catchphrases up front ──── */}
      <section className="gmd-hero3d-section">
        {/* autoplaying studio/macro shots fill the hero as a living backdrop */}
        <div className="gmd-hero3d-bg">
          <HeroSlider images={HERO_SLIDES} />
        </div>
        <span className="gmd-hero3d-scrim" aria-hidden />

        <Container>
          <div className="gmd-hero3d-copy">
            <Eyebrow dark>Custom grillz &amp; jewelry · Southern-made since 2014</Eyebrow>
            <Heading level={1} dark style={{ marginTop: 'var(--s-xs)' }}>
              <span style={{ display: 'block' }}>Where your smile</span>
              <span style={{ display: 'block' }}>becomes your</span>
              <span style={{ display: 'block', color: 'var(--c-accent)' }}>signature</span>
            </Heading>
            <p className="gmd-hero3d-sub">{SITE.subTagline}</p>
            <HeroCatchphrase phrases={HERO_HOOKS} />

            <div className="gmd-btn-row" style={{ marginTop: 'var(--s-sm)' }}>
              <Btn to="/configurator" variant="accent">Design Your Grill</Btn>
              <Btn to="/shop" variant="ghost-dark">Shop the case</Btn>
            </div>

            {/* the spine — live silver spot drives the full-set price */}
            <div className="gmd-hero3d-live">
              <span className="gmd-live-dot" aria-hidden />
              <span>
                Live silver <b>${spot}</b>
                <span style={{ color: pctColor }}> {pctStr}</span>
              </span>
              <span className="gmd-hero3d-live-sep" aria-hidden>
                ·
              </span>
              <span>
                Full set <b>from {formatPrice(heroPrice.total)}</b>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CATCHPHRASE BAND (full-bleed, between sections) ────────── */}
      <Marquee />

      {/* ── CATEGORY TRIO ─────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 'var(--s-sm)' }}>
            <div>
              <Eyebrow>Start here</Eyebrow>
              <Heading level={2} style={{ marginTop: 12 }}>Three ways in</Heading>
            </div>
            <Btn to="/shop" variant="ghost">Browse<NudgeArrow /></Btn>
          </div>
        </Reveal>
        <div className="gmd-home-trio">
          {TRIO.map(({ slug, to, cta }) => {
            const cat = categoryBySlug(slug)!
            return (
              <Link key={slug} to={to} className="gmd-card" style={{ display: 'block' }}>
                {slug === 'grills' ? (
                  <div className="gmd-trio-media" style={{ aspectRatio: '4 / 5' }}>
                    <img src={GRILL_MEDIA} alt="Custom iced grill, close up" loading="lazy" />
                  </div>
                ) : (
                  <ProductMedia product={representative(catalog, slug)} ratio="4 / 5" />
                )}
                <div style={{ marginTop: 14 }}>
                  <Heading level={3}>{cat.name}</Heading>
                  <p style={{ marginTop: 6, fontSize: 'var(--t-body)', color: 'var(--c-ink-muted)' }}>{cat.tagline}</p>
                  <span style={{ display: 'inline-block', marginTop: 10, fontFamily: 'var(--f-head)', fontSize: 'var(--t-small)', fontWeight: 600, color: 'var(--c-accent-deep)' }}>
                    {cta} →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </Section>

      {/* ── BUILDER TEASER (the spine) ────────────────────────────── */}
      <Section soft id="builder">
        <Reveal style={{ maxWidth: 640, marginBottom: 'var(--s-sm)' }}>
          <Eyebrow>The builder</Eyebrow>
          <Heading level={2} style={{ marginTop: 12 }}>Design your own grill</Heading>
          <p style={{ marginTop: 14, fontSize: 'var(--t-sub)', color: 'var(--c-ink-muted)' }}>
            Tap the teeth you want in the live builder and watch the price move with today&rsquo;s real silver spot. Start from a
            preset here, then take it into the full builder to set metal, finish, and stones.
          </p>
        </Reveal>

        <div className="gmd-home-builder">
          {/* dark preview stage */}
          <div
            style={{
              background: 'var(--c-dark-2)',
              borderRadius: 'var(--radius-md)',
              padding: 'clamp(22px, 3.5vw, 40px)',
              color: 'var(--c-on-dark)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--s-xs)',
              justifyContent: 'center',
            }}
          >
            {/* interactive 3D grill — drag to spin (no auto-rotation) */}
            <div className="gmd-builder-grill">
              <HeroGrillStage autoRotate={false} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ ...LABEL, color: 'var(--c-accent)' }}>{preset.label}</span>
              <span style={{ display: 'block', marginTop: 6, fontSize: 'var(--t-small)', color: 'var(--c-on-dark-muted)' }}>{preset.note}</span>
            </div>
          </div>

          {/* controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-sm)', justifyContent: 'center' }}>
            <div>
              <span style={{ ...LABEL, color: 'var(--c-ink-muted)' }}>Quick presets</span>
              <div className="gmd-preset-row" style={{ marginTop: 12 }}>
                {PRESETS.map((p, i) => {
                  const active = i === presetIdx
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPresetIdx(i)}
                      aria-pressed={active}
                      style={{
                        fontFamily: 'var(--f-head)',
                        fontSize: 'var(--t-small)',
                        fontWeight: 600,
                        padding: '10px 16px',
                        borderRadius: 'var(--radius-pill)',
                        border: `1px solid ${active ? 'var(--c-ink)' : 'var(--c-line-strong)'}`,
                        background: active ? 'var(--c-ink)' : 'transparent',
                        color: active ? 'var(--c-on-dark)' : 'var(--c-ink)',
                        cursor: 'pointer',
                        transition: 'background 0.2s var(--ease-ui), color 0.2s var(--ease-ui), border-color 0.2s var(--ease-ui)',
                      }}
                    >
                      {p.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--c-line)', borderBottom: '1px solid var(--c-line)', padding: 'var(--s-xs) 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <span style={{ ...LABEL, color: 'var(--c-ink-muted)' }}>{preset.teeth} teeth · 925 Silver · Solid</span>
                <div className="font-display" style={{ marginTop: 8, fontWeight: 800, fontSize: 'var(--t-h2)', color: 'var(--c-ink)', fontVariantNumeric: 'tabular-nums' }}>
                  {formatPrice(presetQuote.total)}
                </div>
              </div>
              <span style={{ fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                Live · silver ${spot}
              </span>
            </div>

            <Btn to="/configurator" variant="accent" style={{ alignSelf: 'flex-start' }}>Open the builder</Btn>
          </div>
        </div>
      </Section>

      {/* ── SIGNATURE 3D GRILL REVEAL (full-bleed dark band) ──────── */}
      <GrillReveal />

      {/* ── BESTSELLERS ───────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 'var(--s-sm)' }}>
            <div>
              <Eyebrow>Most ordered</Eyebrow>
              <Heading level={2} style={{ marginTop: 12 }}>Bestsellers</Heading>
            </div>
            <Btn to="/shop" variant="ghost">See all</Btn>
          </div>
        </Reveal>
        <div className="gmd-home-grid4">
          {catalog.filter((p) => p.bestseller).slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* ── SIGNATURE PIECES (brief homepage priority) ────────────── */}
      <Section soft>
        <div className="gmd-home-signature">
          <Reveal>
            <Eyebrow>Beyond the grillz</Eyebrow>
            <Heading level={2} style={{ marginTop: 12 }}>Signature pieces</Heading>
            <p style={{ marginTop: 14, fontSize: 'var(--t-sub)', color: 'var(--c-ink-muted)', maxWidth: 440, lineHeight: 1.7 }}>
              The Iced Cuban Link that finishes every fit, and a hand-set Custom G-Shock built on a piece you already
              trust. Same bench, same VVS moissanite, same solid metal, no shortcuts.
            </p>
            <div className="gmd-btn-row" style={{ marginTop: 'var(--s-sm)' }}>
              <Btn to="/shop/chains" variant="solid">Shop chains</Btn>
              <Btn to="/shop/watches" variant="ghost">Shop watches</Btn>
            </div>
          </Reveal>
          <div className="gmd-home-signature-cards">
            {catalog.filter((p) => p.category === 'chains' || p.category === 'watches').map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── SHOP BY CATEGORY ──────────────────────────────────────── */}
      <Section>
        <Reveal style={{ marginBottom: 'var(--s-sm)' }}>
          <Eyebrow>The full case</Eyebrow>
          <Heading level={2} style={{ marginTop: 12 }}>Shop by category</Heading>
        </Reveal>
        <div className="gmd-home-cats">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={categoryHref(cat.slug)}
              className="gmd-cat-tile"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                justifyContent: 'space-between',
                minHeight: 118,
                padding: 16,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--c-line)',
                background: 'var(--c-surface)',
              }}
            >
              <span className="font-head" style={{ fontSize: 'var(--t-body)', fontWeight: 600, color: 'var(--c-ink)' }}>{cat.name}</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)', lineHeight: 1.35 }}>{cat.tagline}</span>
                <span className="gmd-cat-arrow" aria-hidden style={{ color: 'var(--c-ink-faint)' }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── STORY TEASER ──────────────────────────────────────────── */}
      <Section dark>
        <div style={{ maxWidth: 720 }}>
          <Eyebrow dark>Based in {SITE.base} · crafted since {SITE.established}</Eyebrow>
          <Heading level={2} dark style={{ marginTop: 14 }}>Made by hand, fit to you</Heading>
          <p style={{ marginTop: 'var(--s-xs)', fontSize: 'var(--t-sub)', color: 'var(--c-on-dark-muted)', lineHeight: 1.7 }}>
            GoldMoufDog got its start in downtown {SITE.foundedCity} in {SITE.established}, founded by {SITE.founder},
            and is now based in {SITE.base}. Every grill is molded to your exact bite and every piece is finished by
            hand — solid metal or gold-plated, always labeled clearly. We serve {SITE.serves.join(' and ')} in person
            and ship custom work worldwide.
          </p>
          <div style={{ marginTop: 'var(--s-sm)' }}>
            <Btn to="/story" variant="ghost-dark">Read our story</Btn>
          </div>
        </div>
      </Section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <Section>
        <Reveal style={{ marginBottom: 'var(--s-sm)' }}>
          <Eyebrow>Word of mouth</Eyebrow>
          <Heading level={2} style={{ marginTop: 12 }}>What the city says</Heading>
        </Reveal>
        <div className="gmd-home-quotes">
          {TESTIMONIALS.map((t) => (
            <figure
              key={`${t.name}-${t.piece}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: 'clamp(20px, 2.5vw, 28px)',
                border: '1px solid var(--c-line)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--c-surface)',
              }}
            >
              <span aria-hidden className="font-display" style={{ fontSize: 34, lineHeight: 0.6, color: 'var(--c-accent-line)' }}>&ldquo;</span>
              <blockquote style={{ fontSize: 'var(--t-body)', color: 'var(--c-ink)', lineHeight: 1.6, flex: 1 }}>{t.quote}</blockquote>
              <figcaption style={{ borderTop: '1px solid var(--c-line)', paddingTop: 14 }}>
                <span className="font-head" style={{ fontSize: 'var(--t-small)', fontWeight: 600, color: 'var(--c-ink)' }}>{t.name} · {t.city}</span>
                <span style={{ display: 'block', marginTop: 4, ...LABEL, letterSpacing: '0.1em', color: 'var(--c-accent-deep)' }}>{t.piece}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ── CLOSING CTA ───────────────────────────────────────────── */}
      <Section dark>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--s-sm)' }}>
          <div style={{ maxWidth: 760 }}>
            <Eyebrow dark>Ready when you are</Eyebrow>
            <Heading level={2} dark style={{ marginTop: 14, fontSize: 'var(--t-h1)' }}>Design your grill</Heading>
            <p style={{ marginTop: 'var(--s-xs)', fontSize: 'var(--t-sub)', color: 'var(--c-on-dark-muted)' }}>
              Build your set in the live builder, or bring us your idea and we&rsquo;ll make it. Priced to the day&rsquo;s silver, so
              there are no surprises.
            </p>
          </div>
          <div className="gmd-btn-row">
            <Btn to="/configurator" variant="accent">Design your grill</Btn>
            <Btn to="/contact" variant="ghost-dark">Talk to the shop</Btn>
          </div>
        </div>
      </Section>
    </>
  )
}
