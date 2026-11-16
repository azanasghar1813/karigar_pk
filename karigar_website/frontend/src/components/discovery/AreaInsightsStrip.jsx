import { Building2, ShieldCheck, TrendingUp, Sparkles, MapPin } from 'lucide-react'

export default function AreaInsightsStrip({
  city,
  selectedArea,
  totalBusinesses = 0,
  verifiedCount = 0,
  topCategory = 'Electrician',
  recentlyAdded = 0
}) {
  const isCityWide = !selectedArea || selectedArea === 'All Areas'

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

      {/* 4-Stat Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Total Businesses */}
        <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A1F44] flex items-center justify-center flex-shrink-0">
            <Building2 size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-[#5A6B84] font-medium block truncate">Total Businesses</span>
            <span className="font-poppins font-extrabold text-base sm:text-lg text-[#0A1F44]">
              {totalBusinesses.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Metric 2: Verified Craftsmen */}
        <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-[#5A6B84] font-medium block truncate">Verified Pros</span>
            <span className="font-poppins font-extrabold text-base sm:text-lg text-[#0A1F44]">
              {verifiedCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Metric 3: Top Category */}
        <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FF7A00] flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-[#5A6B84] font-medium block truncate">Top Category</span>
            <span className="font-poppins font-extrabold text-xs sm:text-sm text-[#0A1F44] truncate block" title={topCategory}>
              {topCategory}
            </span>
          </div>
        </div>

        {/* Metric 4: Recently Added */}
        <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7A00] flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-[#5A6B84] font-medium block truncate">Recently Added</span>
            <span className="font-poppins font-extrabold text-base sm:text-lg text-[#0A1F44]">
              {recentlyAdded.toLocaleString()}+
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
