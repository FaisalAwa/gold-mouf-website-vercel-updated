/* ═══════════════════════════════════════════════════════════════
   HeroPendantStage — the hero visual: a physics chain-pendant.
   Any device with WebGL + no reduced-motion → the lazy PendantChain
   (three.js chunk loads only then, incl. phones — drag on desktop,
   tilt on touch). Everywhere else → a static pendant poster. First
   paint never blocked by three.
   ═══════════════════════════════════════════════════════════════ */
import { Suspense, lazy, useEffect, useState } from 'react'

const PendantChain = lazy(() => import('./PendantChain'))

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
      <img
        src="/assets/products/pendants/gmd-pnd-crs-moi-925-wh.webp"
        alt="A GoldMoufDog iced cross pendant"
        width={1200}
        height={1200}
        style={{ maxWidth: 360 }}
      />
    </div>
  )
}

export function HeroPendantStage() {
  const [use3D, setUse3D] = useState(false)

  const [touch, setTouch] = useState(false)

  useEffect(() => {
    // enabled on every device (incl. phones) — just needs WebGL + motion allowed
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    setTouch(coarse)
    if (!reduce && hasWebGL()) setUse3D(true)
  }, [])

  return (
    <div className="gmd-hero3d-stage">
      {use3D ? (
        <Suspense fallback={<Poster />}>
          <PendantChain />
        </Suspense>
      ) : (
        <Poster />
      )}
      {use3D && (
        <span className="gmd-hero3d-hint" aria-hidden>
          {touch ? 'Tilt your phone' : 'Drag the pendant'}
        </span>
      )}
    </div>
  )
}
