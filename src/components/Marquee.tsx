/* Auto-scrolling catchphrase band. Seamless loop (content duplicated),
   pauses for reduced-motion. Separator = the GoldMoufDog grill mark —
   an arched row of teeth (the brand's own emblem), drawn as a crisp
   monochrome SVG so it reads at any size and never looks generic. */
import { MARQUEE } from '@/data/phrases'

/** GoldMoufDog mark: a grill (arched row of teeth). Monochrome, scalable. */
function GrillMark({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={(size * 32) / 20}
      height={size}
      viewBox="0 0 32 20"
      fill={color}
      aria-hidden
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect x="1.2" y="6.2" width="5" height="10.6" rx="1.7" />
      <rect x="7" y="4.6" width="5.2" height="12.2" rx="1.7" />
      <rect x="13" y="3.8" width="5.4" height="13" rx="1.7" />
      <rect x="19.2" y="4.6" width="5.2" height="12.2" rx="1.7" />
      <rect x="25.4" y="6.2" width="5" height="10.6" rx="1.7" />
    </svg>
  )
}

export function Marquee({
  phrases = MARQUEE,
  dark = true,
  speed = 32,
}: {
  phrases?: string[]
  dark?: boolean
  speed?: number
}) {
  const items = [...phrases, ...phrases]
  return (
    <div
      aria-hidden
      style={{
        overflow: 'hidden',
        background: dark ? 'var(--c-dark)' : 'var(--c-accent)',
        color: dark ? 'var(--c-on-dark)' : '#fff',
        borderTop: dark ? '1px solid var(--c-dark-2)' : 'none',
        borderBottom: dark ? '1px solid var(--c-dark-2)' : 'none',
        padding: '13px 0',
      }}
    >
      <div className="gmd-marquee-track" style={{ animationDuration: `${speed}s` }}>
        {items.map((p, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
            <span
              className="font-display"
              style={{ fontSize: 'clamp(13px, 1.5vw, 17px)', fontWeight: 800, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}
            >
              {p}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', margin: '0 20px', flexShrink: 0 }}>
              <GrillMark size={13} color={dark ? 'var(--c-accent)' : 'rgba(255,255,255,0.9)'} />
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
