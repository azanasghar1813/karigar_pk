import { useState, useEffect } from 'react'
import api from '../config/api'
import { useSearchParams, Link } from 'react-router-dom'
import { Star, MapPin, ShieldCheck, ArrowRight, Search, SlidersHorizontal, Map, Grid, CheckCircle2, Heart } from 'lucide-react'
import { CITIES, SERVICES } from '../config/site'

export default function FindKarigar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialService = searchParams.get('service') || 'All'
  const initialCity = searchParams.get('city') || 'All Cities'
  const initialView = searchParams.get('view') || 'grid'

  const [karigars, setKarigars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState(initialView) // 'grid' or 'map'
  const [selectedMapKarigar, setSelectedMapKarigar] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    service: initialService,
    city: initialCity,
    minRating: 0,
    sortBy: 'rating'
  })

  const servicesList = ['All Categories', ...SERVICES]
  const citiesList = ['All Cities', ...CITIES]

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
        if (filters.service && filters.service !== 'All' && filters.service !== 'All Categories') {
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A1930]">
      
      {/* Top Search & Filter Bar (matching Panel 5 "Explore on Map") */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Inputs Row */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
            
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search on map..."
                className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-[#0A1930] placeholder-gray-400 focus:outline-none focus:border-[#FF8A00] focus:bg-white"
              />
            </div>

            {/* Category Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={filters.service}
                onChange={(e) => handleFilterChange('service', e.target.value)}
                className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white cursor-pointer"
              >
                {servicesList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white cursor-pointer"
              >
                {citiesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="price">Lowest Rate</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle (Grid vs Map) */}
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-gray-200 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0A1930] shadow-sm'
                  : 'text-gray-500 hover:text-[#0A1930]'
              }`}
            >
              <Grid size={14} /> Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-[#0A1930] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#0A1930]'
              }`}
            >
              <Map size={14} /> Map
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* MAP VIEW MODE (matching reference image Panel 5) */}
        {viewMode === 'map' ? (
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl relative min-h-[580px] flex flex-col justify-end">
            
            {/* Map Visual */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
                alt="Interactive Map Overview"
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute inset-0 bg-[#0A1930]/15" />

              {/* Pins on map */}
              <div className="absolute top-1/4 left-1/3">
                <button
                  type="button"
                  onClick={() => setSelectedMapKarigar(karigars[0] || null)}
                  className="bg-[#FF8A00] text-white p-2.5 rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                  <MapPin size={20} />
                </button>
              </div>

              <div className="absolute top-1/3 left-1/2">
                <button
                  type="button"
                  onClick={() => setSelectedMapKarigar(karigars[1] || null)}
                  className="bg-[#0A1930] text-white p-2.5 rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                  <MapPin size={20} />
                </button>
              </div>

              <div className="absolute top-1/2 left-2/3">
                <button
                  type="button"
                  onClick={() => setSelectedMapKarigar(karigars[2] || null)}
                  className="bg-[#FF8A00] text-white p-2.5 rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                  <MapPin size={20} />
                </button>
              </div>
            </div>

            {/* Floating Top Pill */}
            <div className="relative z-10 m-4 flex items-center justify-between pointer-events-none">
              <span className="bg-white/95 backdrop-blur-md border border-gray-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#0A1930] pointer-events-auto shadow-sm">
                📍 Showing verified pros in {filters.city}
              </span>
            </div>

            {/* Floating Worker Preview Card (from reference image) */}
            {selectedMapKarigar ? (
              <div className="relative z-10 m-4 sm:m-6 max-w-sm bg-white border border-gray-200 rounded-2xl p-4 shadow-2xl flex items-center gap-3.5">
                <img
                  src={selectedMapKarigar.profilePhoto || '/assets/images/electrician_work.jpg'}
                  alt={selectedMapKarigar.fullName}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-poppins font-bold text-[#0A1930] text-sm truncate">
                      {selectedMapKarigar.fullName}
                    </h3>
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-yellow-500 mt-0.5">
                    <Star size={13} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-[#0A1930]">{selectedMapKarigar.rating ? selectedMapKarigar.rating.toFixed(1) : '4.9'}</span>
                    <span className="text-gray-400">({selectedMapKarigar.reviewsCount || '2.8k'})</span>
                  </div>
                  <p className="text-[#FF8A00] font-black text-xs mt-1">
                    PKR {selectedMapKarigar.hourlyRate || 500}+
                  </p>
                </div>
                <Link
                  to={`/worker/${selectedMapKarigar._id}`}
                  className="bg-[#FF8A00] hover:bg-[#E67A00] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all whitespace-nowrap shadow-sm"
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
                  <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 animate-pulse">
                    <div className="h-44 bg-gray-100 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/3"></div>
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
                      className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden hover:border-[#FF8A00]/50 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Header with Verified badge */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                          <img
                            src={cardImage}
                            alt={karigar.fullName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Verified Badge */}
                          <div className="absolute top-3 left-3 bg-[#0A1930] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <CheckCircle2 size={13} className="text-[#FF8A00]" />
                            <span>Verified</span>
                          </div>

                          {/* Heart */}
                          <button
                            type="button"
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                          >
                            <Heart size={14} />
                          </button>
                        </div>

                        {/* Body */}
                        <div className="p-5">
                          <h3 className="font-poppins font-bold text-[#0A1930] text-base mb-1 group-hover:text-[#FF8A00] transition-colors truncate">
                            {karigar.fullName}
                          </h3>

                          <div className="flex items-center gap-1.5 text-xs mb-2">
                            <Star size={13} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-[#0A1930]">{karigar.rating ? karigar.rating.toFixed(1) : '4.9'}</span>
                            <span className="text-gray-400">({karigar.reviewsCount || '1.8k'})</span>
                          </div>

                          <p className="text-gray-500 text-xs flex items-center gap-1 mb-4">
                            <MapPin size={12} className="text-[#FF8A00] flex-shrink-0" />
                            <span className="truncate">{karigar.city || 'Karachi'}, Pakistan</span>
                          </p>

                          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                            <span className="text-xs text-gray-500">Starting from</span>
                            <span className="text-sm font-bold text-[#0A1930]">PKR {karigar.hourlyRate || 500}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Button */}
                      <div className="px-5 pb-5 pt-0">
                        <Link
                          to={`/worker/${karigar._id}`}
                          className="w-full inline-flex items-center justify-center gap-1 bg-white hover:bg-gray-50 border border-gray-200 text-[#0A1930] text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
                        >
                          <span>View Profile</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center max-w-md mx-auto shadow-sm">
                <Search size={36} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-base font-bold text-[#0A1930] mb-1">No Karigars Found</h3>
                <p className="text-gray-500 text-xs mb-4">
                  Try adjusting your filters or search query to find available professionals.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ service: 'All Categories', city: 'All Cities', minRating: 0, sortBy: 'rating' })
                    setSearchQuery('')
                  }}
                  className="bg-[#FF8A00] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#E67A00] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
