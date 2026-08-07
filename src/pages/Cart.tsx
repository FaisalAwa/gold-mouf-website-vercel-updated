/* /cart — checkout entry. Catalog pieces go straight to Shopify checkout;
   custom grill builds carry no variant and are still confirmed by text/DM
   to lock specs and fit before any money moves. */
import { useState } from 'react'
import { Section, Eyebrow, Heading, Btn } from '@/components'
import { useCart } from '@/context/CartContext'
import type { CartItem } from '@/context/CartContext'
import { formatPrice } from '@/data/catalog'
import { createCheckout, shopifyReady, variantIdFor } from '@/lib/shopify'
import { SITE } from '@/data/site'
import '@/styles/cart.css'

function Thumb({ item }: { item: CartItem }) {
  const initial = item.title.trim().charAt(0).toUpperCase() || 'G'
  return (
    <div className="cart-line__thumb">
      {item.image ? (
        <img src={item.image} alt={item.title} loading="lazy" />
      ) : (
        <span className="cart-line__initial" aria-hidden>
          {initial}
        </span>
      )}
    </div>
  )
}

export default function Cart() {
  const { items, subtotal, setQty, remove } = useCart()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasMadeToOrder = items.some((i) => i.madeToOrder)

  // Custom builds have no Shopify variant — they are quoted by hand.
  const custom = items.filter((i) => !variantIdFor(i.sku))
  const canCheckout = shopifyReady && items.some((i) => variantIdFor(i.sku))

  const checkout = async () => {
    setBusy(true)
    setError(null)
    try {
      const { checkoutUrl } = await createCheckout(items.map((i) => ({ sku: i.sku, qty: i.qty })))
      // Leaving the SPA for Shopify's hosted checkout — no need to unset busy.
      window.location.href = checkoutUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout could not be started.')
      setBusy(false)
    }
  }

  if (items.length === 0) {
    return (
      <Section pad="lg">
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow>Your Bag</Eyebrow>
          <Heading level={1} style={{ margin: '14px 0 12px' }}>
            Your bag is empty
          </Heading>
          <p style={{ color: 'var(--c-ink-muted)', fontSize: 'var(--t-sub)', marginBottom: 'var(--s-sm)' }}>
            Start with a piece from the shop, or design a grill tooth by tooth and watch the price move with the
            silver spot.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn to="/shop" variant="solid">
              Shop the collection
            </Btn>
            <Btn to="/configurator" variant="accent">
              Build a custom grill
            </Btn>
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section pad="lg">
      <div style={{ marginBottom: 'var(--s-sm)' }}>
        <Eyebrow>Your Bag</Eyebrow>
        <Heading level={1} style={{ marginTop: 12 }}>
          Review your pieces
        </Heading>
      </div>

      <div className="cart-grid">
        {/* ── Line items ─────────────────────────────────────────── */}
        <div className="cart-lines">
          {items.map((item) => (
            <div key={item.key} className="cart-line">
              <Thumb item={item} />
              <div className="cart-line__body">
                <div className="cart-line__top">
                  <div style={{ minWidth: 0 }}>
                    <p
                      className="font-head"
                      style={{ fontSize: 'var(--t-body)', fontWeight: 600, color: 'var(--c-ink)' }}
                    >
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p style={{ fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)', marginTop: 3 }}>
                        {item.subtitle}
                      </p>
                    )}
                    {item.madeToOrder && (
                      <p
                        style={{
                          fontSize: 'var(--t-label)',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'var(--c-accent-deep)',
                          marginTop: 6,
                        }}
                      >
                        Made to order
                      </p>
                    )}
                  </div>
                  <button
                    className="cart-remove"
                    onClick={() => remove(item.key)}
                    aria-label={`Remove ${item.title}`}
                  >
                    ×
                  </button>
                </div>
                <div className="cart-line__controls">
                  <div className="qty" role="group" aria-label={`Quantity for ${item.title}`}>
                    <button onClick={() => setQty(item.key, item.qty - 1)} aria-label="Decrease quantity">
                      −
                    </button>
                    <span aria-live="polite">{item.qty}</span>
                    <button onClick={() => setQty(item.key, item.qty + 1)} aria-label="Increase quantity">
                      +
                    </button>
                  </div>
                  <span className="font-head" style={{ fontSize: 'var(--t-body)', fontWeight: 600 }}>
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Summary ────────────────────────────────────────────── */}
        <aside className="cart-summary">
          <Heading level={3} style={{ marginBottom: 'var(--s-xs)' }}>
            Summary
          </Heading>
          <div className="cart-summary__row" style={{ marginBottom: 10 }}>
            <span style={{ color: 'var(--c-ink-muted)' }}>Subtotal</span>
            <span className="font-head" style={{ fontWeight: 600 }}>
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="cart-summary__row" style={{ marginBottom: 'var(--s-xs)' }}>
            <span style={{ color: 'var(--c-ink-muted)' }}>Shipping</span>
            <span style={{ color: 'var(--c-ink-muted)', fontSize: 'var(--t-small)' }}>Calculated at checkout</span>
          </div>

          {hasMadeToOrder && (
            <p
              style={{
                fontSize: 'var(--t-small)',
                color: 'var(--c-ink-muted)',
                lineHeight: 1.5,
                paddingTop: 'var(--s-xs)',
                borderTop: '1px solid var(--c-line)',
                marginBottom: 'var(--s-xs)',
              }}
            >
              Custom pieces are built to order in 2 to 6 weeks.
            </p>
          )}

          <Btn
            variant="accent"
            full
            onClick={canCheckout ? checkout : () => setConfirming(true)}
            disabled={busy}
          >
            {busy ? 'Starting checkout…' : 'Checkout'}
          </Btn>

          {error && (
            <p
              role="alert"
              style={{
                marginTop: 10,
                fontSize: 'var(--t-small)',
                color: 'var(--c-accent-deep)',
                lineHeight: 1.5,
              }}
            >
              {error} You can also text {SITE.contact.phone} and we'll take it from there.
            </p>
          )}

          {/* A bag mixing catalog pieces with a custom build: the catalog
              side checks out now, the build is quoted after. */}
          {canCheckout && custom.length > 0 && (
            <p style={{ marginTop: 10, fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)', lineHeight: 1.5 }}>
              {custom.length === 1 ? 'Your custom build' : `Your ${custom.length} custom builds`} can&rsquo;t be paid
              for online — we price each one to your mold. Checkout covers the rest of the bag, then text{' '}
              {SITE.contact.phone} to lock the build.
            </p>
          )}

          {confirming && (
            <div className="cart-confirm">
              <p style={{ fontSize: 'var(--t-small)', color: 'var(--c-ink)', lineHeight: 1.55 }}>
                We finalize custom orders by text to confirm your specs and fit. Send your bag to the shop:
              </p>
              <div className="cart-confirm__actions">
                <Btn href={SITE.contact.phoneHref} variant="solid">
                  Text {SITE.contact.phone}
                </Btn>
                <Btn href={SITE.socials.instagram.href} variant="ghost">
                  DM {SITE.socials.instagram.label}
                </Btn>
                <Btn href={`mailto:${SITE.contact.email}`} variant="ghost">
                  Email us
                </Btn>
              </div>
            </div>
          )}
        </aside>
      </div>
    </Section>
  )
}
