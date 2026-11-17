import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, HelpCircle, Phone, MessageCircle, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import { SITE_PHONE_DISPLAY, SITE_PHONE_WA, SITE_EMAIL } from '../config/site'

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: 'How do I book a verified Karigar on KarigarPK?',
      a: 'You can browse verified professionals by selecting your city (Lahore, Karachi, Islamabad) and required service category (Electrician, Plumber, AC Repair, etc.). On any verified profile, click "Book Now", choose your preferred service type, date, and time slot, and confirm. The verified technician will receive your booking details and call you to coordinate arrival.'
    },
    {
      q: 'What is the difference between a "Verified Karigar" and a "Directory Listing"?',
      a: 'Verified Karigars are independently vetted professionals with government-issued CNIC documents, verified mobile numbers, community ratings, and fixed starting rates who accept direct appointment bookings. Directory Listings are public commercial directory records (shops, workshops, local service centers) allowing you to connect directly via Call or WhatsApp.'
    },
    {
      q: 'Is KarigarPK free to use for customers?',
      a: 'Yes, searching, browsing, and directly contacting local businesses or karigars through KarigarPK is 100% free with zero commission on your phone calls or WhatsApp messages. For verified booking appointments, you pay the agreed hourly/service fee directly to the professional upon satisfactory work completion.'
    },
    {
      q: 'How do I claim my existing business listing on KarigarPK?',
      a: 'If your business is already listed in our directory, navigate to your listing page and click "Is this your business? Claim it — it\'s FREE". Verify ownership through a 6-digit OTP sent to your registered phone, upload your CNIC and business photos, and our team will verify your badge within 24 hours.'
    },
    {
      q: 'Why do some phone numbers only show Call and not WhatsApp?',
      a: 'We strictly detect Pakistani mobile numbers (03xx / +923xx) versus PTCL landlines (021, 042, 051). Because landlines cannot receive WhatsApp messages, we only display WhatsApp buttons on valid mobile numbers to ensure your messages always reach an active chat.'
    },
    {
      q: 'Which cities and areas across Pakistan does KarigarPK cover?',
      a: 'KarigarPK currently serves all major sectors across Karachi (Clifton, DHA, Gulshan, Gulistan-e-Johar, North Nazimabad), Lahore (Gulberg, DHA, Johar Town, Model Town, Bahria), and Islamabad/Rawalpindi (F-sectors, G-sectors, Blue Area, Bahria Town), with continuous expansion across Faisalabad, Multan, and Peshawar.'
    },
    {
      q: 'How are Karigars vetted and background-checked?',
      a: 'Every verified Karigar undergoes a multi-step verification process including original NADRA CNIC front/back document inspection, active Pakistani phone verification, skill and service specialty review, and ongoing customer feedback monitoring.'
    },
    {
      q: 'What if I need emergency plumbing or electrical repair right now?',
      a: 'Visit the "Find Karigar" discovery hub, toggle the "Available Now" filter, or use the "Local Radar" to view active technicians within 1 to 5 kilometers of your doorstep, and initiate an immediate direct phone call.'
    }
  ]

  // Schema.org FAQPage structured data for Google Search and AI Overview
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a
      }
    }))
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-10 px-4 sm:px-6 lg:px-8 pb-28 sm:pb-16">
      {/* Dynamic JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/80 text-[#FF7A00] px-3.5 py-1 rounded-full text-xs font-bold mb-3 shadow-2xs">
            <HelpCircle size={14} />
            <span>Help Center & Knowledge Base</span>
          </div>
          <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-[#0A1F44] tracking-tight mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[#5A6B84] leading-relaxed">
            Everything you need to know about booking verified technicians, directory listings, pricing, and business claims on KarigarPK.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-12">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E4EAF2] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-poppins font-bold text-sm sm:text-base text-[#0A1F44] hover:text-[#FF7A00] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className={`w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-orange-50 text-[#FF7A00]' : 'text-gray-400'}`}>
                    <ChevronDown size={16} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#5A6B84] leading-relaxed border-t border-gray-100 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-[#0A1F44] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-md">
              <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-1">
                24/7 Support Desk
              </span>
              <h3 className="font-poppins text-xl sm:text-2xl font-bold mb-2">
                Still have questions or need assistance?
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Our Pakistani support desk is ready to help you coordinate emergency service visits or verify your business listing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <a
                href={`tel:${SITE_PHONE_DISPLAY}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0A1F44] hover:bg-gray-100 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
              >
                <Phone size={14} className="text-[#FF7A00]" />
                <span>Call {SITE_PHONE_DISPLAY}</span>
              </a>

              <a
                href={`https://wa.me/${SITE_PHONE_WA}?text=${encodeURIComponent('Hello KarigarPK, I have a question regarding services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Help</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
