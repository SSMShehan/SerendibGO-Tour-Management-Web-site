import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Header from './Header'
import Footer from './Footer'
import Chatbot from '../chatbot/Chatbot'

const Layout = () => {
  const location = useLocation()
  const { user } = useAuth()

  // Hide header for dashboard pages
  const shouldHideHeader = (
    (user?.role === 'guide' && (
      location.pathname.startsWith('/guide/dashboard') ||
      location.pathname.startsWith('/guide-support') ||
      location.pathname.startsWith('/guide-notifications')
    )) ||
    (user?.role === 'staff' && location.pathname.startsWith('/staff')) ||
    (user?.role === 'admin' && (
      location.pathname.startsWith('/staff') ||
      location.pathname.startsWith('/admin')
    )) ||
    location.pathname === '/login' ||
    location.pathname === '/register'
  )

  // Pages where we want the header to be transparent and overlay the hero section
  // We MUST NOT have top padding on these pages
  const transparentHeaderPages = ['/', '/tours', '/guides', '/hotels', '/vehicles', '/custom-trip', '/login', '/register']
  const isTransparentPage = transparentHeaderPages.includes(location.pathname)

  // Add padding to main content only if it's NOT a transparent header page
  // This pushes content down on standard pages so it doesn't hide behind the navbar
  const mainClassName = isTransparentPage ? 'flex-1' : 'flex-1 pt-20'

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideHeader && <Header />}

      <main className={mainClassName}>
        <Outlet />
      </main>

      {!shouldHideHeader && <Footer />}
      {!shouldHideHeader && <Chatbot />}
    </div>
  )
}

export default Layout
