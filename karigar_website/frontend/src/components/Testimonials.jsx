import { Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Testimonials() {
  const reviews = [
    {
      name: 'Ayesha Khan',
      city: 'Karachi',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
      text: 'Excellent service! Electrician arrived on time and did a great job.'
    },
    {
      name: 'Usman Ali',
      city: 'Lahore',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
      text: 'Very professional and helpful platform.'
    },
    {
      name: 'Fatima Rizwan',
      city: 'Islamabad',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      text: 'Highly recommended for local services.'
    }
  ]

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1930]">
              What Our Customers Say
            </h2>
          </div>
          <Link
            to="/find-karigar"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0A1930] hover:text-[#FF8A00] transition-colors"
          >
            <span>View all reviews</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Review Cards + 1 Dark Promo Banner (Exact matching Reference Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-stretch">
          
          {/* 3 Review Cards (White with subtle borders) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-gray-300 transition-all shadow-sm hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <h4 className="font-poppins font-bold text-[#0A1930] text-sm leading-tight">
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

                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    "{r.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 1 CTA Banner with Karigar Polo Portrait (Dark Navy Container matching Reference Image) */}
          <div className="lg:col-span-1 bg-[#0A1930] rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-xl text-white">
            <div className="relative z-10 w-full">
              <h3 className="font-poppins font-bold text-white text-base sm:text-lg leading-snug mb-1">
                Looking for professional services in your city?
              </h3>
              <p className="text-gray-300 text-xs mb-3">
                Join KarigarPK today!
              </p>
            </div>

            {/* Karigar Portrait */}
            <div className="relative z-10 my-2">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#FF8A00] shadow-lg">
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
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md hover:shadow-orange-500/25"
              >
                <span>Join Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
