/* Light nav — logo lockup (badge + Archivo-Expanded wordmark), cart badge,
   primary "Design Your Grill" CTA. Sits under the fixed silver ticker.
   "Shop" opens a submenu of every category, each routing to its own page. */
import { useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { SITE } from '@/data/site'
import { CATEGORIES, categoryHref, type CategorySlug, type Product } from '@/data/catalog'
import { useLiveCatalog } from '@/lib/live-catalog'

/* flagship image per category for the shop mega-menu — same
   "priciest reads as most representative" pattern as Home.tsx;
   grills is builder-led (no catalog rows) so it gets the hero photo */
const GRILL_THUMB = '/assets/grill/hero.webp'
function categoryThumb(catalog: Product[], slug: CategorySlug): string | undefined {
  if (slug === 'grills') return GRILL_THUMB
  const list = catalog.filter((p) => p.category === slug)
  if (!list.length) return undefined
  return list.reduce((best, p) => (p.price > best.price ? p : best), list[0]).image
}

const LINKS = [
  { label: 'Grillz Builder', to: '/configurator' },
  { label: 'Custom Inquiry', to: '/custom-inquiry' },
  { label: 'Instant Quote', to: '/instant-quote' },
  { label: 'Story', to: '/story' },
  { label: 'Contact', to: '/contact' },
]

function Logo() {
  return (
    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }} aria-label={`${SITE.brand} home`}>
      <img src="/assets/brand/logo-badge-black.png" alt="" width={38} height={38} style={{ display: 'block' }} />
      <span className="font-display" style={{ fontSize: 19, fontWeight: 800, color: 'var(--c-ink)', lineHeight: 1 }}>
        GOLDMOUFDOG
      </span>
    </Link>
  )
}

const linkStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: 'var(--f-head)',
  fontSize: 'var(--t-small)',
  fontWeight: 600,
  letterSpacing: '0.02em',
  color: active ? 'var(--c-accent-deep)' : 'var(--c-ink)',
  padding: '6px 0',
  borderBottom: active ? '2px solid var(--c-accent)' : '2px solid transparent',
  transition: 'color 0.2s var(--ease-ui)',
})

export function Nav() {
  const { count } = useCart()
  const catalog = useLiveCatalog()
  const [open, setOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [mobileShopOpen, setMobileShopOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const loc = useLocation()

  const openShop = () => {
    clearTimeout(closeTimer.current)
    setShopOpen(true)
  }
  const closeShopSoon = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setShopOpen(false), 120)
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 'var(--ticker-h)',
        left: 0,
        right: 0,
        zIndex: 110,
        height: 'var(--nav-h)',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--c-line)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          height: '100%',
          padding: '0 var(--gutter)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <Logo />

        {/* desktop links */}
        <div className="gmd-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <div
            style={{ position: 'relative' }}
            onMouseEnter={openShop}
            onMouseLeave={closeShopSoon}
          >
            <NavLink
              to="/shop"
              style={({ isActive }) => ({ ...linkStyle(isActive || shopOpen), display: 'inline-flex', alignItems: 'center', gap: 5 })}
              onClick={() => setShopOpen(false)}
              aria-haspopup="true"
              aria-expanded={shopOpen}
            >
              Shop
              <span
                aria-hidden
                className="gmd-shop-caret"
                style={{ transform: shopOpen ? 'rotate(180deg)' : 'none' }}
              >
                ▾
              </span>
            </NavLink>
            {shopOpen && (
              <div
                className="gmd-shop-menu"
                role="menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: -18,
                  marginTop: 14,
                  minWidth: 460,
                  background: 'var(--c-surface)',
                  border: '1px solid var(--c-line)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-pop)',
                  padding: 18,
                  zIndex: 130,
                }}
              >
                <Link
                  to="/shop"
                  onClick={() => setShopOpen(false)}
                  className="gmd-shop-menu-primary"
                  style={{ display: 'block', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: 14 }}
                >
                  <span className="font-head" style={{ display: 'block', fontSize: 'var(--t-label)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-accent-deep)' }}>
                    The full case
                  </span>
                  <span style={{ display: 'block', marginTop: 4, fontFamily: 'var(--f-display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', textTransform: 'uppercase', color: 'var(--c-ink)' }}>
                    All products →
                  </span>
                </Link>

                <div className="gmd-shop-menu-grid">
                  {CATEGORIES.map((c) => {
                    const thumb = categoryThumb(catalog, c.slug)
                    return (
                      <Link
                        key={c.slug}
                        to={categoryHref(c.slug)}
                        onClick={() => setShopOpen(false)}
                        className="gmd-shop-menu-item"
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 'var(--radius-sm)', border: '1px solid transparent' }}
                      >
                        <span
                          style={{
                            flex: 'none',
                            width: 52,
                            height: 65,
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            background: 'var(--c-surface-2)',
                          }}
                        >
                          {thumb && (
                            <img
                              src={thumb}
                              alt=""
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          )}
                        </span>
                        <span style={{ minWidth: 0 }}>
                          <span style={{ display: 'block', fontFamily: 'var(--f-head)', fontWeight: 600, fontSize: 'var(--t-small)', color: 'var(--c-ink)' }}>
                            {c.name}
                          </span>
                          <span style={{ display: 'block', marginTop: 2, fontSize: 'var(--t-label)', color: 'var(--c-ink-muted)' }}>
                            {c.tagline}
                          </span>
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} style={({ isActive }) => linkStyle(isActive)}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/cart" aria-label={`Cart, ${count} items`} style={{ position: 'relative', display: 'inline-flex', padding: 4 }}>
            <CartGlyph />
            {count > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 17,
                  height: 17,
                  padding: '0 4px',
                  borderRadius: 999,
                  background: 'var(--c-ink)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'grid',
                  placeItems: 'center',
                  lineHeight: 1,
                }}
              >
                {count}
              </span>
            )}
          </Link>

          <Link
            to="/configurator"
            className="gmd-nav-desktop font-head"
            style={{
              background: 'var(--c-ink)',
              color: 'var(--c-on-dark)',
              fontSize: 'var(--t-small)',
              fontWeight: 600,
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              whiteSpace: 'nowrap',
            }}
          >
            Design Your Grill
          </Link>

          <button
            className="gmd-nav-mobile"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{ display: 'none', padding: 6 }}
          >
            <Burger open={open} />
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {open && (
        <div
          className="gmd-nav-drawer"
          style={{
            display: 'none',
            position: 'absolute',
            top: 'var(--nav-h)',
            left: 0,
            right: 0,
            background: 'var(--c-surface)',
            borderBottom: '1px solid var(--c-line)',
            boxShadow: 'var(--shadow-pop)',
            padding: 'var(--s-xs) var(--gutter)',
            maxHeight: 'calc(100svh - var(--ticker-h) - var(--nav-h))',
            overflowY: 'auto',
          }}
        >
          {/* Shop — expandable accordion so every category is one tap away */}
          <div style={{ borderBottom: '1px solid var(--c-line)' }}>
            <button
              type="button"
              onClick={() => setMobileShopOpen((v) => !v)}
              aria-expanded={mobileShopOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '14px 0',
                background: 'none',
                border: 'none',
                fontFamily: 'var(--f-head)',
                fontWeight: 600,
                fontSize: 'inherit',
                color: loc.pathname.startsWith('/shop') ? 'var(--c-accent-deep)' : 'var(--c-ink)',
                cursor: 'pointer',
              }}
            >
              Shop
              <span aria-hidden style={{ transform: mobileShopOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s var(--ease-ui)' }}>▾</span>
            </button>
            {mobileShopOpen && (
              <div style={{ paddingBottom: 10 }}>
                <Link
                  to="/shop"
                  onClick={() => { setOpen(false); setMobileShopOpen(false) }}
                  style={{ display: 'block', padding: '10px 0 10px 14px', fontFamily: 'var(--f-head)', fontWeight: 600, color: 'var(--c-ink)' }}
                >
                  All products
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    to={categoryHref(c.slug)}
                    onClick={() => { setOpen(false); setMobileShopOpen(false) }}
                    style={{ display: 'block', padding: '10px 0 10px 14px', color: 'var(--c-ink-muted)' }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '14px 0',
                borderBottom: '1px solid var(--c-line)',
                fontFamily: 'var(--f-head)',
                fontWeight: 600,
                color: loc.pathname === l.to ? 'var(--c-accent-deep)' : 'var(--c-ink)',
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/configurator"
            onClick={() => setOpen(false)}
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 14,
              background: 'var(--c-ink)',
              color: 'var(--c-on-dark)',
              fontWeight: 600,
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Design Your Grill
          </Link>
        </div>
      )}
    </nav>
  )
}

function CartGlyph() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--c-ink)" strokeWidth={1.6} aria-hidden>
      <path d="M6 7h12l-1 13H7L6 7Z" strokeLinejoin="round" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  )
}

function Burger({ open }: { open: boolean }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" stroke="var(--c-ink)" strokeWidth={1.8} aria-hidden>
      {open ? (
        <>
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="19" y1="5" x2="5" y2="19" />
        </>
      ) : (
        <>
          <line x1="4" y1="8" x2="20" y2="8" />
          <line x1="4" y1="16" x2="20" y2="16" />
        </>
      )}
    </svg>
  )
}
