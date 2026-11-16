import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, MapPin, ShieldCheck, ArrowRight, Star, Heart, SlidersHorizontal, Map, Grid, CheckCircle2, ChevronDown, RotateCcw } from 'lucide-react'
import api from '../config/api'
import { CITIES, SERVICES_CONFIG, CITY_AREAS } from '../config/site'
import { useCity } from '../context/CityContext'
import RatingBadge from '../components/RatingBadge'
import UserAvatar from '../components/UserAvatar'
import MapView from '../components/MapView'

export default function FindKarigar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedCity, setSelectedCity } = useCity()

  const initialService = searchParams.get('service') || 'All'
  const initialCity = searchParams.get('city') || selectedCity || 'All Cities'
  const initialView = searchParams.get('view') || 'split'

  const [karigars, setKarigars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState(initialView) // 'split', 'grid', 'map'
  const [selectedKarigarId, setSelectedKarigarId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState({})
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const [filterCity, setFilterCity] = useState(initialCity === 'All' ? 'All Cities' : initialCity)
  const [filterArea, setFilterArea] = useState('All Areas')
  const [filterCategory, setFilterCategory] = useState(initialService)
  const [sortBy, setSortBy] = useState('rating') // 'rating', 'price_asc', 'reviews'

  // Sync city with global context if valid city
  useEffect(() => {
    if (filterCity && filterCity !== 'All Cities' && CITIES.includes(filterCity)) {
      setSelectedCity(filterCity)
    }
  }, [filterCity, setSelectedCity])

  // Get available areas for chosen city
  const availableAreas = useMemo(() => {
    if (!filterCity || filterCity === 'All Cities') {
      return ['All Areas']
    }
    return CITY_AREAS[filterCity] || ['All Areas']
  }, [filterCity])

  // Reset area when city changes if previous area not in new city
  useEffect(() => {
    if (!availableAreas.includes(filterArea)) {
      setFilterArea('All Areas')
    }
  }, [availableAreas, filterArea])

  // Fetch Karigars from backend API
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    api.get('/karigars')
      .then((res) => {
        if (!isMounted) return
        const data = Array.isArray(res.data) ? res.data : []
        setKarigars(data)
        if (data.length > 0) {
          setSelectedKarigarId(data[0]._id)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.warn('API Error fetching karigars:', err)
        setKarigars([])
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Filter and Sort Karigars
  const filteredKarigars = useMemo(() => {
    return karigars.filter((k) => {
      // Verified only filter
      if (verifiedOnly && k.verificationStatus !== 'approved') {
        return false
      }

      // City filter
      if (filterCity && filterCity !== 'All Cities') {
        const kCity = (k.city || '').toLowerCase()
        if (!kCity.includes(filterCity.toLowerCase())) {
          return false
        }
      }

      // Area filter
      if (filterArea && filterArea !== 'All Areas') {
        const kAddress = ((k.address || '') + ' ' + (k.city || '')).toLowerCase()
        if (!kAddress.includes(filterArea.toLowerCase())) {
          return false
        }
      }

      // Category filter
      if (filterCategory && filterCategory !== 'All' && filterCategory !== 'All Categories') {
        const kServices = Array.isArray(k.services) ? k.services.map((s) => s.toLowerCase()) : [(k.services || '').toLowerCase()]
        const target = filterCategory.toLowerCase()
        const matches = kServices.some((s) => s.includes(target) || target.includes(s))
        if (!matches) return false
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = (k.fullName || '').toLowerCase().includes(q)
        const cityMatch = (k.city || '').toLowerCase().includes(q)
        const serviceMatch = Array.isArray(k.services)
          ? k.services.some((s) => s.toLowerCase().includes(q))
          : (k.services || '').toLowerCase().includes(q)
        if (!nameMatch && !cityMatch && !serviceMatch) {
          return false
        }
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'price_asc') {
        return (a.hourlyRate || 0) - (b.hourlyRate || 0)
      }
      if (sortBy === 'reviews') {
        return (b.reviewsCount || 0) - (a.reviewsCount || 0)
      }
      // default: rating descending
      return (b.rating || 0) - (a.rating || 0)
    })
  }, [karigars, verifiedOnly, filterCity, filterArea, filterCategory, searchQuery, sortBy])

  const toggleFavorite = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilterCity('All Cities')
    setFilterArea('All Areas')
    setFilterCategory('All')
    setVerifiedOnly(false)
    setSortBy('rating')
  }

  // Selected karigar for map popup
  const activeKarigar = useMemo(() => {
    return filteredKarigars.find((k) => k._id === selectedKarigarId) || filteredKarigars[0] || null
  }, [filteredKarigars, selectedKarigarId])

  // Map markers
  const mapCity = filterCity !== 'All Cities' ? filterCity : 'Karachi'
  const mapMarkers = useMemo(() => {
    return filteredKarigars.map((k, idx) => ({
      id: k._id,
      name: k.fullName || 'Verified Karigar',
      service: Array.isArray(k.services) ? k.services.join(', ') : k.services || 'Professional Service',
      price: k.hourlyRate || 500,
      lat: k.lat || (mapCity === 'Lahore' ? 31.5204 + (idx * 0.012 - 0.008) : 24.8607 + (idx * 0.012 - 0.008)),
      lng: k.lng || (mapCity === 'Lahore' ? 74.3587 + (idx * 0.012 - 0.008) : 67.0011 + (idx * 0.012 - 0.008))
    }))
  }, [filteredKarigars, mapCity])

  const formatLocation = (k) => {
    const rawCity = k.city || ''
    if (!rawCity || rawCity.length < 3 || /dnsmss|sjsk|test|asdf/i.test(rawCity)) {
      return `${mapCity}, Pakistan`
    }
    return rawCity
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A]">
      
      {/* Sticky Filter Bar (matching Reference 2 "Explore on Map") */}
      <div className="bg-white border-b border-[#E4EAF2] sticky top-[74px] z-30 shadow-sm">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3">
          
          {/* Main Controls Row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6B84] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services or businesses (e.g. Electrician, DHA)..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] placeholder-[#5A6B84] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
              />
            </div>

            {/* Dropdown Filters Row */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Category Select */}
              <div className="relative min-w-[130px]">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full appearance-none bg-[#F7F9FC] border border-[#E4EAF2] rounded-xl pl-3 pr-7 py-2 text-xs font-semibold text-[#0E1E3A] cursor-pointer focus:outline-none focus:border-[#FF7A00]"
                >
                  <option value="All">All Categories</option>
                  {SERVICES_CONFIG.map((s) => (
                    <option key={s.id} value={s.searchKey}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="text-[#5A6B84] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* City Select */}
              <div className="relative min-w-[120px]">
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full appearance-none bg-[#F7F9FC] border border-[#E4EAF2] rounded-xl pl-3 pr-7 py-2 text-xs font-semibold text-[#0E1E3A] cursor-pointer focus:outline-none focus:border-[#FF7A00]"
                >
                  <option value="All Cities">All Cities</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="text-[#5A6B84] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Area Select (Populated dynamically from chosen city) */}
              <div className="relative min-w-[120px]">
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  disabled={availableAreas.length <= 1}
                  className="w-full appearance-none bg-[#F7F9FC] border border-[#E4EAF2] rounded-xl pl-3 pr-7 py-2 text-xs font-semibold text-[#0E1E3A] cursor-pointer focus:outline-none focus:border-[#FF7A00] disabled:opacity-50"
                >
                  {availableAreas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="text-[#5A6B84] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort By Select */}
              <div className="relative min-w-[110px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-[#F7F9FC] border border-[#E4EAF2] rounded-xl pl-3 pr-7 py-2 text-xs font-semibold text-[#0E1E3A] cursor-pointer focus:outline-none focus:border-[#FF7A00]"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price_asc">Lowest Price</option>
                  <option value="reviews">Most Reviews</option>
                </select>
                <ChevronDown size={13} className="text-[#5A6B84] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Verified Only Toggle */}
              <button
                type="button"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  verifiedOnly
                    ? 'bg-[#0A1F44] text-white border-[#0A1F44]'
                    : 'bg-[#F7F9FC] text-[#5A6B84] border-[#E4EAF2] hover:text-[#0A1F44]'
                }`}
              >
                <ShieldCheck size={13} className={verifiedOnly ? 'text-[#22C55E]' : ''} />
                <span>Verified Only</span>
              </button>

              {/* Mobile View Switcher */}
              <div className="lg:hidden flex items-center bg-[#F7F9FC] border border-[#E4EAF2] rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'map' ? 'grid' : 'map')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 text-[#0A1F44]"
                >
                  {viewMode === 'map' ? <Grid size={13} /> : <Map size={13} />}
                  <span>{viewMode === 'map' ? 'Show List' : 'Show Map'}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area: Left Results List + Right Sticky Real Map */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6">
        
        {/* Results Count Line */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm font-semibold text-[#5A6B84]">
            <span className="font-extrabold text-[#0A1F44]">{filteredKarigars.length}</span> professionals in{' '}
            <span className="text-[#0A1F44] font-bold">{filterCity}</span>
            {filterCategory !== 'All' && <span> • Category: <span className="text-[#FF7A00] font-bold">{filterCategory}</span></span>}
          </p>

          {(searchQuery || filterCategory !== 'All' || filterCity !== 'All Cities' || filterArea !== 'All Areas' || verifiedOnly) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF7A00] hover:text-[#F06400] transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* 2-Column Split: Results (Left) + Real Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Results List */}
          <div className={`lg:col-span-7 space-y-4 ${viewMode === 'map' ? 'hidden lg:block' : 'block'}`}>
            {isLoading ? (
              // Skeleton Cards
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-[#E4EAF2] p-4 shadow-sm animate-pulse flex gap-4">
                  <div className="w-32 h-28 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-8 bg-gray-200 rounded-lg w-full mt-2" />
                  </div>
                </div>
              ))
            ) : filteredKarigars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredKarigars.map((k) => {
                  const isSelected = selectedKarigarId === k._id
                  const isFav = !!favorites[k._id]
                  const isVerified = k.verificationStatus === 'approved'
                  const serviceLabel = Array.isArray(k.services) && k.services.length > 0 ? k.services[0] : (k.services || 'Professional')
                  const photo = k.profilePhoto || '/assets/images/electrician_work.jpg'

                  return (
                    <div
                      key={k._id}
                      onClick={() => setSelectedKarigarId(k._id)}
                      className={`bg-white rounded-2xl border transition-all duration-150 flex flex-col justify-between overflow-hidden cursor-pointer ${
                        isSelected
                          ? 'border-[#FF7A00] shadow-[0_8px_30px_rgba(255,122,0,0.15)] ring-2 ring-[#FF7A00]/20'
                          : 'border-[#E4EAF2] hover:border-gray-300 shadow-[0_4px_16px_rgba(10,31,68,0.05)] hover:shadow-md'
                      }`}
                    >
                      <div>
                        {/* Photo Container */}
                        <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                          <img
                            src={photo}
                            alt={k.fullName || 'Karigar'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/assets/images/electrician_work.jpg'
                            }}
                          />

                          {/* Verified Badge */}
                          {isVerified && (
                            <div className="absolute top-2.5 left-2.5 bg-[#0A1F44]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <ShieldCheck size={12} className="text-[#22C55E]" />
                              <span>Verified</span>
                            </div>
                          )}

                          {/* Favorite Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(k._id, e)}
                            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm"
                            aria-label="Favorite"
                          >
                            <Heart size={13} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                          </button>
                        </div>

                        {/* Card Info */}
                        <div className="p-3.5">
                          <h3 className="font-poppins font-bold text-sm text-[#0A1F44] truncate">
                            {k.fullName || 'Verified Karigar'}
                          </h3>
                          <p className="text-xs text-[#5A6B84] font-medium mt-0.5 mb-1.5">
                            {serviceLabel}
                          </p>

                          {/* Rating Badge */}
                          <div className="mb-2">
                            <RatingBadge rating={k.rating} reviewsCount={k.reviewsCount} size="sm" />
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-1 text-xs text-[#5A6B84] truncate">
                            <MapPin size={12} className="text-[#FF7A00] flex-shrink-0" />
                            <span className="truncate">{formatLocation(k)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom */}
                      <div className="p-3.5 pt-0">
                        <div className="border-t border-[#E4EAF2] pt-2.5 mb-2.5 flex items-center justify-between">
                          <span className="text-[11px] text-[#5A6B84]">Starting from</span>
                          <span className="text-xs font-black text-[#0A1F44]">
                            PKR {k.hourlyRate || 500}
                          </span>
                        </div>

                        <Link
                          to={`/worker/${k._id}`}
                          className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl border border-[#0A1F44]/20 hover:border-[#FF7A00] hover:bg-[#FF7A00] text-[#0A1F44] hover:text-white font-bold text-xs transition-colors"
                        >
                          <span>View profile</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Empty State
              <div className="bg-white rounded-3xl border border-[#E4EAF2] p-10 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF7A00] flex items-center justify-center mx-auto mb-4">
                  <Search size={28} />
                </div>
                <h3 className="font-poppins font-bold text-lg text-[#0A1F44] mb-2">
                  No professionals found matching your filters
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6B84] max-w-md mx-auto mb-6">
                  Try broadening your search, changing the selected city or area, or clearing your active filters to see all available service providers.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Real Map with Interactive Pins */}
          <div className={`lg:col-span-5 sticky top-[150px] ${viewMode === 'grid' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-3xl border border-[#E4EAF2] p-2.5 shadow-[0_8px_30px_rgba(10,31,68,0.08)] relative overflow-hidden h-[620px]">
              
              <MapView
                city={mapCity}
                markers={mapMarkers}
                selectedMarkerId={selectedKarigarId}
                onMarkerClick={(m) => {
                  setSelectedKarigarId(m.id)
                }}
                className="w-full h-full rounded-2xl"
              />

              {/* Floating Active Karigar Preview Card on Map (matching Reference 2 "Explore on Map") */}
              {activeKarigar && (
                <div className="absolute top-6 left-6 right-6 z-10 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center gap-3">
                    <img
                      src={activeKarigar.profilePhoto || '/assets/images/electrician_work.jpg'}
                      alt={activeKarigar.fullName}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-200"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/assets/images/electrician_work.jpg'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-poppins font-bold text-xs sm:text-sm text-[#0A1F44] truncate">
                          {activeKarigar.fullName || 'Karigar'}
                        </h4>
                        {activeKarigar.verificationStatus === 'approved' && (
                          <ShieldCheck size={13} className="text-[#22C55E] flex-shrink-0" />
                        )}
                      </div>
                      <div className="my-0.5">
                        <RatingBadge rating={activeKarigar.rating} reviewsCount={activeKarigar.reviewsCount} size="sm" />
                      </div>
                      <p className="text-[11px] font-bold text-[#FF7A00]">
                        Starting PKR {activeKarigar.hourlyRate || 500}
                      </p>
                    </div>
                    <Link
                      to={`/worker/${activeKarigar._id}`}
                      className="bg-[#0A1F44] hover:bg-[#FF7A00] text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors flex-shrink-0"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              )}

              {/* Bottom Label on Map */}
              <div className="absolute bottom-5 left-5 z-10">
                <span className="font-poppins font-black text-xs text-[#0A1F44] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                  📍 {mapCity}
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
