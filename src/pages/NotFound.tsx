/* 404 — friendly dead end that routes back into the store. */
import { Section, Eyebrow, Btn } from '@/components'

export default function NotFound() {
  return (
    <Section pad="lg">
      <div
        style={{
          minHeight: '46vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <p
          className="font-display"
          style={{ fontSize: 'var(--t-hero)', fontWeight: 800, color: 'var(--c-ink)', lineHeight: 0.9 }}
        >
          404
        </p>
        <Eyebrow>Page not found</Eyebrow>
        <p style={{ fontSize: 'var(--t-sub)', color: 'var(--c-ink-muted)', margin: '14px 0 var(--s-sm)' }}>
          This piece isn't in the case.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn to="/" variant="solid">
            Home
          </Btn>
          <Btn to="/shop" variant="ghost">
            Shop
          </Btn>
          <Btn to="/configurator" variant="accent">
            Build a grill
          </Btn>
        </div>
      </div>
    </Section>
  )
}
