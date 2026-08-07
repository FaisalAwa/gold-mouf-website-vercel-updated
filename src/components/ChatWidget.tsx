/* Chat launcher — Shopify Inbox stub (functional shell). Until Inbox is wired,
   it routes to the real reply channels the shop already uses: text + IG. */
import { useState } from 'react'
import { SITE } from '@/data/site'

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 130 }}>
      {open && (
        <div
          role="dialog"
          aria-label="Chat with GoldMoufDog"
          style={{
            width: 'min(320px, calc(100vw - 36px))',
            marginBottom: 12,
            background: 'var(--c-surface)',
            border: '1px solid var(--c-line)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-pop)',
            overflow: 'hidden',
          }}
        >
          <div style={{ background: 'var(--c-dark)', color: 'var(--c-on-dark)', padding: '14px 16px' }}>
            <p className="font-head" style={{ fontWeight: 700 }}>Talk to the shop</p>
            <p style={{ fontSize: 'var(--t-small)', color: 'var(--c-on-dark-muted)', marginTop: 2 }}>
              Real people, usually reply within the hour.
            </p>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href={SITE.contact.phoneHref} className="font-head" style={btn}>Text {SITE.contact.phone}</a>
            <a href={SITE.socials.instagram.href} target="_blank" rel="noreferrer" className="font-head" style={btn}>
              DM on Instagram
            </a>
            <a href={`mailto:${SITE.contact.email}`} className="font-head" style={{ ...btn, background: 'transparent', color: 'var(--c-ink)', border: '1px solid var(--c-line-strong)' }}>
              Email us
            </a>
          </div>
        </div>
      )}
      <button
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 54,
          height: 54,
          borderRadius: 999,
          background: 'var(--c-ink)',
          boxShadow: 'var(--shadow-pop)',
          display: 'grid',
          placeItems: 'center',
          marginLeft: 'auto',
        }}
      >
        {open ? (
          <svg width={22} height={22} viewBox="0 0 24 24" stroke="#fff" strokeWidth={2} aria-hidden>
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        ) : (
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} aria-hidden>
            <path d="M4 6h16v10H9l-5 4V6Z" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  )
}

const btn: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  background: 'var(--c-ink)',
  color: 'var(--c-on-dark)',
  fontWeight: 600,
  fontSize: 'var(--t-small)',
  padding: '11px',
  borderRadius: 'var(--radius-sm)',
}
