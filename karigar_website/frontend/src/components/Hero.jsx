import { useState } from 'react'
import { Search, MapPin, ArrowRight, ShieldCheck, Wrench, Zap, Snowflake, Sparkles, Scissors, Car, Utensils, Hammer, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CITIES } from '../config/site'

export default function Hero() {
  const [keyword, setKeyword] = useState('')
  const [selectedCity, setSelectedCity] = useState('Lahore')
  const navigate = useNavigate()

  const categories = [
    { name: 'Home Repair', icon: Hammer, service: 'General Repair' },
    { name: 'Electricians', icon: Zap, service: 'Electrician' },
    { name: 'Plumbers', icon: Wrench, service: 'Plumber' },
    { name: 'AC & Cooling', icon: Snowflake, service: 'AC Repair' },
    { name: 'Cleaning', icon: Sparkles, service: 'Cleaner' },
    { name: 'Beauty', icon: Scissors, service: 'Household Chores' },
    { name: 'Auto Services', icon: Car, service: 'General Repair' },
    { name: 'Painting', icon: Wrench, service: 'Painter' }
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
    <div className="relative bg-[#0B1329] text-white pt-10 pb-16 lg:py-16 overflow-hidden border-b border-[#1F2E54]/40">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* Left Text & Search Column */}
          <div className="flex-1 w-full max-w-2xl text-center lg:text-left z-10">
            
            {/* Top Pill (From Reference Image 1) */}
            <div className="inline-flex items-center gap-2 bg-[#131F3D] border border-[#1F2E54] px-4 py-1.5 rounded-full text-xs font-semibold text-gray-200 mb-6 shadow-sm">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Verified Professionals</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300">Trusted by 10,000+ Pakistani Families</span>
            </div>

            {/* Main Headline with Highlighted Styling */}
            <h1 className="font-poppins text-3xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.15] mb-5 tracking-tight text-white">
              Find <span className="text-secondary drop-shadow-[0_2px_15px_rgba(255,107,0,0.35)]">trusted local businesses</span> & professionals near you.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
              Discover, compare and book verified home repair technicians, electricians, plumbers & contractors across Pakistan.
            </p>

            {/* Floating Unified Search Bar (Matching Reference Image 1) */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/20">
                
                {/* Search Keyword Input */}
                <div className="flex-1 w-full flex items-center gap-3 px-3.5 py-2">
                  <Search size={20} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="What service are you looking for?"
                    className="w-full text-slate-800 placeholder-gray-400 font-medium text-sm sm:text-base border-none focus:outline-none bg-transparent"
                  />
                </div>

                <div className="hidden sm:block w-px h-8 bg-gray-200" />

                {/* City Picker Dropdown */}
                <div className="w-full sm:w-44 flex items-center gap-2 px-3.5 py-2 relative">
                  <MapPin size={18} className="text-secondary flex-shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-slate-800 font-semibold text-sm sm:text-base border-none bg-transparent focus:outline-none cursor-pointer appearance-none pr-6"
                  >
                    <option value="All Cities">All Pakistan</option>
                    {CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="text-gray-500 absolute right-3 pointer-events-none" />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-secondary hover:bg-secondary-dark text-white font-bold px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all text-sm sm:text-base whitespace-nowrap cursor-pointer hover:shadow-orange-500/50"
                >
                  <span>Search</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>

            {/* Category Icon Pills (Directly from Reference Image 1) */}
            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
              {categories.map((cat, idx) => {
                const IconComponent = cat.icon
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCategoryClick(cat.service)}
                    className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-[#131F3D]/80 hover:bg-[#1B2C52] border border-[#1F2E54]/80 hover:border-secondary/60 transition-all group cursor-pointer shadow-sm hover:-translate-y-1"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-secondary/20 flex items-center justify-center text-gray-300 group-hover:text-secondary mb-1.5 transition-colors">
                      <IconComponent size={18} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-300 group-hover:text-white text-center leading-tight">
                      {cat.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Hero Image Card (Minar-e-Pakistan Landmark from Reference) */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg rounded-3xl overflow-hidden border border-[#1F2E54] shadow-2xl bg-[#131F3D] group">
              <img
                src="/assets/images/lahore_minar_hero.jpg"
                alt="Minar-e-Pakistan Lahore - Local Services"
                className="w-full h-[320px] sm:h-[420px] object-cover rounded-3xl transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1329] via-[#0B1329]/30 to-transparent" />
              
              {/* Cursive Tagline Overlay (From Reference Image 1) */}
              <div className="absolute top-6 right-6 text-right">
                <span className="font-poppins text-lg sm:text-xl font-bold text-white drop-shadow-md block">
                  Support Local
                </span>
                <span className="text-secondary font-bold text-sm sm:text-base tracking-wide drop-shadow block">
                  Grow Together 🤝
                </span>
              </div>

              {/* Verified Count Card Overlay */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#0F1E3D]/90 border border-white/10 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Verified Active Network</p>
                  <p className="text-lg font-bold text-white">500+ Local Karigars</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/find-karigar')}
                  className="px-3.5 py-1.5 rounded-xl bg-secondary text-white text-xs font-bold shadow hover:bg-orange-600 transition-colors"
                >
                  Explore All →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
