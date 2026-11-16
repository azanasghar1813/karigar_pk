import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, MapPin, ArrowRight } from 'lucide-react'
import api from '../config/api'
import { useCity } from '../context/CityContext'
import { CITY_COORDINATES, CITY_AREAS } from '../config/site'
import MapView from './MapView'
import BusinessCard from './BusinessCard'

export default function TopRatedSection() {
  const { selectedCity, setSelectedCity } = useCity()
  const [activeCity, setActiveCity] = useState(selectedCity || 'Lahore')
  const [activeDiscoveryTab, setActiveDiscoveryTab] = useState('Visual Grid')
  const [apiKarigars, setApiKarigars] = useState([])
  const [apiListings, setApiListings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const showcaseCities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad']

  // Keep active city synced with global city context
  useEffect(() => {
    if (selectedCity) {
      setActiveCity(selectedCity)
    }
  }, [selectedCity])

  const handleCityChange = (cityName) => {
    setActiveCity(cityName)
    setSelectedCity(cityName)
  }

  // Fetch real verified karigars AND real directory listings for the active city
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    const params = {
      city: activeCity,
      limit: 6
    }

    Promise.allSettled([
      api.get('/karigars'),
      api.get('/listings', { params })
    ]).then(([karigarsRes, listingsRes]) => {
      if (!isMounted) return

      if (karigarsRes.status === 'fulfilled' && Array.isArray(karigarsRes.value?.data)) {
        setApiKarigars(karigarsRes.value.data.map(k => ({ ...k, type: 'karigar' })))
      }

      if (listingsRes.status === 'fulfilled' && listingsRes.value?.data) {
        const raw = listingsRes.value.data.listings || listingsRes.value.data
        if (Array.isArray(raw)) {
          setApiListings(raw.map(l => ({ ...l, type: 'listing' })))
        }
      }
      setLoading(false)
    }).catch((err) => {
      if (!isMounted) return
      console.warn('API fetch error in TopRatedSection:', err)
      setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [activeCity])

  // Filter real karigars for the active city
  const cityKarigars = apiKarigars.filter((k) => {
    if (!k) return false
    if (!activeCity || activeCity === 'All Cities' || activeCity === 'All') return true
    const kCity = (k.city || '').toLowerCase()
    return kCity.includes(activeCity.toLowerCase())
  })

  // If city has fewer than 3 verified karigars, top up with real directory listings from this city
  const displayItems = [...cityKarigars, ...apiListings].slice(0, 3)

  // Real map markers from verified database records or geocoded listings
  const mapCenter = CITY_COORDINATES[activeCity] || CITY_COORDINATES['Lahore']
  const mapMarkers = displayItems
    .filter((item) => {
      const lat = item.lat || item.coordinates?.lat
      const lng = item.lng || item.coordinates?.lng
      return lat && lng
    })
    .map((item) => ({
      id: item._id,
      name: item.fullName || item.name || 'Business',
      service: Array.isArray(item.services) && item.services.length > 0 ? item.services[0] : (item.service || 'Service'),
      price: item.hourlyRate || null,
      lat: item.lat || item.coordinates?.lat,
      lng: item.lng || item.coordinates?.lng
    }))

  return (
    <section className="py-4 sm:py-6 bg-[#F5F7FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Discovery Hub Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h3 className="font-poppins text-base sm:text-lg font-extrabold text-[#0A1F44]">
              Discovery Hub
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { name: 'Explore Areas', to: '/find-karigar?view=areas' },
                { name: 'Visual Grid', to: '/find-karigar?view=grid' },
                { name: 'Local Radar', to: '/find-karigar?view=radar' },
                { name: 'Smart Compare', to: '/find-karigar?view=compare' }
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

        {/* Top-rated near you Row with Area / City Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00]">
              <Star size={14} className="fill-[#FF7A00] text-[#FF7A00]" />
            </div>
            <h2 className="font-poppins text-base sm:text-lg font-extrabold text-[#0A1F44] tracking-tight">
              Top-rated near you
            </h2>
          </div>

          {/* City / Area Filter Pills strictly for activeCity */}
          <div className="relative w-full md:w-auto overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 px-0.5">
              <button
                type="button"
                className="snap-start shrink-0 min-h-[40px] px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-[#0A1F44] text-white shadow-xs"
              >
                <MapPin size={13} className="text-[#FF7A00]" />
                <span>{activeCity}</span>
              </button>

              {((CITY_AREAS[activeCity] || []).filter(a => a !== 'All Areas').slice(0, 3)).map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => navigate(`/find-karigar?city=${encodeURIComponent(activeCity)}&area=${encodeURIComponent(area)}`)}
                  className="snap-start shrink-0 min-h-[40px] px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 bg-white text-[#5A6B84] hover:text-[#0A1F44] border border-[#E4EAF2] hover:border-gray-300"
                >
                  <MapPin size={12} className="text-gray-400" />
                  <span>{area}</span>
                </button>
              ))}

              <Link
                to={`/find-karigar?city=${encodeURIComponent(activeCity)}`}
                className="snap-start shrink-0 min-h-[40px] px-3 py-2 rounded-full inline-flex items-center gap-1 text-xs font-bold text-[#FF7A00] hover:text-[#F06400] transition-colors"
              >
                <span>View all</span>
                <ArrowRight size={13} />
              </Link>
            </div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#F5F7FB] to-transparent md:hidden" />
          </div>
        </div>

        {/* Dynamic Cards Grid: Shows real karigars + real directory listings (up to 3) + Map Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          
          {loading ? (
            // Skeleton loaders
            [1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-[#E4EAF2] p-4 h-72 animate-pulse flex flex-col justify-between">
                <div className="h-36 bg-gray-200 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="h-8 bg-gray-200 rounded-xl" />
              </div>
            ))
          ) : displayItems.length === 0 ? (
            /* Honest Empty State if completely 0 items in activeCity */
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white rounded-2xl border border-[#E4EAF2] p-8 text-center flex flex-col items-center justify-center min-h-[260px] shadow-xs">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF7A00] flex items-center justify-center mb-3">
                <MapPin size={22} />
              </div>
              <h3 className="font-poppins font-bold text-[#0A1F44] text-base mb-1">
                No listings in {activeCity} yet
              </h3>
              <p className="text-xs text-[#5A6B84] max-w-sm mb-4 leading-relaxed">
                Be the first skilled service professional to join our verified directory in {activeCity}.
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
            /* Render up to 3 real business cards */
            displayItems.map((item) => (
              <BusinessCard
                key={item._id}
                item={item}
                type={item.type || (item.verificationStatus ? 'karigar' : 'listing')}
              />
            ))
          )}

          {/* Map Card for Selected City with Interactive Map */}
          <div className={`bg-white rounded-2xl border border-[#E4EAF2] overflow-hidden shadow-[0_4px_16px_rgba(10,31,68,0.05)] relative min-h-[260px] sm:min-h-[290px] flex flex-col group ${
            displayItems.length === 2 ? 'col-span-1 sm:col-span-2 lg:col-span-2' : 
            displayItems.length === 1 ? 'col-span-1 sm:col-span-1 lg:col-span-3' : 
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
                    Explore listings in {activeCity}
                  </p>
                </div>
                <Link
                  to={`/find-karigar?city=${encodeURIComponent(activeCity)}&view=radar`}
                  className="w-6 h-6 rounded-full bg-[#0A1F44] text-white flex items-center justify-center hover:bg-[#FF7A00] transition-colors flex-shrink-0"
                  title="Explore city on map"
                >
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Bottom Map Expand Button */}
            <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
              <span className="text-[10px] bg-white/90 backdrop-blur-md text-[#5A6B84] px-2 py-0.5 rounded font-medium shadow-xs">
                © OpenStreetMap
              </span>
              <Link
                to={`/find-karigar?city=${encodeURIComponent(activeCity)}&view=radar`}
                className="bg-[#0A1F44]/90 backdrop-blur-md hover:bg-[#FF7A00] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm transition-all flex items-center gap-1 pointer-events-auto"
              >
                <span>Radar View</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
