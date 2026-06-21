import { Link } from 'react-router-dom'
import { Search, HardHat, ArrowRight } from 'lucide-react'

export default function DualCards() {
  return (
    <section className="py-12 px-4 bg-slate-50 -mt-8 relative z-10">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-secondary mb-6">
                <Search size={24} />
              </div>
              <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-3">
                Need a service done?
              </h2>
              <p className="text-slate-500 mb-8">
                Search verified karigars and book in minutes.
              </p>
            </div>
            <Link 
              to="/find-karigar" 
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-secondary hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Find a karigar <ArrowRight size={18} />
            </Link>
          </div>

          {/* Karigar Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-primary mb-6">
                <HardHat size={24} />
              </div>
              <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-3">
                Are you a skilled worker?
              </h2>
              <p className="text-slate-500 mb-8">
                Join as a karigar and start earning on your own terms.
              </p>
            </div>
            <Link 
              to="/register-karigar" 
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white border-2 border-primary text-primary hover:bg-slate-50 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Join as karigar <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
