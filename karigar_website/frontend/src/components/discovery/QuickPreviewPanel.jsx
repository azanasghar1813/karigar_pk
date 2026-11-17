import { Link } from 'react-router-dom'
import { Phone, MessageCircle, ShieldCheck, AlertCircle, MapPin, ArrowRight, ExternalLink, GitCompare, Calendar, Check, X } from 'lucide-react'
import RatingBadge from '../RatingBadge'
import { SERVICES_CONFIG, getServiceConfig } from '../../config/site'
import { isPakistaniMobileNumber, getWhatsAppNumber } from '../../utils/phone'
import { useDiscovery } from '../../context/DiscoveryContext'

export default function QuickPreviewPanel({
  business,
  onClose = null,
  isMobileModal = false
}) {
  const { compareList, toggleCompare, isInCompare } = useDiscovery()

  if (!business) {
    return (
      <div className="bg-white rounded-3xl border border-[#E4EAF2] p-8 text-center text-[#5A6B84] shadow-sm flex flex-col items-center justify-center min-h-[380px]">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-[#E4EAF2] flex items-center justify-center text-[#94A3B8] mb-3">
          <MapPin size={24} />
        </div>
        <h4 className="font-poppins font-bold text-[#0A1F44] text-sm mb-1">Quick Preview</h4>
        <p className="text-xs max-w-[200px] leading-relaxed">
          Hover or click any business card to view contact details, map location, and direct booking options.
        </p>
      </div>
    )
  }

  const isKarigar = business.type === 'karigar'
  const id = business._id
  const name = isKarigar ? (business.fullName || 'Verified Professional') : (business.name || 'Local Business')
  const serviceLabel = isKarigar
    ? (Array.isArray(business.services) && business.services.length > 0 ? business.services[0] : (business.services || 'Professional Service'))
    : (business.service || 'Local Service')

  const matchedConfig = getServiceConfig(serviceLabel)
  const defaultImage = matchedConfig ? matchedConfig.image : '/assets/images/handyman_service.webp'
  const photo = isKarigar
    ? (business.profilePhoto || defaultImage)
    : (business.photos && business.photos.length > 0 ? business.photos[0] : defaultImage)

  const isVerified = isKarigar
    ? business.verificationStatus === 'approved'
    : business.claimStatus === 'verified'

  const locationText = isKarigar
    ? `${business.city || 'Pakistan'}`
    : `${business.area ? business.area + ', ' : ''}${business.city || 'Pakistan'}`

  const targetUrl = isKarigar ? `/worker/${id}` : `/listing/${id}`
  const phone = business.phone || ''
  const isMobile = isPakistaniMobileNumber(phone)
  const waNumber = getWhatsAppNumber(phone)

  const inCompare = isInCompare(id)

  return (
    <div className={`bg-white rounded-3xl border border-[#E4EAF2] shadow-[0_8px_30px_rgba(10,31,68,0.08)] overflow-hidden flex flex-col justify-between ${isMobileModal ? 'p-5' : 'p-5 sticky top-[150px]'}`}>
      <div>
        {/* Mobile close bar */}
        {isMobileModal && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E4EAF2]">
            <span className="font-poppins font-bold text-xs uppercase text-[#5A6B84] tracking-wider">Business Preview</span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-[#5A6B84]"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header Photo */}
        <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = defaultImage
            }}
          />

          <div className="absolute top-2.5 left-2.5">
            {isVerified ? (
              <span className="bg-[#0A1F44]/95 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <ShieldCheck size={12} className="text-[#22C55E]" />
                <span>Verified Pro</span>
              </span>
            ) : (
              <span className="bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <AlertCircle size={11} />
                <span>Unclaimed Listing</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => toggleCompare(business)}
            className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md flex items-center gap-1 transition-all shadow-sm ${
              inCompare
                ? 'bg-[#FF7A00] text-white'
                : 'bg-white/90 text-[#0A1F44] hover:bg-white'
            }`}
          >
            <GitCompare size={11} />
            <span>{inCompare ? 'In Compare' : '+ Compare'}</span>
          </button>
        </div>

        {/* Business Title & Category */}
        <h3 className="font-poppins font-extrabold text-base text-[#0A1F44] leading-snug mb-1 truncate" title={name}>
          {name}
        </h3>

        <p className="text-xs text-[#FF7A00] font-bold mb-2">
          {serviceLabel}
        </p>

        {/* Rating */}
        <div className="mb-3">
          {isKarigar ? (
            <RatingBadge rating={business.rating} reviewsCount={business.reviewsCount} size="sm" />
          ) : business.rating !== null && business.rating > 0 ? (
            <RatingBadge rating={business.rating} reviewsCount={null} size="sm" />
          ) : (
            <span className="text-[11px] text-[#5A6B84] italic">
              Public Directory Listing
            </span>
          )}
        </div>

        {/* Location info */}
        <div className="flex items-center gap-1.5 text-xs text-[#5A6B84] mb-3">
          <MapPin size={13} className="text-[#FF7A00] flex-shrink-0" />
          <span className="truncate">{locationText}</span>
        </div>

        {/* Price / Contact strip */}
        <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-xl p-3 mb-4 flex items-center justify-between">
          <span className="text-xs text-[#5A6B84]">
            {isKarigar ? 'Estimated Starting Rate' : 'Public Contact'}
          </span>
          <span className="font-poppins font-extrabold text-xs sm:text-sm text-[#0A1F44]">
            {isKarigar ? (business.hourlyRate ? `PKR ${business.hourlyRate}` : '—') : (phone || 'Directory Record')}
          </span>
        </div>
      </div>

      {/* Action Buttons: View Profile, Call, WhatsApp, Book */}
      <div className="space-y-2 pt-2 border-t border-[#E4EAF2]">
        <div className={`grid ${phone && isMobile ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0A1F44] hover:bg-[#102747] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Phone size={13} className="text-[#FF7A00]" />
              <span>{isMobile ? 'Call' : `Call Direct (${phone})`}</span>
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed"
            >
              <Phone size={13} />
              <span>No Call</span>
            </button>
          )}

          {phone && isMobile && (
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${name}, I saw your listing on KarigarPK and want to inquire about services.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold transition-all shadow-xs"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>
          )}
        </div>

        {isKarigar ? (
          <Link
            to={`/book?karigarId=${id}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FF7A00] hover:bg-[#F06400] text-white text-xs font-bold transition-all shadow-sm shadow-orange-500/20"
          >
            <Calendar size={13} />
            <span>Book Verified Service</span>
          </Link>
        ) : (
          <Link
            to={`/register-karigar?claimListingId=${id}&name=${encodeURIComponent(name)}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
          >
            <AlertCircle size={13} className="text-amber-600" />
            <span>Claim Listing (Free)</span>
          </Link>
        )}

        <Link
          to={targetUrl}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-[#0A1F44]/20 hover:border-[#0A1F44] text-[#0A1F44] text-xs font-bold transition-colors"
        >
          <span>View Full Profile</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
