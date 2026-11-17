import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  Radar,
  MapPin,
  Crosshair,
  Sliders,
  ShieldCheck,
  AlertCircle,
  Phone,
  MessageCircle,
  Calendar,
  X,
  Square,
  CheckSquare,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react'
import RatingBadge from '../RatingBadge'
import { SERVICES_CONFIG } from '../../config/site'
import { useDiscovery } from '../../context/DiscoveryContext'
import { calculateDistanceKm, formatDistance, CITY_COORDINATES } from '../../utils/geo'

// Custom User Location Pin with pulsating radar wave
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'custom-user-radar-pin',
    html: `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #3B82F6; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 14px; height: 14px; border-radius: 50%; background: #2563EB; border: 3px solid #FFFFFF; box-shadow: 0 0 10px rgba(37,99,235,0.6);"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

// Custom Business Pin for map
const createBusinessPin = (isSelected = false, isVerified = false) => {
  const size = isSelected ? 34 : 26
  const bg = isVerified ? '#0A1F44' : '#FF7A00'
  const border = isSelected ? '#FF7A00' : '#FFFFFF'

  return L.divIcon({
    className: 'custom-biz-pin',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${bg};
        border: 2px solid ${border};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(10,31,68,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.15s ease;
      ">
        <div style="
          width: 7px;
          height: 7px;
          background: #FFFFFF;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size]
  })
}

export default function LocalRadarView({ allItems = [] }) {
  const {
    city,
    area,
    service,
    filters,
    userLocation,
    requestUserLocation,
    isInCompare,
    toggleCompare,
    setViewMode
  } = useDiscovery()

  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const userLayerRef = useRef(null)
  const ringsLayerRef = useRef(null)
  const markersLayerRef = useRef(null)

  // Radar range slider state (1 km to 10 km, default 5 km)
  const [radiusKm, setRadiusKm] = useState(5)
  // Selected business for the floating preview card
  const [activeBusiness, setActiveBusiness] = useState(null)
  const [mapError, setMapError] = useState(false)

  // Request user location on mount if not requested yet
  useEffect(() => {
    if (userLocation.isDefault && !userLocation.isDenied) {
      requestUserLocation()
    }
  }, [userLocation.isDefault, userLocation.isDenied, requestUserLocation])

  // Compute effective center based on selected Area or User Geolocation
  const { centerLat, centerLng } = useMemo(() => {
    if (area && area !== 'All Areas') {
      const areaMatches = allItems.filter(
        (item) => item.area && item.area.toLowerCase() === area.toLowerCase() && item.coordinates?.lat && item.coordinates?.lng
      )

      if (areaMatches.length > 0) {
        const sumLat = areaMatches.reduce((acc, m) => acc + Number(m.coordinates.lat), 0)
        const sumLng = areaMatches.reduce((acc, m) => acc + Number(m.coordinates.lng), 0)
        return {
          centerLat: sumLat / areaMatches.length,
          centerLng: sumLng / areaMatches.length
        }
      }

      // Fallback: check known area coordinates
      const areaKey = area.toLowerCase().trim()
      const KNOWN_AREAS = {
        'gulberg': { lat: 31.5139, lng: 74.3444 },
        'dha': { lat: 31.4705, lng: 74.3855 },
        'defence': { lat: 31.4705, lng: 74.3855 },
        'johar town': { lat: 31.4697, lng: 74.2728 },
        'model town': { lat: 31.4883, lng: 74.3204 },
        'bahria town': { lat: 31.3685, lng: 74.1818 },
        'faisal town': { lat: 31.4795, lng: 74.3031 },
        'cantt': { lat: 31.5361, lng: 74.3941 },
        'allama iqbal town': { lat: 31.5034, lng: 74.2858 },
        'iqbal town': { lat: 31.5034, lng: 74.2858 },
        'shadman': { lat: 31.5372, lng: 74.3275 },
        'wapda town': { lat: 31.4326, lng: 74.2644 },
        'clifton': { lat: 24.8138, lng: 67.0299 },
        'gulshan': { lat: 24.9207, lng: 67.0982 },
        'gulshan-e-iqbal': { lat: 24.9207, lng: 67.0982 },
        'saddar': { lat: 24.8569, lng: 67.0251 },
        'north nazimabad': { lat: 24.9372, lng: 67.0416 },
        'pechs': { lat: 24.8682, lng: 67.0652 },
        'blue area': { lat: 33.7103, lng: 73.0645 },
        'f-6': { lat: 33.7297, lng: 73.0747 },
        'f-7': { lat: 33.7215, lng: 73.0565 },
        'f-8': { lat: 33.7121, lng: 73.0371 },
        'f-10': { lat: 33.6931, lng: 73.0033 },
        'f-11': { lat: 33.6841, lng: 72.9856 },
        'g-9': { lat: 33.6917, lng: 73.0315 },
        'g-11': { lat: 33.6677, lng: 72.9984 },
        'i-8': { lat: 33.6685, lng: 73.0763 }
      }

      for (const [key, coords] of Object.entries(KNOWN_AREAS)) {
        if (areaKey.includes(key)) {
          return { centerLat: coords.lat, centerLng: coords.lng }
        }
      }
    }

    const defaultLat = userLocation?.lat || CITY_COORDINATES[city]?.lat || 31.5204
    const defaultLng = userLocation?.lng || CITY_COORDINATES[city]?.lng || 74.3587
    return { centerLat: defaultLat, centerLng: defaultLng }
  }, [area, allItems, userLocation, city])

  // Filter items strictly by:
  // 1. MUST have real coordinates (lat & lng)
  // 2. Distance from center <= radiusKm
  // 3. Service category
  // 4. "Available now" strictly limits to verified karigars with isOnline === true
  // 5. "Verified only"
  // 6. Minimum rating
  const eligibleBusinesses = useMemo(() => {
    return allItems
      .filter((item) => {
        // STRICT: coordinates must exist
        if (!item.coordinates || !item.coordinates.lat || !item.coordinates.lng) {
          return false
        }

        const isKarigar = item.type === 'karigar'
        const isVerified = isKarigar
          ? item.verificationStatus === 'approved'
          : item.claimStatus === 'verified'

        // Available Now filter strictly limits to verified karigars with isOnline === true
        if (filters.availableNow) {
          if (!isKarigar || !item.isOnline) return false
        }

        // Verified only filter
        if (filters.verifiedOnly && !isVerified) {
          return false
        }

        // Min rating filter
        if (filters.minRating > 0) {
          if (!item.rating || item.rating < filters.minRating) return false
        }

        // Service category filter
        if (service && service !== 'All') {
          const itemService = isKarigar
            ? (Array.isArray(item.services) ? item.services.join(' ') : item.services)
            : item.service
          if (!itemService || !itemService.toLowerCase().includes(service.toLowerCase())) {
            return false
          }
        }

        // Distance check
        const dist = calculateDistanceKm(centerLat, centerLng, item.coordinates.lat, item.coordinates.lng)
        if (dist === null || dist > radiusKm) {
          return false
        }

        return true
      })
      .map((item) => {
        const dist = calculateDistanceKm(centerLat, centerLng, item.coordinates.lat, item.coordinates.lng)
        return {
          ...item,
          distance: dist
        }
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
  }, [allItems, centerLat, centerLng, radiusKm, filters, service])

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    try {
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 13,
          zoomControl: false,
          attributionControl: false
        })

        // Daylight OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap'
        }).addTo(map)

        // Custom Zoom control in bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map)

        userLayerRef.current = L.layerGroup().addTo(map)
        ringsLayerRef.current = L.layerGroup().addTo(map)
        markersLayerRef.current = L.layerGroup().addTo(map)

        mapInstanceRef.current = map
      } else {
        mapInstanceRef.current.setView([centerLat, centerLng], mapInstanceRef.current.getZoom(), { animate: true })
      }
    } catch (err) {
      console.error('Leaflet initialization error:', err)
      setMapError(true)
    }

    return () => {
      // cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update Center, User Marker, and Radar Rings
  useEffect(() => {
    if (!mapInstanceRef.current || !userLayerRef.current || !ringsLayerRef.current) return

    // Pan map smoothly to the active center (area centroid or user location)
    mapInstanceRef.current.setView([centerLat, centerLng], mapInstanceRef.current.getZoom() || 13, { animate: true })

    userLayerRef.current.clearLayers()
    ringsLayerRef.current.clearLayers()

    // 1. User Position Marker
    const userMarker = L.marker([centerLat, centerLng], {
      icon: createUserLocationIcon(),
      zIndexOffset: 1000
    })
    userMarker.addTo(userLayerRef.current)

    // 2. Fixed Reference Rings (1 km, 3 km, 5 km)
    L.circle([centerLat, centerLng], {
      radius: 1000,
      color: '#3B82F6',
      fillColor: '#3B82F6',
      fillOpacity: 0.04,
      weight: 1.2,
      dashArray: '4, 4'
    }).addTo(ringsLayerRef.current)

    L.circle([centerLat, centerLng], {
      radius: 3000,
      color: '#3B82F6',
      fillColor: '#3B82F6',
      fillOpacity: 0.03,
      weight: 1.2,
      dashArray: '6, 6'
    }).addTo(ringsLayerRef.current)

    L.circle([centerLat, centerLng], {
      radius: 5000,
      color: '#3B82F6',
      fillColor: '#3B82F6',
      fillOpacity: 0.02,
      weight: 1.2,
      dashArray: '8, 8'
    }).addTo(ringsLayerRef.current)

    // 3. Dynamic Active Radar Sweep Ring based on radius slider
    L.circle([centerLat, centerLng], {
      radius: radiusKm * 1000,
      color: '#FF7A00',
      fillColor: '#FF7A00',
      fillOpacity: 0.05,
      weight: 2
    }).addTo(ringsLayerRef.current)

  }, [centerLat, centerLng, radiusKm])

  // Update Business Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return

    markersLayerRef.current.clearLayers()

    eligibleBusinesses.forEach((item) => {
      const isSelected = activeBusiness && (activeBusiness._id === item._id || activeBusiness.id === item._id)
      const isVerified = item.type === 'karigar'
        ? item.verificationStatus === 'approved'
        : item.claimStatus === 'verified'

      const marker = L.marker([item.coordinates.lat, item.coordinates.lng], {
        icon: createBusinessPin(isSelected, isVerified)
      })

      marker.on('click', () => {
        setActiveBusiness(item)
      })

      marker.addTo(markersLayerRef.current)
    })
  }, [eligibleBusinesses, activeBusiness])

  // Graceful fallback if Radar map fails
  if (mapError) {
    return (
      <div className="bg-white rounded-3xl border border-[#E4EAF2] p-10 text-center shadow-sm max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-[#0A1F44] mb-2">
          Radar Map is Unavailable
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6B84] leading-relaxed mb-6">
          We couldn't initialize the map view on your browser. You can seamlessly browse all local businesses using the Visual Grid view.
        </p>
        <button
          type="button"
          onClick={() => setViewMode('grid')}
          className="bg-[#FF7A00] hover:bg-[#e66e00] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-md cursor-pointer"
        >
          Switch to Visual Grid →
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      
      {/* 1. Radar Control Strip */}
      <div className="bg-white rounded-2xl border border-[#E4EAF2] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center flex-shrink-0">
            <Radar size={20} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-poppins font-extrabold text-sm sm:text-base text-[#0A1F44]">
                Local Service Radar
              </h3>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {eligibleBusinesses.length} Active in Radius
              </span>
            </div>
            <p className="text-xs text-[#5A6B84]">
              Showing real verified & directory businesses within {radiusKm} km of your location
            </p>
          </div>
        </div>

        {/* Right: Radius Slider & Locate Me Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E4EAF2] px-3 py-1.5 rounded-xl">
            <Sliders size={14} className="text-[#5A6B84]" />
            <label htmlFor="radius-slider" className="text-xs font-bold text-[#0A1F44] whitespace-nowrap">
              Radius: <span className="text-[#FF7A00] font-black">{radiusKm} km</span>
            </label>
            <input
              id="radius-slider"
              type="range"
              min="1"
              max="10"
              step="1"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-20 sm:w-28 accent-[#FF7A00] cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={requestUserLocation}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              userLocation.isDefault
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                : 'bg-white hover:bg-gray-50 text-[#0A1F44] border-[#E4EAF2]'
            }`}
            title="Locate me on map"
          >
            <Crosshair size={14} />
            <span className="hidden sm:inline">
              {userLocation.isDefault ? 'Locate Me' : 'GPS Active'}
            </span>
          </button>
        </div>

      </div>

      {/* Geolocation Notice Banner if denied or fallback */}
      {userLocation.isDefault && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <Info size={15} className="text-amber-600 flex-shrink-0" />
            <span>
              <strong>Note:</strong> Showing center of <strong>{city}</strong> as reference point. Click <strong>Locate Me</strong> to use your real GPS location.
            </span>
          </div>
          <button
            type="button"
            onClick={requestUserLocation}
            className="text-xs font-bold text-[#FF7A00] hover:underline cursor-pointer flex-shrink-0 ml-2"
          >
            Enable GPS
          </button>
        </div>
      )}

      {/* 2. Interactive Radar Map Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E4EAF2] shadow-sm bg-slate-100 h-[520px] w-full">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Radar Ring Distance Legend Overlay */}
        <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md border border-[#E4EAF2] rounded-xl px-3 py-2 text-[11px] font-semibold text-[#0A1F44] shadow-sm flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <span>You</span>
          <span className="text-gray-300">|</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#0A1F44]" />
          <span>Verified</span>
          <span className="text-gray-300">|</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF7A00]" />
          <span>Directory</span>
          <span className="text-gray-300">|</span>
          <span className="text-[10px] text-[#5A6B84]">Circles: 1, 3, 5 km</span>
        </div>

        {/* ======================================================== */}
        {/* 3. Floating Preview Card upon Marker Click (Req 7)       */}
        {/* ======================================================== */}
        {activeBusiness && (
          <div className="absolute bottom-5 left-4 right-4 sm:left-auto sm:right-5 sm:w-96 z-[450] animate-in fade-in slide-in-from-bottom-3">
            {(() => {
              const isKarigar = activeBusiness.type === 'karigar'
              const id = activeBusiness._id || activeBusiness.id
              const name = isKarigar
                ? (activeBusiness.fullName || 'Verified Professional')
                : (activeBusiness.name || 'Local Business')

              const serviceLabel = isKarigar
                ? (Array.isArray(activeBusiness.services) && activeBusiness.services.length > 0 ? activeBusiness.services[0] : (activeBusiness.services || 'Professional Service'))
                : (activeBusiness.service || 'Local Service')

              const matchedConfig = SERVICES_CONFIG.find(
                s => s.searchKey === serviceLabel || s.name === serviceLabel
              )
              const defaultImage = matchedConfig ? matchedConfig.image : '/assets/images/electrician_work.jpg'
              const photo = isKarigar
                ? (activeBusiness.profilePhoto || defaultImage)
                : (activeBusiness.photos && activeBusiness.photos.length > 0 ? activeBusiness.photos[0] : defaultImage)

              const isVerified = isKarigar
                ? activeBusiness.verificationStatus === 'approved'
                : activeBusiness.claimStatus === 'verified'

              const targetUrl = isKarigar ? `/worker/${id}` : `/listing/${id}`
              const phone = activeBusiness.phone || ''
              const cleanDigits = phone.replace(/\D/g, '')
              const waNumber = cleanDigits.startsWith('92')
                ? cleanDigits
                : (cleanDigits.startsWith('0') ? `92${cleanDigits.slice(1)}` : `92${cleanDigits}`)

              const inCompare = isInCompare(id)
              const isBookable = isKarigar || isVerified
              const bookUrl = isBookable ? `/book/${id}` : `/claim/${id}`
              const bookLabel = isBookable ? 'Book Appointment' : 'Claim to Book'

              return (
                <div className="bg-white rounded-2xl border border-[#E4EAF2] p-4 shadow-[0_12px_40px_rgba(10,31,68,0.22)] relative">
                  
                  {/* Close Card */}
                  <button
                    type="button"
                    onClick={() => setActiveBusiness(null)}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer z-10"
                    title="Close preview"
                  >
                    <X size={13} />
                  </button>

                  <div className="flex gap-3 items-start mb-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={photo}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/assets/images/electrician_work.jpg'
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1 pr-6">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {isVerified ? (
                          <span className="bg-green-100 text-green-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                            <ShieldCheck size={10} className="text-green-600" /> Verified
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                            Directory Listing
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded-full">
                          📍 {formatDistance(activeBusiness.distance)}
                        </span>
                      </div>

                      <h4 className="font-poppins font-extrabold text-sm text-[#0A1F44] truncate" title={name}>
                        {name}
                      </h4>
                      <p className="text-xs text-[#FF7A00] font-bold truncate">
                        {serviceLabel}
                      </p>
                      
                      {/* Rating */}
                      <div className="mt-1">
                        {activeBusiness.rating !== null && activeBusiness.rating > 0 ? (
                          <RatingBadge rating={activeBusiness.rating} reviewsCount={activeBusiness.reviewsCount} size="sm" />
                        ) : (
                          <span className="text-[11px] text-[#5A6B84] italic">Directory Record</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Compare Toggle */}
                  <div className="space-y-2 pt-2 border-t border-[#E4EAF2]">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleCompare(activeBusiness)}
                        className={`text-xs font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          inCompare
                            ? 'bg-[#FF7A00] text-white'
                            : 'bg-gray-100 text-[#0A1F44] hover:bg-orange-50 hover:text-[#FF7A00]'
                        }`}
                      >
                        {inCompare ? <CheckSquare size={13} /> : <Square size={13} />}
                        <span>{inCompare ? 'In Compare' : '+ Compare'}</span>
                      </button>

                      <Link
                        to={targetUrl}
                        className="text-xs font-bold text-[#0A1F44] hover:text-[#FF7A00] flex items-center gap-1 transition-colors"
                      >
                        <span>View Profile</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>

                    {/* Primary Booking / Claim Action */}
                    <Link
                      to={bookUrl}
                      className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-white text-xs font-bold transition-all shadow-xs ${
                        isBookable
                          ? 'bg-[#FF7A00] hover:bg-[#e66e00]'
                          : 'bg-[#0A1F44] hover:bg-[#102747]'
                      }`}
                    >
                      <Calendar size={13} />
                      <span>{bookLabel}</span>
                    </Link>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {phone ? (
                        <a
                          href={`tel:${phone}`}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0A1F44] hover:bg-[#102747] text-white text-xs font-bold transition-all shadow-xs"
                        >
                          <Phone size={12} />
                          <span>Call</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-gray-100 text-gray-400 text-xs font-medium cursor-not-allowed"
                        >
                          Call N/A
                        </button>
                      )}

                      {phone ? (
                        <a
                          href={`https://wa.me/${waNumber}?text=Assalam-o-Alaikum,%20maine%20aap%20ki%20listing%20KarigarPK%20par%20dekhi%20hai.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          <MessageCircle size={12} />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-gray-100 text-gray-400 text-xs font-medium cursor-not-allowed"
                        >
                          WA N/A
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )
            })()}
          </div>
        )}

      </div>

    </div>
  )
}
