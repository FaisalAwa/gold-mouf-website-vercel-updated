/* Live-metals ticker — dark bar, SILVER FIRST, with a silver sparkline.
   THE SPINE surfaced globally. Simulated live until metals API (PLACEHOLDERS P05). */
import { useLiveMetals } from '@/data/silver'
import type { MetalQuote } from '@/data/silver'

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null
  const w = 46
  const h = 14
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / span) * h}`)
    .join(' ')
  const rising = data[data.length - 1] >= data[0]
  return (
    <svg width={w} height={h} style={{ display: 'block' }} aria-hidden>
      <polyline
        points={pts}
        fill="none"
        stroke={rising ? 'var(--c-up)' : 'var(--c-down)'}
        strokeWidth={1.25}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Quote({ q, spark, dupKey }: { q: MetalQuote; spark?: number[]; dupKey: string }) {
  const color = q.direction === 'down' ? 'var(--c-down)' : q.direction === 'up' ? 'var(--c-up)' : 'var(--c-on-dark-muted)'
  const arrow = q.direction === 'down' ? '▾' : '▴'
  return (
    <span key={dupKey} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', flexShrink: 0 }}>
      <span style={{ color: 'var(--c-silver)', fontWeight: 600, letterSpacing: '0.06em' }}>{q.label}</span>
      <span style={{ color: 'var(--c-on-dark)', fontVariantNumeric: 'tabular-nums' }}>
        ${q.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>
        {arrow} {Math.abs(q.changePct).toFixed(2)}%
      </span>
      {spark && <Sparkline data={spark} />}
    </span>
  )
}

/* one full pass of the ticker content — duplicated so the loop is seamless */
function TickerPass({ quotes, silverHistory, pass }: { quotes: MetalQuote[]; silverHistory: number[]; pass: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 28, paddingRight: 28, flexShrink: 0 }}>
      {quotes.map((q, i) => (
        <Quote key={`${pass}-${q.key}`} dupKey={`${pass}-${q.key}`} q={q} spark={i === 0 ? silverHistory : undefined} />
      ))}
      <span style={{ color: 'var(--c-on-dark-muted)', fontSize: 'var(--t-label)', flexShrink: 0 }}>
        Grillz priced to spot
      </span>
    </span>
  )
}

export function SilverTicker() {
  const { quotes, silverHistory } = useLiveMetals()
  return (
    <div
      role="status"
      aria-live="off"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 120,
        height: 'var(--ticker-h)',
        background: 'var(--c-dark)',
        color: 'var(--c-on-dark)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0,0,0,0.4)',
        fontFamily: 'var(--f-body)',
        fontSize: 'var(--t-small)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          padding: '0 var(--gutter)',
        }}
      >
        <span style={{ color: 'var(--c-accent)', letterSpacing: '0.16em', fontSize: 'var(--t-label)', textTransform: 'uppercase', flexShrink: 0, paddingRight: 24 }}>
          Live Spot
        </span>
        {/* scrolling marquee, right → left, standard ticker direction */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div className="gmd-ticker-track">
            <TickerPass quotes={quotes} silverHistory={silverHistory} pass="a" />
            <TickerPass quotes={quotes} silverHistory={silverHistory} pass="b" />
          </div>
        </div>
      </div>
    </div>
  )
}
