import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Heart, MapPin, AlertCircle, ArrowRight, Square, CheckSquare, Phone, MessageCircle } from 'lucide-react'
import RatingBadge from './RatingBadge'
import { SERVICES_CONFIG } from '../config/site'
import { isFavorite as checkIsFavorite, toggleFavorite as toggleFavoriteStorage } from '../utils/favorites'
import { useDiscovery } from '../context/DiscoveryContext'

export default function BusinessCard({
  item,
  type = 'listing', // 'listing' | 'karigar'
  isSelected = false,
  isFavorite = false,
  onToggleFavorite = null,
  onSelect = null
}) {
  const isKarigar = type === 'karigar'
  const id = item._id || item.id

  const { toggleCompare, isInCompare } = useDiscovery()
  const inCompare = isInCompare(id)

  const [favState, setFavState] = useState(() => isFavorite || checkIsFavorite(id))

  useEffect(() => {
    setFavState(isFavorite || checkIsFavorite(id))
    const handleFavChange = () => {
      setFavState(checkIsFavorite(id))
    }
    window.addEventListener('karigar_favorites_changed', handleFavChange)
    return () => window.removeEventListener('karigar_favorites_changed', handleFavChange)
  }, [id, isFavorite])

  const handleHeartClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const nowFav = toggleFavoriteStorage(item, type)
    setFavState(nowFav)
    if (onToggleFavorite) onToggleFavorite(id, e)
  }

  // Display Name
  const name = isKarigar ? (item.fullName || 'Verified Professional') : (item.name || 'Local Business')

  // Service label
  const serviceLabel = isKarigar
    ? (Array.isArray(item.services) && item.services.length > 0 ? item.services[0] : (item.services || 'Professional Service'))
    : (item.service || 'Local Service')

  // Image lookup
  const matchedConfig = SERVICES_CONFIG.find(
    s => s.searchKey === serviceLabel || s.name === serviceLabel || (serviceLabel && serviceLabel.toLowerCase().includes(s.searchKey.toLowerCase()))
  )
  const defaultImage = matchedConfig ? matchedConfig.image : '/assets/images/electrician_work.jpg'

  const photo = isKarigar
    ? (item.profilePhoto || defaultImage)
    : (item.photos && item.photos.length > 0 ? item.photos[0] : defaultImage)

  // Location text
  const locationText = isKarigar
    ? `${item.city || 'Pakistan'}`
    : `${item.area ? item.area + ', ' : ''}${item.city || 'Pakistan'}`

  // Phone numbers and sanitized WhatsApp format
  const phone = item.phone || ''
  const cleanDigits = phone.replace(/\D/g, '')
  const waNumber = cleanDigits.startsWith('92')
    ? cleanDigits
    : (cleanDigits.startsWith('0') ? `92${cleanDigits.slice(1)}` : `92${cleanDigits}`)

  // Target link
  const targetUrl = isKarigar ? `/worker/${id}` : `/listing/${id}`

  // Verification status
  const isVerified = isKarigar
    ? item.verificationStatus === 'approved'
    : item.claimStatus === 'verified'

  const isUnclaimed = !isKarigar && item.claimStatus !== 'verified'

  const handleCompareClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCompare({
      _id: id,
      id,
      type,
      name,
      fullName: isKarigar ? item.fullName : undefined,
      service: serviceLabel,
      services: item.services,
      profilePhoto: item.profilePhoto,
      photos: item.photos,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      verificationStatus: item.verificationStatus,
      claimStatus: item.claimStatus,
      hourlyRate: item.hourlyRate,
      phone: item.phone,
      city: item.city,
      area: item.area,
      coordinates: item.coordinates,
      isOnline: item.isOnline,
      workingDays: item.workingDays,
      workingHours: item.workingHours
    })
  }

  return (
    <div
      onClick={() => onSelect && onSelect(id)}
      className={`bg-white rounded-2xl border transition-all duration-150 flex flex-col justify-between overflow-hidden cursor-pointer group ${
        isSelected
          ? 'border-[#FF7A00] shadow-[0_8px_30px_rgba(255,122,0,0.15)] ring-2 ring-[#FF7A00]/20'
          : inCompare
          ? 'border-[#FF7A00]/60 ring-2 ring-[#FF7A00]/10 shadow-sm'
          : 'border-[#E4EAF2] hover:border-gray-300 shadow-[0_4px_16px_rgba(10,31,68,0.05)] hover:shadow-md'
      }`}
    >
      <div>
        {/* Photo Container */}
        <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = '/assets/images/electrician_work.jpg'
            }}
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5">
            {isVerified ? (
              <div className="bg-[#0A1F44]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <ShieldCheck size={12} className="text-[#22C55E]" />
                <span>Verified</span>
              </div>
            ) : isUnclaimed ? (
              <div className="bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <AlertCircle size={11} />
                <span>Unclaimed</span>
              </div>
            ) : null}
          </div>

          {/* Top Right Actions: Compare Checkbox + Favorite Heart */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={handleCompareClick}
              className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm transition-all active:scale-90 cursor-pointer ${
                inCompare
                  ? 'bg-[#FF7A00] text-white ring-2 ring-white'
                  : 'bg-white/90 text-[#0A1F44] hover:bg-white hover:text-[#FF7A00]'
              }`}
              title={inCompare ? "Remove from comparison" : "Compare this business"}
              aria-label="Compare"
            >
              {inCompare ? (
                <CheckSquare size={14} className="text-white" />
              ) : (
                <Square size={14} />
              )}
            </button>

            <button
              type="button"
              onClick={handleHeartClick}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm transition-transform active:scale-90 cursor-pointer"
              aria-label="Favorite"
            >
              <Heart size={13} className={favState ? 'fill-red-500 text-red-500' : ''} />
            </button>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-3.5">
          <h3 className="font-poppins font-bold text-sm text-[#0A1F44] truncate" title={name}>
            {name}
          </h3>
          <p className="text-xs text-[#5A6B84] font-medium mt-0.5 mb-1.5 truncate">
            {serviceLabel}
          </p>

          {/* Rating Display */}
          <div className="mb-2">
            {isKarigar ? (
              <RatingBadge rating={item.rating} reviewsCount={item.reviewsCount} size="sm" />
            ) : item.rating !== null && item.rating > 0 ? (
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#0A1F44]">
                <RatingBadge rating={item.rating} reviewsCount={null} size="sm" />
              </div>
            ) : (
              <span className="text-[11px] text-[#5A6B84] italic">
                Directory Record
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-[#5A6B84] truncate">
            <MapPin size={12} className="text-[#FF7A00] flex-shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>
        </div>
      </div>

      {/* Card Bottom */}
      <div className="p-3.5 pt-0 space-y-2">
        <div className="border-t border-[#E4EAF2] pt-2 flex items-center justify-between">
          <span className="text-[11px] text-[#5A6B84]">
            {isKarigar ? 'Starting from' : 'Contact'}
          </span>
          <span className="text-xs font-black text-[#0A1F44] truncate max-w-[130px]">
            {isKarigar
              ? (item.hourlyRate ? `PKR ${item.hourlyRate}` : '—')
              : phone ? (
                <a
                  href={`tel:${phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-[#FF7A00] underline decoration-[#FF7A00]/40 transition-colors"
                  title="Direct call"
                >
                  {phone}
                </a>
              ) : 'Public Directory'}
          </span>
        </div>

        {/* Direct Call & WhatsApp Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          {phone ? (
            <a
              href={`tel:${phone}`}
              onClick={(e) => e.stopPropagation()}
              className="py-1.5 px-2 rounded-xl bg-[#0A1F44] hover:bg-[#102747] text-white text-[11px] font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              title="Direct call"
            >
              <Phone size={12} className="text-[#FF7A00]" />
              <span>Call</span>
            </a>
          ) : (
            <button
              disabled
              onClick={(e) => e.stopPropagation()}
              className="py-1.5 px-2 rounded-xl bg-gray-100 text-gray-400 text-[11px] font-medium inline-flex items-center justify-center gap-1 cursor-not-allowed"
            >
              <Phone size={12} />
              <span>Call N/A</span>
            </button>
          )}

          {phone ? (
            <a
              href={`https://wa.me/${waNumber}?text=Assalam-o-Alaikum,%20maine%20aap%20ki%20listing%20KarigarPK%20par%20dekhi%20hai.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              title="Direct WhatsApp"
            >
              <MessageCircle size={12} />
              <span>WhatsApp</span>
            </a>
          ) : (
            <button
              disabled
              onClick={(e) => e.stopPropagation()}
              className="py-1.5 px-2 rounded-xl bg-gray-100 text-gray-400 text-[11px] font-medium inline-flex items-center justify-center gap-1 cursor-not-allowed"
            >
              <MessageCircle size={12} />
              <span>WA N/A</span>
            </button>
          )}
        </div>

        <Link
          to={targetUrl}
          className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl border border-[#0A1F44]/20 hover:border-[#FF7A00] hover:bg-[#FF7A00] text-[#0A1F44] hover:text-white font-bold text-xs transition-colors"
        >
          <span>View Profile</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  )
}
