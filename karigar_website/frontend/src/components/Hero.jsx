import { useState } from 'react'
import { Search, MapPin, ArrowRight, ShieldCheck, Wrench, Zap, Snowflake, Sparkles, Scissors, Car, Utensils, Hammer, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CITIES } from '../config/site'

export default function Hero() {
  const [keyword, setKeyword] = useState('')
  const [selectedCity, setSelectedCity] = useState('Karachi')
  const navigate = useNavigate()

  const categories = [
    { name: 'Home Repair', icon: Hammer, service: 'General Repair' },
    { name: 'Electricians', icon: Zap, service: 'Electrician' },
    { name: 'Plumbers', icon: Wrench, service: 'Plumber' },
    { name: 'AC & Cooling', icon: Snowflake, service: 'AC Repair' },
    { name: 'Cleaning', icon: Sparkles, service: 'Cleaner' },
    { name: 'Beauty', icon: Scissors, service: 'Household Chores' },
    { name: 'Auto Services', icon: Car, service: 'General Repair' },
    { name: 'Restaurants', icon: Utensils, service: 'General Repair' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword.trim()) params.append('service', keyword.trim())
    if (selectedCity && selectedCity !== 'All Cities') params.append('city', selectedCity)
    navigate(`/find-karigar?${params.toString()}`)
  }

  const handleCategoryClick = (serviceName) => {
    navigate(`/find-karigar?service=${encodeURIComponent(serviceName)}&city=${encodeURIComponent(selectedCity)}`)
  }

  return (
    <div className="relative bg-gradient-to-b from-[#EBF2FA] via-[#F4F7FC] to-white pt-8 pb-12 sm:pt-10 sm:pb-16 overflow-hidden border-b border-gray-100">
      
      {/* Background Minar-e-Pakistan landmark panorama blending into the right */}
      <div className="absolute right-0 top-0 w-full lg:w-3/5 h-full opacity-35 lg:opacity-60 pointer-events-none overflow-hidden">
        <img
          src="/assets/images/lahore_minar_hero.jpg"
          alt="Pakistan Heritage Landmark"
          className="w-full h-full object-cover object-right filter contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#EBF2FA] via-[#EBF2FA]/80 to-transparent lg:block hidden"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Top Trust Pill (matching reference image) */}
        <div className="inline-flex items-center gap-2 bg-[#0A1930] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm">
          <ShieldCheck size={14} className="text-[#FF8A00]" />
          <span>Verified Professionals</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-200">Trusted by 1M+ People</span>
        </div>

        {/* Hero Main Flex Row */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-8">
          
          {/* Main Headline & Subtitle */}
          <div className="max-w-2xl">
            <h1 className="font-poppins text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0A1930] leading-[1.15] mb-4 tracking-tight">
              Find <span className="text-[#FF8A00]">trusted</span> local businesses & professionals near you.
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-normal">
              Discover, compare and book verified services across Pakistan.
            </p>
          </div>

          {/* Cursive Tagline on Right (from Reference Image) */}
          <div className="hidden lg:block text-right pt-4 pr-6">
            <span className="font-serif italic text-2xl sm:text-3xl text-[#102747] font-semibold block leading-tight">
              Support Local
            </span>
            <span className="font-serif italic text-2xl sm:text-3xl text-[#102747] font-semibold block leading-tight">
              Grow Together
            </span>
            <div className="w-24 h-1 bg-[#FF8A00] rounded-full ml-auto mt-1"></div>
          </div>
        </div>

        {/* Floating Search Bar Card (Exact design from Reference Image) */}
        <form onSubmit={handleSearch} className="max-w-3xl mb-8">
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-2">
            
            {/* Search Input */}
            <div className="flex-1 w-full flex items-center gap-3 px-3.5 py-2">
              <Search size={20} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full text-[#0A1930] placeholder-gray-400 font-medium text-sm sm:text-base border-none focus:outline-none bg-transparent"
              />
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-200" />

            {/* City Picker */}
            <div className="w-full sm:w-48 flex items-center gap-2 px-3.5 py-2 relative">
              <MapPin size={18} className="text-[#FF8A00] flex-shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-[#0A1930] font-semibold text-sm sm:text-base border-none bg-transparent focus:outline-none cursor-pointer appearance-none pr-6"
              >
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold px-7 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-all text-sm sm:text-base whitespace-nowrap cursor-pointer hover:shadow-orange-500/40"
            >
              <span>Search</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </form>

        {/* 8 Category Icons Carousel Bar (Exact from Reference Image) */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-100 max-w-5xl">
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 divide-x-0 lg:divide-x divide-gray-100">
            {categories.map((cat, idx) => {
              const IconComponent = cat.icon
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleCategoryClick(cat.service)}
                  className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-gray-50 transition-all group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#102747] group-hover:text-[#FF8A00] mb-1.5 transition-colors">
                    <IconComponent size={20} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-[#0A1930] text-center leading-tight whitespace-nowrap">
                    {cat.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
