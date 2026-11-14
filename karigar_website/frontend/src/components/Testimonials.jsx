import { Star, ArrowRight, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Testimonials() {
  const reviews = [
    {
      name: 'Ayesha Khan',
      city: 'Karachi',
      service: 'Electrician Service',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
      text: 'Excellent service! Electrician arrived on time and did a great job.'
    },
    {
      name: 'Usman Ali',
      city: 'Lahore',
      service: 'Plumbing Works',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
      text: 'Very professional and helpful platform.'
    },
    {
      name: 'Fatima Rizwan',
      city: 'Islamabad',
      service: 'AC Maintenance',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      text: 'Highly recommended for local services.'
    }
  ]

  return (
    <section className="py-12 sm:py-16 px-4 bg-[#0B1329] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              What Our Customers Say
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-1">
              Real reviews from real homeowners across Pakistan
            </p>
          </div>
          <Link
            to="/find-karigar"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6B00] hover:text-orange-400 transition-colors"
          >
            <span>View all reviews</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid: 3 Review Cards + 1 CTA Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* 3 Review Cards (Span 3 cols on desktop) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-[#131F3D] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-gray-700 transition-all shadow-lg hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6B00]"
                    />
                    <div>
                      <h4 className="font-poppins font-bold text-white text-base leading-tight">
                        {r.name}
                      </h4>
                      <p className="text-gray-400 text-xs mt-0.5">{r.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(r.rating)].map((_, s) => (
                      <Star key={s} size={15} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed italic">
                    "{r.text}"
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
                  <span>{r.service}</span>
                  <span className="text-emerald-400 font-medium">✓ Verified Booking</span>
                </div>
              </div>
            ))}
          </div>

          {/* 1 CTA Banner with Karigar Polo Portrait (Span 1 col on desktop) */}
          <div className="lg:col-span-1 bg-gradient-to-br from-[#1F2E54] to-[#131F3D] border border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 w-full">
              <h3 className="font-poppins font-bold text-white text-lg sm:text-xl leading-snug mb-2">
                Looking for professional services in your city?
              </h3>
              <p className="text-gray-300 text-xs mb-4">
                Join KarigarPK today & connect with thousands of verified professionals.
              </p>
            </div>

            {/* Karigar Portrait */}
            <div className="relative z-10 my-2">
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-[#FF6B00] shadow-2xl">
                <img
                  src="/assets/images/karigar_polo_portrait.jpg"
                  alt="Verified Karigar"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <div className="relative z-10 w-full mt-3">
              <Link
                to="/register-karigar"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-orange-500/25"
              >
                <span>Join Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Background decorative glow */}
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-[#FF6B00]/10 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
