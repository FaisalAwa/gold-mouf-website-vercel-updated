/* ═══════════════════════════════════════════════════════════════
   HeroGrillStage — the right-hand hero visual.
   Any device with WebGL + no reduced-motion → the lazy 3D grill
   (three.js chunk loads only then, incl. phones — PresentationControls
   handles touch drag natively). Everywhere else → a static framed
   poster. The Canvas never blocks first paint: the poster shows
   immediately and upgrades in place.
   ═══════════════════════════════════════════════════════════════ */
import { Suspense, lazy, useEffect, useState } from 'react'

const Hero3D = lazy(() => import('./Hero3D'))

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')),
    )
  } catch {
    return false
  }
}

function Poster() {
  return (
    <div className="gmd-hero3d-poster">
      <span className="gmd-hero3d-poster-sheen" aria-hidden />
      <img
        src="/assets/grill/hero.webp"
        alt="A full custom iced-out 925 silver grill set, top and bottom"
        width={1600}
        height={1072}
      />
    </div>
  )
}

export function HeroGrillStage({ autoRotate = false, teeth }: { autoRotate?: boolean; teeth?: number }) {
  const [use3D, setUse3D] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduce && hasWebGL()) setUse3D(true)
  }, [])

  return (
    <div className="gmd-hero3d-stage">
      {use3D ? (
        <Suspense fallback={<Poster />}>
          <Hero3D autoRotate={autoRotate} teeth={teeth} />
        </Suspense>
      ) : (
        <Poster />
      )}
      {use3D && (
        <span className="gmd-hero3d-hint" aria-hidden>
          Drag to spin
        </span>
      )}
    </div>
  )
}
