import { useMemo } from 'react'
import { useDiscovery } from '../../context/DiscoveryContext'
import AreaInsightsStrip from './AreaInsightsStrip'
import AreaCard from './AreaCard'
import { MapPin, Search } from 'lucide-react'

export default function ExploreAreasView({
  areas = [],
  totalBusinesses = 0,
  verifiedCount = 0,
  isLoading = false
}) {
  const { city, area, setArea, setViewMode } = useDiscovery()

  // Calculate top service category across areas
  const topCategory = useMemo(() => {
    const serviceCounts = {}
    areas.forEach((a) => {
      if (Array.isArray(a.services)) {
        a.services.forEach((s) => {
          serviceCounts[s.service] = (serviceCounts[s.service] || 0) + s.count
        })
      }
    })
    const sorted = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])
    return sorted.length > 0 ? sorted[0][0] : 'Electrician'
  }, [areas])

  // Calculate real sum of recentlyAdded across all areas from backend aggregation (no fake data)
  const totalRecentlyAdded = useMemo(() => {
    if (!areas || areas.length === 0) return null
    let sum = 0
    let hasValidData = false
    for (const a of areas) {
      if (typeof a.recentlyAdded === 'number') {
        sum += a.recentlyAdded
        hasValidData = true
      }
    }
    return hasValidData ? sum : null
  }, [areas])

  // Calculate total verified count across areas from backend aggregation
  const totalVerified = useMemo(() => {
    if (!areas || areas.length === 0) return verifiedCount
    const sum = areas.reduce((acc, a) => acc + (typeof a.verifiedCount === 'number' ? a.verifiedCount : 0), 0)
    return sum > 0 ? sum : verifiedCount
  }, [areas, verifiedCount])

  const handleSelectArea = (selectedAreaName) => {
    setArea(selectedAreaName)
    setViewMode('grid') // Switches to Grid filtered by that area
  }

  return (
    <div className="space-y-6">
      {/* Area Insights Strip at the top */}
      <AreaInsightsStrip
        city={city}
        selectedArea={area}
        totalBusinesses={totalBusinesses}
        verifiedCount={totalVerified}
        topCategory={topCategory}
        recentlyAdded={totalRecentlyAdded}
      />

      {/* Area Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-poppins font-extrabold text-lg text-[#0A1F44]">
              Browse by Local Neighborhood
            </h3>
            <p className="text-xs text-[#5A6B84]">
              Select an area in <span className="font-bold text-[#0A1F44]">{city}</span> to see local verified craftsmen and service providers.
            </p>
          </div>
          <span className="text-xs font-bold text-[#FF7A00]">
            {areas.length} Areas Available
          </span>
        </div>

        {isLoading ? (
          // Skeletons to prevent layout shift
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-[#E4EAF2] p-5 shadow-xs animate-pulse h-44 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mt-4" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto" />
              </div>
            ))}
          </div>
        ) : areas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((a) => (
              <AreaCard
                key={a.area}
                area={a}
                city={city}
                isSelected={area === a.area}
                onClick={handleSelectArea}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E4EAF2] p-10 text-center shadow-sm">
            <MapPin size={32} className="text-[#FF7A00] mx-auto mb-3" />
            <h4 className="font-poppins font-bold text-[#0A1F44] text-base mb-1">
              No specific areas cataloged for {city} yet
            </h4>
            <p className="text-xs text-[#5A6B84] mb-4">
              Switch to Visual Grid to view all general listings available in {city}.
            </p>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className="bg-[#0A1F44] hover:bg-[#102747] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all"
            >
              Go to Visual Grid →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
