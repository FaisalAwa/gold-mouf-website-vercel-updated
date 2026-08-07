/* ═══════════════════════════════════════════════════════════════
   GOLD MOUF DOG — Cart context (shopify-headless front end)
   localStorage-backed. Lines carry the client SKU, which /cart
   trades for a real Shopify variant to build the checkout. Custom
   grill builds carry no SKU and are still quoted by hand.
   ═══════════════════════════════════════════════════════════════ */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export interface CartItem {
  /** unique per variant/build */
  key: string
  /** Shopify variant SKU — how a catalog line resolves to a real checkout
   *  line. Absent on custom builds, which are quoted by hand. */
  sku?: string
  title: string
  subtitle?: string
  price: number
  qty: number
  image?: string
  href?: string
  kind: 'product' | 'custom'
  tone?: 'gold' | 'silver' | 'iced' | 'twotone'
  madeToOrder?: boolean
}

interface CartAPI {
  items: CartItem[]
  count: number
  subtotal: number
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  remove: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
  justAdded: string | null
}

const CartContext = createContext<CartAPI | null>(null)
const STORAGE_KEY = 'gmd_cart_v1'

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load)
  const [justAdded, setJustAdded] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage full / disabled — cart still works in-memory */
    }
  }, [items])

  const add = useCallback((item: Omit<CartItem, 'qty'>, qty = 1) => {
    setItems((cur) => {
      const existing = cur.find((i) => i.key === item.key)
      if (existing) {
        return cur.map((i) => (i.key === item.key ? { ...i, qty: i.qty + qty } : i))
      }
      return [...cur, { ...item, qty }]
    })
    setJustAdded(item.key)
    window.setTimeout(() => setJustAdded((k) => (k === item.key ? null : k)), 2600)
  }, [])

  const remove = useCallback((key: string) => {
    setItems((cur) => cur.filter((i) => i.key !== key))
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setItems((cur) =>
      qty <= 0 ? cur.filter((i) => i.key !== key) : cur.map((i) => (i.key === key ? { ...i, qty } : i)),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartAPI>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0)
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0)
    return { items, count, subtotal, add, remove, setQty, clear, justAdded }
  }, [items, add, remove, setQty, clear, justAdded])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartAPI {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
