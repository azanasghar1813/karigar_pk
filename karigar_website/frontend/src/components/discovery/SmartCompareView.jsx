import { Link } from 'react-router-dom'
import { GitCompare, X, ShieldCheck, AlertCircle, Phone, MessageCircle, Star, ArrowRight } from 'lucide-react'
import RatingBadge from '../RatingBadge'
import { SERVICES_CONFIG } from '../../config/site'
import { useDiscovery } from '../../context/DiscoveryContext'

export default function SmartCompareView({
  allItems = []
}) {
  const { compareList, removeFromCompare, clearCompare, setViewMode } = useDiscovery()

  // Find the full business objects for the selected compare IDs
  const compareItems = compareList
    .map((id) => allItems.find((item) => item._id === id))
    .filter(Boolean)

  if (compareItems.length < 2) {
    return (
      <div className="bg-white rounded-3xl border border-[#E4EAF2] p-10 text-center shadow-sm max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF7A00] flex items-center justify-center mx-auto mb-4">
          <GitCompare size={28} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-[#0A1F44] mb-2">
          Select at least 2 businesses to compare
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6B84] leading-relaxed mb-6">
          You currently have {compareItems.length} business selected. Browse the Visual Grid and click "+ Compare" on cards to compare their ratings, pricing, and services side-by-side.
        </p>
        <button
          type="button"
          onClick={() => setViewMode('grid')}
          className="bg-[#0A1F44] hover:bg-[#102747] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-md cursor-pointer"
        >
          Return to Visual Grid →
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-[#E4EAF2] p-4 shadow-xs">
        <div>
          <h3 className="font-poppins font-extrabold text-base text-[#0A1F44]">
            Smart Business Comparison
          </h3>
          <p className="text-xs text-[#5A6B84]">
            Comparing {compareItems.length} selected local service providers
          </p>
        </div>

        <button
          type="button"
          onClick={clearCompare}
          className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          Clear Selection
        </button>
      </div>

      {/* Comparison Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-${compareItems.length} gap-4`}>
        {compareItems.map((item) => {
          const isKarigar = item.type === 'karigar'
          const name = isKarigar ? (item.fullName || 'Karigar') : item.name
          const service = isKarigar
            ? (Array.isArray(item.services) ? item.services[0] : item.services)
            : item.service

          const matchedConfig = SERVICES_CONFIG.find(
            s => s.searchKey === service || s.name === service
          )
          const defaultImage = matchedConfig ? matchedConfig.image : '/assets/images/electrician_work.jpg'
          const photo = isKarigar
            ? (item.profilePhoto || defaultImage)
            : (item.photos?.[0] || defaultImage)

          const targetUrl = isKarigar ? `/worker/${item._id}` : `/listing/${item._id}`
          const isVerified = isKarigar ? item.verificationStatus === 'approved' : item.claimStatus === 'verified'

          return (
            <div
              key={item._id}
              className="bg-white rounded-3xl border border-[#E4EAF2] p-5 shadow-sm flex flex-col justify-between relative"
            >
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFromCompare(item._id)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center transition-colors z-10 cursor-pointer"
                title="Remove from comparison"
              >
                <X size={14} />
              </button>

              <div>
                {/* Photo */}
                <div className="h-40 w-full rounded-2xl overflow-hidden mb-3 bg-slate-100 relative">
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    {isVerified ? (
                      <span className="bg-[#0A1F44]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <ShieldCheck size={11} className="text-[#22C55E]" /> Verified
                      </span>
                    ) : (
                      <span className="bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <AlertCircle size={11} /> Unclaimed
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="font-poppins font-bold text-base text-[#0A1F44] mb-1 truncate" title={name}>
                  {name}
                </h4>
                <p className="text-xs text-[#FF7A00] font-bold mb-3">{service}</p>

                {/* Metric Rows */}
                <div className="space-y-2 text-xs border-t border-[#E4EAF2] pt-3">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#5A6B84]">Rating:</span>
                    <span className="font-bold text-[#0A1F44]">
                      {item.rating ? `${Number(item.rating).toFixed(1)} / 5.0` : 'Not Rated'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#5A6B84]">Starting Rate:</span>
                    <span className="font-extrabold text-[#0A1F44]">
                      {isKarigar ? `PKR ${item.hourlyRate || 500}` : 'Directory Rate'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#5A6B84]">Location:</span>
                    <span className="font-semibold text-[#0A1F44] truncate max-w-[140px]">
                      {item.area ? `${item.area}, ` : ''}{item.city}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-[#5A6B84]">Public Contact:</span>
                    <span className="font-semibold text-[#0A1F44] truncate max-w-[140px]">
                      {item.phone || 'Directory Record'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-[#E4EAF2]">
                <Link
                  to={targetUrl}
                  className="w-full inline-flex items-center justify-center gap-1 py-2 px-4 rounded-xl bg-[#0A1F44] hover:bg-[#FF7A00] text-white text-xs font-bold transition-colors"
                >
                  <span>View Full Profile</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
