/* PLP tile — links to the PDP. Name shown in full, price below in a lighter
   tone. Deliberately roomy: name → price, nothing else competing for space. */
import { Link } from 'react-router-dom'
import type { Product } from '@/data/catalog'
import { formatPrice } from '@/data/catalog'
import { ProductMedia } from './ProductMedia'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.slug}`} className="gmd-card" style={{ display: 'block' }}>
      <ProductMedia product={product} />
      <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <h3
          className="font-head"
          style={{ fontSize: 'var(--t-body)', fontWeight: 600, color: 'var(--c-ink)', lineHeight: 1.35 }}
        >
          {product.name}
        </h3>
        <span
          style={{ fontSize: 'var(--t-body)', fontWeight: 500, color: 'var(--c-ink-muted)', fontVariantNumeric: 'tabular-nums' }}
        >
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  )
}
