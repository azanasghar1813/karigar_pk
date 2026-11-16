import { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, User, ChevronDown, LayoutDashboard, CalendarCheck, MapPin, Search, ArrowRight } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { useCity } from '../context/CityContext'
import BrandLogo from './BrandLogo'
import { SERVICES_CONFIG } from '../config/site'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)
  const cityRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)
  const { selectedCity, setSelectedCity, cities } = useCity()

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName)
    setCityDropdownOpen(false)
    if (location.pathname === '/find-karigar') {
      navigate(`/find-karigar?city=${encodeURIComponent(cityName)}`)
    }
  }

  const handleLogout = () => {
    logout()
    setUserDropdownOpen(false)
    navigate('/')
  }

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false)
      }
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-[#0A1F44] border-b border-white/10 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[66px] flex items-center justify-between">
        
        {/* Brand Logo Left using /logo.png */}
        <div className="flex-shrink-0">
          <BrandLogo variant="dark" size="md" />
        </div>

        {/* Desktop Navigation Links (Centered) */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-[14px] font-medium">
          <Link 
            to="/" 
            className={`px-4 py-1.5 rounded-full transition-all duration-150 ${
              location.pathname === '/' 
                ? 'bg-white/15 text-white font-bold shadow-sm' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>

          {/* Explore Dropdown */}
          <div className="relative group">
            <button 
              type="button"
              className="flex items-center gap-1 px-3.5 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <span>Explore</span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-white group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-52 bg-[#061530] border border-white/10 rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
              type="button"
              className="flex items-center gap-1 px-3.5 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <span>Services</span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-white group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-56 bg-[#061530] border border-white/10 rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {SERVICES_CONFIG.slice(0, 7).map((s) => (
                <Link
                  key={s.id}
                  to={`/find-karigar?service=${encodeURIComponent(s.searchKey)}`}
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white"
                >
                  {s.name}
                </Link>
              ))}
              <div className="border-t border-white/10 my-1" />
              <Link to="/services" className="block px-4 py-2 text-sm text-[#FF7A00] font-semibold hover:bg-white/10">
                View All Services →
              </Link>
            </div>
          </div>

          <Link 
            to="/how-it-works" 
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              location.pathname === '/how-it-works' 
                ? 'bg-white/15 text-white font-bold' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            How it Works
          </Link>

          <Link 
            to="/join-karigar" 
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              location.pathname === '/join-karigar' 
                ? 'bg-white/15 text-white font-bold' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            For Professionals
          </Link>
        </div>

        {/* Right Side Actions: Location Pill + Search + Log in / Account + Join as a Pro */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Location Selector Pill */}
          <div className="relative" ref={cityRef}>
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-full border border-white/10 transition-all cursor-pointer shadow-sm"
            >
              <MapPin size={14} className="text-[#FF7A00]" />
              <span className="max-w-[130px] truncate">{selectedCity}, Pakistan</span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {cityDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#061530] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Select Launch City
                </div>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCity === city
                        ? 'bg-[#FF7A00] text-white font-bold'
                        : 'text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Icon */}
          <Link
            to="/find-karigar"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            title="Search Karigars"
            aria-label="Search Karigars"
          >
            <Search size={16} />
          </Link>

          {/* Log in / User menu */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 py-1.5 px-3 rounded-full border border-white/10 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF7A00] text-white flex items-center justify-center text-xs font-black">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold max-w-[90px] truncate">{user.name || 'Account'}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#061530] border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <span className="inline-block text-[10px] font-bold bg-[#FF7A00]/20 text-[#FF7A00] px-2 py-0.5 rounded-full mt-1">
                      {user.role === 'karigar' ? 'Professional' : user.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </div>

                  {user.role === 'admin' ? (
                    <Link to="/admin" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-white/10">
                      <LayoutDashboard size={14} /> Admin Portal
                    </Link>
                  ) : user.role === 'karigar' ? (
                    <Link to="/karigar" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-white/10">
                      <LayoutDashboard size={14} /> Karigar Portal
                    </Link>
                  ) : (
                    <Link to="/dashboard" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-white/10">
                      <LayoutDashboard size={14} /> My Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/10 border-t border-white/10 mt-1 cursor-pointer"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white hover:text-[#FF7A00] font-semibold text-xs sm:text-sm px-3 py-1.5 transition-colors"
            >
              Log in
            </Link>
          )}

          {/* Orange Join as a Pro Button */}
          <Link
            to="/register-karigar"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shadow-md shadow-orange-500/25 hover:scale-[1.02]"
          >
            <span>Join as a Pro</span>
            <ArrowRight size={14} />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#061530] border-t border-white/10 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 px-3 rounded-xl text-sm font-semibold hover:bg-white/10"
          >
            Home
          </Link>
          <Link
            to="/find-karigar"
            onClick={() => setIsOpen(false)}
            className="block py-2 px-3 rounded-xl text-sm font-semibold hover:bg-white/10"
          >
            Explore Karigars
          </Link>
          <Link
            to="/services"
            onClick={() => setIsOpen(false)}
            className="block py-2 px-3 rounded-xl text-sm font-semibold hover:bg-white/10"
          >
            All Services
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setIsOpen(false)}
            className="block py-2 px-3 rounded-xl text-sm font-semibold hover:bg-white/10"
          >
            How it Works
          </Link>
          <Link
            to="/join-karigar"
            onClick={() => setIsOpen(false)}
            className="block py-2 px-3 rounded-xl text-sm font-semibold hover:bg-white/10"
          >
            For Professionals
          </Link>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {!user && (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-white/20 text-white font-semibold text-sm"
              >
                Log In
              </Link>
            )}
            <Link
              to="/register-karigar"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold text-sm"
            >
              Join as a Professional →
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
