import { Shield, Zap, CreditCard, Clock, Star, Lock } from 'lucide-react'

export default function WhyKarigar() {
  const reasons = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All karigars are CNIC verified and background checked'
    },
    {
      icon: Star,
      title: 'Best Rated',
      description: 'Highly rated karigars with genuine customer reviews'
    },
    {
      icon: Zap,
      title: 'Fast Service',
      description: 'Book a service and get karigar within hours'
    },
    {
      icon: CreditCard,
      title: 'Cash on Delivery',
      description: 'No advance payment. Pay after the job is completed'
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Emergency services available anytime, anywhere'
    },
    {
      icon: Lock,
      title: 'Secure Booking',
      description: 'Your safety and privacy is our top priority'
    }
  ]

  return (
    <section className="py-10 sm:py-14 md:py-16 px-4 bg-field-hero text-white">
      <div className="container">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">Why Choose Karigar?</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            We provide the most trusted home services platform in Pakistan
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon
            return (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-white/20 transition-all border border-white/10"
              >
                <div className="text-secondary mb-3 sm:mb-4">
                  <Icon size={28} className="sm:w-10 sm:h-10" />
                </div>
                <h3 className="font-poppins text-sm sm:text-xl font-bold mb-1.5 sm:mb-2">{reason.title}</h3>
                <p className="text-gray-200 text-xs sm:text-base leading-relaxed">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}