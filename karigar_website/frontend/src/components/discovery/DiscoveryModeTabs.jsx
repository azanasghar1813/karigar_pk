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

      {/* Tab 4: Smart Compare (disabled until 2+ selected) */}
      <button
        type="button"
        disabled={!canCompare}
        onClick={() => canCompare && setViewMode('compare')}
        title={canCompare ? 'Compare selected businesses' : 'Select at least 2 businesses to compare'}
        className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
          canCompare
            ? viewMode === 'compare'
              ? 'bg-[#FF7A00] text-white shadow-md cursor-pointer'
              : 'bg-white border border-[#FF7A00]/50 text-[#0A1F44] hover:bg-orange-50 cursor-pointer'
            : 'bg-[#F1F5F9] border border-[#E4EAF2] text-[#94A3B8] cursor-not-allowed opacity-80'
        }`}
      >
        <GitCompare size={15} className={canCompare ? 'text-[#FF7A00]' : ''} />
        <span>Smart Compare</span>
        {compareList.length > 0 && (
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${canCompare ? 'bg-[#FF7A00] text-white' : 'bg-slate-200 text-slate-600'}`}>
            {compareList.length}/3
          </span>
        )}
      </button>
    </div>
  )
}
