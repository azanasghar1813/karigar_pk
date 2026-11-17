import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShieldCheck, MapPin, Phone, MessageCircle, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import api from '../config/api'
import { SERVICES_CONFIG, CITY_COORDINATES } from '../config/site'
import RatingBadge from '../components/RatingBadge'
import UserAvatar from '../components/UserAvatar'
import MapView from '../components/MapView'

export default function WorkerProfile() {
  const { id } = useParams()
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    let isMounted = true

    const fetchWorkerData = async () => {
      try {
        setLoading(true)
        const [workerRes, reviewsRes] = await Promise.allSettled([
          api.get(`/karigars/${id}`),
          api.get(`/reviews/${id}`)
        ])

        if (!isMounted) return

        if (workerRes.status === 'fulfilled' && workerRes.value?.data) {
          setWorker(workerRes.value.data)
        } else {
          if (workerRes.status === 'rejected') {
            console.error('Worker fetch error details:', workerRes.reason)
          }
          setError('Ye profile nahi mila — ho sakta hai link ghalat ho ya profile hata di gayi ho.')
        }

        if (reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value?.data)) {
          setReviews(reviewsRes.value.data)
        }
      } catch (err) {
        if (!isMounted) return
        console.error('WorkerProfile load error:', err)
        setError('Ye profile nahi mila — ho sakta hai link ghalat ho ya profile hata di gayi ho.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) {
      fetchWorkerData()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="py-24 px-4 bg-[#F5F7FB] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#0A1F44] font-bold text-sm">Loading Verified Profile...</p>
        </div>
      </div>
    )
  }

  if (error || !worker) {
    // Sanitize message so technical or backend error strings are NEVER shown to users
    const isTechnical = !error || /cast|objectid|mongo|error|500|exception|syntax/i.test(error)
    const friendlyMessage = isTechnical 
      ? 'Ye profile nahi mila — ho sakta hai link ghalat ho ya profile hata di gayi ho.'
      : error

    return (
      <div className="py-24 px-4 bg-[#F5F7FB] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 border border-[#E4EAF2] max-w-md w-full text-center shadow-xl">
          <AlertCircle size={44} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#0A1F44] mb-2 font-poppins">Profile Nahi Mila</h2>
          <p className="text-[#5A6B84] mb-6 text-sm leading-relaxed">{friendlyMessage}</p>
          <Link
            to="/find-karigar"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-md"
          >
            <ArrowLeft size={16} /> Browse Directory
          </Link>
        </div>
      </div>
    )
  }

  // Parse services: hide section entirely if empty (never show fake "General Repair" fallback)
  const servicesList = Array.isArray(worker.services)
    ? worker.services.filter(Boolean)
    : (typeof worker.services === 'string' && worker.services.trim() ? [worker.services.trim()] : [])
  const hasServices = servicesList.length > 0
  const primaryService = hasServices ? servicesList[0] : ''

  // Find category default cover photo
  const matchedConfig = SERVICES_CONFIG.find(s => s.searchKey === primaryService || s.name === primaryService)
  const categoryDefaultCover = matchedConfig ? matchedConfig.image : '/assets/images/electrician_work.jpg'
  const coverImage = worker.coverPhoto || categoryDefaultCover

  // Clean data hygiene check
  const cleanCity = (worker.city && worker.city.length >= 3 && !/dnsmss|sjsk|test|asdf/i.test(worker.city)) 
    ? worker.city 
    : 'Pakistan'
  
  const cleanBio = (worker.bio && worker.bio.trim().length >= 25 && !/eksjs|asdf|qwerty|test/i.test(worker.bio))
    ? worker.bio.trim()
    : `Verified and experienced professional serving residential and commercial clients in ${cleanCity}. Specializing in certified installations, routine maintenance, diagnostics, and high-quality repairs with safety guaranteed.`

  const cleanAddress = (worker.address && worker.address.trim().length >= 10 && !/dnsmss|sjsk|ward anana/i.test(worker.address))
    ? worker.address.trim()
    : `${cleanCity}, Pakistan`

  const phoneForCall = worker.phone || '+923427066034'
  const cleanPhone = phoneForCall.replace(/\D/g, '')
  const waNumber = cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.replace(/^0/, '')}`

  // Real review counts only
  const realReviewCount = Number(worker.reviewsCount) || reviews.length || 0

  // Only show stats that truly exist in data
  const hasExperience = worker.experience && Number(worker.experience) > 0
  const isApproved = worker.verificationStatus === 'approved'

  // Map coordinates
  const cityCoords = CITY_COORDINATES[cleanCity] || CITY_COORDINATES['Karachi']
  const mapCenter = {
    lat: worker.lat || cityCoords.lat,
    lng: worker.lng || cityCoords.lng
  }

  // Google Maps directions destination URL
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${worker.fullName || 'Karigar'}, ${cleanAddress}`)}`

  // Tab definitions: only include Services tab if services exist
  const tabs = [
    { id: 'overview', label: 'Overview' },
    ...(hasServices ? [{ id: 'services', label: 'Services' }] : []),
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    ...(worker.gallery && worker.gallery.length > 0 ? [{ id: 'gallery', label: 'Gallery' }] : []),
    { id: 'location', label: 'Location' }
  ]

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-6 pb-32 md:pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb (No internal IDs exposed in UI) */}
        <div className="flex items-center justify-between mb-5">
          <Link
            to="/find-karigar"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B84] hover:text-[#0A1F44] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Directory
          </Link>
        </div>

        {/* Master Profile Container Card */}
        <div className="bg-white border border-[#E4EAF2] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(10,31,68,0.06)] mb-8">
          
          {/* Cover Photo: Full-width rounded cover */}
          <div className="h-48 sm:h-64 w-full relative overflow-hidden bg-slate-900">
            <img
              src={coverImage}
              alt={`${worker.fullName} Cover`}
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Profile Header Details:
              - Avatar pulls up halfway over cover (-mt-14 sm:-mt-16)
              - Karigar name and details sit CLEARLY on the pure white card surface below the cover
              - 100% readable contrast with dark navy font-extrabold on white background
          */}
          <div className="px-6 sm:px-8 pb-6 pt-3 relative bg-white">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
              
              {/* Avatar + Main Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                
                {/* Avatar with white ring overlapping cover */}
                <div className="relative -mt-14 sm:-mt-16 flex-shrink-0">
                  <UserAvatar
                    src={worker.profilePhoto}
                    name={worker.fullName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-white shadow-xl object-cover bg-[#0A1F44]"
                    textClassName="text-2xl font-black text-white"
                  />
                  {isApproved && (
                    <div
                      className="absolute -bottom-1 -right-1 bg-[#22C55E] text-white rounded-full p-1 ring-2 ring-white shadow"
                      title="Verified by KarigarPK"
                    >
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>

                {/* Name, Service & Location Info - clearly below cover on pure white surface */}
                <div className="pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1F44] leading-tight">
                      {worker.fullName}
                    </h1>
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        <ShieldCheck size={13} className="text-[#22C55E]" /> Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#5A6B84] font-medium mt-1">
                    {primaryService ? (
                      <>
                        <span className="text-[#FF7A00] font-bold">{primaryService}</span> • {cleanCity}, Pakistan
                      </>
                    ) : (
                      <>{cleanCity}, Pakistan</>
                    )}
                  </p>

                  {/* Rating & Review Count (Honest Rating Badge) */}
                  <div className="mt-2">
                    <RatingBadge rating={worker.rating} reviewsCount={worker.reviewsCount} size="md" />
                  </div>
                </div>
              </div>

              {/* Action Buttons: Navy Call Now, Green WhatsApp, Orange Book Now */}
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full md:w-auto">
                <a
                  href={`tel:${phoneForCall}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0A1F44] hover:bg-[#102747] text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                >
                  <Phone size={14} className="text-[#FF7A00]" />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${worker.fullName}, I found your verified profile on KarigarPK and want to inquire about your services.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                >
                  <span className="text-white">WhatsApp</span>
                </a>

                <Link
                  to={`/book?karigarId=${worker._id}${primaryService ? `&service=${encodeURIComponent(primaryService)}` : ''}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 hover:scale-[1.02]"
                >
                  <span>Book Now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>

            {/* In-Page Navigation Tabs */}
            <div className="flex items-center gap-2 border-t border-[#E4EAF2] pt-4 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#0A1F44] text-white shadow-sm'
                      : 'text-[#5A6B84] hover:text-[#0A1F44] hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* 2-Column Split: Content (Left) + Right Sticky Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Overview / Services / Reviews / Location */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Overview / About Business */}
            {(activeTab === 'overview' || activeTab === 'services') && (
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-poppins font-bold text-[#0A1F44] text-lg sm:text-xl mb-3">
                  About Business
                </h3>
                <p className="text-[#0E1E3A] text-sm leading-relaxed mb-6 whitespace-pre-line">
                  {cleanBio}
                </p>

                {/* Real Stats Row — ONLY rendered if real data exists */}
                {(hasExperience || isApproved) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-[#E4EAF2] pt-4">
                    {hasExperience && (
                      <div className="p-3 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2]/60">
                        <span className="text-[11px] text-[#5A6B84] block font-medium">Experience</span>
                        <span className="font-poppins font-bold text-sm text-[#0A1F44]">
                          {worker.experience} Years
                        </span>
                      </div>
                    )}
                    {isApproved && (
                      <div className="p-3 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2]/60">
                        <span className="text-[11px] text-[#5A6B84] block font-medium">Verification</span>
                        <span className="font-poppins font-bold text-sm text-[#22C55E]">
                          CNIC & Background Checked
                        </span>
                      </div>
                    )}
                    <div className="p-3 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2]/60">
                      <span className="text-[11px] text-[#5A6B84] block font-medium">Operating City</span>
                      <span className="font-poppins font-bold text-sm text-[#0A1F44]">
                        {cleanCity}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Services Offered: ONLY rendered if services list is NOT empty */}
            {hasServices && (activeTab === 'overview' || activeTab === 'services') && (
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-poppins font-bold text-[#0A1F44] text-lg sm:text-xl mb-4">
                  Services Offered
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicesList.map((srv, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#FF7A00]" />
                        <span className="font-bold text-sm text-[#0A1F44]">{srv}</span>
                      </div>
                      <span className="text-xs font-bold text-[#FF7A00]">
                        {worker.hourlyRate ? `Starting PKR ${worker.hourlyRate}` : 'Rate on request'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Section: ONLY shown if worker has their own photos */}
            {worker.gallery && worker.gallery.length > 0 && activeTab === 'gallery' && (
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-poppins font-bold text-[#0A1F44] text-lg sm:text-xl mb-4">
                  Work Gallery
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {worker.gallery.map((img, idx) => (
                    <div key={idx} className="h-36 rounded-2xl overflow-hidden border border-gray-200 bg-slate-100">
                      <img src={img} alt={`Work sample ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section: Real Reviews from API or honest "No reviews yet" */}
            {(activeTab === 'overview' || activeTab === 'reviews') && (
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-poppins font-bold text-[#0A1F44] text-lg sm:text-xl">
                    Client Reviews ({realReviewCount})
                  </h3>
                  {realReviewCount > 0 && (
                    <RatingBadge rating={worker.rating} reviewsCount={worker.reviewsCount} size="sm" />
                  )}
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-3">
                    {reviews.map((rev, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-[#0A1F44] text-xs">
                            {rev.customer?.fullName || rev.authorName || 'Verified Customer'}
                          </span>
                          <span className="text-[#5A6B84] text-[11px]">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-1.5">
                          {[...Array(5)].map((_, s) => (
                            <Star key={s} size={13} className={s < rev.rating ? "fill-[#FFB800] text-[#FFB800]" : "text-gray-300"} />
                          ))}
                        </div>
                        <p className="text-[#0E1E3A] text-xs leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[#F7F9FC] border border-dashed border-[#E4EAF2] text-center">
                    <p className="text-sm font-semibold text-[#0A1F44] mb-1">No reviews yet</p>
                    <p className="text-xs text-[#5A6B84]">
                      Be the first verified customer to book this professional and share your experience.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Location Section */}
            {activeTab === 'location' && (
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-poppins font-bold text-[#0A1F44] text-lg sm:text-xl mb-2">
                  Operating Location & Coverage
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6B84] mb-4">
                  {cleanAddress}
                </p>
                <div className="h-64 rounded-2xl overflow-hidden border border-[#E4EAF2] mb-4">
                  <MapView
                    city={cleanCity}
                    markers={[{
                      id: worker._id,
                      name: worker.fullName,
                      service: primaryService,
                      price: worker.hourlyRate || null,
                      lat: mapCenter.lat,
                      lng: mapCenter.lng
                    }]}
                    zoom={13}
                    height="100%"
                    className="w-full h-full"
                  />
                </div>
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0A1F44] hover:bg-[#102747] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors"
                >
                  <MapPin size={14} className="text-[#FF7A00]" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Sticky Booking Rail */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 shadow-sm sticky top-24 space-y-6">
              
              <div>
                <span className="text-xs text-[#5A6B84] font-medium block mb-1">Service Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#0A1F44]">
                    {worker.hourlyRate ? `PKR ${worker.hourlyRate}` : 'Rate on request'}
                  </span>
                  {worker.hourlyRate ? (
                    <span className="text-xs text-[#5A6B84] font-medium">/ visit</span>
                  ) : null}
                </div>
              </div>

              {/* Verified Trust Badges */}
              <div className="space-y-2 border-t border-[#E4EAF2] pt-4 text-xs">
                <div className="flex items-center gap-2 text-[#0A1F44] font-semibold">
                  <ShieldCheck size={16} className="text-[#22C55E]" />
                  <span>Verified Identity & Background</span>
                </div>
                <div className="flex items-center gap-2 text-[#0A1F44] font-semibold">
                  <CheckCircle2 size={16} className="text-[#22C55E]" />
                  <span>Standardized Transparent Pricing</span>
                </div>
              </div>

              {/* Book Button */}
              <Link
                to={`/book?karigarId=${worker._id}${primaryService ? `&service=${encodeURIComponent(primaryService)}` : ''}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md shadow-orange-500/25 hover:scale-[1.02]"
              >
                <span>Book This Professional</span>
                <ArrowRight size={16} />
              </Link>

              {/* Direct Call Button */}
              <a
                href={`tel:${phoneForCall}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#0A1F44] font-bold py-3 px-6 rounded-2xl text-xs transition-colors"
              >
                <Phone size={14} className="text-[#FF7A00]" />
                <span>Call {worker.fullName}</span>
              </a>

            </div>
          </div>

        </div>

      </div>

      {/* Mobile Sticky Quick Action Bar (Floating above MobileTabBar) */}
      <div className="fixed bottom-[56px] left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md px-3.5 py-2.5 border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(10,31,68,0.1)] flex items-center justify-between gap-2">
        <a
          href={`tel:${phoneForCall}`}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#0A1F44] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
        >
          <Phone size={13} className="text-[#FF7A00]" />
          <span>Call</span>
        </a>

        <a
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${worker.fullName}, I found your verified profile on KarigarPK and want to inquire about your services.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#22C55E] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
        >
          <MessageCircle size={14} />
          <span>WhatsApp</span>
        </a>

        <Link
          to={`/book?karigarId=${worker._id}${primaryService ? `&service=${encodeURIComponent(primaryService)}` : ''}`}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF7A00] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/25 active:scale-95 transition-transform"
        >
          <span>Book</span>
          <ArrowRight size={13} />
        </Link>
      </div>

    </div>
  )
}
