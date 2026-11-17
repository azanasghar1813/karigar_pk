import { ShieldCheck, Zap, Star, SlidersHorizontal, RotateCcw, MapPin, Check } from 'lucide-react'
import { useDiscovery } from '../../context/DiscoveryContext'

export default function DiscoverySidebar({
  areas = [],
  totalCityCount = 0,
  onCloseMobile = null,
  isSortDataMissing = false
}) {
  const {
    city,
    area,
    setArea,
    filters,
    setFilter,
    resetFilters,
    setViewMode
  } = useDiscovery()

  const handleAreaClick = (selectedArea) => {
    setArea(selectedArea)
    if (onCloseMobile) onCloseMobile()
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E4EAF2] p-5 shadow-[0_4px_20px_rgba(10,31,68,0.04)] space-y-6">
      
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E4EAF2]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#FF7A00]" />
          <h3 className="font-poppins font-bold text-sm text-[#0A1F44]">
            Filters & Sorting
          </h3>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF7A00] hover:text-[#F06400] transition-colors cursor-pointer"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Verified Only Toggle */}
      <div className="flex items-center justify-between py-1">
        <label htmlFor="verifiedOnly" className="cursor-pointer flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div>
            <span className="font-poppins font-bold text-xs text-[#0A1F44] block">Verified Only</span>
            <span className="text-[10px] text-[#5A6B84]">Hide unclaimed directory rows</span>
          </div>
        </label>
        
        <input
          id="verifiedOnly"
          type="checkbox"
          checked={filters.verifiedOnly}
          onChange={(e) => setFilter('verifiedOnly', e.target.checked)}
          className="w-4 h-4 text-[#FF7A00] rounded border-gray-300 focus:ring-[#FF7A00] cursor-pointer"
        />
      </div>

      {/* 2. Available Now Toggle (affects verified pros with isOnline) */}
      <div className="flex items-center justify-between py-1">
        <label htmlFor="availableNow" className="cursor-pointer flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF7A00] flex items-center justify-center flex-shrink-0">
            <Zap size={16} />
          </div>
          <div>
            <span className="font-poppins font-bold text-xs text-[#0A1F44] block">Available Now</span>
            <span className="text-[10px] text-[#5A6B84]">Online for immediate dispatch</span>
          </div>
        </label>

        <input
          id="availableNow"
          type="checkbox"
          checked={filters.availableNow}
          onChange={(e) => setFilter('availableNow', e.target.checked)}
          className="w-4 h-4 text-[#FF7A00] rounded border-gray-300 focus:ring-[#FF7A00] cursor-pointer"
        />
      </div>

      {/* 3. Sort Select */}
      <div className="space-y-1.5 pt-2 border-t border-[#E4EAF2]">
        <label className="text-xs font-bold text-[#0A1F44] block">
          Sort Results By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => setFilter('sort', e.target.value)}
          className="w-full bg-[#F8FAFC] border border-[#E4EAF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#0E1E3A] cursor-pointer focus:outline-none focus:border-[#FF7A00]"
        >
          <option value="rating">Top Rated (Highest First)</option>
          <option value="price_asc">Lowest Starting Price</option>
          <option value="reviews">Most Reviews & Activity</option>
          <option value="newest">Recently Registered / Added</option>
        </select>
        {isSortDataMissing && (
          <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 rounded-xl p-2 font-medium leading-relaxed">
            Is sort ke liye abhi data nahi — rating ke hisab se dikha rahe hain
          </p>
        )}
      </div>

      {/* 4. Minimum Rating Filter */}
      <div className="space-y-2 pt-2 border-t border-[#E4EAF2]">
        <label className="text-xs font-bold text-[#0A1F44] block">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 3, 4, 4.5].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setFilter('minRating', val)}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                filters.minRating === val
                  ? 'bg-[#0A1F44] text-white shadow-xs'
                  : 'bg-[#F8FAFC] border border-[#E4EAF2] text-[#5A6B84] hover:text-[#0A1F44]'
              }`}
            >
              {val === 0 ? (
                <span>All</span>
              ) : (
                <>
                  <Star size={11} className={filters.minRating === val ? 'fill-[#FF7A00] text-[#FF7A00]' : 'text-gray-400'} />
                  <span>{val}+</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Price Max Slider */}
      <div className="space-y-2 pt-2 border-t border-[#E4EAF2]">
        <div className="flex items-center justify-between">
          <label htmlFor="priceMaxSlider" className="text-xs font-bold text-[#0A1F44]">
            Max Starting Rate
          </label>
          <span className="text-xs font-extrabold text-[#FF7A00]">
            PKR {filters.priceMax >= 10000 ? '10,000+' : filters.priceMax.toLocaleString()}
          </span>
        </div>
        <input
          id="priceMaxSlider"
          type="range"
          min="500"
          max="10000"
          step="500"
          value={filters.priceMax}
          onChange={(e) => setFilter('priceMax', Number(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF7A00]"
        />
        <div className="flex justify-between text-[10px] text-[#5A6B84]">
          <span>PKR 500</span>
          <span>PKR 5,000</span>
          <span>PKR 10,000+</span>
        </div>
      </div>

      {/* 6. Area List with Real Counts */}
      <div className="space-y-2 pt-2 border-t border-[#E4EAF2]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#0A1F44] flex items-center gap-1">
            <MapPin size={13} className="text-[#FF7A00]" />
            <span>Areas in {city}</span>
          </label>
          <span className="text-[11px] text-[#5A6B84] font-medium">
            {areas.length} locations
          </span>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-1 pr-1 text-xs">
          {/* All Areas Option */}
          <button
            type="button"
            onClick={() => handleAreaClick('All Areas')}
            className={`w-full flex items-center justify-between py-2 px-3 rounded-xl transition-colors text-left cursor-pointer ${
              area === 'All Areas'
                ? 'bg-[#0A1F44] text-white font-bold'
                : 'bg-[#F8FAFC] hover:bg-gray-100 text-[#0E1E3A]'
            }`}
          >
            <span>All Areas ({city})</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              area === 'All Areas' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {totalCityCount}
            </span>
          </button>

          {/* Real Area Items from API */}
          {areas.map((a) => {
            const isSelected = area === a.area
            return (
              <button
                key={a.area}
                type="button"
                onClick={() => handleAreaClick(a.area)}
                className={`w-full flex items-center justify-between py-1.5 px-3 rounded-xl transition-colors text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#0A1F44] text-white font-bold'
                    : 'hover:bg-gray-50 text-[#5A6B84] hover:text-[#0A1F44]'
                }`}
              >
                <span className="truncate pr-2">{a.area}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold flex-shrink-0 ${
                  isSelected ? 'bg-[#FF7A00] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {a.totalCount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
