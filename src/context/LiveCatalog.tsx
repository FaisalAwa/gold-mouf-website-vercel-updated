/* Live catalog provider — fetches what Shopify currently publishes once
   per session and hands it to the hooks in @/lib/live-catalog. Failure is
   not an error state here: the generated catalog already covers every
   surface, so an unreachable Shopify just means nothing gets overlaid. */

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchLiveCatalog, shopifyReady } from '@/lib/shopify'
import type { LiveProduct } from '@/lib/shopify'
import { LiveCatalogContext } from '@/lib/live-catalog'
import type { LiveCatalogAPI, LiveStatus } from '@/lib/live-catalog'

export function LiveCatalogProvider({ children }: { children: ReactNode }) {
  const [live, setLive] = useState<Map<string, LiveProduct>>(() => new Map())
  const [status, setStatus] = useState<LiveStatus>(shopifyReady ? 'loading' : 'idle')

  useEffect(() => {
    if (!shopifyReady) return
    let cancelled = false

    fetchLiveCatalog()
      .then((next) => {
        if (cancelled) return
        setLive(next)
        setStatus('ready')
      })
      .catch(() => {
        // Unreachable or misconfigured — the local catalog already covers us.
        if (!cancelled) setStatus('offline')
      })

    return () => { cancelled = true }
  }, [])

  const value = useMemo<LiveCatalogAPI>(
    () => ({ status, get: (slug) => live.get(slug) }),
    [status, live],
  )

  return <LiveCatalogContext.Provider value={value}>{children}</LiveCatalogContext.Provider>
}
