import { useState } from 'react'
import { Search, ChevronDown, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CallbackBox from './CallbackBox'
import { CITIES, SERVICES } from '../config/site'

export default function Hero() {
  const [service, setService] = useState('')
  const [city, setCity] = useState('Lahore')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (service) params.append('service', service)
    if (city && city !== 'All Cities') params.append('city', city)
    
    navigate(`/find-karigar?${params.toString()}`)
  }

  return (
    <div className="bg-field-hero text-white py-16 sm:py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
          
          {/* Left Column: Text & Search */}
          <div className="flex-1 text-center lg:text-left animate-slide-in">
            <div className="inline-block bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 border border-emerald-500/30">
              ⚡ Verified Home Services Across Pakistan
            </div>
            <h1 className="font-poppins text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Find a trusted karigar near you
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Connect with vetted electricians, plumbers, carpenters & technicians in your city.
            </p>

            {/* Search Bar with Service & City Fields (Issue 7 Fix) */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2">
                {/* Service Dropdown */}
                <div className="flex-1 relative">
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-3.5 pr-10 rounded-xl text-slate-800 border-none bg-slate-50 focus:outline-none focus:ring-2 focus:ring-secondary appearance-none text-sm sm:text-base font-medium cursor-pointer"
                  >
                    <option value="" disabled>Choose a service</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>

                {/* City Dropdown */}
                <div className="sm:w-44 relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3.5 pr-10 rounded-xl text-slate-800 border-none bg-slate-50 focus:outline-none focus:ring-2 focus:ring-secondary appearance-none text-sm sm:text-base font-medium cursor-pointer"
                  >
                    <option value="All Cities">All Cities</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-secondary hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all text-sm sm:text-base whitespace-nowrap shadow-md hover:shadow-orange-500/20"
                >
                  <Search size={20} />
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>CNIC Verified Karigars</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Fast Same-Day Service</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Callback Box */}
          <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end animate-slide-in" style={{ animationDelay: '100ms' }}>
            <CallbackBox />
          </div>
          
        </div>
      </div>
    </div>
  )
}
