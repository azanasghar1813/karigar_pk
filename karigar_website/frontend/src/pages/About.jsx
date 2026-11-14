import { Users, Target, Heart, Zap, ShieldCheck, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen bg-[#0B1329] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest block mb-2">
            Who We Are
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl font-black text-white mb-4">
            About KarigarPK
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Empowering Pakistani households with certified local craftsmanship and creating dignified earning opportunities for thousands of skilled professionals.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-[#131F3D] border border-gray-800 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-white mb-4">
                Our Mission & Vision
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Historically in Pakistan, finding a trustworthy electrician, plumber, or carpenter meant relying on random roadside kiosks without background checks, price transparency, or quality guarantees.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                KarigarPK transforms this landscape by verifying national identity (CNIC), enforcing strict service quality standards, and providing digital booking so families get fast, reliable home repairs at transparent prices.
              </p>
              <Link
                to="/register-karigar"
                className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-md"
              >
                Join Our Professional Network →
              </Link>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
              <img
                src="/assets/images/karigar_drill_portrait.jpg"
                alt="KarigarPK Professional Craftsman"
                className="w-full h-80 object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-white mb-2">
              Our Core Principles
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              The values that govern our operations every single day
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#131F3D] border border-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#0B1329] flex items-center justify-center text-[#FF6B00] mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-poppins text-lg font-bold text-white mb-2">Verified Trust</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Every karigar on our platform is vetted with government NADRA identification to safeguard your home and family.
              </p>
            </div>

            <div className="bg-[#131F3D] border border-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#0B1329] flex items-center justify-center text-sky-400 mb-4">
                <Zap size={24} />
              </div>
              <h3 className="font-poppins text-lg font-bold text-white mb-2">Prompt Execution</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Emergency callouts or scheduled visits arrive within 30 minutes in key sectors of Lahore, Karachi, and Islamabad.
              </p>
            </div>

            <div className="bg-[#131F3D] border border-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#0B1329] flex items-center justify-center text-emerald-400 mb-4">
                <Award size={24} />
              </div>
              <h3 className="font-poppins text-lg font-bold text-white mb-2">Fair Compensation</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                We ensure skilled craftsmen earn fair market wages without exploitative middleman cuts, fostering genuine pride in their work.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
