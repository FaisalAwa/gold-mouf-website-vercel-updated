import '@/styles/shop.css'
import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Section, Eyebrow, Heading, Btn, ProductCard, Marquee } from '@/components'
import { CATEGORIES, PRODUCTS, categoryBySlug, productsByCategory } from '@/data/catalog'
import { useLiveList } from '@/lib/live-catalog'
import { HOOKS } from '@/data/phrases'

type SortKey = 'featured' | 'price-asc' | 'price-desc'

const uniq = (arr: string[]): string[] => Array.from(new Set(arr))

function chipStyle(active: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontFamily: 'var(--f-head)',
    fontSize: 'var(--t-small)',
    fontWeight: 600,
    letterSpacing: '0.01em',
    padding: '11px 10px',
    borderRadius: 'var(--radius-sm)',
    border: `1px solid ${active ? 'var(--c-accent-line)' : 'var(--c-line-strong)'}`,
    background: active ? 'var(--c-accent-soft)' : 'var(--c-surface)',
    color: active ? 'var(--c-accent-deep)' : 'var(--c-ink)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }
}

const fieldLabel: CSSProperties = {
  fontSize: 'var(--t-label)',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--c-ink-faint)',
}

export default function Shop() {
  const { category } = useParams()
  const cat = category ? categoryBySlug(category) : undefined

  const [metal, setMetal] = useState('all')
  const [finish, setFinish] = useState('all')
  const [sort, setSort] = useState<SortKey>('featured')

  // Shopify's current photo + price laid over the generated catalog, so the
  // filters and price sort work off what the store actually charges.
  const base = useLiveList(
    useMemo(
      () => (cat ? productsByCategory(cat.slug) : category ? [] : PRODUCTS),
      [cat, category],
    ),
  )

  const metals = useMemo<string[]>(() => uniq(base.map((p) => p.metal)), [base])
  const finishes = useMemo<string[]>(() => uniq(base.map((p) => p.finish)), [base])

  // Fall back to "all" if a persisted filter isn't in the current category's set.
  const activeMetal = metals.includes(metal) ? metal : 'all'
  const activeFinish = finishes.includes(finish) ? finish : 'all'

  const view = useMemo(() => {
    const list = base.filter(
      (p) =>
        (activeMetal === 'all' || p.metal === activeMetal) &&
        (activeFinish === 'all' || p.finish === activeFinish),
    )
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
    // Featured: photographed pieces lead, bestsellers ahead within each group.
    return [...list].sort(
      (a, b) =>
        Number(!!b.image) - Number(!!a.image) ||
        Number(!!b.bestseller) - Number(!!a.bestseller),
    )
  }, [base, activeMetal, activeFinish, sort])

  // Category slug present but unknown → friendly not-found.
  if (category && !cat) {
    return (
      <Section pad="lg">
        <Eyebrow>Shop</Eyebrow>
        <Heading level={1} style={{ marginTop: 12 }}>Category not found</Heading>
        <p style={{ marginTop: 14, color: 'var(--c-ink-muted)', maxWidth: 520, fontSize: 'var(--t-sub)' }}>
          That collection isn&rsquo;t in the case. Browse the full shop instead.
        </p>
        <div style={{ marginTop: 24 }}>
          <Btn to="/shop">Back to the shop</Btn>
        </div>
      </Section>
    )
  }

  const isGrills = cat?.slug === 'grills'
  const title = cat ? cat.name : 'The Case'
  const blurbLine = cat
    ? cat.blurb
    : 'Every piece we make: grillz, chains, iced sets, and custom one-offs, built by hand in the South since 2014.'
  const hookLine = isGrills ? HOOKS.fit : HOOKS.metal
  const count = view.length

  return (
    <>
    <Section pad="md">
      {/* ── Header ─────────────────────────────────────────────── */}
      <Eyebrow>
        <Link to="/shop" className="shop-crumb" style={{ color: 'inherit' }}>Shop</Link>
        {cat && <span style={{ color: 'var(--c-ink-faint)' }}> / {cat.name}</span>}
      </Eyebrow>
      <Heading level={1} style={{ marginTop: 12 }}>{title}</Heading>
      <p style={{ marginTop: 14, color: 'var(--c-ink-muted)', maxWidth: 640, fontSize: 'var(--t-sub)', lineHeight: 1.5 }}>
        {blurbLine}
      </p>
      <p
        className="font-display"
        style={{ marginTop: 10, color: 'var(--c-accent-deep)', fontWeight: 700, fontSize: 'var(--t-body)', letterSpacing: '0.01em' }}
      >
        {hookLine}
      </p>
    </Section>

    <Marquee speed={30} />

    <Section pad="md">
      {/* ── Filters ────────────────────────────────────────────── */}
      <nav className="shop-chips" aria-label="Shop categories">
        <Link to="/shop" style={chipStyle(!category)} className="shop-chip">All</Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            to={c.slug === 'grills' ? '/configurator' : `/shop/${c.slug}`}
            style={chipStyle(category === c.slug)}
            className="shop-chip"
          >
            {c.name}
          </Link>
        ))}
      </nav>

      {isGrills ? (
        <div
          style={{
            marginTop: 'var(--s-sm)',
            padding: 'var(--s-md) var(--gutter)',
            textAlign: 'center',
            border: '1px solid var(--c-line)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--c-surface)',
          }}
        >
          <p className="font-head" style={{ fontSize: 'var(--t-h3)', fontWeight: 700, color: 'var(--c-ink)' }}>
            Grillz are built to order, not off the shelf
          </p>
          <p style={{ marginTop: 8, color: 'var(--c-ink-muted)', fontSize: 'var(--t-body)', maxWidth: 520, marginInline: 'auto' }}>
            Every set is molded to your exact bite and priced live to the silver spot. Design yours tooth by tooth on the builder.
          </p>
          <div style={{ marginTop: 20 }}>
            <Btn to="/configurator" variant="accent">Open the builder</Btn>
          </div>
        </div>
      ) : (
        <>
          <div className="shop-controls" style={{ marginTop: 20, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
              <label style={{ display: 'inline-flex', flexDirection: 'column', gap: 6 }}>
                <span style={fieldLabel}>Metal</span>
                <select className="shop-select" value={activeMetal} onChange={(e) => setMetal(e.target.value)}>
                  <option value="all">All metals</option>
                  {metals.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'inline-flex', flexDirection: 'column', gap: 6 }}>
                <span style={fieldLabel}>Finish</span>
                <select className="shop-select" value={activeFinish} onChange={(e) => setFinish(e.target.value)}>
                  <option value="all">All finishes</option>
                  {finishes.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'inline-flex', flexDirection: 'column', gap: 6 }}>
                <span style={fieldLabel}>Sort</span>
                <select className="shop-select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </label>
            </div>

            <span style={{ fontSize: 'var(--t-small)', color: 'var(--c-ink-muted)', fontVariantNumeric: 'tabular-nums' }}>
              {count} {count === 1 ? 'piece' : 'pieces'}
            </span>
          </div>

          {/* ── Grid ───────────────────────────────────────────────── */}
          {count > 0 ? (
            <div className="shop-grid" style={{ marginTop: 'var(--s-sm)' }}>
              {view.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div
              style={{
                marginTop: 'var(--s-sm)',
                padding: 'var(--s-md) var(--gutter)',
                textAlign: 'center',
                border: '1px solid var(--c-line)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--c-surface)',
              }}
            >
              <p className="font-head" style={{ fontSize: 'var(--t-h3)', fontWeight: 700, color: 'var(--c-ink)' }}>
                Nothing matches those filters
              </p>
              <p style={{ marginTop: 8, color: 'var(--c-ink-muted)', fontSize: 'var(--t-body)' }}>
                Loosen the metal or finish to see more of the case.
              </p>
              <div style={{ marginTop: 20 }}>
                <Btn variant="ghost" onClick={() => { setMetal('all'); setFinish('all') }}>Clear filters</Btn>
              </div>
            </div>
          )}
        </>
      )}
    </Section>
    </>
  )
}
