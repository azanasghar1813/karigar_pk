import { useState, useEffect } from 'react'
import api from '../config/api'
import { useSearchParams, Link } from 'react-router-dom'
import { Star, Zap, SlidersHorizontal } from 'lucide-react'

export default function FindKarigar() {
  const [searchParams] = useSearchParams()
  const [karigars, setKarigars] = useState([])
  const [filters, setFilters] = useState({
    service: searchParams.get('service') || 'All',
    minRating: 0,
    sortBy: 'rating'
  })
  const [showFilters, setShowFilters] = useState(false)

  const services = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Repair', 'Locksmith', 'CCTV Install']

  useEffect(() => {
    const fetchKarigars = async () => {
      try {
        const params = {};
        if (filters.service !== 'All') params.service = filters.service;

        const { data } = await api.get('/karigars', { params });
        
        // Apply frontend filtering for rating
        let filtered = data.filter(k => k.rating >= filters.minRating);

        // Sort karigars
        if (filters.sortBy === 'rating') {
          filtered.sort((a, b) => b.rating - a.rating)
        } else if (filters.sortBy === 'price') {
          filtered.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0))
        }

        setKarigars(filtered);
      } catch (err) {
        console.error('Failed to fetch karigars:', err);
      }
    };

    fetchKarigars();
  }, [filters])

  return (
    <div>

      <div className="bg-gradient-to-br from-primary to-blue-900 text-white py-8 sm:py-12 px-4">
        <div className="container">
          <h1 className="font-poppins text-2xl sm:text-4xl font-bold mb-2">Find a Karigar</h1>
          <p className="text-gray-300 text-sm sm:text-base">Verified professionals ready to help</p>
        </div>
      </div>

      <div className="py-8 sm:py-12 px-4 bg-field-workers min-h-screen">
        <div className="container">
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-semibold text-white"
            >
              <SlidersHorizontal size={16} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-24">
                <h3 className="font-poppins font-bold text-white text-lg mb-6">Filters</h3>

                {/* Service Filter */}
                <div className="mb-6">
                  <label className="text-white font-semibold text-sm block mb-3">Service Type</label>
                  <select
                    value={filters.service}
                    onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                    className="form-input"
                  >
                    {services.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* City filter removed for single-city launch */}

                {/* Rating Filter */}
                <div className="mb-6">
                  <label className="text-white font-semibold text-sm block mb-3">Min. Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                    className="form-input"
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
                  <label className="text-white font-semibold text-sm block mb-3">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="form-input"
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="price">Lowest Price</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Karigars Grid */}
            <div className="lg:col-span-3">
              {karigars.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  {karigars.map((karigar) => (
                    <div key={karigar._id} className="worker-card p-3 sm:p-6">
                      <div className="mb-3 sm:mb-4 flex justify-between items-start gap-2">
                        <div>
                          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-poppins font-bold text-sm sm:text-lg mx-auto mb-2 sm:mb-3">
                            {karigar.profilePhoto ? (
                              <img src={karigar.profilePhoto.startsWith('http') ? karigar.profilePhoto : `https://karigar-pk-xuea.onrender.com/${karigar.profilePhoto}`} alt={karigar.fullName} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              karigar.fullName.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <h3 className="font-poppins font-bold text-white text-sm sm:text-lg leading-tight">{karigar.fullName}</h3>
                          <p className="text-secondary text-xs sm:text-base">{karigar.services?.join(', ')}</p>
                        </div>
                        {karigar.verified && (
                          <span className="rounded-full bg-green-100 px-1.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-sm font-semibold text-green-700 whitespace-nowrap">✓ CNIC Verified</span>
                        )}
                      </div>

                      <div className="border-t border-gray-700 py-2 sm:py-3 mb-2 sm:mb-3">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <div className="flex items-center gap-2">
                            <Star size={14} className="text-yellow-400 fill-yellow-400 sm:w-[18px] sm:h-[18px]" />
                            <span className="text-white font-semibold text-xs sm:text-base">{karigar.rating}</span>
                            <span className="text-gray-400 text-[10px] sm:text-sm">({karigar.reviewsCount} jobs)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 text-secondary">
                          <Zap size={13} className="sm:w-4 sm:h-4" />
                          <span className="font-semibold text-xs sm:text-base">Rs. {karigar.hourlyRate || 500}/hr</span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-[11px] sm:text-sm mb-3 sm:mb-4">{karigar.bio || 'Professional worker'}</p>

                      <Link
                        to={`/book/${karigar._id}`}
                        className="block w-full rounded-lg sm:rounded-xl bg-secondary px-2 sm:px-4 py-1.5 sm:py-2.5 text-center text-xs sm:text-base font-semibold text-white shadow-md hover:bg-orange-600 transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No karigars found. Try changing your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}