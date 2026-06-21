import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SITE_LOGO, SITE_LOGO_ALT, SITE_PHONE_DISPLAY, SITE_PHONE_E164, SITE_PHONE_WA } from '../config/site'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 text-white py-12 px-4">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={SITE_LOGO}
                alt={SITE_LOGO_ALT}
                className="h-10 w-10 rounded-lg object-contain bg-white"
              />
              <span className="font-poppins text-lg font-bold">Karigar PK</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Pakistan's most trusted home services platform connecting you with verified karigars.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Twitter size={20} /></a>
              <a href="https://www.instagram.com/karigarpk.live/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-poppins font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/find-karigar" className="text-gray-400 hover:text-secondary transition-colors">Electrician Service</Link></li>
              <li><Link to="/find-karigar" className="text-gray-400 hover:text-secondary transition-colors">Plumber Service</Link></li>
              <li><Link to="/find-karigar" className="text-gray-400 hover:text-secondary transition-colors">Carpenter Service</Link></li>
              <li><Link to="/find-karigar" className="text-gray-400 hover:text-secondary transition-colors">AC Repair Service</Link></li>
              <li><Link to="/find-karigar" className="text-gray-400 hover:text-secondary transition-colors">Painter Service</Link></li>
              <li><Link to="/find-karigar" className="text-gray-400 hover:text-secondary transition-colors">Locksmith Service</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-secondary transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-secondary transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-secondary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-gray-400 hover:text-secondary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-poppins font-bold text-white mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-secondary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href={`tel:${SITE_PHONE_E164}`} className="text-gray-400 hover:text-secondary transition-colors">{SITE_PHONE_DISPLAY}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-secondary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:karigarpk.live@gmail.com" className="text-gray-400 hover:text-secondary transition-colors">karigarpk.live@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-secondary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-400">Lahore, Pakistan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Karigar PK. All rights reserved. Pakistan's trusted home services platform.
            </p>
            <div className="flex gap-4 text-sm">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-secondary transition-colors">Privacy</Link>
              <Link to="/terms-and-conditions" className="text-gray-400 hover:text-secondary transition-colors">Terms</Link>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}