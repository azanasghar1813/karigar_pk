import { Link } from 'react-router-dom'
import { Wallet, Clock, ShieldCheck, TrendingUp, ArrowRight, Zap, Wrench, Snowflake, Hammer, Paintbrush, Key, Video, Sparkles } from 'lucide-react'
import { SERVICES_CONFIG } from '../config/site'

export default function JoinKarigar() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A]">
      
      {/* Navy Hero Section */}
      <div className="bg-[#0A1F44] text-white py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Soft orange decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#FF7A00] opacity-15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-600 opacity-15 blur-3xl pointer-events-none" />
        
        <div className="max-w-[1240px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
            
            {/* Left Column: Heading & CTAs */}
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-block px-3.5 py-1.5 bg-white/10 text-[#FF7A00] text-xs font-bold rounded-full mb-4 tracking-wider uppercase">
                Work With KarigarPK
              </span>
              <h1 className="font-poppins text-3xl sm:text-5xl lg:text-[52px] font-extrabold mb-4 leading-[1.15] tracking-tight text-white">
                Turn your skills into <span className="text-[#FF7A00]">consistent earnings</span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                Join KarigarPK's verified marketplace of technicians and workshop owners. Be your own boss, choose your own working hours, and receive customer bookings directly across Pakistan with 0% listing fee.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <a
                  href="#services-grid"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/25 text-center hover:scale-105"
                >
                  Start Earning Today →
                </a>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/20 hover:bg-white/10 text-white font-bold text-sm transition-all text-center"
                >
                  Login to Portal
                </Link>
              </div>
            </div>
            
            {/* Right Card: Why Karigars Choose Us */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-3xl w-full max-w-sm text-left shadow-2xl">
              <h3 className="font-poppins font-bold text-lg sm:text-xl text-white mb-4 text-center">
                Why Karigars Choose Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00] flex-shrink-0">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Consistent Daily Bookings</p>
                    <p className="text-xs text-gray-300">Receive verified service orders directly</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-[#22C55E] flex-shrink-0">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Transparent Direct Earnings</p>
                    <p className="text-xs text-gray-300">Keep 100% of your labor charges</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">NADRA Verified Trust</p>
                    <p className="text-xs text-gray-300">Badge of trust for residential clients</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3 Core Benefits Section (Clean White Background) */}
      <section className="py-14 sm:py-18 bg-white border-b border-[#E4EAF2] px-4 sm:px-6">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-2xl sm:text-4xl font-extrabold text-[#0A1F44]">
              Everything you need to succeed
            </h2>
            <p className="text-[#5A6B84] text-sm sm:text-base mt-2">
              We provide the marketplace and customers, you provide your expert craftsmanship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F7F9FC] border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto bg-blue-100 text-[#0A1F44] rounded-2xl flex items-center justify-center mb-4">
                <Clock size={28} />
              </div>
              <h3 className="font-poppins font-bold text-lg text-[#0A1F44] mb-2">Flexible Hours</h3>
              <p className="text-[#5A6B84] text-xs sm:text-sm leading-relaxed">
                Work when you want. Toggle your availability online or offline with a single click in your mobile dashboard.
              </p>
            </div>
            
            <div className="bg-[#F7F9FC] border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto bg-orange-100 text-[#FF7A00] rounded-2xl flex items-center justify-center mb-4">
                <Wallet size={28} />
              </div>
              <h3 className="font-poppins font-bold text-lg text-[#0A1F44] mb-2">Instant Cash & COD</h3>
              <p className="text-[#5A6B84] text-xs sm:text-sm leading-relaxed">
                Receive your payments directly in cash or via JazzCash/EasyPaisa right upon job completion.
              </p>
            </div>
            
            <div className="bg-[#F7F9FC] border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto bg-emerald-100 text-[#22C55E] rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-poppins font-bold text-lg text-[#0A1F44] mb-2">Verified Platform</h3>
              <p className="text-[#5A6B84] text-xs sm:text-sm leading-relaxed">
                We verify both clients and technicians to ensure a safe, professional, and respectful environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Grid (Clean Light Background with Navy Heading) */}
      <section id="services-grid" className="py-14 sm:py-20 px-4 sm:px-6 bg-[#F5F7FB]">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-2xl sm:text-4xl font-extrabold text-[#0A1F44]">
              Select your expertise
            </h2>
            <p className="text-[#5A6B84] text-sm sm:text-base mt-2">
              Choose the primary trade you want to offer to start your verified professional onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES_CONFIG.slice(0, 8).map((service) => (
              <div
                key={service.id}
                className="bg-white border border-[#E4EAF2] rounded-3xl p-6 text-center hover:border-[#FF7A00]/50 transition-all shadow-[0_8px_24px_rgba(10,31,68,0.05)] hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7A00] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Wrench size={22} className="stroke-[2.2]" />
                  </div>
                  <h3 className="font-poppins font-bold text-[#0A1F44] text-lg mb-1">
                    {service.name}
                  </h3>
                  <p className="text-[#5A6B84] text-xs leading-relaxed mb-5">
                    {service.description}
                  </p>
                </div>

                <Link
                  to={`/register-karigar?service=${encodeURIComponent(service.searchKey)}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FF7A00] hover:bg-[#F06400] text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-orange-500/25"
                >
                  <span>Join as {service.name}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
