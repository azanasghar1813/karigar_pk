import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Wrench, Zap, Snowflake, Home, Sparkles, Hammer, Paintbrush,
  Car, Tv, Video, Key, Smile, Phone, MessageCircle, MapPin,
  Star, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react'
import api from '../config/api'
import { CITIES, SERVICES_CONFIG, getServiceConfig } from '../config/site'
import BusinessCard from '../components/BusinessCard'
import RatingBadge from '../components/RatingBadge'

// Slugs mapping to canonical service search keys
const SLUG_TO_SERVICE = {
  'plumber': 'Plumber',
  'plumbers': 'Plumber',
  'electrician': 'Electrician',
  'electricians': 'Electrician',
  'ac-repair': 'AC Repair',
  'ac-technician': 'AC Repair',
  'ac-cooling': 'AC Repair',
  'carpenter': 'Carpenter',
  'carpentry': 'Carpenter',
  'painter': 'Painter',
  'painting': 'Painter',
  'cleaner': 'Cleaner',
  'cleaning': 'Cleaner',
  'handyman': 'General Repair',
  'home-repair': 'General Repair',
  'appliance-repair': 'Appliance Repair',
  'auto-service': 'Car Mechanic, Car Wash & Detailing',
  'car-wash': 'Car Mechanic, Car Wash & Detailing',
  'cctv-installation': 'CCTV Installation',
  'cctv': 'CCTV Installation',
  'locksmith': 'Locksmith',
  'pest-control': 'Pest Control',
  'generator-service': 'Generator & UPS Service',
  'geyser-repair': 'Geyser Repair',
  'movers': 'Movers & Packers',
  'salon': 'Salon & Beauty (at Home)',
  'beauty': 'Salon & Beauty (at Home)'
}

export default function SeoServiceCityPage() {
  const { serviceSlug, citySlug } = useParams()
  const navigate = useNavigate()

  // Resolve canonical service and city names
  const canonicalService = useMemo(() => {
    if (!serviceSlug) return 'Plumber'
    const clean = serviceSlug.toLowerCase().trim()
    return SLUG_TO_SERVICE[clean] || (clean.charAt(0).toUpperCase() + clean.slice(1))
  }, [serviceSlug])

  const canonicalCity = useMemo(() => {
    if (!citySlug) return 'Lahore'
    const found = CITIES.find(c => c.toLowerCase() === citySlug.toLowerCase().trim())
    return found || 'Lahore'
  }, [citySlug])

  const serviceConfig = getServiceConfig(canonicalService)
  const serviceName = serviceConfig ? serviceConfig.name : `${canonicalService}s`
  const startingPrice = serviceConfig ? serviceConfig.startingPrice : 600

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch real listings and verified karigars for this service + city
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    const params = {
      city: canonicalCity,
      service: canonicalService,
      limit: 30
    }

    Promise.allSettled([
      api.get('/karigars'),
      api.get('/listings', { params })
    ]).then(([karigarsRes, listingsRes]) => {
      if (!isMounted) return

      let fetchedKarigars = []
      if (karigarsRes.status === 'fulfilled' && Array.isArray(karigarsRes.value?.data)) {
        fetchedKarigars = karigarsRes.value.data
          .filter(k => {
            const matchCity = (k.city || '').toLowerCase().includes(canonicalCity.toLowerCase())
            const kServices = Array.isArray(k.services) ? k.services.join(' ').toLowerCase() : (k.services || '').toLowerCase()
            const matchService = kServices.includes(canonicalService.toLowerCase()) || canonicalService.toLowerCase().includes(kServices)
            return matchCity && matchService
          })
          .map(k => ({ ...k, type: 'karigar' }))
      }

      let fetchedListings = []
      if (listingsRes.status === 'fulfilled' && listingsRes.value?.data) {
        const raw = listingsRes.value.data.listings || listingsRes.value.data
        if (Array.isArray(raw)) {
          fetchedListings = raw.map(l => ({ ...l, type: 'listing' }))
        }
      }

      setItems([...fetchedKarigars, ...fetchedListings])
      setLoading(false)
    }).catch(err => {
      if (!isMounted) return
      console.warn('Error loading SEO page listings:', err)
      setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [canonicalCity, canonicalService])

  // Dynamic SEO Title & Meta Tags
  useEffect(() => {
    const pageTitle = `Best ${serviceName} in ${canonicalCity} - Verified Rates & Direct Contact | KarigarPK`
    const pageDesc = `Find top-rated verified ${serviceName.toLowerCase()} in ${canonicalCity}, Pakistan. Direct phone calls, WhatsApp, honest customer reviews, and clear upfront pricing starting from PKR ${startingPrice}.`

    document.title = pageTitle

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = pageDesc

    // Canonical link
    let canonicalTag = document.querySelector('link[rel="canonical"]')
    if (canonicalTag) {
      canonicalTag.href = `https://www.karigarpk.live/services/${encodeURIComponent(serviceSlug || 'plumber')}/${encodeURIComponent(canonicalCity.toLowerCase())}`
    }
  }, [serviceName, canonicalCity, serviceSlug, startingPrice])

  // Frequently Asked Questions tailored for Google AI Overviews and ChatGPT/Gemini
  const faqs = [
    {
      q: `How much does a ${canonicalService.toLowerCase()} charge in ${canonicalCity}?`,
      a: `${serviceName} in ${canonicalCity} on KarigarPK typically start from PKR ${startingPrice} for general home inspection and minor repairs. Complete piping, rewiring, or major component replacements are quoted with upfront itemized costs before work begins.`
    },
    {
      q: `Can I get an emergency ${canonicalService.toLowerCase()} in ${canonicalCity} today?`,
      a: `Yes, KarigarPK features verified local ${serviceName.toLowerCase()} across all major neighborhoods of ${canonicalCity}. You can call directly or contact them via WhatsApp for urgent same-day callouts.`
    },
    {
      q: `Are ${serviceName.toLowerCase()} in ${canonicalCity} background-verified?`,
      a: `Yes, verified professionals on KarigarPK undergo government NADRA CNIC verification, mobile number validation, and customer job reviews before receiving our Verified Pro badge.`
    },
    {
      q: `Which areas in ${canonicalCity} are covered for ${canonicalService.toLowerCase()} services?`,
      a: `Service coverage includes all premier residential and commercial areas across ${canonicalCity}, including Clifton, DHA, Gulshan-e-Iqbal, Johar Town, Gulberg, Model Town, and Blue Area.`
    }
  ]

  // Schema.org structured data (LocalBusiness + Service + ItemList + FAQPage)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        'name': `${canonicalService} Services in ${canonicalCity}`,
        'provider': {
          '@type': 'LocalBusiness',
          'name': 'KarigarPK',
          'url': 'https://www.karigarpk.live',
          'telephone': '+923427066034',
          'email': 'karigarpk.live@gmail.com',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': canonicalCity,
            'addressCountry': 'PK'
          }
        },
        'areaServed': {
          '@type': 'City',
          'name': canonicalCity
        },
        'offers': {
          '@type': 'Offer',
          'price': String(startingPrice),
          'priceCurrency': 'PKR',
          'availability': 'https://schema.org/InStock'
        }
      },
      {
        '@type': 'FAQPage',
        'mainEntity': faqs.map(f => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.a
          }
        }))
      },
      {
        '@type': 'ItemList',
        'name': `Top Verified ${serviceName} in ${canonicalCity}`,
        'itemListElement': items.slice(0, 10).map((item, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': item.fullName || item.name || `${canonicalService} Specialist`,
          'telephone': item.phone || '+923427066034'
        }))
      }
    ]
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] pb-28 sm:pb-16">
      {/* Schema.org Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Banner with City Selector */}
      <div className="bg-[#0A1F44] text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight size={12} />
            <span className="text-[#FF7A00] font-bold">{canonicalService} in {canonicalCity}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <ShieldCheck size={14} className="text-[#22C55E]" />
                <span>Verified Local Services Directory</span>
              </div>
              <h1 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
                Best <span className="text-[#FF7A00]">{serviceName}</span> in {canonicalCity}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Connect directly with background-checked {serviceName.toLowerCase()} across {canonicalCity}. Compare hourly rates, call immediately, or message on WhatsApp with 0% middleman commission.
              </p>
            </div>

            {/* City Switcher Pill Rail */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 lg:w-80 flex-shrink-0">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Choose Launch City
              </span>
              <div className="flex flex-wrap gap-2">
                {['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'].map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => navigate(`/services/${serviceSlug || 'plumber'}/${city.toLowerCase()}`)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      canonicalCity.toLowerCase() === city.toLowerCase()
                        ? 'bg-[#FF7A00] text-white shadow-md'
                        : 'bg-white/10 text-gray-200 hover:bg-white/20'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        
        {/* Quick Highlights Bar */}
        <div className="bg-white rounded-2xl border border-[#E4EAF2] p-4 shadow-sm mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-[11px] text-[#5A6B84] block">Starting Rate</span>
            <span className="font-poppins font-extrabold text-[#0A1F44] text-base">PKR {startingPrice}</span>
          </div>
          <div>
            <span className="text-[11px] text-[#5A6B84] block">Active Providers</span>
            <span className="font-poppins font-extrabold text-[#0A1F44] text-base">{items.length} Listed</span>
          </div>
          <div>
            <span className="text-[11px] text-[#5A6B84] block">Response Time</span>
            <span className="font-poppins font-extrabold text-emerald-600 text-base">Instant Call / WA</span>
          </div>
          <div>
            <span className="text-[11px] text-[#5A6B84] block">Direct Booking Fee</span>
            <span className="font-poppins font-extrabold text-[#FF7A00] text-base">0% Free Contact</span>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-poppins font-bold text-xl text-[#0A1F44]">
                Available {serviceName} in {canonicalCity}
              </h2>
              <p className="text-xs text-[#5A6B84]">
                Direct phone and WhatsApp contact enabled for verified local providers
              </p>
            </div>
            <Link
              to={`/find-karigar?city=${encodeURIComponent(canonicalCity)}&service=${encodeURIComponent(canonicalService)}&view=grid`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#FF7A00] hover:text-[#F06400] transition-colors"
            >
              <span>Explore All on Map</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-2xl border border-[#E4EAF2] h-64 animate-pulse p-4" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(item => (
                <BusinessCard
                  key={item._id}
                  item={item}
                  type={item.type || 'listing'}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E4EAF2] p-8 text-center">
              <MapPin size={36} className="text-[#FF7A00] mx-auto mb-2" />
              <h3 className="font-poppins font-bold text-[#0A1F44] text-base mb-1">
                Currently registering more {serviceName.toLowerCase()} in {canonicalCity}
              </h3>
              <p className="text-xs text-[#5A6B84] mb-4">
                You can browse all available craftsmen in the central directory or join as a verified professional.
              </p>
              <Link
                to="/find-karigar"
                className="inline-flex items-center gap-2 bg-[#0A1F44] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#102747]"
              >
                <span>Browse Full Directory</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* SEO FAQ Section (Targeted for Google AI Overview & Featured Snippets) */}
        <div className="bg-white rounded-3xl border border-[#E4EAF2] p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle size={18} className="text-[#FF7A00]" />
            <h3 className="font-poppins font-bold text-lg text-[#0A1F44]">
              Frequently Asked Questions About {serviceName} in {canonicalCity}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-4">
                <h4 className="font-poppins font-bold text-xs sm:text-sm text-[#0A1F44] mb-1.5">
                  {faq.q}
                </h4>
                <p className="text-xs text-[#5A6B84] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Popular Services in City */}
        <div className="border-t border-[#E4EAF2] pt-8">
          <h4 className="font-poppins font-bold text-sm text-[#0A1F44] mb-3">
            Other Popular Services in {canonicalCity}
          </h4>
          <div className="flex flex-wrap gap-2">
            {SERVICES_CONFIG.filter(s => s.searchKey !== canonicalService).map(s => (
              <Link
                key={s.id}
                to={`/services/${s.id}/${canonicalCity.toLowerCase()}`}
                className="px-3 py-1.5 rounded-xl border border-[#E4EAF2] bg-white text-xs font-semibold text-[#5A6B84] hover:text-[#0A1F44] hover:border-gray-300 transition-colors"
              >
                {s.name} in {canonicalCity}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
