import { useMemo, useState } from 'react'
import { Search, Star, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { useDiscovery } from '../../context/DiscoveryContext'
import BusinessCard from '../BusinessCard'

export default function VisualGridView({
  items = [],
  isLoading = false,
  onSelectBusiness = null
}) {
  const {
    query,
    area,
    service,
    city,
    resetFilters,
    selectedBusiness,
    setSelectedBusiness
  } = useDiscovery()

  const [favorites, setFavorites] = useState({})

  const handleSelect = (item) => {
    setSelectedBusiness(item)
    if (onSelectBusiness) onSelectBusiness(item)
  }

  const toggleFavorite = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // When no query or custom filters are active, section the items into:
  // 1. Top-rated near you
  // 2. Recently added
  // 3. All remaining
  const isSectioned = !query.trim() && service === 'All'

  const topRatedItems = useMemo(() => {
    if (!isSectioned) return []
    return [...items]
      .filter((item) => item.rating !== null && item.rating > 0)
      .slice(0, 4)
  }, [items, isSectioned])

  const recentlyAddedItems = useMemo(() => {
    if (!isSectioned) return []
    // Exclude top-rated already shown
    const topIds = new Set(topRatedItems.map((i) => i._id))
    return items.filter((i) => !topIds.has(i._id)).slice(0, 4)
  }, [items, isSectioned, topRatedItems])

  const remainingItems = useMemo(() => {
    if (!isSectioned) return items
    const usedIds = new Set([...topRatedItems, ...recentlyAddedItems].map((i) => i._id))
    return items.filter((i) => !usedIds.has(i._id))
  }, [items, isSectioned, topRatedItems, recentlyAddedItems])

  // Loading Skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white rounded-2xl border border-[#E4EAF2] p-4 shadow-sm animate-pulse h-80 flex flex-col justify-between">
            <div className="w-full h-40 bg-gray-200 rounded-xl mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-8 bg-gray-200 rounded-xl w-full mt-4" />
          </div>
        ))}
      </div>
    )
  }

  // Empty State
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#E4EAF2] p-10 sm:p-14 text-center shadow-sm max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF7A00] flex items-center justify-center mx-auto mb-4">
          <Search size={28} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-[#0A1F44] mb-2">
          No businesses or professionals found
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6B84] leading-relaxed mb-6">
          No listings match your current filters in {city} {area !== 'All Areas' ? `(${area})` : ''}. Try broadening your search or resetting filters.
        </p>
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-md shadow-orange-500/25 cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Reset All Filters</span>
        </button>
      </div>
    )
  }

  // Render Sectioned or Single Grid
  if (isSectioned && topRatedItems.length > 0) {
    return (
      <div className="space-y-8">
        
        {/* SECTION 1: Top-Rated Near You */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#FF7A00] flex items-center justify-center">
              <Star size={16} className="fill-[#FF7A00]" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-base text-[#0A1F44]">
                Top-rated near you
              </h3>
              <p className="text-[11px] text-[#5A6B84]">
                Highest customer rated professionals and certified businesses in {city}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {topRatedItems.map((item) => (
              <BusinessCard
                key={`top-${item.type}-${item._id}`}
                item={item}
                type={item.type}
                isSelected={selectedBusiness?._id === item._id}
                isFavorite={!!favorites[item._id]}
                onToggleFavorite={toggleFavorite}
                onSelect={() => handleSelect(item)}
              />
            ))}
          </div>
        </div>

        {/* SECTION 2: Recently Added */}
        {recentlyAddedItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0A1F44] flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-base text-[#0A1F44]">
                  Recently Added & Featured
                </h3>
                <p className="text-[11px] text-[#5A6B84]">
                  New local services and businesses recently cataloged
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
              {recentlyAddedItems.map((item) => (
                <BusinessCard
                  key={`recent-${item.type}-${item._id}`}
                  item={item}
                  type={item.type}
                  isSelected={selectedBusiness?._id === item._id}
                  isFavorite={!!favorites[item._id]}
                  onToggleFavorite={toggleFavorite}
                  onSelect={() => handleSelect(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: All Results */}
        {remainingItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-poppins font-bold text-base text-[#0A1F44]">
                All Local Results ({items.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
              {remainingItems.map((item) => (
                <BusinessCard
                  key={`rem-${item.type}-${item._id}`}
                  item={item}
                  type={item.type}
                  isSelected={selectedBusiness?._id === item._id}
                  isFavorite={!!favorites[item._id]}
                  onToggleFavorite={toggleFavorite}
                  onSelect={() => handleSelect(item)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    )
  }

  // Default Standard Grid (when search or specific category is active)
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-[#5A6B84]">
          Showing <span className="font-extrabold text-[#0A1F44]">{items.length}</span> matching businesses in{' '}
          <span className="text-[#0A1F44] font-bold">{city}</span>
          {area !== 'All Areas' && <span> • <span className="text-[#FF7A00] font-bold">{area}</span></span>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {items.map((item) => (
          <BusinessCard
            key={`${item.type}-${item._id}`}
            item={item}
            type={item.type}
            isSelected={selectedBusiness?._id === item._id}
            isFavorite={!!favorites[item._id]}
            onToggleFavorite={toggleFavorite}
            onSelect={() => handleSelect(item)}
          />
        ))}
      </div>
    </div>
  )
}
