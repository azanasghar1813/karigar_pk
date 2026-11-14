import { useState, useEffect } from 'react'
import api from '../config/api'
import { useSearchParams, Link } from 'react-router-dom'
import { Star, Zap, SlidersHorizontal, MapPin, ShieldCheck, ArrowRight, PhoneCall } from 'lucide-react'
import { CITIES, SERVICES } from '../config/site'

export default function FindKarigar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialService = searchParams.get('service') || 'All'
  const initialCity = searchParams.get('city') || 'All Cities'

  const [karigars, setKarigars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    service: initialService,
    city: initialCity,
    minRating: 0,
    sortBy: 'rating'
  })
  const [showFilters, setShowFilters] = useState(false)

  const servicesList = ['All', ...SERVICES]
  const citiesList = ['All Cities', ...CITIES]

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
        
        // Filter by min rating
        let filtered = Array.isArray(data) ? data.filter(k => (k.rating || 0) >= filters.minRating) : []

        // Sort
        if (filters.sortBy === 'rating') {
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        } else if (filters.sortBy === 'price') {
          filtered.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0))
        }

        setKarigars(filtered)
      } catch (err) {
        console.error('Failed to fetch karigars:', err)
        setKarigars([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchKarigars()
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-primary to-blue-900 text-white py-8 sm:py-12 px-4 shadow-md">
        <div className="container max-w-6xl mx-auto">
          <h1 className="font-poppins text-2xl sm:text-4xl font-bold mb-2">Find Verified Karigars</h1>
          <p className="text-gray-200 text-sm sm:text-base">
            Verified electricians, plumbers, carpenters & handymen ready to serve you
          </p>
        </div>
      </div>

      <div className="py-8 sm:py-12 px-4 bg-field-workers min-h-screen">
        <div className="container max-w-6xl mx-auto">
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white shadow"
            >
              <SlidersHorizontal size={16} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 sticky top-24 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                  <h3 className="font-poppins font-bold text-white text-lg">Filter Karigars</h3>
                  <button 
                    onClick={() => setFilters({ service: 'All', city: 'All Cities', minRating: 0, sortBy: 'rating' })}
                    className="text-xs text-secondary hover:underline"
                  >
                    Reset
                  </button>
                </div>

                {/* Service Filter */}
                <div>
                  <label className="text-white font-semibold text-xs block mb-2">Service Type</label>
                  <select
                    value={filters.service}
                    onChange={(e) => handleFilterChange('service', e.target.value)}
                    className="form-input text-sm"
                  >
                    {servicesList.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* City Filter (Issue 6 Fix) */}
                <div>
                  <label className="text-white font-semibold text-xs block mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="form-input text-sm"
                  >
                    {citiesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="text-white font-semibold text-xs block mb-2">Minimum Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                    className="form-input text-sm"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={3}>3+ Stars</option>
                    <option value={3.5}>3.5+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-white font-semibold text-xs block mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="form-input text-sm"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price">Lowest Hourly Rate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Karigars Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                // Loading Skeleton (Issue 6 Fix: Eliminates false "No karigars found" flash)
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 animate-pulse">
                      <div className="flex gap-4 items-center mb-4">
                        <div className="w-14 h-14 bg-gray-700 rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-10 bg-gray-700 rounded-xl mt-4"></div>
                    </div>
                  ))}
                </div>
              ) : karigars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {karigars.map((karigar) => {
                    const initials = karigar.fullName 
                      ? karigar.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                      : 'KP'

                    return (
                      <div key={karigar._id} className="bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all shadow-lg flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow">
                              {karigar.profilePhoto && !karigar.profilePhoto.includes('document') ? (
                                <img 
                                  src={karigar.profilePhoto} 
                                  alt={karigar.fullName} 
                                  className="w-full h-full object-cover rounded-xl"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                initials
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Link to={`/worker/${karigar._id}`} className="font-poppins font-bold text-white text-base sm:text-lg hover:text-secondary transition-colors truncate block">
                                  {karigar.fullName}
                                </Link>
                                {karigar.verificationStatus === 'approved' && (
                                  <span className="inline-flex items-center gap-0.5 rounded-full bg-green-950/80 border border-green-800 px-2 py-0.5 text-[10px] font-semibold text-green-300">
                                    <ShieldCheck size={11} /> Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-secondary text-xs sm:text-sm font-semibold truncate">
                                {Array.isArray(karigar.services) ? karigar.services.join(', ') : karigar.services}
                              </p>
                              <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                                <MapPin size={12} /> {karigar.city}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-gray-700/80 py-3 mb-3 flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-1.5 text-yellow-400">
                              <Star size={16} className="fill-yellow-400" />
                              <span className="text-white font-bold">{karigar.rating ? karigar.rating.toFixed(1) : '5.0'}</span>
                              <span className="text-gray-400">({karigar.reviewsCount || 0} jobs)</span>
                            </div>
                            <div className="flex items-center gap-1 text-secondary font-semibold">
                              <Zap size={14} />
                              <span>Rs. {karigar.hourlyRate || 500}/hr</span>
                            </div>
                          </div>

                          <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
                            {karigar.bio || 'Skilled professional ready to provide fast, reliable repair services.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Link
                            to={`/worker/${karigar._id}`}
                            className="w-full rounded-xl bg-gray-700 hover:bg-gray-600 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-white transition-colors"
                          >
                            View Profile
                          </Link>
                          <Link
                            to={`/book/${karigar._id}`}
                            className="w-full rounded-xl bg-secondary hover:bg-orange-600 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-white shadow transition-colors"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                // Helpful Empty State (Issue 6 Fix)
                <div className="bg-gray-800 rounded-2xl p-8 sm:p-12 border border-gray-700 text-center max-w-lg mx-auto shadow-xl">
                  <div className="w-16 h-16 bg-gray-700/60 rounded-2xl flex items-center justify-center text-secondary mx-auto mb-4">
                    <PhoneCall size={32} />
                  </div>
                  <h3 className="font-poppins font-bold text-white text-xl mb-2">
                    No Karigars Found in This Category
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    We are currently expanding our verified network. Need immediate assistance? Request a direct callback and our team will assign a certified technician for you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/contact"
                      className="btn-secondary px-6 py-2.5 text-sm font-semibold rounded-xl"
                    >
                      Request Callback
                    </Link>
                    <button
                      onClick={() => setFilters({ service: 'All', city: 'All Cities', minRating: 0, sortBy: 'rating' })}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
