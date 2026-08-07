/* ═══════════════════════════════════════════════════════════════
   Motion primitives — one cohesive language for the whole site.
   All GPU-friendly (transform/opacity), reduced-motion + touch safe.
   Framer Motion only (never mixed with GSAP in the same tree).
   ═══════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion, useInView, useSpring } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

/* ── Reveal: rise + fade when scrolled into view ───────────────── */
export function Reveal({
  children,
  y = 26,
  delay = 0,
  once = true,
  amount = 0.25,
  className,
  style,
}: {
  children: ReactNode
  y?: number
  delay?: number
  once?: boolean
  amount?: number
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ── Stagger container + item (for grids / lists) ──────────────── */
export function Stagger({
  children,
  gap = 0.08,
  className,
  style,
  amount = 0.15,
}: {
  children: ReactNode
  gap?: number
  className?: string
  style?: CSSProperties
  amount?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, y = 28, className, style }: { children: ReactNode; y?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div
      className={className}
      style={style}
      variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
    >
      {children}
    </motion.div>
  )
}

/* ── Mask-reveal words (for hero headlines) ────────────────────── */
export function WordReveal({ text, delay = 0, className, style }: { text: string; delay?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  if (reduce) return <span className={className} style={style}>{text}</span>
  return (
    <span className={className} style={style}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: delay + i * 0.09, ease: EASE }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}

/* ── CountUp: roll a number when it scrolls into view ──────────── */
export function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.3,
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView || reduce) {
      setDisplay(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(value * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration, reduce])

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

/* ── Tilt: pointer-driven 3D tilt (desktop only) ───────────────── */
export function Tilt({
  children,
  max = 9,
  scale = 1.0,
  className,
  style,
}: {
  children: ReactNode
  max?: number
  scale?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useSpring(0, { stiffness: 150, damping: 16 })
  const ry = useSpring(0, { stiffness: 150, damping: 16 })
  const sc = useSpring(1, { stiffness: 180, damping: 18 })
  const enabled = useRef(false)

  useEffect(() => {
    enabled.current =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const onMove = (e: React.MouseEvent) => {
    if (!enabled.current || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max * 2)
    rx.set(-py * max * 2)
    sc.set(scale)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    sc.set(1)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ ...style, rotateX: rx, rotateY: ry, scale: sc, transformStyle: 'preserve-3d', transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── GoldShimmer: pointer-reactive liquid-chrome light field ───────
   Experimental signature. Canvas of soft chrome-silver blobs drifting on
   their own timeline, with one blob tracking the pointer. Meant to sit behind
   content on a DARK panel (parent must be position:relative; this fills
   it, pointer-events:none). Static single frame on touch / reduced-motion. */
export function GoldShimmer({ style }: { style?: CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const parent = canvas.parentElement
    if (!parent) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const still = reduce || window.matchMedia('(pointer: coarse)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let w = 0
    let h = 0
    const resize = () => {
      const r = parent.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // chrome-silver blobs: base position, drift speed, radius, tone
    const blobs = Array.from({ length: 5 }, (_, i) => ({
      bx: 0.15 + Math.random() * 0.7,
      by: 0.15 + Math.random() * 0.7,
      sx: (Math.random() - 0.5) * 0.00006,
      sy: (Math.random() - 0.5) * 0.00006,
      ph: Math.random() * Math.PI * 2,
      r: 0.35 + Math.random() * 0.3,
      hue: i % 2 === 0 ? '231,237,242' : '154,160,168',
    }))
    const pointer = { x: 0.5, y: 0.4, tx: 0.5, ty: 0.4 }

    const onMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect()
      pointer.tx = (e.clientX - r.left) / r.width
      pointer.ty = (e.clientY - r.top) / r.height
    }
    if (!still) window.addEventListener('mousemove', onMove, { passive: true })

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      pointer.x += (pointer.tx - pointer.x) * 0.06
      pointer.y += (pointer.ty - pointer.y) * 0.06
      for (const b of blobs) {
        const dx = Math.sin(t * 0.0004 + b.ph) * 0.06
        const dy = Math.cos(t * 0.00035 + b.ph) * 0.06
        const cx = (b.bx + b.sx * t + dx) * w
        const cy = (b.by + b.sy * t + dy) * h
        const rad = b.r * Math.min(w, h)
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        g.addColorStop(0, `rgba(${b.hue},0.16)`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, rad, 0, Math.PI * 2)
        ctx.fill()
      }
      // pointer glint
      const px = pointer.x * w
      const py = pointer.y * h
      const pr = 0.4 * Math.min(w, h)
      const pg = ctx.createRadialGradient(px, py, 0, px, py, pr)
      pg.addColorStop(0, 'rgba(231,237,242,0.20)')
      pg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = pg
      ctx.beginPath()
      ctx.arc(px, py, pr, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
    }

    let raf = 0
    const loop = (t: number) => {
      draw(t)
      raf = requestAnimationFrame(loop)
    }
    if (still) {
      draw(2200)
    } else {
      raf = requestAnimationFrame(loop)
    }

    let rt: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(rt)
      rt = setTimeout(resize, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      clearTimeout(rt)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}
    />
  )
}
