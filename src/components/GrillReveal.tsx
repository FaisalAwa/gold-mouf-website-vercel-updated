/* ═══════════════════════════════════════════════════════════════
   GrillReveal — the signature moment.
   A pinned, scroll-scrubbed dark band where a full grill turns up
   from lying-flat to facing the viewer in 3D as you scroll, while three
   brand hooks cross-fade below it and a light-sweep passes once.

   GSAP only (no Framer Motion). ScrollTrigger is registered globally in
   main.tsx — we only import + use it here. Transform + opacity only (GPU).

   The pin + scrub runs on every viewport now — the "gmd-grill" CSS in
   home.css builds the pinned, 3D-perspective, absolute-stacked-panel
   layout unconditionally (no width/pointer split), so this matchMedia
   gate only needs to respect prefers-reduced-motion. 'transform' pinType
   (below) keeps mobile Safari's dynamic address bar from jittering the
   pin, and touch scroll drives ScrollTrigger the same way native scroll
   does on desktop (see main.tsx — Lenis is desktop-only).
   ═══════════════════════════════════════════════════════════════ */

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Container, Eyebrow, Heading } from '@/components'
import { HOOKS } from '@/data/phrases'

/** The three scroll-synced panels — brand hooks + a supporting line each. */
const STEPS: { n: string; hook: string; sub: string }[] = [
  { n: '01', hook: HOOKS.fit, sub: 'Every cap is set to your own impression, a fit no one else can wear.' },
  { n: '02', hook: HOOKS.metal, sub: 'Cast in solid 925 silver or gold. What shows on the surface runs all the way through.' },
  { n: '03', hook: HOOKS.price, sub: 'Your quote tracks the live silver spot, so you pay for the metal, not the markup.' },
]

export function GrillReveal() {
  const rootRef = useRef<HTMLElement>(null)
  const grillRef = useRef<HTMLDivElement>(null)
  const sweepRef = useRef<HTMLSpanElement>(null)
  const panelsRef = useRef<Array<HTMLDivElement | null>>([])

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    // Matches the (now-unconditional) staged CSS in home.css — see file header.
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const [p0, p1, p2] = panelsRef.current

      // Initial hidden states — applied before paint, so no flash on desktop.
      gsap.set(grillRef.current, { rotationX: -78, scale: 0.7, opacity: 0.2, transformOrigin: '50% 50%' })
      gsap.set(sweepRef.current, { xPercent: -160, skewX: -12, opacity: 0 })
      gsap.set(p0, { opacity: 1, yPercent: 0 })
      gsap.set([p1, p2], { opacity: 0, yPercent: 30 })

      const tl = gsap.timeline({ paused: true })

      // The grill turns up to face the viewer across the whole scrub.
      tl.to(grillRef.current, { rotationX: 0, scale: 1, opacity: 1, ease: 'none', duration: 1 }, 0)

      // Light-sweep passes once, early in the reveal.
      tl.to(
        sweepRef.current,
        { keyframes: { xPercent: [-160, 160], opacity: [0, 1, 0], easeEach: 'none' }, ease: 'none', duration: 0.5 },
        0.12,
      )

      // Hooks cross-fade as progress advances: 01 → 02 → 03.
      tl.to(p0, { opacity: 0, yPercent: -30, ease: 'none', duration: 0.12 }, 0.32)
        .to(p1, { opacity: 1, yPercent: 0, ease: 'none', duration: 0.12 }, 0.36)
        .to(p1, { opacity: 0, yPercent: -30, ease: 'none', duration: 0.12 }, 0.6)
        .to(p2, { opacity: 1, yPercent: 0, ease: 'none', duration: 0.12 }, 0.64)

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: '+=140%',
        pin: true,
        // 'transform' pin (vs. GSAP's default 'fixed') avoids jank from
        // mobile Safari's dynamic address bar resizing the viewport mid-pin.
        pinType: 'transform',
        anticipatePin: 1,
        scrub: 0.4,
        animation: tl,
        invalidateOnRefresh: true,
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={rootRef} className="gmd-grill">
      <Container>
        <div className="gmd-grill-inner">
          <div className="gmd-grill-head">
            <Eyebrow dark>The signature</Eyebrow>
            <Heading level={2} dark style={{ marginTop: 12 }}>
              Solid metal, up close
            </Heading>
          </div>

          <div className="gmd-grill-viewport">
            <div ref={grillRef} className="gmd-grill-3d">
              <img
                src="/assets/grill/hero.webp"
                alt="A full custom iced-out 925 silver grill, top and bottom, revealed"
                width={1600}
                height={1072}
                style={{ width: '100%', maxWidth: 540, height: 'auto', display: 'block', margin: '0 auto', borderRadius: 'var(--radius-md)' }}
              />
              <span ref={sweepRef} className="gmd-grill-sweep" aria-hidden />
            </div>
          </div>

          <div className="gmd-grill-panels">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => {
                  panelsRef.current[i] = el
                }}
                className="gmd-grill-panel"
              >
                <span className="gmd-grill-step">{s.n} / 03</span>
                <p className="gmd-grill-hook font-display">{s.hook}</p>
                <p className="gmd-grill-sub">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default GrillReveal
