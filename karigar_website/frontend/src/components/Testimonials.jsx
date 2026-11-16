import { ShieldCheck, ArrowRight, Building2, PhoneCall, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Testimonials() {
  const directoryPillars = [
    {
      title: '17,000+ Local Businesses',
      subtitle: 'Lahore, Karachi & Islamabad',
      icon: Building2,
      tag: 'Verified Directory',
      text: 'Pakistani shehron ke local electricians, plumbers, AC technicians, carpenters aur trades aik muttahidah directory mein mojood hain.'
    },
    {
      title: 'Direct Call & WhatsApp',
      subtitle: 'Baghair kisi middleman ke',
      icon: PhoneCall,
      tag: 'Direct Contact',
      text: 'Har listing par direct phone aur WhatsApp link mojood hai taake aap baghair kisi commission ya delay ke rabta kar sakein.'
    },
    {
      title: '100% Free Business Claim',
      subtitle: 'Dukandaron aur Karigaron ke liye',
      icon: ShieldCheck,
      tag: 'Free Verification',
      text: 'Agar aap ka karobar pehle se listed hai to OTP aur simple verification ke zariye apna business claim karein aur verified badge hasil karein.'
    }
  ]

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-[#E4EAF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF7A00] uppercase tracking-wider mb-1">
              <Sparkles size={14} />
              <span>KarigarPK Open Platform</span>
            </div>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1F44] tracking-tight">
              17,000+ businesses listed — 3 shehron mein, claim bilkul free
            </h2>
          </div>
          <Link
            to="/find-karigar"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0A1F44] hover:text-[#FF7A00] transition-colors"
          >
            <span>Explore all directory listings</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Cards Grid: 3 Directory Fact Cards + 1 Navy CTA Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {directoryPillars.map((p, i) => {
            const Icon = p.icon
            return (
              <div
                key={i}
                className="bg-white border border-[#E4EAF2] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-gray-300 transition-all shadow-[0_8px_24px_rgba(10,31,68,0.05)] hover:shadow-lg h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7A00] flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-extrabold bg-[#0A1F44]/5 text-[#0A1F44] px-2.5 py-0.5 rounded-full">
                      {p.tag}
                    </span>
                  </div>

                  <h3 className="font-poppins font-bold text-[#0A1F44] text-base leading-snug mb-0.5">
                    {p.title}
                  </h3>
                  <p className="text-[#FF7A00] text-xs font-semibold mb-3">
                    {p.subtitle}
                  </p>

                  <p className="text-[#5A6B84] text-xs sm:text-sm leading-relaxed">
                    {p.text}
                  </p>
                </div>
              </div>
            )
          })}

          {/* 4th Card: Navy CTA Card */}
          <div className="bg-[#0A1F44] rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-xl text-white h-full min-h-[260px]">
            <div className="relative z-10 w-full">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-[#FF7A00] text-white px-2.5 py-0.5 rounded-full mb-3">
                For Local Businesses
              </span>
              <h3 className="font-poppins font-bold text-white text-base leading-snug mb-1.5">
                Apna Karobar KarigarPK par Claim Karein
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed mb-4">
                Directory mein apni listing talash karein aur bina kisi fees ke foran claim karein.
              </p>
            </div>

            <div className="relative z-10 w-full pt-2">
              <Link
                to="/find-karigar"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-md"
              >
                <span>Find Your Listing</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
