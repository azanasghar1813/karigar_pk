import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Clock, Phone, CheckCircle2, ShieldCheck, Briefcase, Award, ArrowLeft, AlertCircle, MessageCircle, ExternalLink, Navigation } from 'lucide-react'
import api from '../config/api'
import RatingBadge from '../components/RatingBadge'
import UserAvatar from '../components/UserAvatar'
import MapView from '../components/MapView'
import { SERVICES_CONFIG, CITY_COORDINATES } from '../config/site'

export default function WorkerProfile() {
  const { id } = useParams()
  const [worker, setWorker] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    let isMounted = true
    const fetchWorkerData = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: karigarData } = await api.get(`/karigars/${id}`)
        if (!isMounted) return
        setWorker(karigarData)

        try {
          const { data: reviewsData } = await api.get(`/reviews?karigarId=${id}`)
          if (isMounted) {
            setReviews(Array.isArray(reviewsData) ? reviewsData : [])
          }
        } catch {
          if (isMounted) setReviews([])
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Error fetching karigar:', err)
        setError(err.response?.data?.message || 'Karigar not found')
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
    return (
      <div className="py-24 px-4 bg-[#F5F7FB] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 border border-[#E4EAF2] max-w-md w-full text-center shadow-xl">
          <AlertCircle size={44} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#0A1F44] mb-2">Profile Not Found</h2>
          <p className="text-[#5A6B84] mb-6 text-xs">{error || 'This profile does not exist or has been removed.'}</p>
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

  const primaryService = Array.isArray(worker.services) && worker.services.length > 0 
    ? worker.services[0] 
    : (typeof worker.services === 'string' ? worker.services : 'General Repair')

  // Find category default cover photo (never a screenshot of this website!)
  const matchedConfig = SERVICES_CONFIG.find(s => s.searchKey === primaryService || s.name === primaryService)
  const categoryDefaultCover = matchedConfig ? matchedConfig.image : '/assets/images/electrician_work.jpg'
  const coverImage = worker.coverPhoto || categoryDefaultCover

  // Clean data hygiene check (handles junk database entries like bio "eksjs" or address "ward anana...")
  const cleanCity = (worker.city && worker.city.length >= 3 && !/dnsmss|sjsk|test|asdf/i.test(worker.city)) 
    ? worker.city 
    : 'Pakistan'
  
  const cleanBio = (worker.bio && worker.bio.trim().length >= 25 && !/eksjs|asdf|qwerty|test/i.test(worker.bio))
    ? worker.bio.trim()
    : `Verified and experienced ${primaryService.toLowerCase()} professional serving residential and commercial clients in ${cleanCity}. Specializing in certified installations, routine maintenance, diagnostics, and high-quality repairs with safety guaranteed.`

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

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-5">
          <Link
            to="/find-karigar"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B84] hover:text-[#0A1F44] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Directory
          </Link>
          <span className="text-xs text-[#5A6B84]">
            ID: <span className="font-mono text-[11px]">{worker._id.slice(-6)}</span>
          </span>
        </div>

        {/* Master Profile Container Card (matching Reference 2 "Business Profile Page") */}
        <div className="bg-white border border-[#E4EAF2] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(10,31,68,0.06)] mb-8">
          
          {/* Cover Photo: Full-width rounded cover matching category (NEVER website screenshot) */}
          <div className="h-56 sm:h-72 w-full relative overflow-hidden bg-slate-900">
            <img
              src={coverImage}
              alt={`${worker.fullName} Cover`}
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Profile Header Details (avatar overlaps cover bottom-left without overlapping text) */}
          <div className="px-6 sm:px-8 pb-6 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              
              {/* Avatar + Main Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                
                {/* Avatar: 112px, rounded-2xl, white ring */}
                <div className="relative">
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

                {/* Name, Service & Location Info */}
                <div className="pt-2">
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
                    <span className="text-[#FF7A00] font-bold">{primaryService}</span> • {cleanCity}, Pakistan
                  </p>

                  {/* Rating & Review Count (One Source of Truth) */}
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
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${worker.fullName}, I found your verified profile on KarigarPK and want to inquire about ${primaryService}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>

                <Link
                  to={`/book/${worker._id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 hover:scale-105"
                >
                  <span>Book Now</span>
                  <ExternalLink size={14} />
                </Link>
              </div>

            </div>

            {/* Navigation Tabs (Overview | Services | Reviews (N) | Gallery | Location) */}
            <div className="flex items-center gap-1.5 border-t border-[#E4EAF2] pt-3 overflow-x-auto text-xs sm:text-sm">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'services', label: 'Services' },
                { id: 'reviews', label: `Reviews (${realReviewCount})` },
                ...(worker.gallery && worker.gallery.length > 0 ? [{ id: 'gallery', label: 'Gallery' }] : []),
                { id: 'location', label: 'Location' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
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

        {/* 2-Column Split: Content (Left) + Right Sticky Rail (Starting Rate & Real Map) */}
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

                {/* Real Stats Row — ONLY rendered if real data exists! */}
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

            {/* Services Offered */}
            {(activeTab === 'overview' || activeTab === 'services') && (
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-poppins font-bold text-[#0A1F44] text-lg sm:text-xl mb-4">
                  Services Offered
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Array.isArray(worker.services) && worker.services.length > 0 ? worker.services : [primaryService]).map((srv, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#FF7A00]" />
                        <span className="font-bold text-sm text-[#0A1F44]">{srv}</span>
                      </div>
                      <span className="text-xs font-bold text-[#FF7A00]">
                        Starting PKR {worker.hourlyRate || 500}
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
                    center={mapCenter}
                    zoom={13}
                    popupText={`${worker.fullName} • ${primaryService}`}
                    className="w-full h-full"
                  />
                </div>
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0A1F44] hover:bg-[#FF7A00] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors"
                >
                  <Navigation size={14} />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN (Sticky Rail): Pricing Card + Real Location Map Card */}
          <div className="lg:col-span-4 space-y-6 sticky top-[100px]">
            
            {/* Quick Pricing Card */}
            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 shadow-sm">
              <span className="text-[#5A6B84] text-xs font-semibold block mb-1">Starting from</span>
              <p className="text-3xl font-black text-[#0A1F44] mb-4">
                PKR {worker.hourlyRate || 500}
              </p>

              <Link
                to={`/book/${worker._id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 hover:scale-[1.02] mb-6"
              >
                <span>Book Service</span>
                <ExternalLink size={14} />
              </Link>

              {/* Real Map Card (replacing fake picture!) */}
              <div className="pt-4 border-t border-[#E4EAF2]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-poppins font-bold text-[#0A1F44] text-xs">
                    Location & Map
                  </h4>
                  <span className="text-[11px] text-[#5A6B84] font-medium">{cleanCity}</span>
                </div>

                <div className="h-40 rounded-2xl overflow-hidden border border-[#E4EAF2] relative mb-3">
                  <MapView
                    city={cleanCity}
                    center={mapCenter}
                    zoom={12}
                    popupText={`${worker.fullName} • ${primaryService}`}
                    className="w-full h-full"
                  />
                </div>

                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#0A1F44]/20 hover:border-[#FF7A00] hover:bg-[#FF7A00] text-[#0A1F44] hover:text-white font-bold text-xs transition-colors"
                >
                  <Navigation size={13} />
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
