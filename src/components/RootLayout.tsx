/* Global chrome wrapper: ticker + nav + page + footer + chat + loader.
   main reserves space for the fixed ticker+nav. */
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SilverTicker } from './SilverTicker'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { ChatWidget } from './ChatWidget'

export function RootLayout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <SilverTicker />
      <Nav />
      <main style={{ paddingTop: 'calc(var(--ticker-h) + var(--nav-h))', minHeight: '100dvh', background: 'var(--c-bg)' }}>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
