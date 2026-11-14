import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Clock, Phone, CheckCircle2, ShieldCheck, Briefcase, Award, ArrowLeft, AlertCircle, MessageCircle, Share2, Heart, ExternalLink } from 'lucide-react'
import api from '../config/api'
import { SITE_PHONE_WA } from '../config/site'

export default function WorkerProfile() {
  const { id } = useParams()
  const [worker, setWorker] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isSaved, setIsSaved] = useState(false)

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
      <div className="py-24 px-4 bg-[#0B1329] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium">Loading Verified Profile...</p>
        </div>
      </div>
    )
  }

  if (error || !worker) {
    return (
      <div className="py-24 px-4 bg-[#0B1329] min-h-screen flex items-center justify-center">
        <div className="bg-[#131F3D] rounded-3xl p-8 border border-gray-800 max-w-md w-full text-center shadow-2xl">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-400 mb-6 text-sm">{error || 'This Karigar profile does not exist or has been removed.'}</p>
          <Link to="/find-karigar" className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all">
            <ArrowLeft size={18} /> Browse Directory
          </Link>
        </div>
      </div>
    )
  }

  const primaryService = Array.isArray(worker.services) && worker.services.length > 0 
    ? worker.services[0] 
    : (typeof worker.services === 'string' ? worker.services : 'General Repair')

  const initials = worker.fullName
    ? worker.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'KP'

  const availabilityDays = worker.availability?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const hoursStart = worker.availability?.workingHours?.start || '09:00'
  const hoursEnd = worker.availability?.workingHours?.end || '19:00'

  const photoGallery = [
    '/assets/images/electrician_work.jpg',
    '/assets/images/plumber_sink.jpg',
    '/assets/images/ac_technician.jpg',
    '/assets/images/electrician_panel.jpg'
  ]

  const phoneForCall = worker.phone || '03001234567'
  const cleanPhone = phoneForCall.replace(/\D/g, '')
  const waNumber = cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.replace(/^0/, '')}`

  return (
    <div className="min-h-screen bg-[#0B1329] text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-5">
          <Link to="/find-karigar" className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Directory
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 rounded-xl bg-[#131F3D] border border-gray-800 text-gray-300 hover:text-[#FF6B00] transition-colors"
              title="Save to Favorites"
            >
              <Heart size={18} className={isSaved ? "fill-[#FF6B00] text-[#FF6B00]" : ""} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: worker.fullName, url: window.location.href })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Profile link copied to clipboard!')
                }
              }}
              className="p-2 rounded-xl bg-[#131F3D] border border-gray-800 text-gray-300 hover:text-white transition-colors"
              title="Share Profile"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Profile Card Header (matching Image 2 "Business Profile Page") */}
        <div className="bg-[#131F3D] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl mb-8">
          {/* Cover Photo Banner */}
          <div className="h-44 sm:h-60 relative w-full overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900">
            <img
              src="/assets/images/ui_hero_mockup.jpg"
              alt="Workshop Banner"
              className="w-full h-full object-cover filter brightness-[0.45]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131F3D] via-transparent to-transparent"></div>
          </div>

          {/* Profile Identity & Action Buttons Row */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 relative -mt-16 sm:-mt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              {/* Avatar & Title */}
              <div className="flex items-end gap-4 sm:gap-6">
                <div className="relative">
                  {worker.profilePhoto && !worker.profilePhoto.includes('placeholder') && !worker.profilePhoto.includes('document') ? (
                    <img
                      src={worker.profilePhoto}
                      alt={worker.fullName}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-[#131F3D] shadow-2xl bg-[#0B1329]"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#FF6B00] to-orange-700 flex items-center justify-center text-white font-poppins font-black text-3xl sm:text-4xl border-4 border-[#131F3D] shadow-2xl">
                      {initials}
                    </div>
                  )}
                  {/* Verified Check Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-[#131F3D] shadow" title="Verified by KarigarPK">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                <div className="mb-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="font-poppins text-xl sm:text-3xl font-extrabold text-white">
                      {worker.fullName}
                    </h1>
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                      <ShieldCheck size={13} /> Verified Pro
                    </span>
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm mt-1">
                    <span className="text-[#FF6B00] font-semibold">{primaryService}</span> • {worker.city}, Pakistan
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 text-yellow-400 font-bold">
                      <Star size={16} className="fill-yellow-400" />
                      <span>{worker.rating ? worker.rating.toFixed(1) : '4.9'}</span>
                      <span className="text-gray-400 font-normal">({worker.reviewsCount || (reviews.length ? reviews.length : '1.8k')} reviews)</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-emerald-400 font-medium">● Open Today ({hoursStart} - {hoursEnd})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Call Now, WhatsApp, Book Now) */}
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <a
                  href={`tel:${phoneForCall}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0B1329] hover:bg-gray-800 border border-gray-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all"
                >
                  <Phone size={15} className="text-[#FF6B00]" />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(worker.fullName)},%20I%20found%20your%20profile%20on%20KarigarPK.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>

                <Link
                  to={`/book/${worker._id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-lg hover:shadow-orange-500/25"
                >
                  <span>Book Now</span>
                  <ExternalLink size={15} />
                </Link>
              </div>
            </div>

            {/* Navigation Tabs (Overview, Services, Reviews, Gallery, Location) */}
            <div className="flex items-center gap-1 border-t border-gray-800/80 mt-6 pt-4 overflow-x-auto text-xs sm:text-sm">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'services', label: 'Services' },
                { id: 'reviews', label: `Reviews (${reviews.length || 12})` },
                { id: 'gallery', label: 'Gallery' },
                { id: 'location', label: 'Location' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#FF6B00] text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About Business Section */}
            {(activeTab === 'overview' || activeTab === 'services') && (
              <div className="bg-[#131F3D] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <h3 className="font-poppins font-bold text-white text-lg sm:text-xl mb-3">
                  About {worker.fullName}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {worker.bio || `${worker.fullName} is a highly rated certified professional serving residential and commercial properties across ${worker.city}. Equipped with professional diagnostic tools, full PPE safety gear, and backed by proven field experience.`}
                </p>

                {/* Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-800 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1329] flex items-center justify-center text-[#FF6B00]">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Experience</p>
                      <p className="text-white font-bold text-sm">{worker.experience ? `${worker.experience}+ Years` : '5+ Years'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1329] flex items-center justify-center text-[#FF6B00]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Response Time</p>
                      <p className="text-white font-bold text-sm">~25 Minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1329] flex items-center justify-center text-emerald-400">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Background</p>
                      <p className="text-white font-bold text-sm">NADRA Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Checklist */}
            {(activeTab === 'overview' || activeTab === 'services') && (
              <div className="bg-[#131F3D] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <h3 className="font-poppins font-bold text-white text-lg sm:text-xl mb-4">
                  Services & Specializations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(Array.isArray(worker.services) && worker.services.length > 0 ? worker.services : [primaryService, 'Repair & Maintenance', 'Emergency Callout', 'Installation']).map((svc, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-[#0B1329] border border-gray-800/80">
                      <CheckCircle2 size={18} className="text-[#FF6B00] flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-200">{svc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery (matching Image 2) */}
            {(activeTab === 'overview' || activeTab === 'gallery') && (
              <div className="bg-[#131F3D] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <h3 className="font-poppins font-bold text-white text-lg sm:text-xl mb-4">
                  Work Gallery & Projects
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {photoGallery.map((imgSrc, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-800 group relative">
                      <img
                        src={imgSrc}
                        alt="Karigar Work sample"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews Section */}
            {(activeTab === 'overview' || activeTab === 'reviews') && (
              <div className="bg-[#131F3D] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-poppins font-bold text-white text-lg sm:text-xl">
                      Customer Reviews
                    </h3>
                    <p className="text-gray-400 text-xs">Verified feedback from past service bookings</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0B1329] border border-gray-800 px-3 py-1.5 rounded-xl">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-bold text-sm">{worker.rating ? worker.rating.toFixed(1) : '4.9'}</span>
                    <span className="text-gray-400 text-xs">/ 5.0</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {(reviews.length > 0 ? reviews : [
                    { customer: { fullName: 'Tariq Mansoor' }, rating: 5, comment: 'Arrived within 30 minutes in DHA, diagnosed the issue quickly and replaced the wiring with full safety. Highly recommended!', createdAt: new Date() },
                    { customer: { fullName: 'Zainab Bibi' }, rating: 5, comment: 'Very polite, professional, and gave honest pricing. No extra hidden charges.', createdAt: new Date() }
                  ]).map((rev, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#0B1329] border border-gray-800/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white text-sm">{rev.customer?.fullName || 'Verified Homeowner'}</span>
                        <span className="text-gray-500 text-xs">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} size={14} className={s < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-700"} />
                        ))}
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (col-span-4): Sticky Booking & Location Cards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Booking Card */}
            <div className="bg-[#131F3D] border border-gray-800 rounded-3xl p-6 shadow-2xl sticky top-24">
              <div className="flex items-baseline justify-between mb-4 border-b border-gray-800 pb-4">
                <div>
                  <span className="text-gray-400 text-xs block">Starting from</span>
                  <span className="text-2xl font-black text-white">PKR {worker.hourlyRate || 500}</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                  Instant Confirmation
                </span>
              </div>

              <div className="space-y-3 mb-6 text-xs text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Inspection Fee</span>
                  <span className="font-semibold text-white">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment Mode</span>
                  <span className="font-semibold text-white">Cash / JazzCash</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Guarantee</span>
                  <span className="font-semibold text-emerald-400">100% Satisfaction</span>
                </div>
              </div>

              <Link
                to={`/book/${worker._id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-orange-500/25 mb-3"
              >
                <span>Book Service Now</span>
                <ExternalLink size={16} />
              </Link>

              <p className="text-center text-[11px] text-gray-400">
                🔒 No advance payment needed. Pay after work completion.
              </p>

              {/* Map Location Preview Card (matching Image 2) */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-poppins font-bold text-white text-sm">Location & Coverage</h4>
                  <span className="text-[11px] text-[#FF6B00] font-semibold">{worker.city}</span>
                </div>

                <div className="h-32 rounded-2xl overflow-hidden border border-gray-800 relative bg-slate-900 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                    alt="Map coverage preview"
                    className="w-full h-full object-cover filter brightness-75"
                  />
                  <div className="absolute inset-0 bg-blue-900/20 flex items-center justify-center">
                    <div className="bg-[#FF6B00] text-white p-2 rounded-full shadow-lg animate-bounce">
                      <MapPin size={20} />
                    </div>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${worker.fullName} ${worker.city} Pakistan`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0B1329] hover:bg-gray-800 border border-gray-700 text-gray-200 text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
                >
                  <MapPin size={14} className="text-[#FF6B00]" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
