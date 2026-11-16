import { Link } from 'react-router-dom'
import { FileCheck, ShieldCheck, DollarSign, Wrench, AlertCircle, ArrowLeft, Mail } from 'lucide-react'

export default function TermsAndConditions() {
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
              Legal & User Agreement
            </span>
            <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-[#0A1F44] tracking-tight mb-2">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6B84]">
              Last Updated: November 16, 2026 • Governing all users and professionals on KarigarPK
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8 text-sm text-[#0E1E3A] leading-relaxed">
            
            <section>
              <h2 className="font-poppins text-lg sm:text-xl font-bold text-[#0A1F44] mb-3 flex items-center gap-2">
                <FileCheck size={20} className="text-[#FF7A00]" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or placing a service booking on KarigarPK (karigarpk.live), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="font-poppins text-lg sm:text-xl font-bold text-[#0A1F44] mb-3 flex items-center gap-2">
                <Wrench size={20} className="text-[#FF7A00]" />
                2. Scope of Services & Marketplace Role
              </h2>
              <p className="mb-3">
                KarigarPK connects customers across Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, and other major cities) with independent, verified technicians and service professionals:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#0E1E3A]">
                <li><strong>Facilitator:</strong> KarigarPK acts as a discovery and booking facilitator platform, providing scheduling, verification records, and transparent tracking.</li>
                <li><strong>Inspection & Work Scope:</strong> Technicians perform an initial on-site diagnosis and agree with the customer on the scope of labor and parts before commencing work.</li>
                <li><strong>User Responsibility:</strong> Customers must provide an accurate service address, honest fault description, and a safe work environment for the visiting technician.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-poppins text-lg sm:text-xl font-bold text-[#0A1F44] mb-3 flex items-center gap-2">
                <DollarSign size={20} className="text-[#FF7A00]" />
                3. Pricing, Payments & Platform Fees
              </h2>
              <p className="mb-3">
                We believe in straightforward, upfront pricing without hidden surprises:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#0E1E3A]">
                <li><strong>Starting Rates & Estimates:</strong> Base service rates shown on listings reflect starting visit/diagnosis charges. Complex jobs requiring replacement parts or extended hours will be quoted on-site prior to work starting.</li>
                <li><strong>Platform Processing Fee:</strong> A transparent nominal platform processing fee (PKR 50) applies per completed booking order to maintain security, customer support, and system infrastructure.</li>
                <li><strong>Payment Methods:</strong> Standard payment is direct cash on completion (COD) or approved direct digital transfer to the technician upon your complete inspection and sign-off.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-poppins text-lg sm:text-xl font-bold text-[#0A1F44] mb-3 flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#FF7A00]" />
                4. Quality, Verification & Safety
              </h2>
              <p>
                All registered technicians undergo CNIC and background checks. In accordance with our security policies, technician identity cards (CNICs) are held securely by administration and are never published publicly on open profiles. Customers are encouraged to verify technician identity upon arrival.
              </p>
            </section>

            <section>
              <h2 className="font-poppins text-lg sm:text-xl font-bold text-[#0A1F44] mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-[#FF7A00]" />
                5. Cancellations, Disputes & Support
              </h2>
              <p>
                Bookings can be cancelled free of charge prior to the technician's departure to your site. In the unlikely event of a disagreement regarding service quality or pricing, KarigarPK provides dedicated mediation support.
              </p>
            </section>

            <section className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-5">
              <h2 className="font-poppins text-base font-bold text-[#0A1F44] mb-2 flex items-center gap-2">
                <Mail size={18} className="text-[#FF7A00]" />
                6. Contact & Dispute Resolution
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6B84] mb-2">
                For queries regarding our terms, service standards, or booking assistance, contact our team:
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
