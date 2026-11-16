import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Mail } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B84] hover:text-[#0A1F44] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        {/* Master Content Card */}
        <div className="bg-white border border-[#E4EAF2] rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgba(10,31,68,0.06)]">
          
          {/* Header */}
          <div className="border-b border-[#E4EAF2] pb-6 mb-8">
            <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-2">
              Legal & Compliance
            </span>
            <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-[#0A1F44] tracking-tight mb-2">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6B84]">
              Last Updated: November 16, 2026 • Effective for all users across Pakistan
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8 text-sm text-[#0E1E3A] leading-relaxed">
            
            <section>
              <h2 className="font-poppins text-lg sm:text-xl font-bold text-[#0A1F44] mb-3 flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#FF7A00]" />
                1. Overview & Commitment
              </h2>
              <p>
                At KarigarPK (karigarpk.live), we take the privacy of our customers and verified service professionals seriously. This Privacy Policy outlines what information we collect, how it is utilized to fulfill service bookings, and our stringent data protection standards under applicable Pakistani laws.
              </p>
            </section>

            <section>
              <h2 className="font-poppins text-lg sm:text-xl font-bold text-[#0A1F44] mb-3 flex items-center gap-2">
                <Eye size={20} className="text-[#FF7A00]" />
                2. Information We Collect
              </h2>
              <p className="mb-3">
                We only collect information strictly required to coordinate, deliver, and verify home maintenance services:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#0E1E3A]">
                <li><strong>Customer Contact Details:</strong> Full name, verified mobile phone number, operating city, and residential/commercial service address.</li>
                <li><strong>Booking Parameters:</strong> Service category requested, preferred date and time slot, fault description, and optional site notes.</li>
                <li><strong>Professional Credentials (Karigars):</strong> Government CNIC verification records (strictly confidential and never published publicly), trade skills, experience, and verified contact numbers.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-poppins text-lg sm:text-xl font-bold text-[#0A1F44] mb-3 flex items-center gap-2">
                <Lock size={20} className="text-[#FF7A00]" />
                3. How We Use & Protect Your Data
              </h2>
              <p className="mb-3">
                Your data is exclusively utilized for legitimate marketplace operations:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#0E1E3A]">
                <li><strong>Dispatch & Arrival Coordination:</strong> Connecting you directly with the assigned technician for arrival scheduling.</li>
                <li><strong>Service Transparency:</strong> Generating booking reference codes and digital invoice summaries.</li>
                <li><strong>Zero Commercial Data Selling:</strong> We NEVER sell, lease, or monetize user data with third-party marketing companies.</li>
                <li><strong>Public Privacy Safeguard:</strong> CNIC numbers, sensitive ID documents, and private credentials are NEVER displayed in public directories or profile pages.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-poppins text-lg sm:text-xl font-bold text-[#0A1F44] mb-3 flex items-center gap-2">
                <FileText size={20} className="text-[#FF7A00]" />
                4. Data Retention & User Rights
              </h2>
              <p>
                You retain complete rights over your personal account. You may review, edit, or request complete removal of your booking history and profile records at any time by contacting our data protection desk.
              </p>
            </section>

            <section className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-5">
              <h2 className="font-poppins text-base font-bold text-[#0A1F44] mb-2 flex items-center gap-2">
                <Mail size={18} className="text-[#FF7A00]" />
                5. Contact Us Regarding Your Privacy
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6B84] mb-2">
                If you have questions, corrections, or complaints regarding data processing on KarigarPK, please email our legal desk:
              </p>
              <a
                href="mailto:karigarpk.live@gmail.com"
                className="font-bold text-[#FF7A00] hover:text-[#F06400] text-sm transition-colors"
              >
                karigarpk.live@gmail.com
              </a>
            </section>

          </div>

        </div>

      </div>
    </div>
  )
}
