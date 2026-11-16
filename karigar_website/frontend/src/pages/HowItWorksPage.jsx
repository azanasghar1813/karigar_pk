import { Search, CalendarCheck, CheckCircle2, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Search & Compare',
      desc: 'Browse verified electricians, plumbers, HVAC technicians, and carpenters across Karachi, Lahore, Islamabad, and all launch cities.',
      icon: Search,
      badge: 'Step 1'
    },
    {
      num: '02',
      title: 'Instant Booking',
      desc: 'Pick your preferred date and convenient time slot. Transparent pricing with clear PKR 50 processing fee and no hidden surprises.',
      icon: CalendarCheck,
      badge: 'Step 2'
    },
    {
      num: '03',
      title: 'Service Done & Verified',
      desc: 'The verified technician arrives at your doorstep, completes the job professionally, and you pay securely via Cash or JazzCash.',
      icon: CheckCircle2,
      badge: 'Step 3'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-12 sm:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-2">
            Simple 3-Step Process
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl font-extrabold text-[#0A1F44] mb-3 tracking-tight">
            How KarigarPK Works
          </h1>
          <p className="text-[#5A6B84] text-sm sm:text-base leading-relaxed">
            Booking a trusted, verified professional for your home or commercial office in Pakistan takes less than 2 minutes.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {steps.map((s, idx) => {
            const Icon = s.icon
            return (
              <div
                key={s.num}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4EAF2] shadow-[0_8px_30px_rgba(10,31,68,0.06)] hover:shadow-xl hover:border-[#FF7A00]/40 transition-all duration-200 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF7A00] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Icon size={28} className="stroke-[2.2]" />
                    </div>
                    <span className="font-poppins font-black text-3xl text-gray-200 group-hover:text-[#FF7A00]/30 transition-colors">
                      {s.num}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider block mb-1">
                    {s.badge}
                  </span>
                  <h3 className="font-poppins font-bold text-xl text-[#0A1F44] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-[#5A6B84] text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E4EAF2]/80">
                  <span className="text-xs font-semibold text-[#0A1F44] flex items-center gap-1 group-hover:text-[#FF7A00] transition-colors">
                    Learn more <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Benefits Strip */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4EAF2] shadow-[0_8px_30px_rgba(10,31,68,0.06)] mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A1F44] flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-[#0A1F44] text-base mb-1">NADRA Verified Pros</h4>
                <p className="text-xs text-[#5A6B84]">Every technician passes CNIC identity verification and background validation.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#FF7A00] flex items-center justify-center flex-shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-[#0A1F44] text-base mb-1">Punctual & Reliable</h4>
                <p className="text-xs text-[#5A6B84]">Confirmed appointment time slots with direct phone and WhatsApp coordination.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Award size={24} />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-[#0A1F44] text-base mb-1">Service Warranty</h4>
                <p className="text-xs text-[#5A6B84]">Transparent customer support and resolution assistance on every verified booking.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#0A1F44] rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <h2 className="font-poppins text-2xl sm:text-4xl font-extrabold mb-3">
            Ready to experience effortless home service?
          </h2>
          <p className="text-gray-300 text-sm max-w-xl mx-auto mb-6">
            Join thousands of happy homeowners and business managers across Pakistan who rely on KarigarPK.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/find-karigar"
              className="bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-8 rounded-full text-sm transition-all shadow-md shadow-orange-500/30 hover:scale-105"
            >
              Explore Karigars Now →
            </Link>
            <Link
              to="/register-karigar"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-full text-sm transition-colors border border-white/20"
            >
              Join as a Professional
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
