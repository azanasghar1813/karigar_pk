import { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User, ChevronDown, LayoutDashboard, CalendarCheck } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { SITE_LOGO, SITE_LOGO_ALT } from '../config/site'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={SITE_LOGO}
            alt={SITE_LOGO_ALT}
            className="h-10 w-10 rounded-lg object-contain bg-white"
          />
          <span className="font-poppins text-base sm:text-xl font-bold">Karigar PK</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/services" className="hover:text-secondary transition-colors">Services</Link>
          <Link to="/find-karigar" className="hover:text-secondary transition-colors">Find a Karigar</Link>
          <Link to="/join-karigar" className="hover:text-secondary transition-colors">Join Karigar</Link>
          <Link to="/about" className="hover:text-secondary transition-colors">About</Link>
          <Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link>
          {user?.role === 'customer' && (
            <Link to="/customer-dashboard" className="text-secondary font-semibold hover:text-white transition-colors">My Bookings</Link>
          )}
        </div>

        {/* Desktop CTA / Account */}
        <div className="hidden md:flex gap-3 items-center">
          {!user ? (
            <>
              <div className="relative group">
                <button className="px-5 py-2 rounded-xl border-2 border-white/70 text-white font-semibold flex items-center gap-2 hover:bg-white/10 transition-all">
                  Sign In
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/login" className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/signup" className="block px-4 py-2 text-sm text-secondary font-semibold hover:bg-gray-800 transition-colors">
                    Create new account
                  </Link>
                </div>
              </div>
              <Link to="/find-karigar" className="px-5 py-2 rounded-xl border-2 border-secondary bg-secondary text-white font-semibold shadow-md hover:bg-orange-600 transition-all">Book Now</Link>
            </>
          ) : (
            <>
              {/* Account Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
                >
                  <User size={18} />
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {user.fullName || 'My Account'}
                  </span>
                  {user.role === 'admin' && (
                    <span className="text-xs bg-secondary text-white px-1.5 py-0.5 rounded font-bold">ADMIN</span>
                  )}
                  <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-1 z-50 animate-fade-in">
                    {/* Admin Panel link — only for admins */}
                    {user.role === 'admin' && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:bg-gray-800 font-semibold transition-colors"
                        >
                          <LayoutDashboard size={16} />
                          Admin Panel
                        </Link>
                        <div className="border-t border-gray-700 my-1" />
                      </>
                    )}

                    {/* Karigar Panel link — only for karigars */}
                    {user.role === 'karigar' && (
                      <>
                        <Link
                          to="/karigar"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:bg-gray-800 font-semibold transition-colors"
                        >
                          <LayoutDashboard size={16} />
                          My Dashboard
                        </Link>
                        <div className="border-t border-gray-700 my-1" />
                      </>
                    )}

                    {/* Customer links */}
                    {user.role === 'customer' && (
                      <>
                        <Link
                          to="/customer-dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:bg-gray-800 font-semibold transition-colors"
                        >
                          <LayoutDashboard size={16} />
                          My Bookings
                        </Link>
                        <div className="border-t border-gray-700 my-1" />
                        <Link
                          to="/find-karigar"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <CalendarCheck size={16} />
                          Book a Service
                        </Link>
                        <div className="border-t border-gray-700 my-1" />
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {user.role !== 'karigar' && (
                <Link to="/find-karigar" className="px-5 py-2 rounded-xl border-2 border-secondary bg-secondary text-white font-semibold shadow-md hover:bg-orange-600 transition-all">Book Now</Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Header Buttons */}
        <div className="md:hidden flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className="rounded-lg border border-white/70 px-2.5 py-1.5 text-xs font-semibold">Sign In</Link>
              <Link to="/find-karigar" className="rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold text-white">Book Now</Link>
            </>
          ) : (
            <>
              <Link to="/find-karigar" className="rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold text-white">Book Now</Link>
            </>
          )}
          <button className="p-1" onClick={toggleMenu} aria-label="Toggle navigation menu">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900 px-4 py-4 space-y-3">
          <Link to="/services" className="block hover:text-secondary py-2" onClick={() => setIsOpen(false)}>Services</Link>
          <Link to="/find-karigar" className="block hover:text-secondary py-2" onClick={() => setIsOpen(false)}>Find a Karigar</Link>
          <Link to="/join-karigar" className="block hover:text-secondary py-2" onClick={() => setIsOpen(false)}>Join Karigar</Link>
          <Link to="/about" className="block hover:text-secondary py-2" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" className="block hover:text-secondary py-2" onClick={() => setIsOpen(false)}>Contact</Link>

          {!user ? (
            <>
              <Link to="/login" className="block w-full text-center py-2 rounded-xl border-2 border-white/70 text-white font-semibold mt-4" onClick={() => setIsOpen(false)}>Sign In</Link>
              <Link to="/signup" className="block w-full text-center py-2 rounded-xl border-2 border-secondary text-secondary font-semibold mt-2" onClick={() => setIsOpen(false)}>Create new account</Link>
              <Link to="/find-karigar" className="block w-full text-center py-2 rounded-xl border-2 border-secondary bg-secondary text-white font-semibold shadow-md mt-2" onClick={() => setIsOpen(false)}>Book Now</Link>
            </>
          ) : (
            <>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 py-2 text-secondary font-semibold mt-4"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={16} />
                  Admin Panel
                </Link>
              )}
              {user.role === 'karigar' && (
                <Link
                  to="/karigar"
                  className="flex items-center gap-2 py-2 text-secondary font-semibold mt-4"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={16} />
                  My Dashboard
                </Link>
              )}
              {user.role === 'customer' && (
                <Link
                  to="/customer-dashboard"
                  className="flex items-center gap-2 py-2 text-secondary font-semibold mt-4"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={16} />
                  My Bookings
                </Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left hover:text-secondary py-2 mt-2">Logout</button>
              {user.role !== 'karigar' && (
                <Link to="/find-karigar" className="block w-full text-center py-2 rounded-xl border-2 border-secondary bg-secondary text-white font-semibold shadow-md" onClick={() => setIsOpen(false)}>Book Now</Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  )
}