import { MapPin, ArrowRight, Wrench, ShieldCheck } from 'lucide-react'

export default function AreaCard({
  area,
  city,
  isSelected = false,
  onClick
}) {
  const topServices = Array.isArray(area.services)
    ? [...area.services].sort((a, b) => b.count - a.count).slice(0, 3)
    : []

  return (
    <div
      onClick={() => onClick && onClick(area.area)}
      className={`bg-white rounded-3xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
        isSelected
          ? 'border-[#FF7A00] ring-2 ring-[#FF7A00]/20 shadow-[0_8px_30px_rgba(255,122,0,0.12)]'
          : 'border-[#E4EAF2] hover:border-[#FF7A00]/60 shadow-[0_4px_16px_rgba(10,31,68,0.04)] hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF7A00] flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF7A00] group-hover:text-white transition-colors">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-poppins font-bold text-base text-[#0A1F44] group-hover:text-[#FF7A00] transition-colors leading-tight">
                {area.area}
              </h4>
              <span className="text-xs text-[#5A6B84] font-medium">
                {city}, Pakistan
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="bg-[#F5F7FB] border border-[#E4EAF2] text-[#0A1F44] font-extrabold text-xs px-2.5 py-1 rounded-xl">
              {area.totalCount} Listings
            </span>
            {typeof area.verifiedCount === 'number' && area.verifiedCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-lg">
                <ShieldCheck size={11} className="text-[#22C55E]" />
                <span>{area.verifiedCount} Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Top Categories in Area */}
        <div className="mt-3 space-y-1.5">
          <span className="text-[11px] font-semibold text-[#5A6B84] block">
            Top Services in Area:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {topServices.map((s, idx) => (
              <span
                key={idx}
                className="bg-[#F8FAFC] border border-[#E4EAF2] text-[#0E1E3A] text-[11px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1"
              >
                <span className="text-[#FF7A00] font-bold">{s.count}</span>
                <span className="truncate max-w-[120px]">{s.service}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action */}
      <div className="mt-5 pt-3 border-t border-[#E4EAF2] flex items-center justify-between text-xs font-bold text-[#0A1F44] group-hover:text-[#FF7A00] transition-colors">
        <span>Explore area listings</span>
        <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-[#FF7A00] group-hover:text-white flex items-center justify-center transition-all">
          <ArrowRight size={13} />
        </div>
      </div>
    </div>
  )
}
