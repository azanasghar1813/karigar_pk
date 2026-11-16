import { useState, useEffect, useMemo } from 'react'
import { Search, MapPin, ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import api from '../config/api'
import { CITIES, SERVICES_CONFIG } from '../config/site'
import { useDiscovery } from '../context/DiscoveryContext'
import { parseSmartSearch } from '../utils/smartSearchParser'

// Discovery Hub Components
import DiscoveryModeTabs from '../components/discovery/DiscoveryModeTabs'
import DiscoverySidebar from '../components/discovery/DiscoverySidebar'
import ExploreAreasView from '../components/discovery/ExploreAreasView'
import VisualGridView from '../components/discovery/VisualGridView'
import SmartCompareView from '../components/discovery/SmartCompareView'
import QuickPreviewPanel from '../components/discovery/QuickPreviewPanel'

export default function FindKarigar() {
  const {
    city,
    setCity,
    area,
    setArea,
    service,
    setService,
    query,
    setQuery,
    viewMode,
    setViewMode,
    filters,
    setFilter,
    selectedBusiness,
    setSelectedBusiness
  } = useDiscovery()

  const [areasData, setAreasData] = useState([])
  const [karigars, setKarigars] = useState([])
  const [listings, setListings] = useState([])
  const [isLoadingAreas, setIsLoadingAreas] = useState(true)
  const [isLoadingItems, setIsLoadingItems] = useState(true)

  // Smart Search NLP state
  const [smartChips, setSmartChips] = useState([])
  const [searchInput, setSearchInput] = useState(query || '')

  // Sync search input if external query changes
  useEffect(() => {
    if (query !== searchInput && !smartChips.length) {
      setSearchInput(query || '')
    }
  }, [query])

  // Automatically parse natural language queries on mount or when query changes
  useEffect(() => {
    if (query && !smartChips.length) {
      const { filters: parsedFilters, chips: parsedChips, remainingQuery } = parseSmartSearch(query, areasData)
      if (parsedChips.length > 0) {
        setSmartChips(parsedChips)
        if (parsedFilters.service) setService(parsedFilters.service)
        if (parsedFilters.area) setArea(parsedFilters.area)
        if (parsedFilters.city) setCity(parsedFilters.city)
        if (parsedFilters.viewMode) setViewMode(parsedFilters.viewMode)
        if (parsedFilters.sort) setFilter('sort', parsedFilters.sort)
        if (parsedFilters.minRating) setFilter('minRating', parsedFilters.minRating)
        if (parsedFilters.priceMax) setFilter('priceMax', parsedFilters.priceMax)
        if (parsedFilters.availableNow !== undefined) setFilter('availableNow', parsedFilters.availableNow)
        setQuery(remainingQuery)
      }
    }
  }, [query, areasData])

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    const { filters: parsedFilters, chips: parsedChips, remainingQuery } = parseSmartSearch(searchInput, areasData)

    if (parsedChips.length > 0) {
      setSmartChips(parsedChips)
      if (parsedFilters.service) setService(parsedFilters.service)
      if (parsedFilters.area) setArea(parsedFilters.area)
      if (parsedFilters.city) setCity(parsedFilters.city)
      if (parsedFilters.viewMode) setViewMode(parsedFilters.viewMode)
      if (parsedFilters.sort) setFilter('sort', parsedFilters.sort)
      if (parsedFilters.minRating) setFilter('minRating', parsedFilters.minRating)
      if (parsedFilters.priceMax) setFilter('priceMax', parsedFilters.priceMax)
      if (parsedFilters.availableNow !== undefined) setFilter('availableNow', parsedFilters.availableNow)
      setQuery(remainingQuery)
    } else {
      setSmartChips([])
      setQuery(searchInput.trim())
    }
  }

  const removeSmartChip = (chip) => {
    setSmartChips((prev) => prev.filter(c => c.id !== chip.id))
    if (chip.type === 'service') setService('All')
    if (chip.type === 'area') setArea('All Areas')
    if (chip.type === 'city') setCity('Lahore')
    if (chip.type === 'viewMode') setViewMode('grid')
    if (chip.type === 'filter') {
      if (chip.key === 'sort') setFilter('sort', 'rating')
      if (chip.key === 'minRating') setFilter('minRating', 0)
      if (chip.key === 'priceMax') setFilter('priceMax', 10000)
      if (chip.key === 'availableNow') setFilter('availableNow', false)
    }
  }

  const clearAllSmartChips = () => {
    setSmartChips([])
    setService('All')
    setArea('All Areas')
    setFilter('sort', 'rating')
    setFilter('minRating', 0)
    setFilter('priceMax', 10000)
    setFilter('availableNow', false)
    setSearchInput('')
    setQuery('')
  }

  // Mobile sheet states
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)

  // 1. Fetch real area counts for the chosen city
  useEffect(() => {
    let isMounted = true
    setIsLoadingAreas(true)

    api.get(`/listings/areas?city=${encodeURIComponent(city)}`)
      .then((res) => {
        if (!isMounted) return
        const data = res.data?.areas || []
        setAreasData(data)
        setIsLoadingAreas(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.warn('Failed to load area counts for', city, err)
        setAreasData([])
        setIsLoadingAreas(false)
      })

    return () => {
      isMounted = false
    }
  }, [city])

  // 2. Fetch Karigars and Directory Listings
  useEffect(() => {
    let isMounted = true
    setIsLoadingItems(true)

    const params = {
      city,
      limit: 100
    }
    if (area && area !== 'All Areas') params.area = area
    if (service && service !== 'All') params.service = service
    if (query.trim()) params.q = query.trim()
    if (filters.verifiedOnly) params.verifiedOnly = 'true'

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

      setIsLoadingItems(false)
    }).catch((err) => {
      if (!isMounted) return
      console.warn('Error fetching directory data:', err)
      setIsLoadingItems(false)
    })

    return () => {
      isMounted = false
    }
  }, [city, area, service, query, filters.verifiedOnly])

  // Total real listings count across all areas of chosen city
  const totalCityCount = useMemo(() => {
    return areasData.reduce((sum, a) => sum + (Number(a.totalCount) || 0), 0)
  }, [areasData])

  // Filter Karigars locally with current filters
  const filteredKarigars = useMemo(() => {
    return karigars.filter((k) => {
      // 1. City Match
      if (city && city !== 'All Cities') {
        const kCity = (k.city || '').toLowerCase()
        if (!kCity.includes(city.toLowerCase())) return false
      }

      // 2. Area Match
      if (area && area !== 'All Areas') {
        const kAddress = ((k.address || '') + ' ' + (k.city || '')).toLowerCase()
        if (!kAddress.includes(area.toLowerCase())) return false
      }

      // 3. Category Match
      if (service && service !== 'All') {
        const kServices = Array.isArray(k.services)
          ? k.services.map((s) => s.toLowerCase())
          : [(k.services || '').toLowerCase()]
        const target = service.toLowerCase()
        const matches = kServices.some((s) => s.includes(target) || target.includes(s))
        if (!matches) return false
      }

      // 4. Query Match
      if (query.trim()) {
        const q = query.toLowerCase()
        const nameMatch = (k.fullName || '').toLowerCase().includes(q)
        const cityMatch = (k.city || '').toLowerCase().includes(q)
        const serviceMatch = Array.isArray(k.services)
          ? k.services.some((s) => s.toLowerCase().includes(q))
          : (k.services || '').toLowerCase().includes(q)
        if (!nameMatch && !cityMatch && !serviceMatch) return false
      }

      // 5. Available Now (only affects verified karigars with isOnline)
      if (filters.availableNow && !k.isOnline) {
        return false
      }

      // 6. Minimum Rating
      if (filters.minRating > 0 && (k.rating || 0) < filters.minRating) {
        return false
      }

      // 7. Max Price
      if (filters.priceMax && filters.priceMax < 10000 && (k.hourlyRate || 500) > filters.priceMax) {
        return false
      }

      return true
    })
  }, [karigars, city, area, service, query, filters])

  // Filter Listings locally
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      // 1. Verified Only: Hides all unclaimed listings
      if (filters.verifiedOnly && l.claimStatus !== 'verified') {
        return false
      }

      // 2. Available Now: Unclaimed listings do not have live online status
      if (filters.availableNow) {
        return false
      }

      // 3. Minimum Rating
      if (filters.minRating > 0 && (l.rating === null || l.rating < filters.minRating)) {
        return false
      }

      return true
    })
  }, [listings, filters])

  // Count of verified karigars in active city
  const verifiedKarigarsCount = useMemo(() => {
    return karigars.filter(k => k.verificationStatus === 'approved' && (!city || city === 'All Cities' || (k.city || '').toLowerCase().includes(city.toLowerCase()))).length
  }, [karigars, city])

  // Combined Results (Registered Karigars + Directory Listings)
  const combinedResults = useMemo(() => {
    const list = [...filteredKarigars, ...filteredListings]

    return list.sort((a, b) => {
      if (filters.sort === 'price_asc') {
        const pA = a.hourlyRate || 500
        const pB = b.hourlyRate || 500
        return pA - pB
      }
      if (filters.sort === 'reviews') {
        const rA = a.reviewsCount || 0
        const rB = b.reviewsCount || 0
        return rB - rA
      }
      if (filters.sort === 'newest') {
        const dA = new Date(a.createdAt || 0).getTime()
        const dB = new Date(b.createdAt || 0).getTime()
        return dB - dA
      }
      // Default: Rating descending
      const rateA = a.rating !== null && a.rating !== undefined ? Number(a.rating) : 0
      const rateB = b.rating !== null && b.rating !== undefined ? Number(b.rating) : 0
      return rateB - rateA
    })
  }, [filteredKarigars, filteredListings, filters.sort])

  // Update default selected business
  useEffect(() => {
    if (combinedResults.length > 0 && !selectedBusiness) {
      setSelectedBusiness(combinedResults[0])
    }
  }, [combinedResults, selectedBusiness, setSelectedBusiness])

  // Count active filters for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.verifiedOnly) count++
    if (filters.availableNow) count++
    if (filters.minRating > 0) count++
    if (filters.priceMax < 10000) count++
    if (filters.sort !== 'rating') count++
    if (area !== 'All Areas') count++
    return count
  }, [filters, area])

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A]">
      
      {/* 1. Master Discovery Header & Filter Controls */}
      <div className="bg-white border-b border-[#E4EAF2] sticky top-[74px] z-30 shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-3.5 space-y-3">
          
          {/* Top Row: Search & City/Category Dropdowns */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input with Natural Language Smart Search */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6B84] pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search services, areas, or try 'saste electrician DHA mein'..."
                className="w-full pl-9 pr-16 py-2 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F8FAFC] text-[#0E1E3A] placeholder-[#5A6B84] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#0A1F44] hover:bg-[#FF7A00] text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Go
              </button>
            </form>

            {/* Controls: City Select & Service Select */}
            <div className="flex items-center gap-2">
              
              {/* City Dropdown */}
              <div className="relative min-w-[130px]">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full appearance-none bg-[#F8FAFC] border border-[#E4EAF2] rounded-xl pl-3 pr-7 py-2 text-xs font-bold text-[#0E1E3A] cursor-pointer focus:outline-none focus:border-[#FF7A00]"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="text-[#5A6B84] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Service Category Dropdown */}
              <div className="relative min-w-[140px]">
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full appearance-none bg-[#F8FAFC] border border-[#E4EAF2] rounded-xl pl-3 pr-7 py-2 text-xs font-bold text-[#0E1E3A] cursor-pointer focus:outline-none focus:border-[#FF7A00]"
                >
                  <option value="All">All Categories</option>
                  {SERVICES_CONFIG.map((s) => (
                    <option key={s.id} value={s.searchKey}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="text-[#5A6B84] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 py-2 px-3 rounded-xl border border-[#E4EAF2] bg-[#F8FAFC] text-xs font-bold text-[#0A1F44]"
              >
                <SlidersHorizontal size={14} className="text-[#FF7A00]" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#FF7A00] text-white text-[10px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

            </div>

          </div>

          {/* Interpreted Smart Search Filter Chips */}
          {smartChips.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] font-bold text-[#5A6B84] uppercase tracking-wider mr-1">
                Interpreted:
              </span>
              {smartChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1.5 bg-orange-50/90 border border-orange-200/90 text-[#0A1F44] text-xs font-bold px-2.5 py-1 rounded-full shadow-2xs"
                >
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={() => removeSmartChip(chip)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                    title={`Remove ${chip.label}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearAllSmartChips}
                className="text-[11px] text-[#5A6B84] hover:text-red-500 underline ml-1 cursor-pointer font-medium"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Mode Tab Bar Row */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-poppins font-extrabold text-xs uppercase text-[#5A6B84] tracking-wider hidden md:inline-block">
                Discovery Hub:
              </span>
              <DiscoveryModeTabs />
            </div>

            <div className="text-xs text-[#5A6B84] hidden sm:block">
              <span className="font-bold text-[#0A1F44]">{city}</span> • {areasData.length} Areas • {totalCityCount} Listings
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main 3-Column Canvas */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: Left Filters Sidebar (Hidden on mobile, col-span-3 on lg) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-[160px]">
            <DiscoverySidebar
              areas={areasData}
              totalCityCount={totalCityCount}
            />
          </div>

          {/* COLUMN 2: Main Dynamic Canvas (col-span-6 on xl with preview, col-span-9 on lg) */}
          <div className="col-span-1 lg:col-span-9 xl:col-span-6 min-w-0">
            {viewMode === 'areas' && (
              <ExploreAreasView
                areas={areasData}
                totalBusinesses={totalCityCount}
                verifiedCount={verifiedKarigarsCount}
                isLoading={isLoadingAreas}
              />
            )}

            {viewMode === 'grid' && (
              <VisualGridView
                items={combinedResults}
                isLoading={isLoadingItems}
                onSelectBusiness={(item) => {
                  setSelectedBusiness(item)
                  if (typeof window !== 'undefined' && window.innerWidth < 1280) {
                    setMobilePreviewOpen(true)
                  }
                }}
              />
            )}

            {viewMode === 'compare' && (
              <SmartCompareView
                allItems={[...karigars, ...listings]}
              />
            )}
          </div>

          {/* COLUMN 3: Right Quick Preview Panel (Visible on xl screens, col-span-3) */}
          <div className="hidden xl:block xl:col-span-3">
            <QuickPreviewPanel
              business={selectedBusiness || combinedResults[0]}
            />
          </div>

        </div>
      </div>

      {/* Mobile Slide-Over / Bottom Sheet: Filters */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 lg:hidden">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAF2] mb-4">
              <h3 className="font-poppins font-bold text-base text-[#0A1F44]">
                Filter Services in {city}
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#5A6B84]"
              >
                <X size={18} />
              </button>
            </div>

            <DiscoverySidebar
              areas={areasData}
              totalCityCount={totalCityCount}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />

            <div className="pt-4 mt-4 border-t border-[#E4EAF2]">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#FF7A00] text-white font-bold rounded-xl text-sm shadow-md"
              >
                Show Results ({combinedResults.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Slide-Over / Bottom Sheet: Quick Preview */}
      {mobilePreviewOpen && selectedBusiness && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 xl:hidden">
          <div className="bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl">
            <QuickPreviewPanel
              business={selectedBusiness}
              isMobileModal={true}
              onClose={() => setMobilePreviewOpen(false)}
            />
          </div>
        </div>
      )}

    </div>
  )
}
