import { Building2, ShieldCheck, TrendingUp, Sparkles, MapPin } from 'lucide-react'

export default function AreaInsightsStrip({
  city,
  selectedArea,
  totalBusinesses = 0,
  verifiedCount = 0,
  topCategory = 'Electrician',
  recentlyAdded = null
}) {
  const isCityWide = !selectedArea || selectedArea === 'All Areas'
  const showRecentlyAdded = typeof recentlyAdded === 'number' && !isNaN(recentlyAdded) && recentlyAdded > 0 && recentlyAdded < totalBusinesses

  return (
    <div className="bg-white border border-[#E4EAF2] rounded-3xl p-5 sm:p-6 mb-6 shadow-[0_4px_20px_rgba(10,31,68,0.04)]">
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-[#E4EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF7A00] flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="font-poppins font-bold text-[#0A1F44] text-sm sm:text-base">
              Area Market Insights
            </h3>
            <p className="text-xs text-[#5A6B84]">
              {isCityWide ? `Overview of verified services across all areas in ${city}` : `Live business & craftsman metrics for ${selectedArea}, ${city}`}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-[#F5F7FB] border border-[#E4EAF2] px-3 py-1 rounded-full text-xs font-semibold text-[#0A1F44] self-start sm:self-auto">
          <MapPin size={12} className="text-[#FF7A00]" />
          <span>{isCityWide ? `${city} (All Areas)` : `${selectedArea}, ${city}`}</span>
        </div>
      </div>

      {/* Dynamic Metric Grid */}
      <div className={`grid grid-cols-2 ${showRecentlyAdded ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'} gap-3 sm:gap-4`}>
        {/* Metric 1: Total Businesses */}
        <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0A1F44] flex items-center justify-center flex-shrink-0">
              <Building2 size={15} />
            </div>
            <span className="text-xs text-[#5A6B84] font-semibold whitespace-nowrap">Total Businesses</span>
          </div>
          <span className="font-poppins font-black text-base sm:text-lg text-[#0A1F44]">
            {totalBusinesses.toLocaleString()}
          </span>
        </div>

        {/* Metric 2: Verified Craftsmen */}
        <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={15} />
            </div>
            <span className="text-xs text-[#5A6B84] font-semibold whitespace-nowrap">Verified Pros</span>
          </div>
          <span className="font-poppins font-black text-base sm:text-lg text-[#0A1F44]">
            {verifiedCount.toLocaleString()}
          </span>
        </div>

        {/* Metric 3: Top Category */}
        <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#FF7A00] flex items-center justify-center flex-shrink-0">
              <TrendingUp size={15} />
            </div>
            <span className="text-xs text-[#5A6B84] font-semibold whitespace-nowrap">Top Category</span>
          </div>
          <span className="font-poppins font-black text-xs sm:text-sm text-[#0A1F44] truncate" title={topCategory}>
            {topCategory}
          </span>
        </div>

        {/* Metric 4: Recently Added (Rendered ONLY when real data is available) */}
        {showRecentlyAdded && (
          <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF7A00] flex items-center justify-center flex-shrink-0">
                <Sparkles size={15} />
              </div>
              <span className="text-xs text-[#5A6B84] font-semibold whitespace-nowrap">Recently Added</span>
            </div>
            <span className="font-poppins font-black text-base sm:text-lg text-[#0A1F44]">
              {recentlyAdded.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
