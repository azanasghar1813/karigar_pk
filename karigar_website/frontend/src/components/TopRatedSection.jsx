import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, ShieldCheck, Heart, MapPin, ArrowRight, Expand, Crown, Headphones, Zap, Shield } from 'lucide-react'
import api from '../config/api'
import { useCity } from '../context/CityContext'
import RatingBadge from './RatingBadge'
import MapView from './MapView'

export default function TopRatedSection() {
  const { selectedCity, setSelectedCity } = useCity()
  const [activeCity, setActiveCity] = useState(selectedCity || 'Lahore')
  const [activeArea, setActiveArea] = useState('All')
  const [activeDiscoveryTab, setActiveDiscoveryTab] = useState('Visual Grid')
  const [apiKarigars, setApiKarigars] = useState([])
  const [favorites, setFavorites] = useState({})
  const navigate = useNavigate()

  const showcaseCities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad']

  // City-specific areas matching Reference 1 & latest UI pic
  const cityAreas = {
    Lahore: ['Gulberg', 'DHA Phase 5', 'Johar Town'],
    Karachi: ['DHA Phase 6', 'Gulshan-e-Iqbal', 'Clifton'],
    Islamabad: ['F-10 Markaz', 'Blue Area', 'G-11'],
    Faisalabad: ['D Ground', 'Madina Town', 'Kohinoor City']
  }

  // Keep active city synced with global city context
  useEffect(() => {
    if (selectedCity && showcaseCities.includes(selectedCity)) {
      setActiveCity(selectedCity)
      setActiveArea('All')
    }
  }, [selectedCity])

  const handleCityChange = (cityName) => {
    setActiveCity(cityName)
    setSelectedCity(cityName)
    setActiveArea('All')
  }

  const toggleFavorite = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Fetch real karigars from API to merge
  useEffect(() => {
    let isMounted = true
    api.get('/karigars')
      .then((res) => {
        if (!isMounted) return
        if (Array.isArray(res.data)) {
          setApiKarigars(res.data)
        }
      })
      .catch((err) => {
        console.warn('API karigars:', err)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Exact 3 showcase pros per city matching reference layout & UI pic
  const cityShowcaseData = {
    Lahore: [
      {
        _id: 'lhr-elec-1',
        fullName: 'Al Mustafa Electrician',
        service: 'Electrician',
        rating: 4.9,
        reviewsCount: 2500,
        city: 'Lahore, Gulberg',
        area: 'Gulberg',
        hourlyRate: 500,
        profilePhoto: '/assets/images/electrician_work.jpg',
        verificationStatus: 'approved',
        lat: 31.5102,
        lng: 74.3441
      },
      {
        _id: 'lhr-plumb-1',
        fullName: 'Quick Fix Plumbers',
        service: 'Plumber',
        rating: 4.8,
        reviewsCount: 1800,
        city: 'Lahore, DHA Phase 5',
        area: 'DHA Phase 5',
        hourlyRate: 600,
        profilePhoto: '/assets/images/plumber_sink.jpg',
        verificationStatus: 'approved',
        lat: 31.4704,
        lng: 74.3987
      },
      {
        _id: 'lhr-ac-1',
        fullName: 'Cool Tech AC Services',
        service: 'AC Repair',
        rating: 4.8,
        reviewsCount: 1200,
        city: 'Lahore, Johar Town',
        area: 'Johar Town',
        hourlyRate: 800,
        profilePhoto: '/assets/images/ac_technician.jpg',
        verificationStatus: 'approved',
        lat: 31.4697,
        lng: 74.2728
      }
    ],
    Karachi: [
      {
        _id: 'khi-elec-1',
        fullName: 'Al Mustafa Electrician',
        service: 'Electrician',
        rating: 4.9,
        reviewsCount: 2500,
        city: 'Karachi, DHA Phase 6',
        area: 'DHA Phase 6',
        hourlyRate: 500,
        profilePhoto: '/assets/images/electrician_work.jpg',
        verificationStatus: 'approved',
        lat: 24.8138,
        lng: 67.0677
      },
      {
        _id: 'khi-plumb-1',
        fullName: 'Quick Fix Plumbers',
        service: 'Plumber',
        rating: 4.8,
        reviewsCount: 1800,
        city: 'Karachi, Gulshan-e-Iqbal',
        area: 'Gulshan-e-Iqbal',
        hourlyRate: 600,
        profilePhoto: '/assets/images/plumber_sink.jpg',
        verificationStatus: 'approved',
        lat: 24.9207,
        lng: 67.0982
      },
      {
        _id: 'khi-ac-1',
        fullName: 'Cool Tech AC Services',
        service: 'AC Repair',
        rating: 4.8,
        reviewsCount: 1200,
        city: 'Karachi, Clifton',
        area: 'Clifton',
        hourlyRate: 800,
        profilePhoto: '/assets/images/ac_technician.jpg',
        verificationStatus: 'approved',
        lat: 24.8270,
        lng: 67.0251
      }
    ],
    Islamabad: [
      {
        _id: 'isb-elec-1',
        fullName: 'Capital Home Electric',
        service: 'Electrician',
        rating: 4.9,
        reviewsCount: 1900,
        city: 'Islamabad, F-10 Markaz',
        area: 'F-10 Markaz',
        hourlyRate: 700,
        profilePhoto: '/assets/images/electrician_work.jpg',
        verificationStatus: 'approved',
        lat: 33.6924,
        lng: 73.0118
      },
      {
        _id: 'isb-plumb-1',
        fullName: 'Quick Fix Plumbers',
        service: 'Plumber',
        rating: 4.8,
        reviewsCount: 1500,
        city: 'Islamabad, G-11',
        area: 'G-11',
        hourlyRate: 650,
        profilePhoto: '/assets/images/plumber_sink.jpg',
        verificationStatus: 'approved',
        lat: 33.6681,
        lng: 72.9984
      },
      {
        _id: 'isb-ac-1',
        fullName: 'Cool Tech AC Services',
        service: 'AC Repair',
        rating: 4.9,
        reviewsCount: 1600,
        city: 'Islamabad, Blue Area',
        area: 'Blue Area',
        hourlyRate: 850,
        profilePhoto: '/assets/images/ac_technician.jpg',
        verificationStatus: 'approved',
        lat: 33.7103,
        lng: 73.0571
      }
    ],
    Faisalabad: [
      {
        _id: 'fsd-elec-1',
        fullName: 'Lyallpur Electric Works',
        service: 'Electrician',
        rating: 4.8,
        reviewsCount: 1200,
        city: 'Faisalabad, D Ground',
        area: 'D Ground',
        hourlyRate: 450,
        profilePhoto: '/assets/images/electrician_work.jpg',
        verificationStatus: 'approved',
        lat: 31.4112,
        lng: 73.0924
      },
      {
        _id: 'fsd-plumb-1',
        fullName: 'Chenab Pipe Experts',
        service: 'Plumber',
        rating: 4.8,
        reviewsCount: 980,
        city: 'Faisalabad, Madina Town',
        area: 'Madina Town',
        hourlyRate: 500,
        profilePhoto: '/assets/images/plumber_sink.jpg',
        verificationStatus: 'approved',
        lat: 31.4285,
        lng: 73.0851
      },
      {
        _id: 'fsd-ac-1',
        fullName: 'Kohinoor AC Repair',
        service: 'AC Repair',
        rating: 4.7,
        reviewsCount: 850,
        city: 'Faisalabad, Kohinoor City',
        area: 'Kohinoor City',
        hourlyRate: 700,
        profilePhoto: '/assets/images/ac_technician.jpg',
        verificationStatus: 'approved',
        lat: 31.4019,
        lng: 73.1189
      }
    ]
  }

  // Get matching DB karigars for active city
  const dbCityMatches = apiKarigars.filter((k) => {
    const kCity = (k.city || '').toLowerCase()
    return kCity.includes(activeCity.toLowerCase())
  })

  // Guarantee exactly 3 cards by combining DB karigars with showcase data
  const baseShowcase = cityShowcaseData[activeCity] || cityShowcaseData['Lahore']
  const displayKarigars = [
    ...dbCityMatches,
    ...baseShowcase.slice(dbCityMatches.length)
  ].slice(0, 3)

  // Map markers for active city
  const mapMarkers = displayKarigars.map((k) => ({
    id: k._id,
    name: k.fullName,
    service: Array.isArray(k.services) ? k.services.join(', ') : k.service || 'Service',
    price: k.hourlyRate || 500,
    lat: k.lat,
    lng: k.lng
  }))

  const currentAreas = cityAreas[activeCity] || cityAreas['Lahore']

  return (
    <section className="py-5 sm:py-7 bg-[#F5F7FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Discovery Hub Bar (Exact Match with Reference Mockup & Uploaded Pic) */}
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

        {/* Top-rated near you Row with Dynamic Location Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00]">
              <Star size={15} className="fill-[#FF7A00] text-[#FF7A00]" />
            </div>
            <h2 className="font-poppins text-lg sm:text-xl font-extrabold text-[#0A1F44] tracking-tight">
              Top-rated near you
            </h2>
          </div>

          {/* Location Area Pills Matching Uploaded Reference Pic */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Active City Pill */}
            <button
              type="button"
              onClick={() => setActiveArea('All')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                activeArea === 'All'
                  ? 'bg-[#0A1F44] text-white shadow-xs'
                  : 'bg-white text-[#5A6B84] hover:text-[#0A1F44] border border-[#E4EAF2]'
              }`}
            >
              <MapPin size={12} className={activeArea === 'All' ? 'text-[#FF7A00]' : 'text-gray-400'} />
              <span>{activeCity}</span>
            </button>

            {/* City Sub-Areas (e.g. Gulberg, DHA Phase 5, Johar Town for Lahore) */}
            {currentAreas.map((area) => {
              const isSelected = activeArea === area
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => setActiveArea(area)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#0A1F44] text-white shadow-xs'
                      : 'bg-white text-[#5A6B84] hover:text-[#0A1F44] border border-[#E4EAF2] hover:border-gray-300'
                  }`}
                >
                  <MapPin size={12} className={isSelected ? 'text-[#FF7A00]' : 'text-gray-400'} />
                  <span>{area}</span>
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

        {/* 4-Column Grid: Exactly 3 Business Cards + 1 Real Interactive Map Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
          
          {/* Exactly 3 Karigar Cards */}
          {displayKarigars.map((k) => {
            const isFav = !!favorites[k._id]
            const isVerified = k.verificationStatus === 'approved'
            const serviceLabel = Array.isArray(k.services) && k.services.length > 0 ? k.services[0] : (k.service || 'Professional')
            const photo = k.profilePhoto || '/assets/images/electrician_work.jpg'

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
                        e.target.src = '/assets/images/electrician_work.jpg'
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

                    {/* Rating & Review Count */}
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

                {/* Card Bottom: Solid Orange Book Now Button (Matching Reference Pic) */}
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
          })}

          {/* Card 4: Real Map Card for Selected City with Interactive Pins */}
          <div className="bg-white rounded-2xl border border-[#E4EAF2] overflow-hidden shadow-[0_4px_16px_rgba(10,31,68,0.05)] relative min-h-[260px] sm:min-h-[290px] flex flex-col group">
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
                    Explore areas in {activeCity}
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

        {/* Feature / Value Proposition Bar Directly Below Cards (Matching Reference Pic) */}
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
