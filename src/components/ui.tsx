/* Shared UI primitives — keep every page visually consistent.
   Import from '@/components'. */
import { Link } from 'react-router-dom'
import type { CSSProperties, ReactNode } from 'react'

export function Container({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--gutter)', ...style }}>{children}</div>
}

export function Section({
  children,
  dark = false,
  soft = false,
  id,
  style,
  pad = 'lg',
  className,
}: {
  children: ReactNode
  dark?: boolean
  soft?: boolean
  id?: string
  style?: CSSProperties
  pad?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const bg = dark ? 'var(--c-dark)' : soft ? 'var(--c-surface-2)' : 'var(--c-bg)'
  const py = pad === 'sm' ? 'var(--s-md)' : pad === 'md' ? 'var(--s-md)' : 'var(--s-lg)'
  const cls = ['gmd-section', dark && 'gmd-section--dark', soft && 'gmd-section--soft', className].filter(Boolean).join(' ')
  return (
    <section id={id} className={cls} style={{ background: bg, color: dark ? 'var(--c-on-dark)' : 'var(--c-ink)', padding: `${py} 0`, ...style }}>
      <Container>{children}</Container>
    </section>
  )
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--f-head)',
        fontSize: 'var(--t-label)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: dark ? 'var(--c-accent)' : 'var(--c-accent-deep)',
      }}
    >
      {children}
    </span>
  )
}

export function Heading({
  children,
  level = 2,
  dark = false,
  style,
}: {
  children: ReactNode
  level?: 1 | 2 | 3
  dark?: boolean
  style?: CSSProperties
}) {
  const Tag = (`h${level}` as unknown) as 'h2'
  const size = level === 1 ? 'var(--t-h1)' : level === 3 ? 'var(--t-h3)' : 'var(--t-h2)'
  return (
    <Tag className="font-display" style={{ fontSize: size, fontWeight: 800, color: dark ? 'var(--c-on-dark)' : 'var(--c-ink)', lineHeight: 1.02, ...style }}>
      {children}
    </Tag>
  )
}

type BtnVariant = 'solid' | 'accent' | 'ghost' | 'ghost-dark'
const btnBase: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  fontFamily: 'var(--f-head)',
  fontWeight: 600,
  fontSize: 'var(--t-small)',
  padding: '13px 24px',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  transition: 'background 0.2s var(--ease-ui), color 0.2s var(--ease-ui), transform 0.2s var(--ease-out)',
  border: '1px solid transparent',
}
function variantStyle(v: BtnVariant): CSSProperties {
  switch (v) {
    case 'accent':
      return { background: 'var(--c-accent)', color: 'var(--c-white)' }
    case 'ghost':
      return { background: 'transparent', color: 'var(--c-ink)', borderColor: 'var(--c-line-strong)' }
    case 'ghost-dark':
      return { background: 'transparent', color: 'var(--c-on-dark)', borderColor: 'var(--c-on-dark-line)' }
    default:
      return { background: 'var(--c-ink)', color: 'var(--c-on-dark)' }
  }
}

export function Btn({
  children,
  to,
  href,
  onClick,
  variant = 'solid',
  type,
  disabled,
  style,
  full,
}: {
  children: ReactNode
  to?: string
  href?: string
  onClick?: () => void
  variant?: BtnVariant
  type?: 'button' | 'submit'
  disabled?: boolean
  style?: CSSProperties
  full?: boolean
}) {
  const s = { ...btnBase, ...variantStyle(variant), width: full ? '100%' : undefined, opacity: disabled ? 0.5 : 1, ...style }
  const cls = `gmd-btn gmd-btn--${variant}`
  const label = <span className="gmd-btn__label">{children}</span>
  if (to) return <Link to={to} className={cls} style={s}>{label}</Link>
  if (href) return <a href={href} className={cls} style={s}>{label}</a>
  return <button type={type ?? 'button'} onClick={onClick} disabled={disabled} className={cls} style={s}>{label}</button>
}

export function Rule({ dark = false }: { dark?: boolean }) {
  return <hr style={{ height: 1, border: 0, background: dark ? 'var(--c-on-dark-line)' : 'var(--c-line)' }} />
}
