/* ═══════════════════════════════════════════════════════════════
   JewlxEmbed — shared wrapper for JewlX's iframe widgets (grill
   builder, custom enquiry, instant quote). Mirrors JewlX's own embed
   snippet: fixed-height iframe on desktop that grows via postMessage,
   full-dvh on mobile. Listens for the vendor's `jewlx-resize` message
   and resizes the iframe accordingly (desktop only, per JewlX's spec).

   The vendor's own bootstrap takes a beat (its JS bundle + first paint),
   so a bare iframe shows a blank white flash on entry — the resize
   message doubles as the only reliable cross-origin "content is up"
   signal we get, so it also clears our own loading state. A timeout
   fallback clears it regardless, so a stalled or unauthorized-domain
   response never leaves the spinner stuck.
   ═══════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from 'react'

interface JewlxEmbedProps {
  /** DOM id for the iframe — JewlX scopes postMessage payloads per widget instance. */
  id: string
  src: string
  title: string
}

const READY_TIMEOUT_MS = 6000

export function JewlxEmbed({ id, src, title }: JewlxEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      let data: unknown
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
      } catch {
        return
      }
      if (!data || typeof data !== 'object') return
      const payload = data as { type?: unknown; height?: unknown }
      if (payload.type !== 'jewlx-resize') return
      setLoaded(true)
      if (typeof payload.height !== 'number' || window.innerWidth < 768) return
      const iframe = iframeRef.current
      if (!iframe) return
      const h = Math.max(500, Math.min(4000, payload.height))
      iframe.style.height = `${h}px`
    }
    window.addEventListener('message', handleMessage)
    const timer = window.setTimeout(() => setLoaded(true), READY_TIMEOUT_MS)
    return () => {
      window.removeEventListener('message', handleMessage)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div className="gmd-jewlx-embed">
      <iframe
        ref={iframeRef}
        id={`${id}-iframe`}
        src={src}
        title={title}
        loading="lazy"
        allow="fullscreen"
        allowFullScreen
        className={loaded ? 'is-loaded' : ''}
      />
      <div className={`gmd-jewlx-loading${loaded ? ' is-hidden' : ''}`} aria-hidden={loaded}>
        <span className="gmd-jewlx-spinner" />
        <span className="gmd-jewlx-loading-text">Loading…</span>
      </div>
    </div>
  )
}

export default JewlxEmbed
