import { ShieldCheck, Zap, CreditCard, Clock, Star, Award, CheckCircle2 } from 'lucide-react'

export default function WhyKarigar() {
  const reasons = [
    {
      icon: ShieldCheck,
      title: '100% CNIC & NADRA Verified',
      description: 'Every professional undergoes government ID checks and background vetting before joining.'
    },
    {
      icon: Award,
      title: 'Top-Rated Professionals',
      description: 'Hire highly recommended karigars backed by genuine community ratings and verified job feedback.'
    },
    {
      icon: Zap,
      title: 'Express Doorstep Arrival',
      description: 'Book urgent repairs or scheduled visits with guaranteed on-time arrival across all major sectors.'
    },
    {
      icon: CreditCard,
      title: 'Transparent Pricing & COD',
      description: 'No hidden surprise charges. Inspect the work first, then pay easily via cash or digital wallets.'
    },
    {
      icon: Clock,
      title: '24/7 Priority Support',
      description: 'Dedicated Pakistani support team on WhatsApp and phone ready to assist you anytime.'
    },
    {
      icon: CheckCircle2,
      title: 'Work Satisfaction Guarantee',
      description: 'If you are not satisfied with the job, our dispute resolution team makes it right.'
    }
  ]

  return (
    <section className="py-14 sm:py-16 px-4 bg-[#0B1329] text-white border-t border-gray-800/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[#FF6B00] text-xs uppercase tracking-widest font-bold">Safe & Dependable</span>
          <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold mt-1 mb-3">
            Why Choose KarigarPK?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Pakistan's premier on-demand network connecting households and businesses with certified local pros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon
            return (
              <div
                key={idx}
                className="bg-[#131F3D] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0B1329] border border-gray-700/80 flex items-center justify-center text-[#FF6B00] mb-4 group-hover:scale-105 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="font-poppins text-lg font-bold text-white mb-2">{reason.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
