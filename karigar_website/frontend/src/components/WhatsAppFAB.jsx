import { MessageCircle } from 'lucide-react'
import { SITE_PHONE_WA } from '../config/site'

export default function WhatsAppFAB() {
  return (
    <a
      href={`https://wa.me/${SITE_PHONE_WA}?text=${encodeURIComponent('Hello KarigarPK, I need assistance with a service booking.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 flex items-center justify-center group"
      aria-label="Contact on WhatsApp"
    >
      <div className="flex flex-col items-center gap-1">
        <div className="bg-[#22C55E] text-white p-3.5 sm:p-4 rounded-full shadow-lg shadow-green-600/30 hover:bg-[#16A34A] hover:scale-105 transition-all flex items-center justify-center">
          <MessageCircle size={26} className="text-white" />
        </div>
        <span className="hidden sm:inline-block bg-white/95 backdrop-blur text-[#0A1F44] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md whitespace-nowrap border border-gray-100">
          WhatsApp Help
        </span>
      </div>
    </a>
  )
}
