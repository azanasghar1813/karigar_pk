import { useState } from 'react'
import { GitCompare, X, ArrowRight, Trash2, AlertCircle } from 'lucide-react'
import { useDiscovery } from '../../context/DiscoveryContext'
import { SERVICES_CONFIG } from '../../config/site'

export default function CompareTray({ allItems = [] }) {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    setViewMode,
    compareToast,
    setCompareToast
  } = useDiscovery()

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  // Resolve rich objects: combine item cached in compareList with any loaded live item in allItems
  const resolvedItems = compareList.map((entry) => {
    const targetId = entry._id || entry.id || entry
    const liveMatch = allItems.find((item) => (item._id || item.id) === targetId)
    if (liveMatch) return { ...entry, ...liveMatch }
    return typeof entry === 'object' ? entry : { _id: targetId, name: 'Selected Business' }
  })

  const count = resolvedItems.length
  const canCompare = count >= 2

  if (count === 0 && !compareToast) {
    return null
  }

  const handleOpenCompare = () => {
    if (!canCompare) return
    setMobileDrawerOpen(false)
    setViewMode('compare')
    // Scroll smoothly to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Toast Alert for Max 3 Compare limit */}
      {compareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0A1F44] border-2 border-[#FF7A00] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={18} className="text-[#FF7A00] flex-shrink-0" />
          <span>{compareToast}</span>
          <button
            type="button"
            onClick={() => setCompareToast(null)}
            className="ml-2 text-white/70 hover:text-white p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {count > 0 && (
        <>
          {/* ======================================================== */}
          {/* DESKTOP PERSISTENT BOTTOM BAR (Visible on md+ screens)  */}
          {/* ======================================================== */}
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-[#0A1F44]/95 backdrop-blur-md text-white rounded-2xl shadow-[0_12px_40px_rgba(10,31,68,0.35)] p-3 px-5 border border-[#1E3A6E] hidden md:flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Left: Selected count and thumbnails */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-2 pr-3 border-r border-white/15 flex-shrink-0">
                <div className="w-8 h-8 rounded-xl bg-[#FF7A00] flex items-center justify-center text-white">
                  <GitCompare size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold leading-none">Compare</div>
                  <div className="text-[10px] text-white/60 font-semibold">{count}/3 Selected</div>
                </div>
              </div>

              {/* Thumbnails of selected businesses */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {resolvedItems.map((item) => {
                  const id = item._id || item.id
                  const name = item.name || item.fullName || 'Business'
                  const service = item.service || (Array.isArray(item.services) ? item.services[0] : item.services)
                  const matchedConfig = SERVICES_CONFIG.find(s => s.searchKey === service || s.name === service)
                  const defaultImg = matchedConfig ? matchedConfig.image : '/assets/images/electrician_work.webp'
                  const photo = item.profilePhoto || (item.photos && item.photos[0]) || defaultImg

                  return (
                    <div
                      key={id}
                      className="group flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-1.5 pr-2.5 transition-all flex-shrink-0 max-w-[180px]"
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/20 flex-shrink-0">
                        <img
                          src={photo}
                          alt={name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = '/assets/images/electrician_work.webp'
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold truncate text-white leading-tight" title={name}>
                          {name}
                        </div>
                        <div className="text-[9px] text-[#FF7A00] font-semibold truncate leading-tight">
                          {service || 'Service'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCompare(id)}
                        className="text-white/50 hover:text-red-400 p-0.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )
                })}

                {/* Empty slot indicators up to 3 */}
                {Array.from({ length: 3 - count }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="border border-dashed border-white/20 rounded-xl px-3 py-2 text-[10px] text-white/40 flex items-center gap-1 flex-shrink-0"
                  >
                    <span>+ Add business</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs text-white/60 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Clear all selected"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>

              <button
                type="button"
                disabled={!canCompare}
                onClick={handleOpenCompare}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                  canCompare
                    ? 'bg-[#FF7A00] hover:bg-[#e66e00] text-white cursor-pointer active:scale-95'
                    : 'bg-white/10 text-white/40 cursor-not-allowed opacity-70'
                }`}
              >
                <span>{canCompare ? 'Compare Businesses' : 'Select at least 2'}</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>

          {/* ======================================================== */}
          {/* MOBILE STICKY BUTTON (Visible on <md screens)            */}
          {/* Floats above MobileTabBar and opposite WhatsAppFAB        */}
          {/* ======================================================== */}
          <div className="fixed bottom-[72px] left-4 z-40 md:hidden">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="bg-[#0A1F44]/95 backdrop-blur-md border-2 border-[#FF7A00] text-white px-3.5 py-2 rounded-full shadow-[0_8px_25px_rgba(10,31,68,0.4)] flex items-center gap-2 font-bold text-xs cursor-pointer active:scale-95"
            >
              <GitCompare size={15} className="text-[#FF7A00]" />
              <span>Compare</span>
              <span className="bg-[#FF7A00] text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {count}/3
              </span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* MOBILE DRAWER / BOTTOM SHEET                             */}
          {/* ======================================================== */}
          {mobileDrawerOpen && (
            <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-150">
              <div className="bg-[#0A1F44] text-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl border-t border-[#1E3A6E]">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FF7A00] flex items-center justify-center text-white">
                      <GitCompare size={15} />
                    </div>
                    <h3 className="font-poppins font-bold text-sm text-white">
                      Compare Businesses ({count}/3)
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 rounded-full text-white/60 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* List of items */}
                <div className="space-y-2.5 mb-5">
                  {resolvedItems.map((item) => {
                    const id = item._id || item.id
                    const name = item.name || item.fullName || 'Business'
                    const service = item.service || (Array.isArray(item.services) ? item.services[0] : item.services)
                    const matchedConfig = SERVICES_CONFIG.find(s => s.searchKey === service || s.name === service)
                    const defaultImg = matchedConfig ? matchedConfig.image : '/assets/images/electrician_work.webp'
                    const photo = item.profilePhoto || (item.photos && item.photos[0]) || defaultImg

                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between p-2.5 bg-white/10 rounded-xl border border-white/10"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={photo}
                            alt={name}
                            className="w-10 h-10 rounded-lg object-cover bg-white/20 flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/assets/images/electrician_work.webp'
                            }}
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate" title={name}>
                              {name}
                            </div>
                            <div className="text-[10px] text-[#FF7A00] font-semibold truncate">
                              {service || 'Service'}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCompare(id)}
                          className="text-white/50 hover:text-red-400 p-1.5 rounded-full hover:bg-white/10"
                          title="Remove"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Footer Buttons */}
                <div className="space-y-2 pt-2 border-t border-white/15">
                  <button
                    type="button"
                    disabled={!canCompare}
                    onClick={handleOpenCompare}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      canCompare
                        ? 'bg-[#FF7A00] text-white shadow-md active:scale-95'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    <span>{canCompare ? 'Compare Businesses →' : 'Select at least 2 businesses'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={clearCompare}
                    className="w-full py-2 text-center text-xs text-white/60 hover:text-red-300 font-semibold cursor-pointer"
                  >
                    Clear All Selected
                  </button>
                </div>

              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
