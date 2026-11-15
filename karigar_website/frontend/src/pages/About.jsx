import { Users, Target, Heart, Zap, ShieldCheck, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A1930] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#FF8A00] text-xs font-bold uppercase tracking-widest block mb-1.5">
            Who We Are
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl font-black text-[#0A1930] mb-3">
            About KarigarPK
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Empowering Pakistani households with certified local craftsmanship and creating dignified earning opportunities for thousands of skilled professionals.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white border border-gray-200/90 rounded-3xl p-8 sm:p-12 mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-[#0A1930] mb-3">
                Our Mission & Vision
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Historically in Pakistan, finding a trustworthy electrician, plumber, or carpenter meant relying on random roadside kiosks without background checks, price transparency, or quality guarantees.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                KarigarPK transforms this landscape by verifying national identity (CNIC), enforcing strict service quality standards, and providing digital booking so families get fast, reliable home repairs at transparent prices.
              </p>
              <Link
                to="/register-karigar"
                className="inline-flex items-center gap-1.5 bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
              >
                Join Our Professional Network →
              </Link>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <img
                src="/assets/images/karigar_drill_portrait.jpg"
                alt="KarigarPK Professional Craftsman"
                className="w-full h-72 object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-[#0A1930] mb-1">
              Our Core Principles
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              The values that govern our operations every single day
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8A00] mb-3">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-poppins text-base font-bold text-[#0A1930] mb-1.5">Verified Trust</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Every karigar on our platform is vetted with government NADRA identification to safeguard your home and family.
              </p>
            </div>

            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#102747] mb-3">
                <Zap size={22} />
              </div>
              <h3 className="font-poppins text-base font-bold text-[#0A1930] mb-1.5">Prompt Execution</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Emergency callouts or scheduled visits arrive within 30 minutes in key sectors of Lahore, Karachi, and Islamabad.
              </p>
            </div>

            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                <Award size={22} />
              </div>
              <h3 className="font-poppins text-base font-bold text-[#0A1930] mb-1.5">Fair Compensation</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                We ensure skilled craftsmen earn fair market wages without exploitative middleman cuts, fostering genuine pride in their work.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
