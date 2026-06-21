import { Link } from 'react-router-dom'
import { Wallet, Clock, ShieldCheck, TrendingUp } from 'lucide-react'

export default function JoinKarigar() {
  const services = [
    'Plumber',
    'Electrician',
    'Carpenter',
    'AC Repair',
    'Painter',
    'Locksmith',
    'CCTV Install',
    'General Repair'
  ]

  return (
    <div>

      <div className="bg-gradient-to-br from-primary to-blue-900 text-white py-12 sm:py-20 px-4 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-secondary opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
        
        <div className="container relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 bg-white/10 text-secondary text-sm font-bold rounded-full mb-4">
                WORK WITH US
              </span>
              <h1 className="font-poppins text-3xl sm:text-5xl font-bold mb-4 leading-tight">
                Turn your skills into <span className="text-secondary">consistent earnings</span>
              </h1>
              <p className="text-blue-100 text-base sm:text-lg mb-6">
                Join Karigar PK's network of verified professionals. Be your own boss, choose your hours, and get booked by thousands of customers across Lahore.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#services-grid" className="px-8 py-3 rounded-xl bg-secondary text-white font-bold hover:bg-orange-600 transition-all shadow-lg text-center">
                  Start Earning Today
                </a>
                <Link to="/login" state={{ tab: 'karigar' }} className="px-8 py-3 rounded-xl border border-white/30 hover:bg-white/10 text-white font-bold transition-all text-center">
                  Login to Dashboard
                </Link>
              </div>
            </div>
            
            {/* Stats/Badge */}
            <div className="hidden lg:block bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl w-full max-w-sm">
              <h3 className="font-bold text-xl mb-4 text-center">Why Karigars Choose Us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Consistent Work</p>
                    <p className="text-xs text-blue-200">Daily booking requests</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Great Earnings</p>
                    <p className="text-xs text-blue-200">Keep what you earn, zero hidden fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-12 bg-white px-4">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-slate-800">Everything you need to succeed</h2>
            <p className="text-slate-500 mt-2">We provide the platform, you provide the skills.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-primary rounded-2xl flex items-center justify-center mb-4">
                <Clock size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Flexible Hours</h3>
              <p className="text-slate-600 text-sm">Work when you want. Toggle your availability on or off with a single tap in your dashboard.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-orange-100 text-secondary rounded-2xl flex items-center justify-center mb-4">
                <Wallet size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Weekly Payouts</h3>
              <p className="text-slate-600 text-sm">No waiting for months. Get your hard-earned money transferred directly to your account every week.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Verified Platform</h3>
              <p className="text-slate-600 text-sm">We verify both customers and karigars to ensure a safe, professional, and reliable working environment.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services-grid" className="py-12 sm:py-16 px-4 bg-field-workers min-h-screen">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-white">Select your expertise</h2>
            <p className="text-gray-400 mt-2">Choose the primary service you want to offer to start your registration.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {services.map((service) => (
              <div key={service} className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 text-center">
                <h3 className="font-poppins font-bold text-white text-base sm:text-lg mb-2 sm:mb-4">{service}</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-5">Join as {service} and receive work requests.</p>
                <Link
                  to={`/register-karigar?service=${encodeURIComponent(service)}`}
                  className="inline-block w-full px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-secondary bg-secondary text-white text-xs sm:text-base font-semibold hover:bg-orange-600 transition-all"
                >
                  Join as {service}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
