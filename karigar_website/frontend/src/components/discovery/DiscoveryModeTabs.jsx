import { Map, Grid, Radar, GitCompare } from 'lucide-react'
import { useDiscovery } from '../../context/DiscoveryContext'

export default function DiscoveryModeTabs() {
  const { viewMode, setViewMode, compareList } = useDiscovery()
  const canCompare = compareList.length >= 2

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
      {/* Tab 1: Explore Areas */}
      <button
        type="button"
        onClick={() => setViewMode('areas')}
        className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
          viewMode === 'areas'
            ? 'bg-[#0A1F44] text-white shadow-md'
            : 'bg-white border border-[#E4EAF2] text-[#5A6B84] hover:text-[#0A1F44] hover:border-gray-300'
        }`}
      >
        <Map size={15} className={viewMode === 'areas' ? 'text-[#FF7A00]' : ''} />
        <span>Explore Areas</span>
      </button>

      {/* Tab 2: Visual Grid */}
      <button
        type="button"
        onClick={() => setViewMode('grid')}
        className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
          viewMode === 'grid'
            ? 'bg-[#0A1F44] text-white shadow-md'
            : 'bg-white border border-[#E4EAF2] text-[#5A6B84] hover:text-[#0A1F44] hover:border-gray-300'
        }`}
      >
        <Grid size={15} className={viewMode === 'grid' ? 'text-[#FF7A00]' : ''} />
        <span>Visual Grid</span>
      </button>

      {/* Tab 3: Local Radar */}
      <button
        type="button"
        onClick={() => setViewMode('radar')}
        className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
          viewMode === 'radar'
            ? 'bg-[#0A1F44] text-white shadow-md'
            : 'bg-white border border-[#E4EAF2] text-[#5A6B84] hover:text-[#0A1F44] hover:border-gray-300'
        }`}
      >
        <Radar size={15} className={viewMode === 'radar' ? 'text-[#FF7A00]' : ''} />
        <span>Local Radar</span>
      </button>

      {/* Tab 4: Smart Compare */}
      <button
        type="button"
        onClick={() => setViewMode('compare')}
        className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
          viewMode === 'compare'
            ? 'bg-[#0A1F44] text-white shadow-md'
            : compareList.length >= 2
              ? 'bg-white border border-[#FF7A00] text-[#0A1F44] hover:bg-orange-50 shadow-xs'
              : 'bg-white border border-[#E4EAF2] text-[#5A6B84] hover:text-[#0A1F44] hover:border-gray-300'
        }`}
      >
        <GitCompare size={15} className={viewMode === 'compare' ? 'text-[#FF7A00]' : compareList.length >= 2 ? 'text-[#FF7A00]' : ''} />
        <span>Smart Compare</span>
        {compareList.length > 0 && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${viewMode === 'compare' ? 'bg-[#FF7A00] text-white' : 'bg-orange-100 text-[#FF7A00]'}`}>
            {compareList.length}/3
          </span>
        )}
      </button>
    </div>
  )
}
