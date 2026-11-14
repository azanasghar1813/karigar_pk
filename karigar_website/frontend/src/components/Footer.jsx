import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SITE_LOGO, SITE_LOGO_ALT, SITE_PHONE_DISPLAY, SITE_PHONE_E164, CITIES } from '../config/site'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#070c1a] border-t border-gray-800/80 text-white pt-14 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center text-white font-black text-xl shadow-lg">
                🔨
              </div>
              <span className="font-poppins font-black text-2xl text-white tracking-tight">
                Karigar<span className="text-[#FF6B00]">PK</span>
              </span>
            </Link>
            
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              Pakistan's premier marketplace for trusted local businesses, certified craftsmen, and on-demand home repair services.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck size={16} />
              <span>100% CNIC & Background Verified Network</span>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="font-poppins font-bold text-white text-sm mb-4">Popular Services</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/find-karigar?service=Electrician" className="hover:text-[#FF6B00] transition-colors">Electrician Service</Link></li>
              <li><Link to="/find-karigar?service=Plumber" className="hover:text-[#FF6B00] transition-colors">Plumber Service</Link></li>
              <li><Link to="/find-karigar?service=Carpenter" className="hover:text-[#FF6B00] transition-colors">Carpenter & Woodwork</Link></li>
              <li><Link to="/find-karigar?service=AC%20Repair" className="hover:text-[#FF6B00] transition-colors">AC & Cooling Repair</Link></li>
              <li><Link to="/find-karigar?service=Painter" className="hover:text-[#FF6B00] transition-colors">House Painter</Link></li>
              <li><Link to="/find-karigar?service=Home%20Appliances" className="hover:text-[#FF6B00] transition-colors">Appliance Technician</Link></li>
            </ul>
          </div>

          {/* Covered Cities Directory */}
          <div>
            <h4 className="font-poppins font-bold text-white text-sm mb-4">Cities Covered</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {CITIES.map(c => (
                <li key={c}>
                  <Link to={`/find-karigar?city=${encodeURIComponent(c)}`} className="hover:text-[#FF6B00] transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>
                    <span>{c}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-poppins font-bold text-white text-sm mb-4">Customer Support</h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <Phone size={15} className="text-[#FF6B00] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-300 font-semibold">Helpline</p>
                  <a href={`tel:${SITE_PHONE_E164}`} className="hover:text-[#FF6B00] transition-colors">{SITE_PHONE_DISPLAY}</a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail size={15} className="text-[#FF6B00] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-300 font-semibold">Official Email</p>
                  <a href="mailto:karigarpk.live@gmail.com" className="hover:text-[#FF6B00] transition-colors">karigarpk.live@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#FF6B00] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-300 font-semibold">Headquarters</p>
                  <p>Lahore, Punjab, Pakistan</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            &copy; {currentYear} KarigarPK. All rights reserved. Built with pride for Pakistan.
          </p>

          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/about" className="hover:text-gray-300 transition-colors">About Us</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
