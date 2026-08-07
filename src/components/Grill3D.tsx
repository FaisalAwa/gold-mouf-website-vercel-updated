/* ═══════════════════════════════════════════════════════════════
   Card3D — the "3D Card Effect" (Aceternity / 21st.dev pattern),
   implemented self-contained. A perspective container whose inner
   card rotates toward the pointer; children placed with Card3DItem
   float at different depths (translateZ) for real parallax.
   Desktop pointer only; flat + static on touch / reduced-motion.
   ═══════════════════════════════════════════════════════════════ */
import { useRef, useState, type CSSProperties, type ReactNode } from 'react'

export function Card3D({
  children,
  className,
  style,
  rotate = 12,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  rotate?: number
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)')

  const onMove = (e: React.MouseEvent) => {
    const el = innerRef.current
    if (!el) return
    if (
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTransform(`rotateY(${px * rotate * 2}deg) rotateX(${-py * rotate * 2}deg)`)
  }
  const reset = () => setTransform('rotateX(0deg) rotateY(0deg)')

  return (
    <div className={className} style={{ perspective: '1000px', ...style }}>
      <div
        ref={innerRef}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform,
          transition: 'transform 0.18s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function Card3DItem({
  children,
  depth = 40,
  className,
  style,
}: {
  children: ReactNode
  depth?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={className} style={{ transform: `translateZ(${depth}px)`, transformStyle: 'preserve-3d', ...style }}>
      {children}
    </div>
  )
}
