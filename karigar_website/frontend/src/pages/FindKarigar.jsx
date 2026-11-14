import { useState, useEffect } from 'react'
import api from '../config/api'
import { useSearchParams, Link } from 'react-router-dom'
import { Star, MapPin, ShieldCheck, ArrowRight, PhoneCall, Search, SlidersHorizontal, Map, Grid, CheckCircle2, Heart } from 'lucide-react'
import { CITIES, SERVICES } from '../config/site'

export default function FindKarigar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialService = searchParams.get('service') || 'All'
  const initialCity = searchParams.get('city') || 'All Cities'

  const [karigars, setKarigars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'map'
  const [selectedMapKarigar, setSelectedMapKarigar] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    service: initialService,
    city: initialCity,
    minRating: 0,
    sortBy: 'rating'
  })

  const servicesList = ['All', ...SERVICES]
  const citiesList = ['All Cities', ...CITIES]

  // Pakistani service images fallback
  const serviceImages = {
    Electrician: '/assets/images/electrician_work.jpg',
    Plumber: '/assets/images/plumber_sink.jpg',
    'AC Repair': '/assets/images/ac_technician.jpg',
    Carpenter: '/assets/images/karigar_drill_portrait.jpg'
  }

  useEffect(() => {
    const fetchKarigars = async () => {
      setIsLoading(true)
      try {
        const params = {}
        if (filters.service && filters.service !== 'All') {
          params.service = filters.service
        }
        if (filters.city && filters.city !== 'All Cities' && filters.city !== 'Your City') {
          params.city = filters.city
        }

        const { data } = await api.get('/karigars', { params })
        
        let filtered = Array.isArray(data) ? data.filter(k => (k.rating || 0) >= filters.minRating) : []

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          filtered = filtered.filter(k => 
            k.fullName?.toLowerCase().includes(q) ||
            (Array.isArray(k.services) && k.services.some(s => s.toLowerCase().includes(q))) ||
            k.city?.toLowerCase().includes(q)
          )
        }

        if (filters.sortBy === 'rating') {
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        } else if (filters.sortBy === 'price') {
          filtered.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0))
        }

        setKarigars(filtered)
        if (filtered.length > 0) {
          setSelectedMapKarigar(filtered[0])
        }
      } catch (err) {
        console.error('Failed to fetch karigars:', err)
        setKarigars([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchKarigars()
  }, [filters, searchQuery])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-[#0B1329] text-white">
      {/* Search & Filter Header (matching Image 2 "Explore on Map") */}
      <div className="bg-[#131F3D] border-b border-gray-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-white">
                Find Local Businesses & Pros
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                Browse verified service providers and local workshops across Pakistan
              </p>
            </div>

            {/* View Mode Switcher (Grid vs Map) */}
            <div className="flex items-center bg-[#0B1329] p-1 rounded-xl border border-gray-800 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid size={15} /> Grid View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'map'
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Map size={15} /> Explore on Map
              </button>
            </div>
          </div>

          {/* Search Inputs Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#0B1329] p-2 sm:p-2.5 rounded-2xl border border-gray-800">
            {/* Search Query Input */}
            <div className="sm:col-span-5 relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What service are you looking for?"
                className="w-full bg-[#131F3D] border border-gray-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            {/* City Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full bg-[#131F3D] border border-gray-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00]"
              >
                {citiesList.map(c => (
                  <option key={c} value={c} className="bg-[#0B1329] text-white">{c}</option>
                ))}
              </select>
            </div>

            {/* Service Category Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={filters.service}
                onChange={(e) => handleFilterChange('service', e.target.value)}
                className="w-full bg-[#131F3D] border border-gray-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00]"
              >
                {servicesList.map(s => (
                  <option key={s} value={s} className="bg-[#0B1329] text-white">{s}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full bg-[#131F3D] border border-gray-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00]"
              >
                <option value="rating" className="bg-[#0B1329] text-white">Top Rated</option>
                <option value="price" className="bg-[#0B1329] text-white">Lowest Rate</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* MAP VIEW MODE (matching Image 2 "Explore on Map") */}
        {viewMode === 'map' ? (
          <div className="bg-[#131F3D] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col justify-end">
            {/* Interactive Map Visual */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
                alt="Interactive Map Overview"
                className="w-full h-full object-cover filter brightness-[0.7] contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1329] via-[#0B1329]/40 to-transparent"></div>

              {/* Pins on map */}
              <div className="absolute top-1/4 left-1/3">
                <button
                  type="button"
                  onClick={() => setSelectedMapKarigar(karigars[0] || null)}
                  className="bg-[#FF6B00] text-white p-2.5 rounded-full shadow-2xl animate-pulse hover:scale-110 transition-transform"
                >
                  <MapPin size={22} />
                </button>
              </div>

              <div className="absolute top-1/3 left-1/2">
                <button
                  type="button"
                  onClick={() => setSelectedMapKarigar(karigars[1] || null)}
                  className="bg-[#FF6B00] text-white p-2.5 rounded-full shadow-2xl hover:scale-110 transition-transform"
                >
                  <MapPin size={22} />
                </button>
              </div>

              <div className="absolute top-1/2 left-2/3">
                <button
                  type="button"
                  onClick={() => setSelectedMapKarigar(karigars[2] || null)}
                  className="bg-emerald-500 text-white p-2.5 rounded-full shadow-2xl hover:scale-110 transition-transform"
                >
                  <MapPin size={22} />
                </button>
              </div>
            </div>

            {/* Floating Top Bar on Map */}
            <div className="relative z-10 m-4 sm:m-6 flex items-center justify-between pointer-events-none">
              <span className="bg-[#0B1329]/90 backdrop-blur-md border border-gray-800 px-4 py-2 rounded-xl text-xs font-semibold text-white pointer-events-auto">
                📍 Showing Pros in {filters.city}
              </span>
            </div>

            {/* Floating Worker Preview Card at bottom (matching Image 2) */}
            {selectedMapKarigar ? (
              <div className="relative z-10 m-4 sm:m-6 max-w-md bg-[#131F3D]/95 backdrop-blur-lg border border-gray-700 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
                <img
                  src={selectedMapKarigar.profilePhoto || '/assets/images/electrician_work.jpg'}
                  alt={selectedMapKarigar.fullName}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[#FF6B00] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-poppins font-bold text-white text-sm truncate">
                      {selectedMapKarigar.fullName}
                    </h3>
                    <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-yellow-400 mt-0.5">
                    <Star size={13} className="fill-yellow-400" />
                    <span className="font-bold">{selectedMapKarigar.rating ? selectedMapKarigar.rating.toFixed(1) : '4.9'}</span>
                    <span className="text-gray-400">({selectedMapKarigar.reviewsCount || '2.8k'})</span>
                  </div>
                  <p className="text-[#FF6B00] font-black text-xs mt-1">
                    PKR {selectedMapKarigar.hourlyRate || 500}+
                  </p>
                </div>
                <Link
                  to={`/worker/${selectedMapKarigar._id}`}
                  className="bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all whitespace-nowrap shadow-md"
                >
                  View Profile →
                </Link>
              </div>
            ) : null}
          </div>
        ) : (
          /* GRID VIEW MODE */
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-[#131F3D] border border-gray-800 rounded-2xl p-4 animate-pulse">
                    <div className="h-44 bg-gray-800 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-800 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : karigars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {karigars.map((karigar, index) => {
                  const primaryService = Array.isArray(karigar.services) && karigar.services.length > 0
                    ? karigar.services[0]
                    : (typeof karigar.services === 'string' ? karigar.services : 'Verified Pro')

                  const cardImage = karigar.profilePhoto && !karigar.profilePhoto.includes('document') && !karigar.profilePhoto.includes('placeholder')
                    ? karigar.profilePhoto
                    : (serviceImages[primaryService] || '/assets/images/electrician_work.jpg')

                  return (
                    <div
                      key={karigar._id || index}
                      className="bg-[#131F3D] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all shadow-lg hover:shadow-2xl flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Header with Verified badge & Favorite icon */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                          <img
                            src={cardImage}
                            alt={karigar.fullName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#131F3D] via-transparent to-transparent"></div>

                          {/* Verified Badge */}
                          <div className="absolute top-3 left-3 bg-[#0B1329]/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                            <CheckCircle2 size={13} className="text-emerald-400" />
                            <span>Verified</span>
                          </div>

                          {/* Heart */}
                          <button
                            type="button"
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-[#0B1329]/70 backdrop-blur-md text-white hover:text-[#FF6B00] transition-colors border border-white/10"
                          >
                            <Heart size={15} />
                          </button>
                        </div>

                        {/* Body */}
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h3 className="font-poppins font-bold text-white text-base leading-snug group-hover:text-[#FF6B00] transition-colors truncate">
                              {karigar.fullName}
                            </h3>
                          </div>

                          <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
                            <MapPin size={13} className="text-[#FF6B00] flex-shrink-0" />
                            <span className="truncate">{karigar.city || 'Karachi'}, Pakistan</span>
                          </p>

                          <div className="flex items-center justify-between border-t border-gray-800/80 pt-3">
                            <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                              <Star size={14} className="fill-yellow-400" />
                              <span>{karigar.rating ? karigar.rating.toFixed(1) : '4.9'}</span>
                              <span className="text-gray-400 font-normal">({karigar.reviewsCount || '1.8k'})</span>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] text-gray-400 block leading-tight">Starting from</span>
                              <span className="text-sm font-bold text-[#FF6B00]">PKR {karigar.hourlyRate || 500}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-5 pb-5 pt-0">
                        <Link
                          to={`/worker/${karigar._id}`}
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0B1329] hover:bg-gray-800 border border-gray-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-all group-hover:border-[#FF6B00]"
                        >
                          <span>View Profile</span>
                          <ArrowRight size={14} className="text-[#FF6B00]" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-[#131F3D] border border-gray-800 rounded-3xl p-10 text-center max-w-md mx-auto">
                <Search size={40} className="mx-auto text-gray-500 mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Karigars Found</h3>
                <p className="text-gray-400 text-xs mb-5">
                  Try adjusting your filters or search terms to find available professionals.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ service: 'All', city: 'All Cities', minRating: 0, sortBy: 'rating' })
                    setSearchQuery('')
                  }}
                  className="bg-[#FF6B00] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
