import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CallbackBox from './CallbackBox'

export default function Hero() {
  const [service, setService] = useState('')
  const navigate = useNavigate()

  const services = [
    'Electrician',
    'Plumber',
    'Carpenter',
    'Painter',
    'AC Repair',
    'Locksmith',
    'CCTV Install',
    'General Repair',
    'Household Chores'
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (service) {
      navigate('/find-karigar?service=' + encodeURIComponent(service))
    } else {
      navigate('/find-karigar')
    }
  }

  return (
    <div className="bg-field-hero text-white py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Column: Text & Search */}
          <div className="flex-1 text-center lg:text-left animate-slide-in">
            <div className="inline-block bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-emerald-500/30">
              Now serving Lahore
            </div>
            <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find a trusted karigar near you
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0">
              Verified professionals for every home service. Book instantly or request a callback.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0">
              <div className="bg-white rounded-xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-4 pr-10 rounded-lg text-slate-800 border-none bg-slate-50 focus:outline-none focus:ring-2 focus:ring-secondary appearance-none text-lg cursor-pointer"
                  >
                    <option value="" disabled>Choose a service</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>

                <button
                  type="submit"
                  className="bg-secondary hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors text-lg whitespace-nowrap"
                >
                  <Search size={22} />
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-sm md:text-base">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>500+ Verified Karigar</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Same Day Service</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
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