/* Product image with a branded fallback tile (no broken images, no "demo"
   marker). Real photography drops in via product.image when the Drive lands.
   Fallback mark = a Phosphor icon (Tooth for grillz, Diamond for jewelry). */
import { useState } from 'react'
import { Diamond, Tooth } from '@phosphor-icons/react'
import type { Product } from '@/data/catalog'

const TONE_BG: Record<Product['tone'], string> = {
  gold: 'radial-gradient(120% 100% at 30% 15%, #2c2c30 0%, #17171a 55%, #0a0a0a 100%)',
  silver: 'radial-gradient(120% 100% at 30% 15%, #2a2a2e 0%, #161618 55%, #0a0a0a 100%)',
  iced: 'radial-gradient(120% 100% at 30% 15%, #30333a 0%, #191b1f 55%, #0a0a0a 100%)',
  twotone: 'radial-gradient(120% 100% at 30% 15%, #2b2b2f 0%, #17171a 60%, #0a0a0a 100%)',
}
const TONE_GLINT: Record<Product['tone'], string> = {
  gold: '#CFCFD4',
  silver: '#C9CCD1',
  iced: '#E7EDF2',
  twotone: '#CFCFD4',
}

export function ProductMedia({ product, ratio = '1 / 1' }: { product: Product; ratio?: string }) {
  const [failed, setFailed] = useState(false)
  const showImg = product.image && !failed
  const Icon = product.category === 'grills' ? Tooth : Diamond

  return (
    <div
      className="gmd-media"
      style={{
        position: 'relative',
        aspectRatio: ratio,
        overflow: 'hidden',
        borderRadius: 'var(--radius-md)',
        background: TONE_BG[product.tone],
      }}
    >
      {showImg ? (
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="gmd-media-img"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            padding: 20,
            textAlign: 'center',
          }}
        >
          <Icon size={52} weight="duotone" color={TONE_GLINT[product.tone]} />
          <span
            className="font-head"
            style={{ fontSize: 'var(--t-small)', color: 'var(--c-on-dark)', maxWidth: 180, lineHeight: 1.3 }}
          >
            {product.name}
          </span>
          <span
            style={{
              fontSize: 'var(--t-label)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(244,244,245,0.45)',
            }}
          >
            {product.metal}
          </span>
        </div>
      )}
      {product.bestseller && (
        <span
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontSize: 'var(--t-label)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            background: 'var(--c-ink)',
            color: '#fff',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          Bestseller
        </span>
      )}
    </div>
  )
}
