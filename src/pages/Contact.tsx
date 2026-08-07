/* /contact — real channels + a form that opens the visitor's mail app with
   everything filled in (no fake backend). Serves Atlanta + Tuscaloosa. */
import { useState } from 'react'
import { Section, Eyebrow, Heading, Btn } from '@/components'
import { HOOKS } from '@/data/phrases'
import { SITE } from '@/data/site'
import '@/styles/contact.css'

const INTERESTS = [
  'Custom grill',
  'Grillz mold & fit question',
  'Jewelry order',
  'Watch customization',
  'Order status',
  'Something else',
]

const CHANNELS = [
  { label: 'Text', value: SITE.contact.phone, href: SITE.contact.phoneHref },
  { label: 'Email', value: SITE.contact.email, href: `mailto:${SITE.contact.email}` },
  { label: 'Instagram', value: SITE.socials.instagram.label, href: SITE.socials.instagram.href },
  { label: 'TikTok', value: SITE.socials.tiktok.label, href: SITE.socials.tiktok.href },
]

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState(INTERESTS[0])
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = `${interest}: inquiry from ${name || 'the website'}`
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Interest: ${interest}`,
      '',
      message,
    ].join('\n')
    window.location.href = `mailto:${SITE.contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <Section pad="lg">
      <div style={{ maxWidth: 640, marginBottom: 'var(--s-md)' }}>
        <Eyebrow>Get in touch</Eyebrow>
        <Heading level={1} style={{ margin: '14px 0 10px' }}>
          Tell us what you're building
        </Heading>
        <p
          className="font-display"
          style={{ margin: '0 0 16px', fontSize: 'var(--t-sub)', fontWeight: 800, color: 'var(--c-accent-deep)', letterSpacing: '0.01em' }}
        >
          {HOOKS.city}
        </p>
        <p style={{ color: 'var(--c-ink-muted)', fontSize: 'var(--t-sub)', lineHeight: 1.6 }}>
          Custom grill, a chain, a ring. Send the details and we'll come back with specs, pricing, and a timeline.
          Based in {SITE.base}, with roots in {SITE.foundedCity} since {SITE.established}. We serve {SITE.serves.join(' and ')}.
        </p>
      </div>

      <div className="contact-grid">
        {/* ── Form ───────────────────────────────────────────────── */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="c-name">Name</label>
            <input
              id="c-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          <div className="contact-field">
            <label htmlFor="c-email">Email</label>
            <input
              id="c-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="contact-field">
            <label htmlFor="c-interest">What's it about</label>
            <select id="c-interest" value={interest} onChange={(e) => setInterest(e.target.value)}>
              {INTERESTS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="contact-field">
            <label htmlFor="c-message">Details</label>
            <textarea
              id="c-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Teeth count, metal, finish, size, a reference you like. Whatever you've got."
              required
            />
          </div>
          <div>
            <Btn type="submit" variant="solid">
              Send message
            </Btn>
            <p style={{ fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)', marginTop: 12 }}>
              This opens your email app with everything filled in, ready to send.
            </p>
          </div>
        </form>

        {/* ── Direct channels ────────────────────────────────────── */}
        <aside className="contact-panel">
          <Eyebrow dark>Reach the shop direct</Eyebrow>
          <div style={{ marginTop: 'var(--s-xs)' }}>
            {CHANNELS.map((ch) => (
              <a
                key={ch.label}
                href={ch.href}
                className="contact-row"
                target={ch.href.startsWith('http') ? '_blank' : undefined}
                rel={ch.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="contact-row__label">{ch.label}</span>
                  <span className="contact-row__value">{ch.value}</span>
                </span>
                <span className="contact-row__arrow" aria-hidden>
                  →
                </span>
              </a>
            ))}
          </div>
          <p
            style={{
              fontSize: 'var(--t-small)',
              color: 'var(--c-on-dark-muted)',
              lineHeight: 1.6,
              marginTop: 'var(--s-sm)',
              paddingTop: 'var(--s-xs)',
              borderTop: '1px solid var(--c-on-dark-line)',
            }}
          >
            Text or DM usually gets a reply within the hour. In-person fittings are by appointment, with walk-ins
            welcome when the bench is open.
          </p>
        </aside>
      </div>
    </Section>
  )
}
