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
    <section className="py-12 sm:py-16 bg-white border-b border-[#E4EAF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1F44] tracking-tight">
              What Our Customers Say
            </h2>
          </div>
          <Link
            to="/find-karigar"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0A1F44] hover:text-[#FF7A00] transition-colors"
          >
            <span>View all reviews</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Cards Grid: 3 Review Cards + 1 Navy CTA Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* 3 Review Cards */}
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white border border-[#E4EAF2] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-gray-300 transition-all shadow-[0_8px_24px_rgba(10,31,68,0.05)] hover:shadow-lg h-full"
            >
              <div>
                <div className="flex items-center gap-3 mb-3.5">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#E4EAF2]"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-poppins font-bold text-[#0A1F44] text-sm leading-tight">
                      {r.name}
                    </h4>
                    <p className="text-[#5A6B84] text-xs mt-0.5">{r.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(r.rating)].map((_, s) => (
                    <Star key={s} size={15} className="fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>

                <p className="text-[#0E1E3A] text-xs sm:text-sm leading-relaxed">
                  "{r.text}"
                </p>
              </div>
            </div>
          ))}

          {/* 4th Card: Navy CTA Card with Karigar Polo Portrait */}
          <div className="bg-[#0A1F44] rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-xl text-white h-full min-h-[260px]">
            <div className="relative z-10 w-full">
              <h3 className="font-poppins font-bold text-white text-base leading-snug mb-1">
                Looking for professional services in your city?
              </h3>
              <p className="text-gray-300 text-xs mb-3">
                Join KarigarPK today!
              </p>
            </div>

            {/* Circular Karigar Polo Portrait */}
            <div className="relative z-10 my-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF7A00] mx-auto shadow-md">
                <img
                  src="/assets/images/karigar_polo_portrait.jpg"
                  alt="Verified Karigar"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Orange Join Now Button */}
            <div className="relative z-10 w-full pt-2">
              <Link
                to="/register-karigar"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-orange-500/30 hover:scale-105"
              >
                <span>Join Now</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
