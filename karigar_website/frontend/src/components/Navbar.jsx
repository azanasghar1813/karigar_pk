import { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, User, ChevronDown, LayoutDashboard, CalendarCheck, MapPin, Search, ArrowRight, ShieldCheck, Wrench, HardHat } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { CITIES } from '../config/site'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [cityModalOpen, setCityModalOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('karigarSelectedCity') || 'Lahore, Pakistan')

  const dropdownRef = useRef(null)
  const cityRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleCitySelect = (cityName) => {
    const formatted = `${cityName}, Pakistan`
    setSelectedCity(formatted)
    localStorage.setItem('karigarSelectedCity', formatted)
    setCityModalOpen(false)
    // Update search query param if on find-karigar
    if (location.pathname === '/find-karigar') {
      navigate(`/find-karigar?city=${encodeURIComponent(cityName)}`)
    }
  }

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityModalOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-[#0B1329] border-b border-[#1F2E54]/70 text-white sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="container flex justify-between items-center py-3.5">
        
        {/* Brand Logo (House icon with hammer) */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF782D] to-[#E05D00] flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z"/>
              <path d="M14.5 10.5l1.5-1.5 2 2-1.5 1.5z" fill="#0B1329" opacity="0.9"/>
            </svg>
          </div>
          <span className="font-poppins text-xl font-bold tracking-tight text-white">
            Karigar<span className="text-secondary font-extrabold">PK</span>
          </span>
        </Link>

        {/* Desktop Navigation Links (Matching Design) */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
          <Link 
            to="/" 
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/' 
                ? 'bg-white/10 text-white font-semibold' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>

          {/* Explore Dropdown */}
          <div className="relative group">
            <button 
              onClick={() => setExploreOpen(!exploreOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Explore
              <ChevronDown size={14} className="text-gray-400 group-hover:text-white group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-52 bg-[#0F1E3D] border border-[#1F2E54] rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link to="/find-karigar" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 hover:text-white">
                All Verified Karigars
              </Link>
              <Link to="/find-karigar?view=map" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 hover:text-white">
                Explore on Map 📍
              </Link>
              <Link to="/find-karigar?sort=rating" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 hover:text-white">
                Top Rated Professionals ⭐
              </Link>
            </div>
          </div>

          {/* Services Dropdown */}
          <div className="relative group">
            <button 
              className="flex items-center gap-1 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Services
              <ChevronDown size={14} className="text-gray-400 group-hover:text-white group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-56 bg-[#0F1E3D] border border-[#1F2E54] rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link to="/find-karigar?service=Electrician" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10">⚡ Electricians</Link>
              <Link to="/find-karigar?service=Plumber" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10">🔧 Plumbers</Link>
              <Link to="/find-karigar?service=AC%20Repair" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10">❄️ AC & Cooling</Link>
              <Link to="/find-karigar?service=Carpenter" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10">🪚 Carpenters</Link>
              <Link to="/find-karigar?service=Painter" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10">🎨 Painters</Link>
              <div className="border-t border-[#1F2E54] my-1"></div>
              <Link to="/services" className="block px-4 py-2 text-xs font-bold text-secondary hover:underline">
                View All 10+ Services →
              </Link>
            </div>
          </div>

          <Link to="/about" className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            How it Works
          </Link>
          <Link to="/register-karigar" className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            For Professionals
          </Link>
        </div>

        {/* Right Section: City Selector + Search + Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* City Selector Pill (From Reference Image) */}
          <div className="relative" ref={cityRef}>
            <button
              type="button"
              onClick={() => setCityModalOpen(!cityModalOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#131F3D] border border-[#1F2E54] text-xs font-semibold text-gray-200 hover:text-white hover:border-gray-500 transition-colors shadow-sm"
            >
              <MapPin size={13} className="text-secondary" />
              <span>{selectedCity}</span>
              <ChevronDown size={13} className="text-gray-400" />
            </button>

            {cityModalOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#0F1E3D] border border-[#1F2E54] rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
                <p className="px-4 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Select City</p>
                {CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCitySelect(c)}
                    className="w-full text-left px-4 py-2 text-xs text-gray-200 hover:bg-secondary/20 hover:text-white transition-colors"
                  >
                    {c}, Pakistan
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Icon Quick Link */}
          <Link 
            to="/find-karigar" 
            className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Search services"
          >
            <Search size={18} />
          </Link>

          {!user ? (
            <>
              {/* Log in Button */}
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-semibold text-gray-200 hover:text-white transition-colors"
              >
                Log in
              </Link>

              {/* Join as a Pro CTA Button (Exact from Reference) */}
              <Link 
                to="/register-karigar" 
                className="btn-secondary !px-4 !py-2 text-sm rounded-xl font-bold flex items-center gap-1.5"
              >
                <span>Join as a Pro</span>
                <ArrowRight size={15} />
              </Link>
            </>
          ) : (
            /* Logged in User Menu */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#1F2E54] bg-[#131F3D] hover:border-secondary transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-secondary/20 border border-secondary/40 text-secondary font-bold text-xs flex items-center justify-center">
                  {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-semibold max-w-[100px] truncate text-white">
                  {user.fullName?.split(' ')[0] || 'My Account'}
                </span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#0F1E3D] border border-[#1F2E54] rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-[#1F2E54]">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary/20 text-secondary">
                      {user.role}
                    </span>
                  </div>

                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-200 hover:bg-white/10 hover:text-white" onClick={() => setDropdownOpen(false)}>
                      <LayoutDashboard size={15} className="text-secondary" />
                      Admin Control Panel
                    </Link>
                  )}
                  {user.role === 'karigar' && (
                    <Link to="/karigar" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-200 hover:bg-white/10 hover:text-white" onClick={() => setDropdownOpen(false)}>
                      <LayoutDashboard size={15} className="text-secondary" />
                      Karigar Dashboard
                    </Link>
                  )}
                  {user.role === 'customer' && (
                    <Link to="/customer/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-200 hover:bg-white/10 hover:text-white" onClick={() => setDropdownOpen(false)}>
                      <CalendarCheck size={15} className="text-secondary" />
                      My Bookings & Orders
                    </Link>
                  )}

                  <div className="border-t border-[#1F2E54] my-1" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left"
                  >
                    <LogOut size={15} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Header Actions */}
        <div className="md:hidden flex items-center gap-2">
          {!user ? (
            <Link to="/login" className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#131F3D] border border-[#1F2E54] text-white">
              Log in
            </Link>
          ) : null}
          <Link to="/register-karigar" className="px-3 py-1.5 text-xs font-bold rounded-lg bg-secondary text-white shadow-sm">
            Join Pro
          </Link>
          <button 
            type="button" 
            className="p-1.5 text-gray-300 hover:text-white" 
            onClick={toggleMenu} 
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0A1428] border-b border-[#1F2E54] px-4 py-4 space-y-2 animate-fade-in">
          <Link to="/" className="block py-2 text-sm text-gray-200" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/find-karigar" className="block py-2 text-sm text-gray-200" onClick={() => setIsOpen(false)}>Explore Karigars</Link>
          <Link to="/services" className="block py-2 text-sm text-gray-200" onClick={() => setIsOpen(false)}>All Services</Link>
          <Link to="/about" className="block py-2 text-sm text-gray-200" onClick={() => setIsOpen(false)}>How it Works</Link>
          <Link to="/register-karigar" className="block py-2 text-sm text-secondary font-semibold" onClick={() => setIsOpen(false)}>For Professionals (Join Now)</Link>

          {user && (
            <div className="pt-3 border-t border-[#1F2E54] space-y-2">
              {user.role === 'customer' && (
                <Link to="/customer/dashboard" className="block py-1.5 text-sm text-white" onClick={() => setIsOpen(false)}>My Bookings</Link>
              )}
              {user.role === 'karigar' && (
                <Link to="/karigar" className="block py-1.5 text-sm text-white" onClick={() => setIsOpen(false)}>Karigar Portal</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="block py-1.5 text-sm text-white" onClick={() => setIsOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="block py-1.5 text-sm text-red-400">Log Out</button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
