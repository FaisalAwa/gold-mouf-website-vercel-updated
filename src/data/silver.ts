/* ═══════════════════════════════════════════════════════════════
   GOLD MOUF DOG — Live metals + grill pricing engine
   THE SPINE: the price moves with the real silver spot.

   Source of truth (all consumers share ONE store):
   • Real feed when VITE_METALS_API_KEY is set — metals.dev, USD/oz.
     QUOTA-SAFE: the free key is 100 req/MONTH, so we fetch at most
     once per TTL and cache the result in localStorage. Reloads read
     the cache (0 API calls); change% is computed vs the previous
     cached fetch, so it stays a real number. Prices, hero readout,
     ticker, and the builder all read the same live numbers.
   • No key → a bounded random walk keeps the ticker alive in
     dev/preview. If a fetch fails it uses the last cached value (or
     the walk) so the ticker never freezes.

   Centralising into a store also fixes the old per-hook desync
   (ticker vs hero used to show different numbers) and means the
   real API is polled once, not once per component.
   See _workspace/PLACEHOLDERS.md P05.
   ═══════════════════════════════════════════════════════════════ */

import { useSyncExternalStore } from 'react'

export interface MetalQuote {
  key: 'silver' | 'gold' | 'platinum' | 'palladium'
  label: string
  symbol: string
  /** USD per troy ounce */
  price: number
  /** absolute change vs previous tick */
  change: number
  /** percent change vs session open */
  changePct: number
  direction: 'up' | 'down' | 'flat'
}

type MetalKey = MetalQuote['key']

// Session-open seeds (USD/oz). Silver first — it is the headline metal.
// In real mode these are only the ~1s placeholder before the first fetch.
const SEEDS: Record<MetalKey, { label: string; symbol: string; price: number; drift: number }> = {
  silver: { label: 'Silver', symbol: 'XAG', price: 34.62, drift: 0.05 },
  gold: { label: 'Gold', symbol: 'XAU', price: 2418.0, drift: 1.4 },
  platinum: { label: 'Platinum', symbol: 'XPT', price: 1012.0, drift: 0.9 },
  palladium: { label: 'Palladium', symbol: 'XPD', price: 1128.0, drift: 1.1 },
}

const ORDER: MetalKey[] = ['silver', 'gold', 'platinum', 'palladium']

/* ── Live source config ──────────────────────────────────────────── */
const API_KEY = ((import.meta.env.VITE_METALS_API_KEY as string | undefined) ?? '').trim()
const SIM_INTERVAL_MS = 4200
// Free tier is 100 req/MONTH. Fetch at most once per TTL, cache the rest.
// 12h ⇒ ≤2 calls/day per browser (~60/mo worst case) — comfortably under 100.
const CACHE_KEY = 'gmd_metals_v1'
const CACHE_TTL_MS = 12 * 60 * 60 * 1000

function nextTick(open: number, current: number, drift: number): number {
  // bounded random walk that gently mean-reverts toward session open (±2.2%)
  const shock = (Math.random() - 0.5) * drift * 2
  const pull = (open - current) * 0.06
  const next = current + shock + pull
  const lo = open * 0.978
  const hi = open * 1.022
  return Math.min(hi, Math.max(lo, next))
}

/** metals.dev latest → USD/oz for our four metals, or null on any failure. */
async function fetchSpot(key: string): Promise<Record<MetalKey, number> | null> {
  try {
    const url = `https://api.metals.dev/v1/latest?api_key=${encodeURIComponent(key)}&currency=USD&unit=toz`
    const res = await fetch(url)
    if (!res.ok) return null
    const json = (await res.json()) as { metals?: Record<string, number> }
    const m = json.metals
    if (!m) return null
    const out = {
      silver: m.silver,
      gold: m.gold,
      platinum: m.platinum,
      palladium: m.palladium,
    } as Record<MetalKey, number>
    for (const k of ORDER) if (!Number.isFinite(out[k])) return null
    return out
  } catch {
    return null
  }
}

export interface LiveMetals {
  quotes: MetalQuote[]
  silver: MetalQuote
  /** last ~24 silver prices for the sparkline */
  silverHistory: number[]
}

/* ── Shared store (useSyncExternalStore) ─────────────────────────── */
const opens: Record<MetalKey, number> = Object.fromEntries(
  ORDER.map((k) => [k, SEEDS[k].price]),
) as Record<MetalKey, number>
let prices: Record<MetalKey, number> = { ...opens }
let prevPrices: Record<MetalKey, number> = { ...opens }
let history: number[] = [SEEDS.silver.price]

function buildSnapshot(): LiveMetals {
  const quotes: MetalQuote[] = ORDER.map((k): MetalQuote => {
    const price = prices[k]
    const open = opens[k]
    const change = price - prevPrices[k]
    const changePct = ((price - open) / open) * 100
    return {
      key: k,
      label: SEEDS[k].label,
      symbol: SEEDS[k].symbol,
      price,
      change,
      changePct,
      direction: change > 0.0001 ? 'up' : change < -0.0001 ? 'down' : 'flat',
    }
  })
  return { quotes, silver: quotes[0], silverHistory: history }
}

let snapshot: LiveMetals = buildSnapshot()
const listeners = new Set<() => void>()

function emit(): void {
  snapshot = buildSnapshot()
  for (const l of listeners) l()
}

function commit(next: Record<MetalKey, number>): void {
  prevPrices = prices
  prices = next
  history = [...history.slice(-23), next.silver]
  emit()
}

let started = false

function startSim(): void {
  // Reduced motion: hold steady (still a live value, just no animated churn).
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.setInterval(() => {
    const next = {} as Record<MetalKey, number>
    for (const k of ORDER) next[k] = nextTick(opens[k], prices[k], SEEDS[k].drift)
    commit(next)
  }, SIM_INTERVAL_MS)
}

interface MetalsCache {
  t: number // fetch timestamp (ms)
  metals: Record<MetalKey, number>
  prev: Record<MetalKey, number> // previous fetch — drives change %
  hist: number[] // silver history for the sparkline
}

function readCache(): MetalsCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const c = JSON.parse(raw) as MetalsCache
    if (!c || typeof c.t !== 'number' || !c.metals || !c.prev) return null
    for (const k of ORDER) if (!Number.isFinite(c.metals[k])) return null
    return c
  } catch {
    return null
  }
}

function writeCache(c: MetalsCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c))
  } catch {
    /* storage disabled — fine, we just refetch next TTL */
  }
}

function seedFrom(metals: Record<MetalKey, number>, prev: Record<MetalKey, number>, hist: number[]): void {
  // open = previous fetch, so changePct reads as "move since last update".
  for (const k of ORDER) {
    opens[k] = prev[k]
    prevPrices[k] = prev[k]
    prices[k] = metals[k]
  }
  history = hist.length ? hist : [metals.silver]
  emit()
}

function startReal(): void {
  const cache = readCache()
  if (cache && Date.now() - cache.t < CACHE_TTL_MS) {
    seedFrom(cache.metals, cache.prev, cache.hist) // fresh cache — 0 API calls
    return
  }
  // stale or missing → exactly ONE fetch this session
  fetchSpot(API_KEY)
    .then((next) => {
      if (!next) {
        if (cache) seedFrom(cache.metals, cache.prev, cache.hist)
        else startSim()
        return
      }
      const prev = cache?.metals ?? next
      const hist = [...(cache?.hist ?? []).slice(-23), next.silver]
      writeCache({ t: Date.now(), metals: next, prev, hist })
      seedFrom(next, prev, hist)
    })
    .catch(() => {
      if (cache) seedFrom(cache.metals, cache.prev, cache.hist)
      else startSim()
    })
}

function start(): void {
  if (started || typeof window === 'undefined') return
  started = true
  if (API_KEY) startReal()
  else startSim()
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  start()
  return () => {
    listeners.delete(cb)
  }
}

/**
 * Live metals hook. All consumers share one store, so the ticker, hero
 * readout, and builder never disagree. Real feed via VITE_METALS_API_KEY,
 * otherwise a bounded random walk (see file header).
 */
export function useLiveMetals(): LiveMetals {
  return useSyncExternalStore(subscribe, () => snapshot)
}

/* ── Grill builder pricing (visibly silver-linked) ─────────────── */

export type BuilderMetal = '925 Silver' | 'NPG' | '10K Gold' | '14K Gold' | '18K Gold'
export type BuilderFinish = 'Solid' | 'Half & Half' | 'Open Face' | 'Iced (Lab VVS)' | 'Iced (VVS)'

// per-tooth base in USD, before the silver-spot component
const METAL_BASE: Record<BuilderMetal, number> = {
  '925 Silver': 62,
  NPG: 74, // Non-Precious Gold — gold look, alloy price (Jewel X / NPG per client)
  '10K Gold': 96,
  '14K Gold': 132,
  '18K Gold': 178,
}
// how strongly each metal's per-tooth price tracks the silver spot
const SILVER_SENSITIVITY: Record<BuilderMetal, number> = {
  '925 Silver': 1.15,
  NPG: 0.45,
  '10K Gold': 0.55,
  '14K Gold': 0.62,
  '18K Gold': 0.7,
}
const FINISH_MULT: Record<BuilderFinish, number> = {
  Solid: 1,
  'Half & Half': 1.18,
  'Open Face': 0.86,
  'Iced (Lab VVS)': 2.35,
  'Iced (VVS)': 3.4,
}

export interface GrillQuote {
  perTooth: number
  subtotal: number
  moldFee: number
  total: number
}

/**
 * Estimate a live grill price. The silver spot moves the number in real time,
 * which is the whole point of the builder. `moldFee` is waived over 6 teeth.
 */
export function estimateGrillPrice(
  teeth: number,
  metal: BuilderMetal,
  finish: BuilderFinish,
  silverSpot: number,
): GrillQuote {
  const perTooth = Math.round(
    (METAL_BASE[metal] + silverSpot * SILVER_SENSITIVITY[metal]) * FINISH_MULT[finish],
  )
  const subtotal = perTooth * teeth
  const moldFee = teeth >= 6 ? 0 : 25
  return { perTooth, subtotal, moldFee, total: subtotal + moldFee }
}

export const BUILDER_METALS: BuilderMetal[] = ['925 Silver', 'NPG', '10K Gold', '14K Gold', '18K Gold']

// Customer-facing labels — NPG is the internal/vendor code (Jewel X), but
// customers need to see "Gold Plated" so solid gold vs. plated is never confused.
export const BUILDER_METAL_LABELS: Record<BuilderMetal, string> = {
  '925 Silver': '925 Silver',
  NPG: 'Gold Plated',
  '10K Gold': '10K Gold',
  '14K Gold': '14K Gold',
  '18K Gold': '18K Gold',
}
export const BUILDER_METAL_HINTS: Partial<Record<BuilderMetal, string>> = {
  NPG: 'Gold-look finish, not solid gold',
}
export const BUILDER_FINISHES: BuilderFinish[] = ['Solid', 'Half & Half', 'Open Face', 'Iced (Lab VVS)', 'Iced (VVS)']

// quick-select presets referenced on Home + the builder
export interface Preset {
  id: string
  label: string
  teeth: number
  note: string
}
export const PRESETS: Preset[] = [
  { id: '6x6', label: '6 × 6', teeth: 12, note: 'Six top, six bottom' },
  { id: '8x8', label: '8 × 8', teeth: 16, note: 'Eight top, eight bottom' },
  { id: '10x10', label: '10 × 10', teeth: 20, note: 'Ten top, ten bottom' },
  { id: '12x12', label: '12 × 12', teeth: 24, note: 'Twelve top, twelve bottom' },
  { id: 'full', label: 'Full Set', teeth: 28, note: 'Every visible tooth' },
]
