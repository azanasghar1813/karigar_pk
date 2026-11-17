import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  GitCompare,
  X,
  ShieldCheck,
  AlertCircle,
  Phone,
  MessageCircle,
  Calendar,
  Sparkles,
  Award,
  DollarSign,
  Star,
  MapPin,
  Clock,
  Radio,
  ArrowRight
} from 'lucide-react'
import RatingBadge from '../RatingBadge'
import { SERVICES_CONFIG } from '../../config/site'
import { useDiscovery } from '../../context/DiscoveryContext'
import { calculateDistanceKm, formatDistance } from '../../utils/geo'

export default function SmartCompareView({ allItems = [] }) {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    setViewMode,
    userLocation
  } = useDiscovery()

  // Match compare items against allItems or fallback to cached objects
  const compareItems = useMemo(() => {
    return compareList.map((entry) => {
      const targetId = entry._id || entry.id || entry
      const live = allItems.find((item) => (item._id || item.id) === targetId)
      const base = live || (typeof entry === 'object' ? entry : { _id: targetId })

      const isKarigar = base.type === 'karigar'
      const name = isKarigar ? (base.fullName || 'Verified Professional') : (base.name || 'Local Business')
      const service = isKarigar
        ? (Array.isArray(base.services) && base.services.length > 0 ? base.services.join(', ') : (base.services || 'Professional Service'))
        : (base.service || 'Local Service')

      const primaryService = isKarigar
        ? (Array.isArray(base.services) ? base.services[0] : base.services)
        : base.service

      const matchedConfig = SERVICES_CONFIG.find(
        s => s.searchKey === primaryService || s.name === primaryService
      )
      const defaultImage = matchedConfig ? matchedConfig.image : '/assets/images/electrician_work.webp'
      const photo = isKarigar
        ? (base.profilePhoto || defaultImage)
        : (base.photos && base.photos.length > 0 ? base.photos[0] : defaultImage)

      const isVerified = isKarigar
        ? base.verificationStatus === 'approved'
        : base.claimStatus === 'verified'

      const rating = typeof base.rating === 'number' && base.rating > 0 ? base.rating : null
      const reviewsCount = base.reviewsCount || 0
      const hourlyRate = typeof base.hourlyRate === 'number' && base.hourlyRate > 0 ? base.hourlyRate : null

      const coords = base.coordinates && base.coordinates.lat && base.coordinates.lng
        ? base.coordinates
        : null

      const distance = (coords && userLocation?.lat && userLocation?.lng)
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, coords.lat, coords.lng)
        : null

      const isOnline = isKarigar ? Boolean(base.isOnline) : null
      const workingHours = base.workingHours || (base.workingDays ? `${base.workingDays}` : null)

      const phone = base.phone || ''
      const cleanDigits = phone.replace(/\D/g, '')
      const waNumber = cleanDigits.startsWith('92')
        ? cleanDigits
        : (cleanDigits.startsWith('0') ? `92${cleanDigits.slice(1)}` : `92${cleanDigits}`)

      return {
        ...base,
        _id: targetId,
        id: targetId,
        isKarigar,
        name,
        service,
        photo,
        isVerified,
        rating,
        reviewsCount,
        hourlyRate,
        coords,
        distance,
        isOnline,
        workingHours,
        phone,
        waNumber
      }
    })
  }, [compareList, allItems, userLocation])

  // Compute Best Match Row Winners purely from authentic real numbers
  const bestMatches = useMemo(() => {
    if (compareItems.length < 2) return {}

    // 1. Lowest Price (strictly from businesses that have an hourlyRate)
    const withRates = compareItems.filter(i => i.hourlyRate !== null)
    let lowestPriceId = null
    if (withRates.length > 0) {
      const minRate = Math.min(...withRates.map(i => i.hourlyRate))
      const lowestItem = withRates.find(i => i.hourlyRate === minRate)
      lowestPriceId = lowestItem?._id
    }

    // 2. Highest Rating (strictly from businesses with authentic ratings)
    const withRatings = compareItems.filter(i => i.rating !== null)
    let highestRatedId = null
    if (withRatings.length > 0) {
      const maxRating = Math.max(...withRatings.map(i => i.rating))
      const topItem = withRatings.find(i => i.rating === maxRating)
      highestRatedId = topItem?._id
    }

    // 3. Closest Distance (strictly if both user location and business coords exist)
    const withDistance = compareItems.filter(i => i.distance !== null)
    let closestId = null
    if (withDistance.length > 0) {
      const minDistance = Math.min(...withDistance.map(i => i.distance))
      const nearestItem = withDistance.find(i => i.distance === minDistance)
      closestId = nearestItem?._id
    }

    // 4. Available Today (strictly verified karigars who are currently online)
    const onlineItem = compareItems.find(i => i.isOnline === true)
    const availableTodayId = onlineItem?._id || null

    return {
      lowestPriceId,
      highestRatedId,
      closestId,
      availableTodayId
    }
  }, [compareItems])

  // Plain-Language Recommendation Summary Line
  const recommendationSummary = useMemo(() => {
    if (compareItems.length < 2) return ''

    const { lowestPriceId, highestRatedId, closestId, availableTodayId } = bestMatches

    // Check if one business dominates multiple criteria
    const counts = {}
    ;[lowestPriceId, highestRatedId, closestId, availableTodayId].forEach(id => {
      if (id) counts[id] = (counts[id] || 0) + 1
    })

    const topWinnerId = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), null)
    const topItem = compareItems.find(i => i._id === topWinnerId)

    if (topItem && counts[topWinnerId] >= 2) {
      const reasons = []
      if (lowestPriceId === topWinnerId) reasons.push(`munasib price (PKR ${topItem.hourlyRate})`)
      if (closestId === topWinnerId) reasons.push(`sab se qareeb (${topItem.distance} km door)`)
      if (highestRatedId === topWinnerId) reasons.push(`aala rating (${topItem.rating}★)`)
      if (availableTodayId === topWinnerId) reasons.push(`aaj dastiyab`)

      return `${topItem.name} ka intikhab behtareen hai kyunkay un ka ${reasons.join(' aur ')} hai.`
    }

    // Specific highlight comparison
    const lowest = compareItems.find(i => i._id === lowestPriceId)
    const topRated = compareItems.find(i => i._id === highestRatedId)
    const closest = compareItems.find(i => i._id === closestId)

    const parts = []
    if (lowest) parts.push(`${lowest.name} ka starting rate sab se munasib hai (PKR ${lowest.hourlyRate})`)
    if (topRated && topRated._id !== lowest?._id) parts.push(`${topRated.name} ki customer rating sab se behtar hai (${topRated.rating}★)`)
    if (closest && closest._id !== lowest?._id && closest._id !== topRated?._id) parts.push(`${closest.name} aap ke sab se qareeb hain (${closest.distance} km)`)

    if (parts.length > 0) {
      return parts.join(', jabkay ') + '.'
    }

    return `Teeno businesses active local directory providers hain. Direct call ya WhatsApp ke zariye un se rabta karein.`
  }, [compareItems, bestMatches])

  // Render Empty State if fewer than 2 items selected
  if (compareItems.length < 2) {
    return (
      <div className="bg-white rounded-3xl border border-[#E4EAF2] p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF7A00] flex items-center justify-center mx-auto mb-4 shadow-xs">
          <GitCompare size={30} />
        </div>
        
        <h3 className="font-poppins font-extrabold text-xl text-[#0A1F44] mb-2">
          {compareItems.length === 1 ? '1 Business Selected for Comparison' : 'Smart Business Comparison'}
        </h3>
        
        <p className="text-xs sm:text-sm text-[#5A6B84] leading-relaxed mb-6 max-w-md mx-auto">
          {compareItems.length === 1
            ? `You have "${compareItems[0].name}" in your compare list. Select at least 1 more business from the Visual Grid or Explore Areas to see them side-by-side.`
            : 'Compare up to 3 local craftsmen and businesses side-by-side. Compare starting rates, customer ratings, distance, verified status, and direct WhatsApp / Call numbers.'}
        </p>

        {compareItems.length === 1 && (
          <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-3.5 mb-6 max-w-xs mx-auto flex items-center gap-3 text-left">
            <img
              src={compareItems[0].photo}
              alt={compareItems[0].name}
              className="w-11 h-11 rounded-xl object-cover bg-white flex-shrink-0"
              onError={(e) => { e.currentTarget.src = '/assets/images/handyman_service.webp' }}
            />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-[#0A1F44] block truncate">{compareItems[0].name}</span>
              <span className="text-[11px] text-[#FF7A00] font-semibold block truncate">{compareItems[0].service}</span>
            </div>
            <button
              type="button"
              onClick={() => removeFromCompare(compareItems[0]._id)}
              className="text-gray-400 hover:text-red-500 p-1"
              title="Remove"
            >
              <X size={15} />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:scale-[1.02]"
          >
            <span>{compareItems.length === 1 ? 'Pick 1 More Business from Grid' : 'Browse Visual Grid to Compare'}</span>
            <ArrowRight size={14} />
          </button>
          {compareItems.length === 1 && (
            <button
              type="button"
              onClick={clearCompare}
              className="w-full sm:w-auto inline-flex items-center justify-center py-3 px-5 rounded-xl border border-[#E4EAF2] text-[#5A6B84] hover:text-[#0A1F44] text-xs font-bold transition-colors cursor-pointer"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Header Bar with Clear All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl border border-[#E4EAF2] p-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF7A00] flex items-center justify-center text-white">
              <GitCompare size={15} />
            </div>
            <h3 className="font-poppins font-extrabold text-base text-[#0A1F44]">
              Smart Business Comparison Table
            </h3>
          </div>
          <p className="text-xs text-[#5A6B84] mt-0.5">
            Side-by-side direct comparison of {compareItems.length} selected local service providers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className="text-xs font-bold text-[#0A1F44] hover:text-[#FF7A00] transition-colors cursor-pointer"
          >
            ← Add more from Grid
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* 2. Plain-Language Recommendation Summary Strip */}
      {recommendationSummary && (
        <div className="bg-gradient-to-r from-orange-50 via-amber-50/70 to-blue-50/50 border border-orange-200/90 rounded-2xl p-4 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF7A00] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-xs uppercase tracking-wider text-[#FF7A00] mb-0.5">
              Honest Data Recommendation
            </h4>
            <p className="text-xs sm:text-sm text-[#0A1F44] font-medium leading-relaxed">
              {recommendationSummary}
            </p>
          </div>
        </div>
      )}

      {/* 3. True Side-by-Side Comparison Table */}
      <div className="bg-white rounded-3xl border border-[#E4EAF2] shadow-sm overflow-hidden">
        {/* Mobile Swipe Hint */}
        <div className="md:hidden flex items-center justify-between px-4 py-2 bg-amber-50/90 border-b border-amber-200/70 text-[11px] font-semibold text-amber-900">
          <div className="flex items-center gap-1.5">
            <span>👉</span>
            <span>Scroll horizontally to compare {compareItems.length} businesses</span>
          </div>
          <span className="text-amber-600 font-bold">Swipe ➔</span>
        </div>
        <div className="overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full border-collapse text-left">
            
            {/* Table Header Row: Photo, Name, and Close Action */}
            <thead>
              <tr className="border-b border-[#E4EAF2] bg-[#F8FAFC]">
                <th className="p-4 w-44 min-w-[160px] text-xs font-bold text-[#5A6B84] uppercase tracking-wider align-top">
                  Service Provider
                </th>
                {compareItems.map((item) => (
                  <th
                    key={item._id}
                    className="p-4 min-w-[220px] max-w-[280px] align-top relative"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCompare(item._id)}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer z-10"
                      title="Remove from comparison"
                    >
                      <X size={13} />
                    </button>

                    {/* Photo */}
                    <div className="h-32 w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 relative">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/assets/images/electrician_work.webp'
                        }}
                      />
                    </div>

                    <h4 className="font-poppins font-extrabold text-sm text-[#0A1F44] leading-snug truncate" title={item.name}>
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#FF7A00] font-bold truncate">
                      {item.service}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E4EAF2] text-xs">
              
              {/* Row 1: Verification Status */}
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-[#5A6B84] flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#22C55E]" />
                  <span>Verification</span>
                </td>
                {compareItems.map((item) => (
                  <td key={item._id} className="p-4">
                    {item.isVerified ? (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 font-bold px-2.5 py-1 rounded-full text-[11px] border border-green-200">
                        <ShieldCheck size={12} className="text-green-600" />
                        <span>Verified Provider</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full text-[11px] border border-amber-200">
                        <AlertCircle size={12} className="text-amber-600" />
                        <span>Unclaimed Listing</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 2: Starting Price */}
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-[#5A6B84] flex items-center gap-1.5">
                  <DollarSign size={14} className="text-[#FF7A00]" />
                  <span>Starting Rate</span>
                </td>
                {compareItems.map((item) => {
                  const isLowest = bestMatches.lowestPriceId === item._id
                  return (
                    <td key={item._id} className="p-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-[#0A1F44] text-sm">
                          {item.hourlyRate !== null ? `PKR ${item.hourlyRate}` : 'N/A'}
                        </span>
                        {isLowest && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <Award size={10} />
                            <span>Lowest Price</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#5A6B84] block mt-0.5">
                        {item.hourlyRate !== null ? 'Per hour / basic charge' : 'Direct quote on call'}
                      </span>
                    </td>
                  )
                })}
              </tr>

              {/* Row 3: Customer Rating & Reviews */}
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-[#5A6B84] flex items-center gap-1.5">
                  <Star size={14} className="text-amber-500" />
                  <span>Customer Rating</span>
                </td>
                {compareItems.map((item) => {
                  const hasRating = item.rating !== null && Number(item.rating) > 0
                  const isHighestRated = bestMatches.highestRatedId === item._id && hasRating
                  const numRating = hasRating ? Number(item.rating).toFixed(1) : null
                  const ratingLabel = item.reviewsCount && Number(item.reviewsCount) > 0
                    ? `(${item.reviewsCount} reviews)`
                    : '(Google rating)'

                  return (
                    <td key={item._id} className="p-4">
                      {hasRating ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="inline-flex items-center gap-1.5">
                            <div className="flex items-center gap-1 text-[#0E1E3A]">
                              <Star size={13} className="fill-[#FFB800] text-[#FFB800]" />
                              <span className="text-xs font-bold text-[#0A1F44]">{numRating}</span>
                            </div>
                            <span className="text-[#5A6B84] text-xs font-medium">
                              {ratingLabel}
                            </span>
                          </div>
                          {isHighestRated && (
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                              <Star size={10} className="fill-amber-600 text-amber-600" />
                              <span>Highest Rated</span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#5A6B84] font-medium text-xs">N/A</span>
                      )}
                    </td>
                  )
                })}
              </tr>

              {/* Row 4: Distance from User */}
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-[#5A6B84] flex items-center gap-1.5">
                  <MapPin size={14} className="text-blue-500" />
                  <span>Proximity / Distance</span>
                </td>
                {compareItems.map((item) => {
                  const isClosest = bestMatches.closestId === item._id && item.distance !== null
                  return (
                    <td key={item._id} className="p-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#0A1F44]">
                          {formatDistance(item.distance)}
                        </span>
                        {isClosest && (
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <MapPin size={10} />
                            <span>Closest</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#5A6B84] block mt-0.5">
                        {item.distance !== null
                          ? 'Calculated from location'
                          : userLocation?.isDenied
                          ? 'Enable location for distance'
                          : 'Coordinates N/A'}
                      </span>
                    </td>
                  )
                })}
              </tr>

              {/* Row 5: Area & City */}
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-[#5A6B84] flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400" />
                  <span>Coverage Area</span>
                </td>
                {compareItems.map((item) => (
                  <td key={item._id} className="p-4">
                    <span className="font-semibold text-[#0A1F44]">
                      {item.area ? `${item.area}, ` : ''}{item.city || 'N/A'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 6: Services Provided */}
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-[#5A6B84] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-500" />
                  <span>Services</span>
                </td>
                {compareItems.map((item) => (
                  <td key={item._id} className="p-4">
                    <span className="text-[#0A1F44] font-medium leading-relaxed">
                      {item.service || 'N/A'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 7: Working Hours */}
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-[#5A6B84] flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  <span>Working Hours</span>
                </td>
                {compareItems.map((item) => (
                  <td key={item._id} className="p-4">
                    <span className="font-medium text-[#0A1F44]">
                      {item.workingHours || 'N/A'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 8: Live Availability */}
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-[#5A6B84] flex items-center gap-1.5">
                  <Radio size={14} className="text-emerald-500" />
                  <span>Live Availability</span>
                </td>
                {compareItems.map((item) => {
                  const isAvailableToday = bestMatches.availableTodayId === item._id
                  if (!item.isKarigar) {
                    return (
                      <td key={item._id} className="p-4 text-[#5A6B84] italic">
                        N/A (Directory Listing)
                      </td>
                    )
                  }
                  return (
                    <td key={item._id} className="p-4">
                      {item.isOnline ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Available Today</span>
                          </span>
                          {isAvailableToday && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                              Ready Now
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 font-medium">Offline</span>
                      )}
                    </td>
                  )
                })}
              </tr>

              {/* Row 9: Column Footer Contact & Booking Actions */}
              <tr className="bg-[#F8FAFC]">
                <td className="p-4 font-bold text-[#0A1F44] align-middle">
                  Connect & Book
                </td>
                {compareItems.map((item) => {
                  const isVerifiedKarigar = item.isKarigar || item.isVerified
                  const bookUrl = isVerifiedKarigar ? `/book/${item._id}` : `/claim/${item._id}`
                  const bookLabel = isVerifiedKarigar ? 'Book Now' : 'Claim to Book'
                  const profileUrl = item.isKarigar ? `/worker/${item._id}` : `/listing/${item._id}`

                  return (
                    <td key={item._id} className="p-4 align-top">
                      <div className="space-y-2">
                        {/* Book Button (verified karigar -> /book/:id, unclaimed listing -> /claim/:id) */}
                        <Link
                          to={bookUrl}
                          className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-white text-xs font-bold transition-all shadow-xs ${
                            isVerifiedKarigar
                              ? 'bg-[#FF7A00] hover:bg-[#e66e00]'
                              : 'bg-[#0A1F44] hover:bg-[#102747]'
                          }`}
                        >
                          <Calendar size={13} />
                          <span>{bookLabel}</span>
                        </Link>

                        {/* View Full Profile Link */}
                        <Link
                          to={profileUrl}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-[#0A1F44]/20 hover:border-[#FF7A00] text-[#0A1F44] hover:text-[#FF7A00] text-xs font-bold transition-colors"
                        >
                          <span>View Full Profile</span>
                          <ArrowRight size={13} />
                        </Link>

                        {/* Call and WhatsApp row */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {item.phone ? (
                            <a
                              href={`tel:${item.phone}`}
                              className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl border border-[#0A1F44]/20 hover:bg-[#0A1F44] hover:text-white text-[#0A1F44] text-[11px] font-bold transition-colors"
                              title="Direct Phone Call"
                            >
                              <Phone size={11} />
                              <span>Call</span>
                            </a>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center justify-center py-1.5 px-2 rounded-xl bg-gray-100 text-gray-400 text-[11px] font-medium cursor-not-allowed"
                            >
                              Call N/A
                            </button>
                          )}

                          {item.phone ? (
                            <a
                              href={`https://wa.me/${item.waNumber}?text=Assalam-o-Alaikum,%20maine%20aap%20ki%20listing%20KarigarPK%20par%20dekhi%20hai.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors"
                              title="Message on WhatsApp"
                            >
                              <MessageCircle size={11} />
                              <span>WhatsApp</span>
                            </a>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center justify-center py-1.5 px-2 rounded-xl bg-gray-100 text-gray-400 text-[11px] font-medium cursor-not-allowed"
                            >
                              WA N/A
                            </button>
                          )}
                        </div>

                        {/* If Karigar, also show link to Profile */}
                        {item.isKarigar && (
                          <Link
                            to={profileUrl}
                            className="block text-center text-[11px] text-[#5A6B84] hover:text-[#0A1F44] font-semibold underline pt-1"
                          >
                            View Verified Profile
                          </Link>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
