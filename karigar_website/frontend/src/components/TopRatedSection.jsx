import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, ShieldCheck, Heart, MapPin, ArrowRight, Expand, Crown, Headphones, Zap, Shield } from 'lucide-react'
import api from '../config/api'
import { useCity } from '../context/CityContext'
import { CITY_COORDINATES } from '../config/site'
import RatingBadge from './RatingBadge'
import MapView from './MapView'

export default function TopRatedSection() {
  const { selectedCity, setSelectedCity } = useCity()
  const [activeCity, setActiveCity] = useState(selectedCity || 'Lahore')
  const [activeDiscoveryTab, setActiveDiscoveryTab] = useState('Visual Grid')
  const [apiKarigars, setApiKarigars] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState({})
  const navigate = useNavigate()

  const showcaseCities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad']

  // Keep active city synced with global city context
  useEffect(() => {
    if (selectedCity && showcaseCities.includes(selectedCity)) {
      setActiveCity(selectedCity)
    }
  }, [selectedCity])

  const handleCityChange = (cityName) => {
    setActiveCity(cityName)
    setSelectedCity(cityName)
  }

  const toggleFavorite = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Fetch real karigars from GET /api/karigars
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    api.get('/karigars')
      .then((res) => {
        if (!isMounted) return
        if (Array.isArray(res.data)) {
          setApiKarigars(res.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.warn('API karigars fetch error:', err)
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Filter ONLY real karigars for the active city (case-insensitive substring)
  // If activeCity is 'All' or 'All Cities', show all real karigars
  const displayKarigars = apiKarigars.filter((k) => {
    if (!k) return false
    if (!activeCity || activeCity === 'All Cities' || activeCity === 'All') return true
    const kCity = (k.city || '').toLowerCase()
    return kCity.includes(activeCity.toLowerCase())
  }).slice(0, 3)

  // Real map markers from verified database records
  const mapCenter = CITY_COORDINATES[activeCity] || CITY_COORDINATES['Lahore']
  const mapMarkers = displayKarigars
    .filter((k) => k && k.lat && k.lng)
    .map((k) => ({
      id: k._id,
      name: k.fullName || 'Professional',
      service: Array.isArray(k.services) && k.services.length > 0 ? k.services.join(', ') : (k.service || 'Service'),
      price: k.hourlyRate || 500,
      lat: k.lat,
      lng: k.lng
    }))

  return (
    <section className="py-5 sm:py-7 bg-[#F5F7FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Discovery Hub Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h3 className="font-poppins text-lg sm:text-xl font-extrabold text-[#0A1F44]">
              Discovery Hub
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { name: 'Explore Areas', to: '/find-karigar' },
                { name: 'Visual Grid', active: true },
                { name: 'Local Radar', to: '/find-karigar?view=map' },
                { name: 'Smart Compare', to: '/services' }
              ].map((tab) => {
                const isSelected = activeDiscoveryTab === tab.name
                return (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => {
                      setActiveDiscoveryTab(tab.name)
                      if (tab.to) navigate(tab.to)
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A1F44] text-white shadow-xs'
                        : 'bg-[#E2E8F0]/70 text-[#5A6B84] hover:bg-[#CBD5E1] hover:text-[#0A1F44]'
                    }`}
                  >
                    {tab.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Top-rated near you Row with Dynamic City Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00]">
              <Star size={15} className="fill-[#FF7A00] text-[#FF7A00]" />
            </div>
            <h2 className="font-poppins text-lg sm:text-xl font-extrabold text-[#0A1F44] tracking-tight">
              Top-rated near you
            </h2>
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {showcaseCities.map((city) => {
              const isSelected = activeCity === city
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCityChange(city)}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#0A1F44] text-white shadow-xs'
                      : 'bg-white text-[#5A6B84] hover:text-[#0A1F44] border border-[#E4EAF2] hover:border-gray-300'
                  }`}
                >
                  <MapPin size={12} className={isSelected ? 'text-[#FF7A00]' : 'text-gray-400'} />
                  <span>{city}</span>
                </button>
              )
            })}

            <Link
              to={`/find-karigar?city=${encodeURIComponent(activeCity)}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#FF7A00] hover:text-[#F06400] transition-colors ml-1.5"
            >
              <span>View all</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Dynamic Cards Grid: Shows ONLY real karigars (0 to 3) + Map Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
          
          {/* If 0 real karigars exist for this city: Honest Empty State */}
          {displayKarigars.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white rounded-2xl border border-[#E4EAF2] p-8 text-center flex flex-col items-center justify-center min-h-[260px] shadow-xs">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF7A00] flex items-center justify-center mb-3">
                <MapPin size={22} />
              </div>
              <h3 className="font-poppins font-bold text-[#0A1F44] text-base mb-1">
                No verified professionals in {activeCity} yet
              </h3>
              <p className="text-xs text-[#5A6B84] max-w-sm mb-4 leading-relaxed">
                Be the first skilled service professional to join our verified directory in {activeCity} and start receiving client requests.
              </p>
              <Link
                to="/join-karigar"
                className="inline-flex items-center gap-1.5 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors shadow-sm"
              >
                <span>Join as a Pro</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            /* Show ONLY real karigars from database (if 1 show 1, if 2 show 2, if 3 show 3) */
            displayKarigars.map((k) => {
              const isFav = !!favorites[k._id]
              const isVerified = k.verificationStatus === 'approved'
              const serviceLabel = Array.isArray(k.services) && k.services.length > 0 ? k.services[0] : (k.service || 'Professional')
              const photo = k.profilePhoto || '/assets/images/karigar_polo_portrait.jpg'

              return (
                <div
                  key={k._id}
                  className="bg-white rounded-2xl border border-[#E4EAF2] overflow-hidden shadow-[0_4px_16px_rgba(10,31,68,0.05)] hover:shadow-[0_10px_28px_rgba(10,31,68,0.09)] hover:border-[#FF7A00]/40 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Photo with Verified Badge and Heart Button */}
                    <div className="relative h-36 sm:h-40 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={photo}
                        alt={k.fullName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/assets/images/karigar_polo_portrait.jpg'
                        }}
                      />

                      {/* Verified Badge */}
                      {isVerified && (
                        <div className="absolute top-2.5 left-2.5 bg-[#0A1F44]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <ShieldCheck size={12} className="text-[#22C55E]" />
                          <span>Verified</span>
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(k._id, e)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-500 hover:text-red-500 shadow-xs transition-transform active:scale-90 cursor-pointer"
                        aria-label="Add to favorites"
                      >
                        <Heart size={14} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 pb-2">
                      <h3 className="font-poppins font-bold text-[#0A1F44] text-[15px] leading-snug truncate group-hover:text-[#FF7A00] transition-colors">
                        {k.fullName}
                      </h3>

                      {/* Rating & Review Count (Honest Rating Badge) */}
                      <div className="mt-1 mb-1.5 flex items-center justify-between">
                        <RatingBadge rating={k.rating} reviewsCount={k.reviewsCount} size="sm" />
                        <div className="text-right">
                          <span className="text-[10px] text-[#5A6B84] block leading-none">Starting from</span>
                          <span className="text-xs font-extrabold text-[#0A1F44]">PKR {k.hourlyRate || 500}</span>
                        </div>
                      </div>

                      {/* Location with Pin */}
                      <div className="flex items-center gap-1 text-[11px] text-[#5A6B84] truncate">
                        <MapPin size={12} className="text-[#FF7A00] flex-shrink-0" />
                        <span className="truncate">{k.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Solid Orange Book Now Button */}
                  <div className="p-3.5 pt-1.5">
                    <Link
                      to={`/book?karigarId=${k._id}&service=${encodeURIComponent(serviceLabel)}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2 px-3 rounded-xl text-xs shadow-xs transition-all hover:scale-[1.01]"
                    >
                      <span>Book Now</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )
            })
          )}

          {/* Map Card for Selected City with Interactive Map */}
          <div className={`bg-white rounded-2xl border border-[#E4EAF2] overflow-hidden shadow-[0_4px_16px_rgba(10,31,68,0.05)] relative min-h-[260px] sm:min-h-[290px] flex flex-col group ${
            displayKarigars.length === 2 ? 'col-span-1 sm:col-span-2 lg:col-span-2' : 
            displayKarigars.length === 1 ? 'col-span-1 sm:col-span-1 lg:col-span-3' : 
            'col-span-1 sm:col-span-2 lg:col-span-1'
          }`}>
            {/* Interactive Leaflet Map for Active City */}
            <div className="absolute inset-0 z-0">
              <MapView
                city={activeCity}
                markers={mapMarkers}
                zoom={12}
                height="100%"
                className="w-full h-full"
              />
            </div>

            {/* City Explorer Pill Overlay */}
            <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 shadow-md border border-[#E4EAF2] flex items-center justify-between pointer-events-auto">
                <div className="min-w-0 pr-2">
                  <h4 className="font-poppins font-extrabold text-[#0A1F44] text-xs sm:text-sm truncate">
                    {activeCity}
                  </h4>
                  <p className="text-[10px] text-[#5A6B84] truncate">
                    Explore verified pros in {activeCity}
                  </p>
                </div>
                <Link
                  to={`/find-karigar?city=${encodeURIComponent(activeCity)}&view=map`}
                  className="w-6 h-6 rounded-full bg-[#0A1F44] text-white flex items-center justify-center hover:bg-[#FF7A00] transition-colors flex-shrink-0"
                  title="Explore city on map"
                >
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Bottom Google / Map Label & Expand Button */}
            <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
              <span className="text-[10px] font-bold text-gray-500 bg-white/80 px-2 py-0.5 rounded shadow-xs">
                Google
              </span>
              <Link
                to={`/find-karigar?city=${encodeURIComponent(activeCity)}&view=map`}
                className="w-7 h-7 rounded-full bg-white text-[#0A1F44] hover:text-[#FF7A00] flex items-center justify-center shadow-md border border-gray-200 pointer-events-auto transition-transform hover:scale-105"
                title="Expand map view"
              >
                <Expand size={13} />
              </Link>
            </div>
          </div>

        </div>

        {/* Feature / Value Proposition Bar Directly Below Cards */}
        <div className="bg-white rounded-2xl border border-[#E4EAF2] p-3 sm:p-4 shadow-[0_4px_20px_rgba(10,31,68,0.04)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* 4 Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 flex-1">
            <div className="flex items-center gap-2.5 pr-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Shield size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0A1F44] leading-tight">100% Verified</p>
                <p className="text-[10px] text-[#5A6B84] leading-tight">Professionals</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:px-3 pt-2 sm:pt-0">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Zap size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0A1F44] leading-tight">Instant Booking</p>
                <p className="text-[10px] text-[#5A6B84] leading-tight">& Support</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:px-3 pt-2 sm:pt-0">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Headphones size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0A1F44] leading-tight">24/7 Customer</p>
                <p className="text-[10px] text-[#5A6B84] leading-tight">Support</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:pl-3 pt-2 sm:pt-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0A1F44] leading-tight">Secure Payments</p>
                <p className="text-[10px] text-[#5A6B84] leading-tight">& Safe Transactions</p>
              </div>
            </div>
          </div>

          {/* Join as Pro Callout Banner */}
          <div className="bg-[#0A1F44] text-white rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FF7A00]/20 text-[#FF7A00] flex items-center justify-center">
                <Crown size={15} />
              </div>
              <div>
                <p className="text-xs font-extrabold leading-tight">Be a Professional on KarigarPK</p>
                <p className="text-[10px] text-gray-300 leading-tight">Grow your business, get more customers.</p>
              </div>
            </div>
            <Link
              to="/join-karigar"
              className="inline-flex items-center gap-1 bg-[#FF7A00] hover:bg-[#F06400] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <span>Join Now</span>
              <ArrowRight size={12} />
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}
