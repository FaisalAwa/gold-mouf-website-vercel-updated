/* Dark footer — anchors the light site. Real contact/socials from SITE. */
import { Link } from 'react-router-dom'
import { SITE } from '@/data/site'
import { CATEGORIES, categoryHref } from '@/data/catalog'

const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10 }
const head: React.CSSProperties = {
  fontFamily: 'var(--f-head)',
  fontSize: 'var(--t-label)',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--c-accent)',
  marginBottom: 4,
}
const link: React.CSSProperties = { fontSize: 'var(--t-small)', color: 'var(--c-on-dark-muted)' }

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: 'linear-gradient(180deg,#161618 0%,#0B0B0C 60%,#000 100%)', color: 'var(--c-on-dark)', padding: 'var(--s-lg) 0 var(--s-md)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        {/* brand line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 'var(--s-sm)' }}>
          <img src="/assets/brand/logo-badge-black.png" alt="" width={54} height={54} style={{ filter: 'invert(1) brightness(1.6)' }} />
          <div>
            <p className="font-display" style={{ fontSize: 'var(--t-h3)', fontWeight: 800, color: 'var(--c-on-dark)', lineHeight: 1 }}>
              GOLDMOUFDOG
            </p>
            <p style={{ fontSize: 'var(--t-small)', color: 'var(--c-on-dark-muted)', marginTop: 4 }}>{SITE.tagline}</p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--s-sm)',
            paddingBottom: 'var(--s-sm)',
            borderBottom: '1px solid var(--c-on-dark-line)',
          }}
        >
          <div style={col}>
            <span style={head}>Shop</span>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={categoryHref(c.slug)} style={link}>
                {c.name}
              </Link>
            ))}
          </div>
          <div style={col}>
            <span style={head}>Custom</span>
            <Link to="/configurator" style={link}>Grillz Builder</Link>
            <Link to="/custom-inquiry" style={link}>Custom Inquiry</Link>
            <Link to="/instant-quote" style={link}>Instant Quote</Link>
            <Link to="/shop/pendants" style={link}>Custom Pendants</Link>
            <Link to="/shop/chains" style={link}>Iced Chains</Link>
            <Link to="/story" style={link}>Our Story</Link>
          </div>
          <div style={col}>
            <span style={head}>Support</span>
            <Link to="/contact" style={link}>Contact</Link>
            <Link to="/legal/grillz-policy" style={link}>Grillz Policy</Link>
            <Link to="/legal/jewelry-policy" style={link}>Jewelry Policy</Link>
            <Link to="/legal/shipping" style={link}>Shipping</Link>
          </div>
          <div style={col}>
            <span style={head}>Reach us</span>
            <a href={`mailto:${SITE.contact.email}`} style={link}>{SITE.contact.email}</a>
            <a href={SITE.contact.phoneHref} style={link}>{SITE.contact.phone}</a>
            <a href={SITE.socials.instagram.href} target="_blank" rel="noreferrer" style={link}>
              Instagram {SITE.socials.instagram.label}
            </a>
            <a href={SITE.socials.tiktok.href} target="_blank" rel="noreferrer" style={link}>
              TikTok {SITE.socials.tiktok.label}
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            paddingTop: 'var(--s-sm)',
            fontSize: 'var(--t-small)',
            color: 'var(--c-on-dark-muted)',
          }}
        >
          <span>© {year} {SITE.legalName}. Based in {SITE.base} · roots in {SITE.foundedCity} since {SITE.established}.</span>
          <span style={{ display: 'flex', gap: 18 }}>
            <Link to="/legal/privacy" style={{ color: 'inherit' }}>Privacy</Link>
            <Link to="/legal/terms" style={{ color: 'inherit' }}>Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
