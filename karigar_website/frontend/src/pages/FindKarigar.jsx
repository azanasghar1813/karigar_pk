import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, MapPin, ShieldCheck, ArrowRight, Star, Heart, SlidersHorizontal, Map, Grid, CheckCircle2, ChevronDown, RotateCcw, AlertCircle, Building2 } from 'lucide-react'
import api from '../config/api'
import { CITIES, SERVICES_CONFIG, CITY_AREAS } from '../config/site'
import { useCity } from '../context/CityContext'
import RatingBadge from '../components/RatingBadge'
import MapView from '../components/MapView'
import BusinessCard from '../components/BusinessCard'

export default function FindKarigar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedCity, setSelectedCity } = useCity()

  const initialService = searchParams.get('service') || 'All'
  const initialCity = searchParams.get('city') || selectedCity || 'All Cities'
  const initialView = searchParams.get('view') || 'split'
  const initialSource = searchParams.get('source') || 'all' // 'all', 'directory', 'karigars'

  const [karigars, setKarigars] = useState([])
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState(initialView) // 'split', 'grid', 'map'
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState({})
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sourceType, setSourceType] = useState(initialSource) // 'all', 'directory', 'karigars'

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

  // Fetch Karigars and Directory Listings in parallel
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    const params = {}
    if (filterCity && filterCity !== 'All Cities') params.city = filterCity
    if (filterArea && filterArea !== 'All Areas') params.area = filterArea
    if (filterCategory && filterCategory !== 'All' && filterCategory !== 'All Categories') params.service = filterCategory
    if (searchQuery.trim()) params.q = searchQuery.trim()
    if (verifiedOnly) params.verifiedOnly = 'true'
    params.limit = 100

    Promise.allSettled([
      api.get('/karigars'),
      api.get('/listings', { params })
    ]).then(([karigarsRes, listingsRes]) => {
      if (!isMounted) return

      let fetchedKarigars = []
      if (karigarsRes.status === 'fulfilled' && Array.isArray(karigarsRes.value?.data)) {
        fetchedKarigars = karigarsRes.value.data.map(k => ({ ...k, type: 'karigar' }))
      }
      setKarigars(fetchedKarigars)

      let fetchedListings = []
      if (listingsRes.status === 'fulfilled' && listingsRes.value?.data) {
        const raw = listingsRes.value.data.listings || listingsRes.value.data
        if (Array.isArray(raw)) {
          fetchedListings = raw.map(l => ({ ...l, type: 'listing' }))
        }
      }
      setListings(fetchedListings)

      setIsLoading(false)
    }).catch(err => {
      if (!isMounted) return
      console.warn('Error fetching directory data:', err)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [filterCity, filterArea, filterCategory, searchQuery, verifiedOnly])

  // Filter Karigars locally based on UI controls
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
    })
  }, [karigars, verifiedOnly, filterCity, filterArea, filterCategory, searchQuery])

  // Filter listings based on verifiedOnly toggle
  const filteredListings = useMemo(() => {
    if (verifiedOnly) {
      return listings.filter(l => l.claimStatus === 'verified')
    }
    return listings
  }, [listings, verifiedOnly])

  // Combined Results based on Source Toggle
  const combinedResults = useMemo(() => {
    let results = []

    if (sourceType === 'karigars') {
      results = [...filteredKarigars]
    } else if (sourceType === 'directory') {
      results = [...filteredListings]
    } else {
      // 'all': registered verified karigars first, then directory listings
      results = [...filteredKarigars, ...filteredListings]
    }

    return results.sort((a, b) => {
      if (sortBy === 'price_asc') {
        const priceA = a.hourlyRate || 500
        const priceB = b.hourlyRate || 500
        return priceA - priceB
      }
      if (sortBy === 'reviews') {
        const revA = a.reviewsCount || 0
        const revB = b.reviewsCount || 0
        return revB - revA
      }
      // default: rating descending
      const ratingA = a.rating !== null && a.rating !== undefined ? Number(a.rating) : 0
      const ratingB = b.rating !== null && b.rating !== undefined ? Number(b.rating) : 0
      return ratingB - ratingA
    })
  }, [sourceType, filteredKarigars, filteredListings, sortBy])

  // Set default selected item
  useEffect(() => {
    if (combinedResults.length > 0 && !selectedItemId) {
      setSelectedItemId(combinedResults[0]._id)
    }
  }, [combinedResults, selectedItemId])

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
    setSourceType('all')
    setSortBy('rating')
  }

  // Active item for map popup
  const activeItem = useMemo(() => {
    return combinedResults.find((item) => item._id === selectedItemId) || combinedResults[0] || null
  }, [combinedResults, selectedItemId])

  // Map markers
  const mapCity = filterCity !== 'All Cities' ? filterCity : 'Karachi'
  const mapMarkers = useMemo(() => {
    return combinedResults.slice(0, 50).map((item, idx) => {
      const isKarigar = item.type === 'karigar'
      const title = isKarigar ? (item.fullName || 'Verified Karigar') : (item.name || 'Local Business')
      const srv = isKarigar
        ? (Array.isArray(item.services) ? item.services.join(', ') : item.services)
        : item.service
      const price = isKarigar ? (item.hourlyRate || 500) : null

      const baseLat = mapCity === 'Lahore' ? 31.5204 : (mapCity === 'Islamabad' ? 33.6844 : 24.8607)
      const baseLng = mapCity === 'Lahore' ? 74.3587 : (mapCity === 'Islamabad' ? 73.0479 : 67.0011)

      const lat = item.coordinates?.lat || item.lat || (baseLat + (idx * 0.008 - 0.004))
      const lng = item.coordinates?.lng || item.lng || (baseLng + (idx * 0.008 - 0.004))

      return {
        id: item._id,
        name: title,
        service: srv,
        price,
        lat,
        lng
      }
    })
  }, [combinedResults, mapCity])

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A]">
      
      {/* Sticky Filter Bar */}
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
                placeholder="Search services or businesses (e.g. Electrician, DHA, Nadeem AC)..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] placeholder-[#5A6B84] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
              />
            </div>

            {/* Source Toggle + Dropdown Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* SOURCE TOGGLE: All, Directory, Verified Karigars */}
              <div className="flex items-center bg-[#F7F9FC] border border-[#E4EAF2] rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setSourceType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sourceType === 'all'
                      ? 'bg-[#0A1F44] text-white shadow-xs'
                      : 'text-[#5A6B84] hover:text-[#0A1F44]'
                  }`}
                >
                  All ({filteredKarigars.length + filteredListings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType('directory')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sourceType === 'directory'
                      ? 'bg-[#0A1F44] text-white shadow-xs'
                      : 'text-[#5A6B84] hover:text-[#0A1F44]'
                  }`}
                >
                  Directory ({filteredListings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType('karigars')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sourceType === 'karigars'
                      ? 'bg-[#0A1F44] text-white shadow-xs'
                      : 'text-[#5A6B84] hover:text-[#0A1F44]'
                  }`}
                >
                  Karigars ({filteredKarigars.length})
                </button>
              </div>

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

              {/* Area Select */}
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
                <span>Verified</span>
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

      {/* Main Content Area */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6">
        
        {/* Results Count Line */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm font-semibold text-[#5A6B84]">
            <span className="font-extrabold text-[#0A1F44]">{combinedResults.length}</span>{' '}
            {sourceType === 'directory' ? 'directory listings' : sourceType === 'karigars' ? 'registered professionals' : 'total results'}{' '}
            in <span className="text-[#0A1F44] font-bold">{filterCity}</span>
            {filterCategory !== 'All' && <span> • Category: <span className="text-[#FF7A00] font-bold">{filterCategory}</span></span>}
          </p>

          {(searchQuery || filterCategory !== 'All' || filterCity !== 'All Cities' || filterArea !== 'All Areas' || verifiedOnly || sourceType !== 'all') && (
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
            ) : combinedResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {combinedResults.map((item) => (
                  <BusinessCard
                    key={`${item.type}-${item._id}`}
                    item={item}
                    type={item.type}
                    isSelected={selectedItemId === item._id}
                    isFavorite={!!favorites[item._id]}
                    onToggleFavorite={toggleFavorite}
                    onSelect={(id) => setSelectedItemId(id)}
                  />
                ))}
              </div>
            ) : (
              // Empty State
              <div className="bg-white rounded-3xl border border-[#E4EAF2] p-10 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF7A00] flex items-center justify-center mx-auto mb-4">
                  <Search size={28} />
                </div>
                <h3 className="font-poppins font-bold text-lg text-[#0A1F44] mb-2">
                  No businesses or professionals found matching your filters
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6B84] max-w-md mx-auto mb-6">
                  Try broadening your search, switching source to "All", or changing your city/area filters.
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
                selectedMarkerId={selectedItemId}
                onMarkerClick={(m) => {
                  setSelectedItemId(m.id)
                }}
                className="w-full h-full rounded-2xl"
              />

              {/* Floating Active Preview Card on Map */}
              {activeItem && (
                <div className="absolute top-6 left-6 right-6 z-10 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center gap-3">
                    <img
                      src={
                        activeItem.type === 'karigar'
                          ? (activeItem.profilePhoto || '/assets/images/electrician_work.jpg')
                          : (activeItem.photos?.[0] || '/assets/images/electrician_work.jpg')
                      }
                      alt={activeItem.fullName || activeItem.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-200"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/assets/images/electrician_work.jpg'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-poppins font-bold text-xs sm:text-sm text-[#0A1F44] truncate">
                          {activeItem.fullName || activeItem.name || 'Business'}
                        </h4>
                        {activeItem.type === 'karigar' && activeItem.verificationStatus === 'approved' && (
                          <ShieldCheck size={13} className="text-[#22C55E] flex-shrink-0" />
                        )}
                        {activeItem.type === 'listing' && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                            Unclaimed
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5A6B84] truncate">
                        {activeItem.type === 'karigar'
                          ? (Array.isArray(activeItem.services) ? activeItem.services.join(', ') : activeItem.services)
                          : activeItem.service}
                      </p>
                      <p className="text-[11px] font-bold text-[#FF7A00]">
                        {activeItem.type === 'karigar'
                          ? `Starting PKR ${activeItem.hourlyRate || 500}`
                          : (activeItem.phone || 'Directory Record')}
                      </p>
                    </div>
                    <Link
                      to={activeItem.type === 'karigar' ? `/worker/${activeItem._id}` : `/listing/${activeItem._id}`}
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
