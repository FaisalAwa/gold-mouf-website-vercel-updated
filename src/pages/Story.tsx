/* /story — the brand, personal and real. Founded 2014 in downtown Atlanta by
   Svmba (@_Svmba), now based in Alabama. Custom-fit grillz + handmade jewelry.
   Serves Atlanta GA + Tuscaloosa AL. All copy grounded in real facts from
   SITE/BRAIN — no invented press or metrics. Motion via the shared framer
   primitives. */
import '@/styles/story.css'
import { Container, Section, Eyebrow, Heading, Btn, Rule, Marquee } from '@/components'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { SITE } from '@/data/site'
import { CATEGORIES } from '@/data/catalog'
import { BADGE_LINE, HOOKS } from '@/data/phrases'

const PROCESS = [
  {
    step: 'Mold',
    body: 'It starts at the teeth. A dental mold captures your exact bite, the difference between a grill that sits right and one that never does.',
  },
  {
    step: 'Cast',
    body: 'We cast your set in solid metal — 925 silver or 10K, 14K, 18K gold — or in a gold-plated finish if that’s the look and budget you want. Either way, it’s labeled clearly so you always know what’s on your teeth.',
  },
  {
    step: 'Set',
    body: 'Stones are hand-set to spec: open face, half-and-half, or fully iced in VVS. Every setting is placed by hand, checked under loupe.',
  },
  {
    step: 'Polish',
    body: 'Final finishing brings the shine up and the fit down to the tooth. It leaves the bench only when it seats clean and reads sharp.',
  },
]

/* real customers, worn in the city — authentic UGC, not renders */
const WORN = [
  { src: '/assets/story/lifestyle.webp', alt: 'A GoldMoufDog customer wearing an iced Cuban link out in the city' },
  { src: '/assets/story/lifestyle-2.webp', alt: 'A GoldMoufDog customer wearing a custom grill and chain' },
]

export default function Story() {
  const jewelry = CATEGORIES.filter((c) => !c.hero)

  return (
    <>
      {/* ── Hero band — the founder, first person (exactly one screen) ── */}
      <Section
        dark
        pad="md"
        className="gmd-story-hero"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <div className="gmd-story-hero__grid">
          <Reveal style={{ maxWidth: 780 }}>
            <Eyebrow dark>
              Based in {SITE.base} · Since {SITE.established}
            </Eyebrow>
            <Heading level={1} dark style={{ margin: '14px 0 16px', fontSize: 'clamp(28px, 3.8vw, 58px)' }}>
              {SITE.tagline}
            </Heading>
            <p className="gmd-story-hero__body" style={{ color: 'var(--c-on-dark-muted)', lineHeight: 1.7 }}>
              I&rsquo;m {SITE.founder}. I started GoldMoufDog in downtown {SITE.foundedCity} in {SITE.established} on
              one idea: a grill should fit the person wearing it. These days the shop calls {SITE.base} home, but the
              standard hasn&rsquo;t moved: every set starts from your own bite and gets cut, cast, and set by hand in
              real metal. No molds of somebody else&rsquo;s mouth, no stock pieces passed off as custom. You bring the
              idea and the bite; I build the piece around it.
            </p>
            <div className="gmd-story-hero__meta">
              <p style={{ marginTop: 16, fontSize: 'var(--t-small)', color: 'var(--c-on-dark-muted)' }}>
                {SITE.founder}, founder ·{' '}
                <a href={SITE.socials.instagram.href} style={{ color: 'var(--c-accent)' }} target="_blank" rel="noreferrer">
                  {SITE.socials.instagram.label}
                </a>
              </p>
              <p
                className="font-display"
                style={{ marginTop: 'var(--s-sm)', fontSize: 'var(--t-h3)', fontWeight: 800, color: 'var(--c-accent)', letterSpacing: '0.01em' }}
              >
                {BADGE_LINE}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="gmd-grill-photo gmd-story-hero__media"
              style={{
                background: 'var(--c-dark-2)',
                border: '1px solid var(--c-on-dark-line)',
              }}
            >
              <img
                src="/assets/story/workshop.webp"
                alt="Inside the GoldMoufDog workshop in downtown Atlanta"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Craft process ──────────────────────────────────────── */}
      <Section pad="lg">
        <Reveal>
          <Eyebrow>How it&rsquo;s made</Eyebrow>
          <Heading level={2} style={{ margin: '12px 0 10px', maxWidth: 620 }}>
            Four steps from your bite to your shine
          </Heading>
          <p
            className="font-display"
            style={{ margin: '0 0 var(--s-sm)', maxWidth: 560, fontSize: 'var(--t-body)', fontWeight: 700, color: 'var(--c-accent-deep)', letterSpacing: '0.01em' }}
          >
            {HOOKS.craft}
          </p>
        </Reveal>
        <Stagger
          gap={0.1}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--s-sm)',
          }}
        >
          {PROCESS.map((p, idx) => (
            <StaggerItem key={p.step}>
              <span
                className="font-display"
                style={{ fontSize: 'var(--t-h3)', color: 'var(--c-accent)', display: 'block' }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3
                className="font-head"
                style={{ fontSize: 'var(--t-h3)', fontWeight: 700, margin: '8px 0 10px', color: 'var(--c-ink)' }}
              >
                {p.step}
              </h3>
              <p style={{ fontSize: 'var(--t-body)', color: 'var(--c-ink-muted)', lineHeight: 1.6 }}>{p.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ── Straight from the bench — full-bleed maker video ──────── */}
      <section className="gmd-story-craft" aria-label="Inside the GoldMoufDog workshop">
        <video
          className="gmd-story-craft__video"
          src="/assets/story/craft-hand.mp4"
          poster="/assets/story/craft-hand.jpg"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden
        />
        <span className="gmd-story-craft__scrim" aria-hidden />
        <Container>
          <div className="gmd-story-craft__inner">
            <Eyebrow dark>Straight from the bench</Eyebrow>
            <h2 className="font-display gmd-story-craft__title">
              From a mold
              <br />
              to a masterpiece
            </h2>
            <ul className="gmd-story-craft__lines">
              <li>Molded to your bite. Nobody else&rsquo;s.</li>
              <li>Solid metal or gold-plated — always labeled.</li>
              <li>Priced to the day&rsquo;s silver — no surprises.</li>
              <li>If it leaves the shop, it&rsquo;s right.</li>
            </ul>
            <div className="gmd-story-craft__cta">
              <Btn to="/configurator" variant="accent">
                Start your custom grill
              </Btn>
              <Btn to="/contact" variant="ghost-dark">
                Talk to the shop
              </Btn>
            </div>
          </div>
        </Container>
      </section>

      <Marquee speed={30} />

      {/* ── Worn in the city — real customers ──────────────────── */}
      <Section pad="lg">
        <Reveal>
          <Eyebrow>Worn in the city</Eyebrow>
          <Heading level={2} style={{ margin: '12px 0 10px', maxWidth: 620 }}>
            Real people, real fits
          </Heading>
          <p style={{ margin: '0 0 var(--s-sm)', maxWidth: 560, fontSize: 'var(--t-body)', color: 'var(--c-ink-muted)', lineHeight: 1.6 }}>
            These are customers, not renders. When a set leaves the bench it goes straight into the rotation,
            from Atlanta to Tuscaloosa and everywhere the mail runs.
          </p>
        </Reveal>
        <Stagger
          gap={0.12}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--s-sm)' }}
        >
          {WORN.map((w) => (
            <StaggerItem key={w.src}>
              <div className="gmd-grill-photo" style={{ aspectRatio: '4 / 5', background: 'var(--c-surface-2)', border: '1px solid var(--c-line)' }}>
                <img src={w.src} alt={w.alt} loading="lazy" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ── What we make ───────────────────────────────────────── */}
      <Section soft pad="lg">
        <Reveal>
          <Eyebrow>What we make</Eyebrow>
          <Heading level={2} style={{ margin: '12px 0 10px' }}>
            Grillz first, then everything around them
          </Heading>
          <p
            className="font-display"
            style={{ margin: '0 0 var(--s-sm)', maxWidth: 560, fontSize: 'var(--t-body)', fontWeight: 700, color: 'var(--c-accent-deep)', letterSpacing: '0.01em' }}
          >
            {HOOKS.metal}
          </p>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--s-sm)',
            alignItems: 'start',
          }}
        >
          <Reveal>
            <div
              style={{
                background: 'var(--c-dark)',
                color: 'var(--c-on-dark)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--s-sm)',
              }}
            >
              <Eyebrow dark>The house craft</Eyebrow>
              <h3
                className="font-display"
                style={{ fontSize: 'var(--t-h2)', fontWeight: 800, margin: '12px 0 12px', color: 'var(--c-on-dark)' }}
              >
                Custom Grillz
              </h3>
              <p style={{ fontSize: 'var(--t-body)', color: 'var(--c-on-dark-muted)', lineHeight: 1.6, marginBottom: 'var(--s-xs)' }}>
                6×6, 8×8, 10×10, 12×12, or a full set. Solid, open face, half-and-half, or iced. Built to your mold in
                the metal you pick, priced live against the silver spot.
              </p>
              <Btn to="/configurator" variant="accent">
                Design yours
              </Btn>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <h3
                className="font-head"
                style={{ fontSize: 'var(--t-h3)', fontWeight: 700, marginBottom: 14, color: 'var(--c-ink)' }}
              >
                Handmade jewelry
              </h3>
              <p style={{ fontSize: 'var(--t-body)', color: 'var(--c-ink-muted)', lineHeight: 1.6, marginBottom: 18 }}>
                The same bench that builds the grillz builds the rest of the case: iced pendants, Cuban links,
                studs, and custom G-Shocks. Same VVS moissanite, same solid metal.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {jewelry.map((c) => (
                  <Btn key={c.slug} to={`/shop/${c.slug}`} variant="ghost" style={{ padding: '9px 16px' }}>
                    {c.name}
                  </Btn>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Values / props ─────────────────────────────────────── */}
      <Section pad="lg">
        <Reveal>
          <Eyebrow>Why people order from us</Eyebrow>
          <Heading level={2} style={{ margin: '12px 0 10px' }}>
            What every order comes with
          </Heading>
          <p
            className="font-display"
            style={{ margin: '0 0 var(--s-sm)', maxWidth: 560, fontSize: 'var(--t-body)', fontWeight: 700, color: 'var(--c-accent-deep)', letterSpacing: '0.01em' }}
          >
            {HOOKS.since}
          </p>
        </Reveal>
        <Stagger
          gap={0.07}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--s-xs)',
          }}
        >
          {SITE.props.map((prop) => (
            <StaggerItem key={prop}>
              <div
                style={{
                  border: '1px solid var(--c-line)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--s-xs)',
                  height: '100%',
                }}
              >
                <span className="font-display" style={{ fontSize: 'var(--t-sub)', color: 'var(--c-accent)' }}>
                  ✦
                </span>
                <p
                  className="font-head"
                  style={{ fontSize: 'var(--t-body)', fontWeight: 600, color: 'var(--c-ink)', marginTop: 10 }}
                >
                  {prop}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <div style={{ margin: 'var(--s-sm) 0' }}>
          <Rule />
        </div>

        {/* Where to find us — real, personal */}
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--s-sm)', alignItems: 'start' }}>
            <div>
              <Eyebrow>Where to find us</Eyebrow>
              <p style={{ marginTop: 12, fontSize: 'var(--t-body)', color: 'var(--c-ink-muted)', maxWidth: 460, lineHeight: 1.7 }}>
                Based in {SITE.base}, with roots in {SITE.foundedCity} since {SITE.established}. Regulars come through
                from {SITE.serves.join(' and ')}, and the mail reaches everywhere else. Come by for your mold, or
                start online and we&rsquo;ll ship you a kit. {SITE.subTagline}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={`mailto:${SITE.contact.email}`} style={{ fontFamily: 'var(--f-head)', fontWeight: 600, color: 'var(--c-ink)' }}>
                {SITE.contact.email}
              </a>
              <a href={SITE.contact.phoneHref} style={{ fontFamily: 'var(--f-head)', fontWeight: 600, color: 'var(--c-ink)' }}>
                {SITE.contact.phone}
              </a>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <Btn href={SITE.socials.instagram.href} variant="ghost" style={{ padding: '9px 16px' }}>
                  Instagram {SITE.socials.instagram.label}
                </Btn>
                <Btn href={SITE.socials.tiktok.href} variant="ghost" style={{ padding: '9px 16px' }}>
                  TikTok {SITE.socials.tiktok.label}
                </Btn>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── Closing CTA ────────────────────────────────────────── */}
      <Section dark pad="lg">
        <Reveal style={{ textAlign: 'center' }}>
          <Heading level={2} dark style={{ maxWidth: 700, margin: '0 auto var(--s-sm)' }}>
            Bring the idea. We&rsquo;ll build it.
          </Heading>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn to="/configurator" variant="accent">
              Start a custom grill
            </Btn>
            <Btn to="/contact" variant="ghost-dark">
              Talk to the shop
            </Btn>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
