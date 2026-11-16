import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCity } from './CityContext'
import { CITIES } from '../config/site'
import { CITY_COORDINATES } from '../utils/geo'

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
  const initialPriceMax = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : 10000
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

  // Compare selection (Phase 5 — max 3, persisted in localStorage with full objects or IDs)
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

  // Toast message when 4th compare item is attempted
  const [compareToast, setCompareToast] = useState(null)

  useEffect(() => {
    if (compareToast) {
      const timer = setTimeout(() => {
        setCompareToast(null)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [compareToast])

  // User Geolocation state for Local Radar & Distance calculations
  const [userLocation, setUserLocationState] = useState(() => {
    const defaultCoords = CITY_COORDINATES[initialCity] || CITY_COORDINATES.Lahore
    return {
      lat: defaultCoords.lat,
      lng: defaultCoords.lng,
      isDefault: true,
      isDenied: false,
      accuracy: null
    }
  })

  // Update default coordinates when city changes if user hasn't provided real location
  useEffect(() => {
    setUserLocationState((prev) => {
      if (prev.isDefault) {
        const cityCenter = CITY_COORDINATES[city] || CITY_COORDINATES.Lahore
        return {
          ...prev,
          lat: cityCenter.lat,
          lng: cityCenter.lng
        }
      }
      return prev
    })
  }, [city])

  const requestUserLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocationState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          isDefault: false,
          isDenied: false
        })
      },
      (err) => {
        const cityCenter = CITY_COORDINATES[city] || CITY_COORDINATES.Lahore
        setUserLocationState({
          lat: cityCenter.lat,
          lng: cityCenter.lng,
          accuracy: null,
          isDefault: true,
          isDenied: true,
          error: err.message
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }, [city])

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

  // Sync city bi-directionally with global CityContext
  useEffect(() => {
    if (contextCity && CITIES.includes(contextCity) && contextCity !== city) {
      setCityState(contextCity)
      setAreaState('All Areas')
      updateUrlParams({ city: contextCity, area: 'All Areas' })
    }
  }, [contextCity, city, updateUrlParams])

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
    if (newCity && CITIES.includes(newCity) && newCity !== contextCity) {
      setSelectedCity(newCity)
    }
  }, [updateUrlParams, contextCity, setSelectedCity])

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
      priceMax: 10000,
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
  const getItemId = (itemOrId) => {
    if (!itemOrId) return ''
    if (typeof itemOrId === 'object') return itemOrId._id || itemOrId.id || ''
    return String(itemOrId)
  }

  const toggleCompare = useCallback((itemOrId) => {
    const targetId = getItemId(itemOrId)
    if (!targetId) return

    setCompareList((prev) => {
      const exists = prev.some((item) => getItemId(item) === targetId)
      if (exists) {
        return prev.filter((item) => getItemId(item) !== targetId)
      }
      if (prev.length >= 3) {
        setCompareToast('Sirf 3 businesses compare ho sakte hain')
        return prev
      }
      // Store the rich item object if provided, otherwise an object with _id
      const payload = typeof itemOrId === 'object' && itemOrId !== null
        ? { ...itemOrId, _id: targetId }
        : { _id: targetId }
      return [...prev, payload]
    })
  }, [])

  const removeFromCompare = useCallback((itemOrId) => {
    const targetId = getItemId(itemOrId)
    setCompareList((prev) => prev.filter((item) => getItemId(item) !== targetId))
  }, [])

  const clearCompare = useCallback(() => {
    setCompareList([])
  }, [])

  const isInCompare = useCallback((itemOrId) => {
    const targetId = getItemId(itemOrId)
    return compareList.some((item) => getItemId(item) === targetId)
  }, [compareList])

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
    compareToast,
    setCompareToast,
    userLocation,
    requestUserLocation,
    setUserLocation: setUserLocationState,
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
    compareToast,
    userLocation, requestUserLocation,
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
