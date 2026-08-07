/* ═══════════════════════════════════════════════════════════════
   ToothMap — the grill tooth selector (signature motif).
   Two clean dental arches (upper hangs, lower rises) rendered as
   minimal chrome tooth chips. Unselected = a faint ghost outline;
   selected = a polished chrome-silver cap with a soft top shine
   (iced tone adds a couple of sparkle points). Intentional and
   premium, not a literal mouth. Same props everywhere it is reused
   (builder selector, Home hero, GrillReveal, loader). Presentational.
   ═══════════════════════════════════════════════════════════════ */

import { useId, useMemo } from 'react'

export type ArchName = 'top' | 'bottom'
export type ToothTone = 'gold' | 'silver' | 'iced' | 'twotone'

interface Slot {
  x: number
  y: number
  w: number
  h: number
  rot: number
  index: number
}

// Explicit arch placement (viewBox 0 0 420 300). Upper = shallow ∩ near the
// top, lower = shallow ∪ near the bottom, with an open bite gap in the middle.
const CX = 210
const X_SPREAD = 168

function buildRow(n: number, baseY: number, flip: boolean): Slot[] {
  const amp = 14
  const out: Slot[] = []
  for (let i = 0; i < n; i++) {
    const u = n === 1 ? 0 : (i / (n - 1)) * 2 - 1 // -1 (left) .. 1 (right)
    const a = Math.abs(u)
    const x = CX + u * X_SPREAD
    const y = flip ? baseY + amp * (1 - u * u) : baseY - amp * (1 - u * u)
    // incisors (center) widest; teeth narrow toward the corners (perspective)
    const w = 24 - 7 * a
    const h = 52 - 8 * a
    const rot = flip ? -u * 15 : u * 15
    out.push({ x, y, w, h, rot, index: i })
  }
  return out
}

const TONE_GRAD: Record<ToothTone, string> = {
  gold: 'gmd-grad-silver',
  silver: 'gmd-grad-silver',
  iced: 'gmd-grad-iced',
  twotone: 'gmd-grad-silver',
}

export interface ToothMapProps {
  top: boolean[]
  bottom: boolean[]
  onToggle?: (arch: ArchName, index: number) => void
  tone?: ToothTone
  interactive?: boolean
  /** faint bite guideline through the mouth gap */
  guide?: boolean
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
}

export function ToothMap({
  top,
  bottom,
  onToggle,
  tone = 'silver',
  interactive = false,
  guide = false,
  className,
  style,
  ariaLabel = 'Grill tooth selection',
}: ToothMapProps) {
  const uid = useId().replace(/:/g, '')
  const topSlots = useMemo(() => buildRow(top.length, 130, false), [top.length])
  const bottomSlots = useMemo(() => buildRow(bottom.length, 190, true), [bottom.length])
  const gradId = (base: string) => `${uid}-${base}`

  const renderTooth = (arch: ArchName, s: Slot, selected: boolean) => {
    const clickable = interactive && !!onToggle
    const r = Math.min(s.w, s.h) * 0.32
    const grad = `url(#${gradId(TONE_GRAD[tone])})`
    return (
      <g
        key={`${arch}-${s.index}`}
        transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}
        onClick={clickable ? () => onToggle!(arch, s.index) : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onToggle!(arch, s.index)
                }
              }
            : undefined
        }
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        aria-pressed={clickable ? selected : undefined}
        aria-label={clickable ? `${arch} tooth ${s.index + 1}${selected ? ', capped' : ''}` : undefined}
        style={{ cursor: clickable ? 'pointer' : 'default', outline: 'none' }}
        className="gmd-tooth"
      >
        {selected ? (
          <>
            {/* polished chrome cap */}
            <rect
              x={-s.w / 2}
              y={-s.h / 2}
              width={s.w}
              height={s.h}
              rx={r}
              fill={grad}
              stroke="rgba(255,255,255,0.42)"
              strokeWidth={0.7}
            />
            {/* soft top shine */}
            <rect
              x={-s.w * 0.3}
              y={-s.h * 0.38}
              width={s.w * 0.6}
              height={s.h * 0.15}
              rx={s.w * 0.14}
              fill="#ffffff"
              opacity={0.4}
            />
            {tone === 'iced' && (
              <>
                <circle cx={s.w * 0.16} cy={-s.h * 0.06} r={1.3} fill="#ffffff" />
                <circle cx={-s.w * 0.1} cy={s.h * 0.2} r={1} fill="#e8f3ff" />
              </>
            )}
          </>
        ) : (
          /* ghost outline — an empty seat waiting to be capped */
          <rect
            x={-s.w / 2}
            y={-s.h / 2}
            width={s.w}
            height={s.h}
            rx={r}
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(226,232,240,0.30)"
            strokeWidth={0.9}
          />
        )}
      </g>
    )
  }

  return (
    <svg
      viewBox="0 0 420 300"
      className={className}
      style={style}
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* chrome-silver ramp (monochrome — no gold) */}
        <linearGradient id={gradId('gmd-grad-silver')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7C828A" />
          <stop offset="0.22" stopColor="#F3F5F8" />
          <stop offset="0.5" stopColor="#CBCED3" />
          <stop offset="0.72" stopColor="#A7ACB3" />
          <stop offset="1" stopColor="#6E747C" />
        </linearGradient>
        <linearGradient id={gradId('gmd-grad-iced')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9FB4C6" />
          <stop offset="0.22" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#E4EDF4" />
          <stop offset="0.76" stopColor="#C2D2DE" />
          <stop offset="1" stopColor="#93A7B7" />
        </linearGradient>
      </defs>

      {guide && (
        <line x1={72} y1={160} x2={348} y2={160} stroke="rgba(180,186,194,0.20)" strokeWidth={1} strokeDasharray="2 8" />
      )}
      {topSlots.map((s) => renderTooth('top', s, !!top[s.index]))}
      {bottomSlots.map((s) => renderTooth('bottom', s, !!bottom[s.index]))}
    </svg>
  )
}

/* ── selection helpers shared by builder + presets ─────────────── */

/** Select the center `n` slots of an arch of length `len` (grillz count from the middle out). */
export function centerSelection(len: number, n: number): boolean[] {
  const arr = new Array(len).fill(false)
  const clamped = Math.max(0, Math.min(len, n))
  const start = Math.floor((len - clamped) / 2)
  for (let i = start; i < start + clamped; i++) arr[i] = true
  return arr
}

export function countSelected(a: boolean[]): number {
  return a.reduce((n, v) => n + (v ? 1 : 0), 0)
}
