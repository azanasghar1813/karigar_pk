import { MessageCircle } from 'lucide-react'
import { SITE_PHONE_WA } from '../config/site'

export default function WhatsAppFAB() {
  return (
    <a
      href={`https://wa.me/${SITE_PHONE_WA}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center group"
      aria-label="Contact on WhatsApp"
    >
      <div className="flex flex-col items-center gap-1">
        <div className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] hover:scale-105 transition-all flex items-center justify-center">
          <MessageCircle size={28} className="animate-in fade-in zoom-in duration-200" />
        </div>
        <span className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap border border-slate-100">
          Chat with us
        </span>
      </div>
    </a>
  )
}
