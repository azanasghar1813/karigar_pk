import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCity } from './CityContext'
import { CITIES } from '../config/site'

const DiscoveryContext = createContext()

const COMPARE_STORAGE_KEY = 'karigar_compare_selection'

export function DiscoveryProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedCity: contextCity, setSelectedCity } = useCity()

  // 1. Initial State from URL params with sensible defaults
  const initialCity = searchParams.get('city') || contextCity || 'Lahore'
  const initialArea = searchParams.get('area') || 'All Areas'
  const initialService = searchParams.get('service') || 'All'
  const initialQuery = searchParams.get('q') || ''

  // View mode: default 'areas' when only city is chosen; 'grid' if area, service, or query is already set
  const initialView = searchParams.get('view') || (
    searchParams.get('area') && searchParams.get('area') !== 'All Areas' ? 'grid' :
    searchParams.get('service') && searchParams.get('service') !== 'All' ? 'grid' :
    searchParams.get('q') ? 'grid' : 'areas'
  )

  const initialVerifiedOnly = searchParams.get('verifiedOnly') === 'true'
  const initialAvailableNow = searchParams.get('availableNow') === 'true'
  const initialMinRating = Number(searchParams.get('minRating')) || 0
  const initialPriceMax = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : 5000
  const initialSort = searchParams.get('sort') || 'rating'

  // 2. React State (Single Shared Source of Truth)
  const [city, setCityState] = useState(initialCity)
  const [area, setAreaState] = useState(initialArea)
  const [service, setServiceState] = useState(initialService)
  const [query, setQueryState] = useState(initialQuery)
  const [viewMode, setViewModeState] = useState(initialView) // 'areas' | 'grid' | 'radar' | 'compare'

  const [filters, setFiltersState] = useState({
    verifiedOnly: initialVerifiedOnly,
    availableNow: initialAvailableNow,
    minRating: initialMinRating,
    priceMax: initialPriceMax,
    sort: initialSort
  })

  // Compare selection (Phase 5 preparation — max 3, persisted in localStorage)
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem(COMPARE_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed.slice(0, 3)
      }
    } catch {
      // fallback
    }
    return []
  })

  // Currently selected/previewed business for Quick Preview Panel
  const [selectedBusiness, setSelectedBusiness] = useState(null)

  // Persist compare list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList))
    } catch {
      // ignore
    }
  }, [compareList])

  // Sync city with global CityContext
  useEffect(() => {
    if (city && CITIES.includes(city) && city !== contextCity) {
      setSelectedCity(city)
    }
  }, [city, contextCity, setSelectedCity])

  // Helper to sync state changes to URL query string
  const updateUrlParams = useCallback((newValues) => {
    setSearchParams((prevParams) => {
      const updated = new URLSearchParams(prevParams)

      const effectiveCity = newValues.city !== undefined ? newValues.city : city
      const effectiveArea = newValues.area !== undefined ? newValues.area : area
      const effectiveService = newValues.service !== undefined ? newValues.service : service
      const effectiveQuery = newValues.query !== undefined ? newValues.query : query
      const effectiveView = newValues.viewMode !== undefined ? newValues.viewMode : viewMode
      const effectiveFilters = newValues.filters !== undefined ? newValues.filters : filters

      if (effectiveCity && effectiveCity !== 'All Cities') updated.set('city', effectiveCity)
      else updated.delete('city')

      if (effectiveArea && effectiveArea !== 'All Areas') updated.set('area', effectiveArea)
      else updated.delete('area')

      if (effectiveService && effectiveService !== 'All') updated.set('service', effectiveService)
      else updated.delete('service')

      if (effectiveQuery && effectiveQuery.trim()) updated.set('q', effectiveQuery.trim())
      else updated.delete('q')

      if (effectiveView) updated.set('view', effectiveView)

      if (effectiveFilters.verifiedOnly) updated.set('verifiedOnly', 'true')
      else updated.delete('verifiedOnly')

      if (effectiveFilters.availableNow) updated.set('availableNow', 'true')
      else updated.delete('availableNow')

      if (effectiveFilters.minRating && effectiveFilters.minRating > 0) updated.set('minRating', String(effectiveFilters.minRating))
      else updated.delete('minRating')

      if (effectiveFilters.priceMax && effectiveFilters.priceMax < 10000) updated.set('priceMax', String(effectiveFilters.priceMax))
      else updated.delete('priceMax')

      if (effectiveFilters.sort && effectiveFilters.sort !== 'rating') updated.set('sort', effectiveFilters.sort)
      else updated.delete('sort')

      return updated
    }, { replace: true })
  }, [setSearchParams, city, area, service, query, viewMode, filters])

  // State Setters that also reflect into URL
  const setCity = useCallback((newCity) => {
    setCityState(newCity)
    setAreaState('All Areas') // reset area when switching city
    updateUrlParams({ city: newCity, area: 'All Areas' })
  }, [updateUrlParams])

  const setArea = useCallback((newArea) => {
    setAreaState(newArea)
    updateUrlParams({ area: newArea })
  }, [updateUrlParams])

  const setService = useCallback((newService) => {
    setServiceState(newService)
    updateUrlParams({ service: newService })
  }, [updateUrlParams])

  const setQuery = useCallback((newQuery) => {
    setQueryState(newQuery)
    updateUrlParams({ query: newQuery })
  }, [updateUrlParams])

  // Switching views preserves ALL other filters, query, and area
  const setViewMode = useCallback((newViewMode) => {
    setViewModeState(newViewMode)
    updateUrlParams({ viewMode: newViewMode })
  }, [updateUrlParams])

  const setFilter = useCallback((key, value) => {
    setFiltersState((prev) => {
      const next = { ...prev, [key]: value }
      updateUrlParams({ filters: next })
      return next
    })
  }, [updateUrlParams])

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      verifiedOnly: false,
      availableNow: false,
      minRating: 0,
      priceMax: 5000,
      sort: 'rating'
    }
    setQueryState('')
    setAreaState('All Areas')
    setServiceState('All')
    setFiltersState(defaultFilters)
    updateUrlParams({
      query: '',
      area: 'All Areas',
      service: 'All',
      filters: defaultFilters
    })
  }, [updateUrlParams])

  // Compare functions
  const toggleCompare = useCallback((id) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      if (prev.length >= 3) {
        return prev // limit to max 3
      }
      return [...prev, id]
    })
  }, [])

  const removeFromCompare = useCallback((id) => {
    setCompareList((prev) => prev.filter((item) => item !== id))
  }, [])

  const clearCompare = useCallback(() => {
    setCompareList([])
  }, [])

  const isInCompare = useCallback((id) => compareList.includes(id), [compareList])

  const value = useMemo(() => ({
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
    resetFilters,
    compareList,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    selectedBusiness,
    setSelectedBusiness
  }), [
    city, setCity,
    area, setArea,
    service, setService,
    query, setQuery,
    viewMode, setViewMode,
    filters, setFilter,
    resetFilters,
    compareList, toggleCompare, removeFromCompare, clearCompare, isInCompare,
    selectedBusiness, setSelectedBusiness
  ])

  return (
    <DiscoveryContext.Provider value={value}>
      {children}
    </DiscoveryContext.Provider>
  )
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext)
  if (!context) {
    throw new Error('useDiscovery must be used within a DiscoveryProvider')
  }
  return context
}

export default DiscoveryContext
