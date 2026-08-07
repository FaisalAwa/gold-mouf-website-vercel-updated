import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/globals.css'
import './styles/app.css'
import './styles/interactions.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Manual scroll restoration — GSAP/Lenis own the scroll position.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// Lenis smooth scroll — DESKTOP ONLY.
// On touch/coarse-pointer devices, native scroll drives ScrollTrigger via a
// passive listener (Lenis on mobile fights the browser's momentum scroll).
const isTouch = window.matchMedia('(pointer: coarse)').matches
if (!isTouch) {
  const lenis = new Lenis({ duration: 0.85, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => { lenis.raf(time * 1000) })
  gsap.ticker.lagSmoothing(0)
  // expose for pages that need to lock/unlock scroll (modals, loader)
  ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
} else {
  window.addEventListener('scroll', () => ScrollTrigger.update(), { passive: true })
}

// Refresh ScrollTrigger once web fonts land (metrics shift pin calculations).
document.fonts?.ready.then(() => ScrollTrigger.refresh())

// Debounced resize → refresh pins (LEARNINGS: the #1 documented failure class).
let resizeTimer: ReturnType<typeof setTimeout>
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
})

// React StrictMode is intentionally OFF — it double-fires effects and breaks
// GSAP ScrollTrigger pin/cleanup. Do not re-enable.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
