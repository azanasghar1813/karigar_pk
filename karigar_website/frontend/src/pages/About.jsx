import { Users, Target, Heart, Zap, ShieldCheck, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-2">
            Who We Are
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl font-extrabold text-[#0A1F44] mb-3 tracking-tight">
            About KarigarPK
          </h1>
          <p className="text-[#5A6B84] text-sm sm:text-base leading-relaxed">
            Empowering Pakistani households with certified local craftsmanship and creating dignified, direct earning opportunities for thousands of skilled professionals across Pakistan.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white border border-[#E4EAF2] rounded-3xl p-8 sm:p-12 mb-12 shadow-[0_8px_30px_rgba(10,31,68,0.06)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1F44] mb-3">
                Our Mission & Vision
              </h2>
              <p className="text-[#0E1E3A] text-sm leading-relaxed mb-3">
                Historically in Pakistan, finding a trustworthy electrician, plumber, or carpenter meant relying on random roadside kiosks without background checks, price transparency, or quality guarantees.
              </p>
              <p className="text-[#5A6B84] text-sm leading-relaxed mb-6">
                KarigarPK transforms this landscape by verifying national identity (CNIC), enforcing strict service quality standards, and providing digital booking so families get fast, reliable home repairs at transparent prices.
              </p>
              <Link
                to="/register-karigar"
                className="inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-6 rounded-full text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 hover:scale-105"
              >
                <span>Join Our Professional Network</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#E4EAF2] shadow-md">
              <img
                src="/assets/images/karigar_drill_portrait.jpg"
                alt="KarigarPK Professional Craftsman"
                className="w-full h-80 object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-14">
          <div className="text-center mb-10">
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1F44] mb-1">
              Our Core Principles
            </h2>
            <p className="text-[#5A6B84] text-xs sm:text-sm">
              The values that govern our operations every single day
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF7A00] mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-poppins text-base font-bold text-[#0A1F44] mb-1.5">Verified Trust</h3>
              <p className="text-[#5A6B84] text-xs sm:text-sm leading-relaxed">
                Every karigar on our platform is vetted with government NADRA identification to safeguard your home and family.
              </p>
            </div>

            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0A1F44] mb-4">
                <Zap size={24} />
              </div>
              <h3 className="font-poppins text-base font-bold text-[#0A1F44] mb-1.5">Prompt Execution</h3>
              <p className="text-[#5A6B84] text-xs sm:text-sm leading-relaxed">
                Emergency callouts or scheduled visits arrive within convenient time slots across all launch cities.
              </p>
            </div>

            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                <Award size={24} />
              </div>
              <h3 className="font-poppins text-base font-bold text-[#0A1F44] mb-1.5">Fair Compensation</h3>
              <p className="text-[#5A6B84] text-xs sm:text-sm leading-relaxed">
                We ensure skilled craftsmen keep 100% of their earnings without exploitative middleman cuts.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#0A1F44] rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold mb-3">
            Experience reliable craftsmanship today
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm max-w-lg mx-auto mb-6">
            Find the right verified technician for your maintenance task anywhere in Pakistan.
          </p>
          <Link
            to="/find-karigar"
            className="inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-8 rounded-full text-xs sm:text-sm transition-all shadow-md shadow-orange-500/30 hover:scale-105"
          >
            <span>Explore Karigars</span>
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </div>
  )
}
