import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { SITE_PHONE_DISPLAY, SITE_PHONE_E164, SITE_EMAIL } from '../config/site'
import BrandLogo from './BrandLogo'

export default function Footer() {
  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Explore', to: '/find-karigar' },
    { label: 'Services', to: '/services' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'For Professionals', to: '/join-karigar' }
  ]

  const supportLinks = [
    { label: 'Help Center', to: '/contact' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms & Conditions', to: '/terms-and-conditions' }
  ]

  const topCities = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Faisalabad',
    'Multan'
  ]

  return (
    <footer className="bg-[#061530] text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/10">
      
      {/* Subtle City Skyline Silhouette Graphic along bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none opacity-15 overflow-hidden select-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-white">
          <path d="M0,120 L0,90 L20,90 L20,70 L35,70 L35,90 L50,90 L50,60 L70,60 L70,90 L90,90 L90,45 L105,45 L105,90 L120,90 L120,75 L140,75 L140,90 L160,90 L160,50 L175,50 L175,30 L185,30 L185,50 L200,50 L200,90 L230,90 L230,65 L250,65 L250,90 L280,90 L280,40 L295,40 L295,90 L320,90 L320,80 L340,80 L340,90 L380,90 L380,20 L395,5 L410,20 L410,90 L440,90 L440,55 L460,55 L460,90 L500,90 L500,70 L520,70 L520,90 L560,90 L560,45 L580,45 L580,90 L610,90 L610,60 L630,60 L630,90 L670,90 L670,35 L685,35 L685,90 L720,90 L720,75 L740,75 L740,90 L780,90 L780,50 L800,50 L800,90 L830,90 L830,30 L845,30 L845,90 L880,90 L880,65 L900,65 L900,90 L940,90 L940,40 L960,40 L960,90 L1000,90 L1000,70 L1020,70 L1020,90 L1060,90 L1060,55 L1080,55 L1080,90 L1120,90 L1120,35 L1135,35 L1135,90 L1170,90 L1170,70 L1200,70 L1200,120 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 4-Column Grid (matching Reference 2 "Footer") */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
          
          {/* Column 1: Logo + Taglines + Socials (col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo variant="dark" size="md" />

            <h3 className="font-poppins font-bold text-base text-white mt-3">
              Pakistan's Local Business & Services Network.
            </h3>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Discover local businesses. Find trusted professionals. Book services with confidence.
            </p>

            {/* Social Icons (Facebook, X, Instagram, LinkedIn, YouTube) */}
            <div className="flex items-center gap-2.5 pt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF7A00] text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF7A00] text-white flex items-center justify-center transition-colors"
                aria-label="X / Twitter"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF7A00] text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF7A00] text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF7A00] text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="font-poppins font-bold text-white text-sm mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-[#FF7A00] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support (col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="font-poppins font-bold text-white text-sm mb-4 tracking-wide">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-[#FF7A00] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Cities (col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="font-poppins font-bold text-white text-sm mb-4 tracking-wide">
              Cities
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              {topCities.map((c) => (
                <li key={c}>
                  <Link
                    to={`/find-karigar?city=${encodeURIComponent(c)}`}
                    className="hover:text-[#FF7A00] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
                    <span>{c}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-400 space-y-1">
              <p>Helpline: <a href={`tel:${SITE_PHONE_E164}`} className="text-white hover:text-[#FF7A00] font-semibold">{SITE_PHONE_DISPLAY}</a></p>
              <p>Email: <a href={`mailto:${SITE_EMAIL}`} className="text-white hover:text-[#FF7A00]">{SITE_EMAIL}</a></p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright (Exact from Reference 2) */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            &copy; 2025 KarigarPK. All rights reserved.
          </p>
          <p className="text-[11px] text-gray-500">
            Pakistan's Local Business & Services Discovery Network
          </p>
        </div>

      </div>
    </footer>
  )
}
