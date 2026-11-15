import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Clock, Phone, CheckCircle2, ShieldCheck, Briefcase, Award, ArrowLeft, AlertCircle, MessageCircle, Share2, Heart, ExternalLink } from 'lucide-react'
import api from '../config/api'

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
      <div className="py-24 px-4 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF8A00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm">Loading Verified Profile...</p>
        </div>
      </div>
    )
  }

  if (error || !worker) {
    return (
      <div className="py-24 px-4 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 max-w-md w-full text-center shadow-xl">
          <AlertCircle size={44} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#0A1930] mb-2">Profile Not Found</h2>
          <p className="text-gray-500 mb-6 text-xs">{error || 'This profile does not exist or has been removed.'}</p>
          <Link to="/find-karigar" className="w-full inline-flex items-center justify-center gap-2 bg-[#FF8A00] hover:bg-[#E67A00] text-white font-semibold py-2.5 px-6 rounded-xl text-xs transition-all">
            <ArrowLeft size={16} /> Browse Directory
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A1930] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-5">
          <Link to="/find-karigar" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#0A1930] transition-colors">
            <ArrowLeft size={14} /> Back to Directory
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#FF8A00] transition-colors shadow-sm"
              title="Save to Favorites"
            >
              <Heart size={16} className={isSaved ? "fill-[#FF8A00] text-[#FF8A00]" : ""} />
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
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#0A1930] transition-colors shadow-sm"
              title="Share Profile"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Profile Card Header (matching reference image "Business Profile Page") */}
        <div className="bg-white border border-gray-200/90 rounded-3xl overflow-hidden shadow-lg mb-8">
          
          {/* Cover Photo Banner */}
          <div className="h-44 sm:h-64 relative w-full overflow-hidden bg-slate-100">
            <img
              src="/assets/images/ui_hero_mockup.jpg"
              alt="Workshop Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
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
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#102747] to-[#0A1930] flex items-center justify-center text-white font-poppins font-black text-3xl sm:text-4xl border-4 border-white shadow-xl">
                      {initials}
                    </div>
                  )}
                  {/* Verified Check Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow" title="Verified by KarigarPK">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                <div className="mb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-poppins text-xl sm:text-3xl font-extrabold text-[#0A1930]">
                      {worker.fullName}
                    </h1>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      <ShieldCheck size={13} /> Verified
                    </span>
                  </div>

                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    <span className="text-[#FF8A00] font-semibold">{primaryService}</span> • {worker.city}, Pakistan
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                      <Star size={15} className="fill-yellow-400 text-yellow-400" />
                      <span>{worker.rating ? worker.rating.toFixed(1) : '4.9'}</span>
                      <span className="text-gray-400 font-normal">({worker.reviewsCount || (reviews.length ? reviews.length : '2.5k')} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Call Now, WhatsApp, Book Now - exact from reference image) */}
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <a
                  href={`tel:${phoneForCall}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0A1930] hover:bg-[#102747] text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                >
                  <Phone size={15} className="text-[#FF8A00]" />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(worker.fullName)},%20I%20found%20your%20profile%20on%20KarigarPK.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>

                <Link
                  to={`/book/${worker._id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-orange-500/25"
                >
                  <span>Book Now</span>
                  <ExternalLink size={15} />
                </Link>
              </div>
            </div>

            {/* Navigation Tabs (Overview, Services, Reviews, Gallery, Location) */}
            <div className="flex items-center gap-1 border-t border-gray-100 mt-6 pt-4 overflow-x-auto text-xs sm:text-sm">
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
                  className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#0A1930] text-white shadow-sm'
                      : 'text-gray-600 hover:text-[#0A1930] hover:bg-gray-100'
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
          <div className="lg:col-span-8 space-y-6">
            
            {/* About Business Section */}
            {(activeTab === 'overview' || activeTab === 'services') && (
              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-poppins font-bold text-[#0A1930] text-lg sm:text-xl mb-3">
                  About Business
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {worker.bio || `${worker.fullName} is a trusted service center in ${worker.city}, offering quality service, expert technicians and genuine parts.`}
                </p>

                {/* Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8A00]">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Experience</p>
                      <p className="text-[#0A1930] font-bold text-sm">{worker.experience ? `${worker.experience}+ Years` : '5+ Years'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#102747]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Response Time</p>
                      <p className="text-[#0A1930] font-bold text-sm">~25 Mins</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Verification</p>
                      <p className="text-[#0A1930] font-bold text-sm">NADRA Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Checklist */}
            {(activeTab === 'overview' || activeTab === 'services') && (
              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-poppins font-bold text-[#0A1930] text-lg sm:text-xl mb-4">
                  Services
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Array.isArray(worker.services) && worker.services.length > 0 ? worker.services : [primaryService, 'Repair & Maintenance', 'Oil Change', 'Diagnostics', 'Tire Services']).map((svc, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-gray-100">
                      <CheckCircle2 size={16} className="text-[#FF8A00] flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">{svc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Gallery */}
            {(activeTab === 'overview' || activeTab === 'gallery') && (
              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-poppins font-bold text-[#0A1930] text-lg sm:text-xl mb-4">
                  Gallery
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {photoGallery.map((imgSrc, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                      <img
                        src={imgSrc}
                        alt="Project sample"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {(activeTab === 'overview' || activeTab === 'reviews') && (
              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-poppins font-bold text-[#0A1930] text-lg sm:text-xl">
                    Reviews
                  </h3>
                  <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-gray-200 px-3 py-1 rounded-xl">
                    <Star size={15} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[#0A1930] font-bold text-xs">{worker.rating ? worker.rating.toFixed(1) : '4.9'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {(reviews.length > 0 ? reviews : [
                    { customer: { fullName: 'Tariq Mansoor' }, rating: 5, comment: 'Arrived promptly, inspected thoroughly, and fixed the issue with professional equipment.', createdAt: new Date() },
                    { customer: { fullName: 'Zainab Bibi' }, rating: 5, comment: 'Polite, skilled, and honest pricing. Will book again!', createdAt: new Date() }
                  ]).map((rev, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[#0A1930] text-xs">{rev.customer?.fullName || 'Verified Customer'}</span>
                        <span className="text-gray-400 text-[11px]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1.5">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} size={13} className={s < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Map Preview & Booking (matching reference image) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Pricing Card */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm">
              <span className="text-gray-400 text-xs block mb-1">Starting from</span>
              <p className="text-3xl font-black text-[#0A1930] mb-4">
                PKR {worker.hourlyRate || 500}
              </p>

              <Link
                to={`/book/${worker._id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-orange-500/25 mb-4"
              >
                <span>Book Service</span>
                <ExternalLink size={15} />
              </Link>

              {/* Map Preview (from reference image) */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-poppins font-bold text-[#0A1930] text-xs mb-2">Location</h4>
                
                <div className="h-36 rounded-2xl overflow-hidden border border-gray-200 relative bg-slate-100 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                    alt="Map coverage preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#FF8A00] text-white p-2 rounded-full shadow-lg">
                      <MapPin size={18} />
                    </div>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${worker.fullName} ${worker.city} Pakistan`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-[#0A1930] text-xs font-bold py-2 px-3 rounded-xl transition-colors shadow-sm"
                >
                  <MapPin size={13} className="text-[#FF8A00]" />
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
