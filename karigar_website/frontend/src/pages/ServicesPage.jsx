import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Zap, Wrench, Snowflake, Home, Sparkles, Hammer, Paintbrush, Car, Tv, Video, Key, Smile, UtensilsCrossed } from 'lucide-react'
import { SERVICES_CONFIG } from '../config/site'

const ICON_MAP = {
  Zap,
  Wrench,
  Snowflake,
  Home,
  Sparkles,
  Hammer,
  Paintbrush,
  Car,
  Tv,
  Video,
  Key,
  Smile,
  UtensilsCrossed
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-2">
            Verified Services Across Pakistan
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl font-extrabold text-[#0A1F44] mb-3.5 tracking-tight">
            Professional Home & Commercial Services
          </h1>
          <p className="text-[#5A6B84] text-sm sm:text-base leading-relaxed">
            Discover background-checked, verified electricians, plumbers, HVAC technicians, carpenters, and painters ready to serve your residence or commercial workspace across Pakistan.
          </p>
        </div>

        {/* Services Grid (Clean White cards with dedicated photos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {SERVICES_CONFIG.map((service) => {
            const IconComponent = ICON_MAP[service.iconName] || Wrench

            return (
              <div
                key={service.id}
                className="bg-white border border-[#E4EAF2] rounded-3xl overflow-hidden hover:border-[#FF7A00]/50 transition-all duration-200 shadow-[0_8px_30px_rgba(10,31,68,0.06)] hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Service Dedicated Photo */}
                  <div className="h-48 relative overflow-hidden bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    
                    {/* Category Icon Badge */}
                    <div className="absolute bottom-3 left-4 w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E4EAF2] flex items-center justify-center text-[#FF7A00] shadow-md">
                      <IconComponent size={20} className="stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <h3 className="font-poppins font-bold text-[#0A1F44] text-xl mb-1.5 group-hover:text-[#FF7A00] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-[#5A6B84] text-xs sm:text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#E4EAF2] pt-3 text-xs">
                      <span className="text-[#5A6B84]">Starting from</span>
                      <span className="font-extrabold text-[#0A1F44] text-sm">
                        PKR {service.startingPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6 pt-0">
                  <Link
                    to={`/find-karigar?service=${encodeURIComponent(service.searchKey)}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm hover:shadow-orange-500/25"
                  >
                    <span>Find {service.name}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA Banner: Navy Rounded Banner */}
        <div className="bg-[#0A1F44] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl text-white">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Are you a skilled technician or workshop owner?
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Join thousands of verified professionals on KarigarPK and start receiving customer bookings directly across Pakistan with 0% listing commission.
            </p>
            <Link
              to="/register-karigar"
              className="inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3.5 px-8 rounded-full text-xs sm:text-sm transition-all shadow-md shadow-orange-500/30 hover:scale-105"
            >
              <span>Join as a Professional</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
