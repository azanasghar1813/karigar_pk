import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Clock, Phone, CheckCircle, Briefcase, Award, ArrowLeft, AlertCircle } from 'lucide-react'
import api from '../config/api'

export default function WorkerProfile() {
  const { id } = useParams()
  const [worker, setWorker] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkerData = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: karigarData } = await api.get(`/karigars/${id}`)
        setWorker(karigarData)

        try {
          const { data: reviewsData } = await api.get(`/reviews?karigarId=${id}`)
          setReviews(Array.isArray(reviewsData) ? reviewsData : [])
        } catch (err) {
          console.warn('Reviews could not be loaded:', err)
          setReviews([])
        }
      } catch (err) {
        console.error('Error fetching karigar:', err)
        setError(err.response?.data?.message || 'Karigar not found')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchWorkerData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="py-20 px-4 bg-field-workers min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium">Loading Karigar Profile...</p>
        </div>
      </div>
    )
  }

  if (error || !worker) {
    return (
      <div className="py-20 px-4 bg-field-workers min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md w-full text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'This Karigar profile does not exist or has been removed.'}</p>
          <Link to="/find-karigar" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Browse Karigars
          </Link>
        </div>
      </div>
    )
  }

  const primaryService = Array.isArray(worker.services) && worker.services.length > 0 
    ? worker.services[0] 
    : (typeof worker.services === 'string' ? worker.services : 'General Service')

  const initials = worker.fullName
    ? worker.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'KP'

  const availabilityDays = worker.availability?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const hoursStart = worker.availability?.workingHours?.start || '09:00'
  const hoursEnd = worker.availability?.workingHours?.end || '18:00'

  return (
    <div>
      <div className="py-12 px-4 bg-field-workers min-h-screen">
        <div className="container max-w-4xl mx-auto">
          {/* Back button */}
          <Link to="/find-karigar" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Search
          </Link>

          {/* Profile Header */}
          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700 mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              <div className="flex-shrink-0">
                {worker.profilePhoto && !worker.profilePhoto.includes('placeholder') && !worker.profilePhoto.includes('document') ? (
                  <img
                    src={worker.profilePhoto}
                    alt={worker.fullName}
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-primary shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div 
                  className={`w-28 h-28 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-poppins font-bold text-3xl shadow-md ${worker.profilePhoto && !worker.profilePhoto.includes('placeholder') && !worker.profilePhoto.includes('document') ? 'hidden' : 'flex'}`}
                >
                  {initials}
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-white">{worker.fullName}</h1>
                  {worker.verificationStatus === 'approved' && (
                    <span className="bg-green-900/60 text-green-300 border border-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Verified
                    </span>
                  )}
                  {worker.isOnline && (
                    <span className="bg-blue-900/60 text-blue-300 border border-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> Available Today
                    </span>
                  )}
                </div>

                <p className="text-secondary font-semibold text-lg mb-3">
                  {primaryService} • <span className="text-gray-300">{worker.city}</span>
                </p>

                <div className="flex flex-wrap gap-4 sm:gap-6 mb-4 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-bold">{worker.rating ? worker.rating.toFixed(1) : 'New'}</span>
                    <span className="text-gray-400">({worker.reviewsCount || reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary font-semibold">
                    <span>Rs. {worker.hourlyRate || 500}/hr</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={18} />
                    <span>{worker.city}</span>
                  </div>
                </div>

                {worker.bio && (
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">{worker.bio}</p>
                )}

                <Link
                  to={`/book/${worker._id}`}
                  className="btn-secondary inline-block px-8 py-3 text-center w-full sm:w-auto font-bold rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all"
                >
                  Book {worker.fullName?.split(' ')[0] || 'Karigar'} Now
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 text-center">
              <Briefcase className="text-secondary mx-auto mb-2" size={28} />
              <p className="text-gray-400 text-xs sm:text-sm">Experience</p>
              <p className="font-poppins font-bold text-white text-base sm:text-lg">{worker.experience ? `${worker.experience} Years` : 'Experienced'}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 text-center">
              <Clock className="text-secondary mx-auto mb-2" size={28} />
              <p className="text-gray-400 text-xs sm:text-sm">Response Time</p>
              <p className="font-poppins font-bold text-white text-base sm:text-lg">Under 30 mins</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 text-center">
              <Award className="text-secondary mx-auto mb-2" size={28} />
              <p className="text-gray-400 text-xs sm:text-sm">Verified Rating</p>
              <p className="font-poppins font-bold text-white text-base sm:text-lg">{worker.rating ? `${worker.rating.toFixed(1)} ★` : 'Trusted'}</p>
            </div>
          </div>

          {/* Services & Skills */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="font-poppins font-bold text-white text-xl mb-4">Services Offered</h2>
            <div className="flex flex-wrap gap-2.5">
              {Array.isArray(worker.services) && worker.services.length > 0 ? (
                worker.services.map((service, idx) => (
                  <span key={idx} className="bg-primary/20 border border-primary/40 text-primary-light px-3.5 py-1.5 rounded-lg text-sm font-medium">
                    {service}
                  </span>
                ))
              ) : (
                <span className="bg-primary/20 border border-primary/40 text-primary-light px-3.5 py-1.5 rounded-lg text-sm font-medium">
                  {primaryService}
                </span>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="font-poppins font-bold text-white text-xl mb-4">Availability & Working Hours</h2>
            <div className="space-y-3">
              <p className="text-gray-300 flex items-center gap-2.5">
                <CheckCircle size={20} className="text-secondary flex-shrink-0" />
                <span>Working Days: <strong className="text-white">{availabilityDays.join(', ')}</strong></span>
              </p>
              <p className="text-gray-300 flex items-center gap-2.5">
                <Clock size={20} className="text-secondary flex-shrink-0" />
                <span>Working Hours: <strong className="text-white">{hoursStart} - {hoursEnd}</strong></span>
              </p>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-poppins font-bold text-white text-xl">Customer Reviews</h2>
              <span className="text-sm text-gray-400">({reviews.length} verified reviews)</span>
            </div>
            
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No reviews yet for this karigar. Book a service and be the first to leave a review!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((rev, idx) => (
                  <div key={rev._id || idx} className="border-b border-gray-700 pb-5 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-poppins font-semibold text-white">{rev.customer?.fullName || 'Verified Customer'}</p>
                      <p className="text-gray-400 text-xs">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={15} 
                          className={i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"} 
                        />
                      ))}
                    </div>
                    {rev.comment && (
                      <p className="text-gray-300 text-sm leading-relaxed">{rev.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
