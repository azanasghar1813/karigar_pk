import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShieldCheck, MapPin, Phone, MessageCircle, ArrowLeft, ExternalLink, AlertCircle, Building2, Wrench, CheckCircle2, Info, Share2, Clock, CalendarCheck } from 'lucide-react'
import api from '../config/api'
import { SERVICES_CONFIG, CITY_COORDINATES } from '../config/site'
import RatingBadge from '../components/RatingBadge'
import MapView from '../components/MapView'
import { useAuth } from '../context/AuthContext'

export default function ListingProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    let isMounted = true

    const fetchListing = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/listings/${id}`)
        if (!isMounted) return
        if (res.data) {
          setListing(res.data)
        } else {
          setError('Directory listing not found.')
        }
      } catch (err) {
        if (!isMounted) return
        console.error('ListingProfile fetch error:', err)
        setError('Ye listing nahi mili — ho sakta hai link ghalat ho ya listing hata di gayi ho.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) {
      fetchListing()
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
          <p className="text-[#0A1F44] font-bold text-sm">Loading Directory Listing...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="py-24 px-4 bg-[#F5F7FB] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 border border-[#E4EAF2] max-w-md w-full text-center shadow-xl">
          <AlertCircle size={44} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#0A1F44] mb-2 font-poppins">Listing Nahi Mili</h2>
          <p className="text-[#5A6B84] mb-6 text-sm leading-relaxed">
            {error || 'Ye listing nahi mili — ho sakta hai link ghalat ho ya listing hata di gayi ho.'}
          </p>
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

  // Cover photo based on service category
  const matchedService = SERVICES_CONFIG.find(
    s => s.searchKey === listing.service || s.name === listing.service || (listing.service && listing.service.includes(s.searchKey))
  )
  const coverImage = (listing.photos && listing.photos.length > 0)
    ? listing.photos[0]
    : (matchedService ? matchedService.image : '/assets/images/electrician_work.jpg')

  // Clean phone and WhatsApp
  const rawPhone = listing.phone || ''
  const rawWhatsApp = listing.whatsapp || listing.phone || ''
  const cleanDigits = rawWhatsApp.replace(/\D/g, '')
  const waNumber = cleanDigits.startsWith('92') ? cleanDigits : (cleanDigits.startsWith('0') ? `92${cleanDigits.slice(1)}` : `92${cleanDigits}`)

  // City & area coordinates for Leaflet
  const cityCoords = CITY_COORDINATES[listing.city] || CITY_COORDINATES['Karachi']
  const mapCenter = listing.coordinates?.lat && listing.coordinates?.lng
    ? { lat: listing.coordinates.lat, lng: listing.coordinates.lng }
    : { lat: cityCoords.lat, lng: cityCoords.lng }

  const mapMarkers = [
    {
      id: listing._id,
      name: listing.name,
      service: listing.service,
      price: null,
      lat: mapCenter.lat,
      lng: mapCenter.lng
    }
  ]

  const claimedById = typeof listing.claimedBy === 'object' && listing.claimedBy !== null
    ? (listing.claimedBy._id || listing.claimedBy.id)
    : listing.claimedBy

  const currentUserId = user?._id || user?.id

  // Only the logged-in claimant can see their pending claim under review status.
  // For the general public, the profile remains the normal unclaimed directory listing until approved.
  const isClaimant = Boolean(
    claimedById && currentUserId && String(claimedById) === String(currentUserId)
  )

  const isVerified = listing.claimStatus === 'verified'
  const isPendingForClaimant = listing.claimStatus === 'pending' && isClaimant
  const isUnclaimed = !isVerified && !isPendingForClaimant

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-6 pb-32 md:pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
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
          
          {/* Cover Photo */}
          <div className="h-48 sm:h-64 w-full relative overflow-hidden bg-slate-900">
            <img
              src={coverImage}
              alt={`${listing.name} Cover`}
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Top Right Badges */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-600/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md">
                  <ShieldCheck size={14} /> Verified Business
                </span>
              ) : isPendingForClaimant ? (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md">
                  <Clock size={14} /> Claim Under Review
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-slate-800/85 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  <AlertCircle size={13} /> Unclaimed Listing
                </span>
              )}
            </div>
          </div>

          {/* Profile Header Details on Pure White Card Surface */}
          <div className="px-6 sm:px-8 pb-6 pt-4 relative bg-white">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
              
              {/* Business Name, Service & Area */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1F44] leading-tight">
                    {listing.name}
                  </h1>

                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      <ShieldCheck size={13} className="text-[#22C55E]" /> Verified Professional
                    </span>
                  ) : isPendingForClaimant ? (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      <Clock size={13} className="text-amber-600" /> Claim Under Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      Unclaimed Directory
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#5A6B84] font-medium flex-wrap">
                  <span className="text-[#FF7A00] font-bold inline-flex items-center gap-1">
                    <Wrench size={14} /> {listing.service}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} className="text-[#0A1F44]" />
                    {listing.area ? `${listing.area}, ` : ''}{listing.city}, Pakistan
                  </span>
                </div>

                {/* Honest Rating Display: only if present */}
                <div className="pt-1">
                  {listing.rating !== null && listing.rating > 0 ? (
                    <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                      <Star size={14} className="fill-[#FF7A00] text-[#FF7A00]" />
                      <span className="font-extrabold text-[#0A1F44] text-xs sm:text-sm">{Number(listing.rating).toFixed(1)}</span>
                      <span className="text-[11px] text-[#5A6B84] font-medium">Public Rating</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#5A6B84] italic">
                      Public directory listing (Not yet rated on platform)
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Call Now, WhatsApp, Book / Claim Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                {rawPhone ? (
                  <a
                    href={`tel:${rawPhone}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#0A1F44] hover:bg-[#102747] text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                  >
                    <Phone size={14} className="text-[#FF7A00]" />
                    <span>Call ({rawPhone})</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-1.5 bg-gray-100 text-gray-400 font-bold py-2.5 px-4 rounded-xl text-xs cursor-not-allowed"
                  >
                    <Phone size={14} />
                    <span>No phone published</span>
                  </button>
                )}

                {rawWhatsApp && cleanDigits.length >= 7 && (
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${listing.name}, I found your business listing on KarigarPK and would like to inquire about your services.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp</span>
                  </a>
                )}

                {/* Primary Action Button: Book Now (if verified) / Under Review (if claimant) / Claim Button (if unclaimed or general public) */}
                {isVerified ? (
                  <Link
                    to={`/book?listingId=${listing._id}&name=${encodeURIComponent(listing.name)}&service=${encodeURIComponent(listing.service)}&city=${encodeURIComponent(listing.city)}${listing.claimedBy ? `&karigarId=${listing.claimedBy}` : ''}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 hover:scale-[1.02]"
                  >
                    <CalendarCheck size={15} />
                    <span>Book Now</span>
                  </Link>
                ) : isPendingForClaimant ? (
                  <span className="inline-flex items-center justify-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm">
                    <Clock size={15} className="text-amber-600" />
                    <span>Claim Under Review</span>
                  </span>
                ) : (
                  <Link
                    to={`/claim/${listing._id}`}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 hover:scale-[1.02]"
                  >
                    <span>Is this your business? Claim it — it's FREE</span>
                  </Link>
                )}
              </div>

            </div>

            {/* In-Page Navigation Tabs */}
            <div className="flex items-center gap-2 border-t border-[#E4EAF2] pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#0A1F44] text-white shadow-sm'
                    : 'text-[#5A6B84] hover:text-[#0A1F44] hover:bg-gray-100'
                }`}
              >
                Overview & Address
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'map'
                    ? 'bg-[#0A1F44] text-white shadow-sm'
                    : 'text-[#5A6B84] hover:text-[#0A1F44] hover:bg-gray-100'
                }`}
              >
                Location Map
              </button>
            </div>

          </div>
        </div>

        {/* 2-Column Split: Content (Left) + Right Claim Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Overview & Map */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Overview / Directory Information Card */}
            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-poppins font-bold text-[#0A1F44] text-lg sm:text-xl mb-4">
                Directory Record Details
              </h2>

              <div className="space-y-4 text-sm text-[#0E1E3A]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#E4EAF2]">
                  <div>
                    <span className="text-xs text-[#5A6B84] block mb-1">Business Name</span>
                    <p className="font-bold text-[#0A1F44]">{listing.name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-[#5A6B84] block mb-1">Service Category</span>
                    <p className="font-bold text-[#FF7A00]">{listing.service}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#E4EAF2]">
                  <div>
                    <span className="text-xs text-[#5A6B84] block mb-1">Operating City & Area</span>
                    <p className="font-semibold text-[#0A1F44]">
                      {listing.area ? `${listing.area}, ` : ''}{listing.city}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-[#5A6B84] block mb-1">Address / Landmark</span>
                    <p className="text-[#0E1E3A]">
                      {listing.address || `Located in ${listing.area || listing.city}, Pakistan`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-[#5A6B84] block mb-1">Public Contact</span>
                    <p className="font-semibold text-[#0A1F44]">
                      {listing.phone || 'Contact via Directory Listing'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-[#5A6B84] block mb-1">Directory Source</span>
                    <p className="text-xs text-[#5A6B84] flex items-center gap-1.5">
                      <span>{listing.source || 'Public Directory Record'}</span>
                      {listing.sourceUrl && (
                        <a
                          href={listing.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF7A00] hover:underline inline-flex items-center gap-0.5"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Area Map Card */}
            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins font-bold text-[#0A1F44] text-lg sm:text-xl">
                  Area Map Location
                </h3>
                <span className="text-xs text-[#5A6B84]">
                  Centered on {listing.area || listing.city}
                </span>
              </div>

              <div className="h-72 w-full rounded-2xl overflow-hidden border border-[#E4EAF2] shadow-inner">
                <MapView
                  city={listing.city}
                  center={mapCenter}
                  zoom={13}
                  markers={mapMarkers}
                  className="h-full w-full"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#5A6B84]">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#FF7A00]" />
                  {listing.address || `${listing.area ? listing.area + ', ' : ''}${listing.city}, Pakistan`}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.name}, ${listing.address || listing.area || listing.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#FF7A00] hover:text-[#F06400] inline-flex items-center gap-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Claim Card & Quick Help */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status-Aware Card */}
            {isVerified ? (
              <div className="bg-gradient-to-br from-[#0A1F44] to-[#102747] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck size={26} />
                </div>

                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-1">
                  Verified Partner
                </span>

                <h3 className="font-poppins text-lg font-bold text-white mb-2 leading-tight">
                  Verified Business Profile
                </h3>

                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  <strong>{listing.name}</strong> is an officially verified professional on KarigarPK. You can book guaranteed services directly with transparent pricing and customer protection.
                </p>

                <Link
                  to={`/book?listingId=${listing._id}&name=${encodeURIComponent(listing.name)}&service=${encodeURIComponent(listing.service)}&city=${encodeURIComponent(listing.city)}${listing.claimedBy ? `&karigarId=${listing.claimedBy}` : ''}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 hover:scale-[1.02]"
                >
                  <CalendarCheck size={16} />
                  <span>Book Online Now</span>
                </Link>

                {listing.claimedBy && (
                  <Link
                    to={`/worker/${listing.claimedBy}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-4 rounded-xl text-xs mt-2.5 transition-all"
                  >
                    <span>View Verified Pro Profile →</span>
                  </Link>
                )}
              </div>
            ) : isPendingForClaimant ? (
              <div className="bg-gradient-to-br from-[#0A1F44] to-[#102747] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <Clock size={26} />
                </div>

                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
                  Claim In Progress
                </span>

                <h3 className="font-poppins text-lg font-bold text-white mb-2 leading-tight">
                  Verification Under Review
                </h3>

                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  A claim application for <strong>{listing.name}</strong> was submitted and is currently being verified by the KarigarPK administrative desk. Response within 24 hours.
                </p>

                <div className="bg-white/10 rounded-xl p-3 text-xs text-gray-200 flex items-center gap-2">
                  <Info size={16} className="text-amber-400 flex-shrink-0" />
                  <span>If you are the owner, check your Karigar Dashboard for status updates.</span>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#0A1F44] to-[#102747] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#FF7A00] mb-4">
                  <Building2 size={24} />
                </div>

                <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-1">
                  Business Owner?
                </span>

                <h3 className="font-poppins text-lg font-bold text-white mb-2 leading-tight">
                  Claim this business profile
                </h3>

                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  Are you the owner or manager of <strong>{listing.name}</strong>? Claiming your profile is 100% free and allows you to update operating hours, add photos, verify credentials, and receive customer bookings.
                </p>

                <Link
                  to={`/claim/${listing._id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 hover:scale-[1.02]"
                >
                  <span>Claim It — It's 100% FREE</span>
                </Link>

                <p className="text-[10px] text-gray-400 text-center mt-3">
                  Instant SMS OTP verification. Free for Pakistani businesses.
                </p>
              </div>
            )}

            {/* Support / Inquiries Box */}
            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 shadow-sm">
              <h4 className="font-poppins font-bold text-[#0A1F44] text-sm mb-2">
                Need Help with this Listing?
              </h4>
              <p className="text-xs text-[#5A6B84] leading-relaxed mb-4">
                If information on this business listing is outdated or needs correction, contact our directory operations desk.
              </p>
              <a
                href="mailto:karigarpk.live@gmail.com?subject=Directory%20Listing%20Update%20Request"
                className="text-xs font-bold text-[#FF7A00] hover:text-[#F06400] transition-colors"
              >
                karigarpk.live@gmail.com →
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-[56px] left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md px-3.5 py-2.5 border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(10,31,68,0.1)] flex items-center justify-between gap-2">
        {rawPhone ? (
          <a
            href={`tel:${rawPhone}`}
            className="flex-1 py-2.5 px-2 rounded-xl bg-[#0A1F44] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform truncate"
          >
            <Phone size={13} className="text-[#FF7A00] flex-shrink-0" />
            <span className="truncate">Call</span>
          </a>
        ) : null}

        {rawWhatsApp && cleanDigits.length >= 7 ? (
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${listing.name}, I found your business listing on KarigarPK and would like to inquire about your services.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-2 rounded-xl bg-[#22C55E] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform truncate"
          >
            <MessageCircle size={14} className="flex-shrink-0" />
            <span className="truncate">WhatsApp</span>
          </a>
        ) : null}

        {isVerified ? (
          <Link
            to={`/book?listingId=${listing._id}&name=${encodeURIComponent(listing.name)}&service=${encodeURIComponent(listing.service)}&city=${encodeURIComponent(listing.city)}${listing.claimedBy ? `&karigarId=${listing.claimedBy}` : ''}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF7A00] text-white text-xs font-bold inline-flex items-center justify-center gap-1 shadow-md shadow-orange-500/25 active:scale-95 transition-transform truncate"
          >
            <CalendarCheck size={14} className="flex-shrink-0" />
            <span>Book</span>
          </Link>
        ) : isPendingForClaimant ? (
          <span className="flex-1 py-2.5 px-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-[11px] font-bold text-center truncate">
            Under Review
          </span>
        ) : (
          <Link
            to={`/claim/${listing._id}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF7A00] text-white text-xs font-bold inline-flex items-center justify-center gap-1 shadow-md shadow-orange-500/25 active:scale-95 transition-transform truncate"
          >
            <span>Claim Free</span>
          </Link>
        )}
      </div>

    </div>
  )
}
