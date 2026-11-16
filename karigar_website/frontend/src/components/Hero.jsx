import { useState } from 'react'
import { Search, MapPin, ArrowRight, ShieldCheck, Wrench, Zap, Snowflake, Sparkles, Smile, Car, UtensilsCrossed, Hammer, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCity } from '../context/CityContext'

export default function Hero() {
  const [keyword, setKeyword] = useState('')
  const { selectedCity, setSelectedCity, cities } = useCity()
  const navigate = useNavigate()

  const categories = [
    { name: 'Home Repair', icon: Hammer, service: 'General Repair', tint: 'bg-blue-50 text-blue-600' },
    { name: 'Electricians', icon: Zap, service: 'Electrician', tint: 'bg-amber-50 text-amber-600' },
    { name: 'Plumbers', icon: Wrench, service: 'Plumber', tint: 'bg-cyan-50 text-cyan-600' },
    { name: 'AC & Cooling', icon: Snowflake, service: 'AC Repair', tint: 'bg-sky-50 text-sky-600' },
    { name: 'Cleaning', icon: Sparkles, service: 'Cleaner', tint: 'bg-emerald-50 text-emerald-600' },
    { name: 'Beauty', icon: Smile, service: 'Beauty', tint: 'bg-pink-50 text-pink-600' },
    { name: 'Auto Services', icon: Car, service: 'Auto Services', tint: 'bg-indigo-50 text-indigo-600' },
    { name: 'Restaurants', icon: UtensilsCrossed, service: 'Restaurants', tint: 'bg-orange-50 text-orange-600' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword.trim()) params.append('service', keyword.trim())
    if (selectedCity && selectedCity !== 'All Cities') params.append('city', selectedCity)
    navigate(`/find-karigar?${params.toString()}`)
  }

  const handleCategoryClick = (serviceKey) => {
    navigate(`/find-karigar?service=${encodeURIComponent(serviceKey)}&city=${encodeURIComponent(selectedCity)}`)
  }

  const currentCityLabel = selectedCity && selectedCity !== 'All Cities' ? selectedCity : 'Pakistan'

  return (
    <section className="relative bg-[#F4F7FC] pt-4 pb-5 sm:pt-6 sm:pb-7 overflow-hidden border-b border-[#E4EAF2]/80">
      
      {/* User's Custom Lahore Minar-e-Pakistan Hero Image:
          - Uses user's high-res asset /assets/images/lahore_minar_hero.jpg
          - Moved down (top-5 sm:top-7) for natural sky headroom
          - Sharpened borders: very subtle, minimal w-8/w-12 gradient blend, no heavy blur
          - Placed cleanly on right side next to text (image k side py text)
          - Ends cleanly above the category cards bar
      */}
      <div className="absolute right-0 top-4 sm:top-6 lg:top-5 w-full lg:w-[48%] xl:w-[50%] h-[270px] sm:h-[310px] pointer-events-none overflow-hidden select-none z-0">
        <img
          src="/assets/images/lahore_minar_hero.jpg"
          alt="Minar-e-Pakistan Landmark Skyline"
          className="w-full h-full object-cover object-right filter brightness-100 contrast-102"
        />
        {/* Subtle, minimal edge blend - reduced blur as requested */}
        <div className="absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-[#F4F7FC] to-transparent hidden lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#F4F7FC] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-[#0A1F44] text-white px-3 py-1 rounded-full text-xs font-semibold mb-2.5 shadow-xs">
          <ShieldCheck size={13} className="text-[#FF7A00]" />
          <span>Verified Professionals</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-200">Trusted by 1M+ People</span>
        </div>

        {/* Hero Headline & Content - compact, non-zoomed, matching reference mockup */}
        <div className="max-w-xl lg:max-w-[500px] mb-3.5 sm:mb-4">
          <h1 className="font-poppins text-2xl sm:text-3xl lg:text-[38px] xl:text-[40px] font-extrabold text-[#0A1F44] leading-[1.12] mb-2 tracking-tight">
            Find <span className="text-[#FF7A00]">trusted local</span><br className="hidden sm:inline" /> businesses & professionals<br className="hidden sm:inline" /> near you.
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6B84] font-medium leading-relaxed max-w-md">
            Discover, compare and book verified services across {currentCityLabel}.
          </p>
        </div>

        {/* Search Bar Pill: sleek, ~48-52px height, compact and sharp */}
        <form onSubmit={handleSearch} className="max-w-xl mb-5 sm:mb-6">
          <div className="bg-white rounded-full p-1 sm:p-1.5 shadow-[0_6px_20px_rgba(10,31,68,0.07)] border border-[#E4EAF2] flex flex-col sm:flex-row items-center gap-1.5">
            
            {/* Service Input */}
            <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-1 sm:py-0.5">
              <Search size={17} className="text-[#5A6B84] flex-shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full text-[#0E1E3A] placeholder-[#5A6B84] font-medium text-xs sm:text-sm border-none focus:outline-none bg-transparent"
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-[#E4EAF2]" />

            {/* City / Area Dropdown */}
            <div className="w-full sm:w-auto flex items-center gap-2 px-2.5 py-1 sm:py-0.5">
              <MapPin size={15} className="text-[#FF7A00] flex-shrink-0" />
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="appearance-none bg-transparent pr-5 text-xs sm:text-sm font-semibold text-[#0E1E3A] cursor-pointer focus:outline-none"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="text-[#5A6B84] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm transition-all shadow-sm shadow-orange-500/20 hover:scale-[1.02] flex-shrink-0"
            >
              <span>Search</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </form>

        {/* 8-Category Strip: Solid Pure White Floating Card Bar
            - Fully opaque pure white background, no bleed/ghosting
            - Compact, crisp, beautifully spaced
        */}
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-[0_4px_20px_rgba(10,31,68,0.05)] border border-[#E4EAF2] relative z-20">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategoryClick(cat.service)}
                  className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl hover:bg-[#F5F7FB] transition-all group cursor-pointer"
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${cat.tint} flex items-center justify-center mb-1.5 transition-transform group-hover:scale-108 shadow-xs`}>
                    <Icon size={19} className="stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#0E1E3A] text-center leading-tight group-hover:text-[#FF7A00] transition-colors whitespace-nowrap">
                    {cat.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
