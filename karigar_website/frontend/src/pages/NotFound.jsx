import { Link } from 'react-router-dom'
import { Home, Search, HelpCircle, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#F5F7FB] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-[#E4EAF2] p-8 sm:p-12 text-center shadow-[0_8px_30px_rgba(10,31,68,0.06)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* 404 Badge */}
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF7A00] flex items-center justify-center mx-auto mb-5 shadow-xs">
          <HelpCircle size={32} />
        </div>

        <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-2">
          Error 404
        </span>

        {/* Clear Urdu / English heading */}
        <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1F44] mb-3 leading-tight">
          Page nahi mila — 404
        </h1>

        <p className="text-[#5A6B84] text-xs sm:text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Aap jis page ko dhoond rahe hain wo mojood nahi hai ya uska link badal diya gaya hai.
        </p>

        {/* Action Buttons: Home & Explore */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A1F44] hover:bg-[#102747] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
          >
            <Home size={16} className="text-[#FF7A00]" />
            <span>Home Page</span>
          </Link>

          <Link
            to="/find-karigar"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 hover:scale-[1.02]"
          >
            <Search size={16} />
            <span>Explore Karigars</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E4EAF2]">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B84] hover:text-[#0A1F44] transition-colors"
          >
            <ArrowLeft size={13} /> Wapis Main Page Par Jayein
          </Link>
        </div>

      </div>
    </div>
  )
}
