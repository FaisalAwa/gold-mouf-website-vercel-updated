import { useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import { LiveCatalogProvider } from '@/context/LiveCatalog'
import { RootLayout } from '@/components'

type LenisLike = { scrollTo: (target: number, opts?: { immediate?: boolean }) => void }
import Home from '@/pages/Home'
import Configurator from '@/pages/Configurator'
import Shop from '@/pages/Shop'
import Product from '@/pages/Product'
import Cart from '@/pages/Cart'
import Story from '@/pages/Story'
import CustomInquiry from '@/pages/CustomInquiry'
import InstantQuote from '@/pages/InstantQuote'
import Contact from '@/pages/Contact'
import Legal from '@/pages/Legal'
import NotFound from '@/pages/NotFound'

/* Always land at the top on any navigation. Lenis owns scroll on desktop, so
   jump it instantly; fall back to the window on touch devices. Runs before
   paint so there is no flash of the previous scroll position. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis
    if (lenis) lenis.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <CartProvider>
      <LiveCatalogProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/configurator" element={<Configurator />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/story" element={<Story />} />
            <Route path="/custom-inquiry" element={<CustomInquiry />} />
            <Route path="/instant-quote" element={<InstantQuote />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal/:doc" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </LiveCatalogProvider>
    </CartProvider>
  )
}

export default App
