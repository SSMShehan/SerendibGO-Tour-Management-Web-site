import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Settings,
  Headphones,
  Bell,
  Eye,
  LogIn
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const dropdownRef = useRef(null)

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      setIsProfileDropdownOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleProfileSettings = () => {
    const routes = {
      guide: '/guide/settings',
      admin: '/admin/settings',
      staff: '/staff',
      hotel_owner: '/hotel-owner',
      driver: '/driver',
      vehicle_owner: '/vehicle-owner',
      default: '/profile'
    }
    navigate(routes[user?.role] || routes.default)
    setIsProfileDropdownOpen(false)
  }

  const handleSupport = () => {
    navigate(user?.role === 'guide' ? '/guide-support' : '/contact')
    setIsProfileDropdownOpen(false)
  }

  const handleNotifications = () => {
    navigate(user?.role === 'guide' ? '/guide-notifications' : '/notifications')
    setIsProfileDropdownOpen(false)
  }

  const handleViewPublicProfile = () => {
    navigate(user?.role === 'guide' ? `/guides/${user.id}` : '/profile')
    setIsProfileDropdownOpen(false)
  }

  const isActive = (path) => location.pathname === path

  // --- RESTORED DESIGN LOGIC ---

  // List of pages that have a full-screen or large hero section where header should be transparent
  // This was the logic we needed, just applied cleanly.
  const transparentHeaderPages = ['/', '/tours', '/guides', '/hotels', '/vehicles', '/custom-trip', '/login', '/register']
  const isTransparentPage = transparentHeaderPages.includes(location.pathname)

  // Style calculation - Original "Glass" Look
  const getHeaderStyle = () => {
    if (scrolled || !isTransparentPage) {
      return "bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 py-2 sm:py-0"
    }
    // Transparent on hero pages when at top
    return "bg-transparent py-4 border-b border-white/10"
  }

  // Text color calculation
  const getTextColor = () => {
    if (scrolled || !isTransparentPage) return 'text-slate-800'
    return 'text-white'
  }

  // Hover effect calculation
  const getHoverClass = () => {
    if (scrolled || !isTransparentPage) return 'hover:bg-slate-100 hover:text-[#E59B2C]'
    return 'hover:bg-white/10 hover:text-white'
  }

  const textColor = getTextColor()

  // Original "Pill" Active State
  const activeClass = scrolled || !isTransparentPage
    ? "bg-[#E59B2C] text-white shadow-md shadow-[#E59B2C]/20"
    : "bg-white text-slate-900 shadow-lg"

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[999] pointer-events-auto transition-all duration-300 ${getHeaderStyle()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo Section - Mobile */}
          <div className="flex-shrink-0 flex items-center md:hidden">
            <Link to="/" className="flex items-center gap-2">
              <span className={`font-bold text-2xl ${textColor} tracking-tight`} style={{ fontFamily: 'serif' }}>
                SERENDIB<span className="text-[#E59B2C]">GO</span>
              </span>
            </Link>
          </div>

          {/* Left Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink to="/" isActive={isActive('/')} textColor={textColor} hoverClass={getHoverClass()} activeClass={activeClass}>
              HOME
            </NavLink>
            <NavLink to="/tours" isActive={isActive('/tours')} textColor={textColor} hoverClass={getHoverClass()} activeClass={activeClass}>
              TOURS
            </NavLink>
            <NavLink to="/guides" isActive={isActive('/guides')} textColor={textColor} hoverClass={getHoverClass()} activeClass={activeClass}>
              GUIDES
            </NavLink>
            <NavLink to="/hotels" isActive={isActive('/hotels')} textColor={textColor} hoverClass={getHoverClass()} activeClass={activeClass}>
              HOTELS
            </NavLink>
          </div>

          {/* Center Brand Name - Desktop */}
          <div className="hidden md:flex text-center absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="group flex items-center gap-1">
              <span className={`font-bold text-3xl tracking-tight ${textColor} transition-colors duration-300`} style={{ fontFamily: 'serif' }}>
                SERENDIB
              </span>
              <span className="font-bold text-3xl text-[#E59B2C]" style={{ fontFamily: 'serif' }}>GO</span>
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <NavLink to="/vehicles" isActive={isActive('/vehicles')} textColor={textColor} hoverClass={getHoverClass()} activeClass={activeClass}>
              VEHICLES
            </NavLink>

            <Link
              to="/custom-trip"
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 border ${isActive('/custom-trip')
                ? activeClass
                : `${textColor} border-[#E59B2C] hover:bg-[#E59B2C] hover:text-white`
                }`}
            >
              CUSTOM TRIP
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 border border-transparent ${getHoverClass()}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E59B2C] to-[#B87A1E] flex items-center justify-center text-white shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                  <span className={`font-medium max-w-[100px] truncate ${textColor}`}>
                    {user?.firstName || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 ${textColor} transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white/20 py-2 z-50 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100/50">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name || `${user?.firstName} ${user?.lastName}`}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-2 space-y-1 px-2">
                      <DropdownItem onClick={() => navigateToDashboard(user, navigate)} icon={User}>Dashboard</DropdownItem>
                      <DropdownItem onClick={handleViewPublicProfile} icon={Eye}>Public Profile</DropdownItem>
                      <DropdownItem onClick={handleProfileSettings} icon={Settings}>Settings</DropdownItem>
                      <DropdownItem onClick={handleNotifications} icon={Bell}>Notifications</DropdownItem>
                      <DropdownItem onClick={handleSupport} icon={Headphones}>Support</DropdownItem>
                    </div>

                    <div className="border-t border-gray-100/50 pt-2 px-2 pb-1">
                      <DropdownItem onClick={handleLogout} icon={LogOut} variant="danger">Logout</DropdownItem>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#E59B2C] hover:bg-[#cd8b28] text-white font-semibold shadow-lg shadow-[#E59B2C]/30 transition-all hover:scale-105 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>LOGIN</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg ${textColor} hover:bg-black/5 transition-colors`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-4 py-6 space-y-4">
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)} isActive={isActive('/')}>HOME</MobileNavLink>
            <MobileNavLink to="/tours" onClick={() => setIsMenuOpen(false)} isActive={isActive('/tours')}>TOURS</MobileNavLink>
            <MobileNavLink to="/guides" onClick={() => setIsMenuOpen(false)} isActive={isActive('/guides')}>GUIDES</MobileNavLink>
            <MobileNavLink to="/hotels" onClick={() => setIsMenuOpen(false)} isActive={isActive('/hotels')}>HOTELS</MobileNavLink>
            <MobileNavLink to="/vehicles" onClick={() => setIsMenuOpen(false)} isActive={isActive('/vehicles')}>VEHICLES</MobileNavLink>
            <MobileNavLink to="/custom-trip" onClick={() => setIsMenuOpen(false)} isActive={isActive('/custom-trip')}>CUSTOM TRIP</MobileNavLink>

            <div className="h-px bg-gray-100 my-4"></div>

            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 mb-4 px-2">
                  <div className="w-10 h-10 rounded-full bg-[#E59B2C]/10 flex items-center justify-center text-[#E59B2C]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name || user?.firstName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <MobileActionButton onClick={() => { navigateToDashboard(user, navigate); setIsMenuOpen(false); }} icon={User}>Dashboard</MobileActionButton>
                  <MobileActionButton onClick={() => { handleProfileSettings(); setIsMenuOpen(false); }} icon={Settings}>Settings</MobileActionButton>
                  <MobileActionButton onClick={() => { handleLogout(); setIsMenuOpen(false); }} icon={LogOut} variant="danger">Logout</MobileActionButton>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center w-full space-x-2 px-4 py-3 rounded-xl bg-[#E59B2C] text-white font-bold shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                <span>LOGIN / REGISTER</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

// Helper Components
const NavLink = ({ to, children, isActive, textColor, hoverClass, activeClass }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive
      ? activeClass
      : `${textColor} ${hoverClass}`
      }`}
  >
    {children}
  </Link>
)

const MobileNavLink = ({ to, children, onClick, isActive }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${isActive
      ? 'bg-[#E59B2C]/10 text-[#E59B2C]'
      : 'text-slate-600 hover:bg-slate-50'
      }`}
  >
    {children}
  </Link>
)

const DropdownItem = ({ onClick, icon: Icon, children, variant = "default" }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${variant === "danger"
      ? "text-red-600 hover:bg-red-50"
      : "text-gray-700 hover:bg-gray-50 hover:text-[#E59B2C]"
      }`}
  >
    <Icon className="w-4 h-4 opacity-70" />
    <span>{children}</span>
  </button>
)

const MobileActionButton = ({ onClick, icon: Icon, children, variant = "default" }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${variant === "danger"
      ? "bg-red-50 text-red-600"
      : "bg-gray-50 text-gray-700"
      }`}
  >
    <Icon className="w-5 h-5" />
    <span>{children}</span>
  </button>
)

const navigateToDashboard = (user, navigate) => {
  if (user?.role === 'guide') navigate('/guide')
  else if (user?.role === 'admin') navigate('/admin')
  else if (user?.role === 'staff') navigate('/staff')
  else if (user?.role === 'hotel_owner') navigate('/hotel-owner')
  else if (user?.role === 'driver') navigate('/driver')
  else if (user?.role === 'vehicle_owner') navigate('/vehicle-owner')
  else navigate('/dashboard')
}

export default Header
