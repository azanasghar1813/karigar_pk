import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import api from '../config/api'
import { SERVICES } from '../config/site'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const bundledServices = [
    {
      _id: '1',
      name: 'Electrician Services',
      icon: '⚡',
      image: '/assets/images/electrician_work.jpg',
      description: 'Short circuits, ceiling fans, breaker boards, UPS & solar inverter wiring.',
      startingPrice: 500
    },
    {
      _id: '2',
      name: 'Plumbing Works',
      icon: '🔧',
      image: '/assets/images/plumber_sink.jpg',
      description: 'Leakages, sanitary fixtures, water pump installations, and pipeline repair.',
      startingPrice: 600
    },
    {
      _id: '3',
      name: 'AC & Cooling',
      icon: '❄️',
      image: '/assets/images/ac_technician.jpg',
      description: 'Split AC deep cleaning, gas refill, general servicing, and compressor repair.',
      startingPrice: 800
    },
    {
      _id: '4',
      name: 'Carpentry & Woodwork',
      icon: '🪚',
      image: '/assets/images/karigar_drill_portrait.jpg',
      description: 'Door locks, customized cabinets, furniture repair, and wooden partitions.',
      startingPrice: 700
    },
    {
      _id: '5',
      name: 'Painting & Polishing',
      icon: '🎨',
      image: '/assets/images/ui_hero_mockup.jpg',
      description: 'Interior wall paint, weather sheet, door polishing, and wall putty finish.',
      startingPrice: 1500
    },
    {
      _id: '6',
      name: 'Home Appliance Repair',
      icon: '📺',
      image: '/assets/images/electrician_panel.jpg',
      description: 'Washing machines, microwave ovens, water geysers, and refrigerators.',
      startingPrice: 600
    }
  ]

  useEffect(() => {
    api.get('/services')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Merge images and starting rates
          const merged = res.data.map((s, idx) => ({
            ...s,
            image: bundledServices[idx % bundledServices.length].image,
            startingPrice: s.startingPrice || bundledServices[idx % bundledServices.length].startingPrice
          }))
          setServices(merged)
        } else {
          setServices(bundledServices)
        }
        setLoading(false)
      })
      .catch(err => {
        console.warn('Using bundled service data:', err)
        setServices(bundledServices)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#0B1329] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest block mb-2">
            Professional Solutions
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl font-black text-white mb-4">
            Services Available Across Pakistan
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Verified, background-checked electricians, plumbers, HVAC technicians, and carpenters ready to serve your residence or commercial office.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-[#131F3D] border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition-all shadow-xl hover:shadow-2xl flex flex-col justify-between group"
            >
              <div>
                {/* Service Visual */}
                <div className="h-48 relative overflow-hidden bg-slate-900">
                  <img
                    src={service.image || '/assets/images/electrician_work.jpg'}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131F3D] via-[#131F3D]/30 to-transparent"></div>
                  
                  {/* Category Emoji Badge */}
                  <div className="absolute bottom-3 left-4 w-12 h-12 rounded-2xl bg-[#0B1329]/90 backdrop-blur-md border border-gray-700/80 flex items-center justify-center text-2xl shadow-lg">
                    {service.icon || '🔧'}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="font-poppins font-bold text-white text-xl mb-2 group-hover:text-[#FF6B00] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-800/80 pt-4 text-xs">
                    <span className="text-gray-400">Starting from</span>
                    <span className="font-bold text-[#FF6B00] text-sm">PKR {service.startingPrice || 500}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Link
                  to={`/find-karigar?service=${encodeURIComponent(service.name)}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-orange-500/25"
                >
                  <span>Find {service.name}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#131F3D] to-[#1F2E54] border border-gray-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-white mb-3">
              Are you a skilled technician or workshop owner?
            </h2>
            <p className="text-gray-300 text-sm mb-6">
              Join thousands of verified pros on KarigarPK and start receiving customer bookings directly with 0% listing commission.
            </p>
            <Link
              to="/register-karigar"
              className="inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl text-sm transition-all shadow-lg hover:shadow-orange-500/25"
            >
              <span>Join as a Professional</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
