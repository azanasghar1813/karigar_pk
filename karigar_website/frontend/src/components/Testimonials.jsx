import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Fatima Khan',
      city: 'Lahore',
      service: 'Electrician',
      rating: 5,
      text: 'Amazing service! The electrician was professional and fixed my wiring issue in just 2 hours. Highly recommended!'
    },
    {
      name: 'Ali Raza',
      city: 'Karachi',
      service: 'Plumber',
      rating: 5,
      text: 'Best plumbing service I\'ve used. The karigar was punctual, skilled, and affordable. Will book again!'
    },
    {
      name: 'Sara Ahmed',
      city: 'Islamabad',
      service: 'Painter',
      rating: 4,
      text: 'Great work! The painter did an excellent job with my apartment. Would definitely recommend Karigar.'
    },
    {
      name: 'Hassan Malik',
      city: 'Lahore',
      service: 'AC Repair',
      rating: 5,
      text: 'Saved my day! My AC was broken and they fixed it the same day. Customer service was excellent.'
    }
  ]

  return (
    <section className="py-10 sm:py-14 md:py-16 px-4 bg-field-general">
      <div className="container">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">What Our Customers Say</h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">Trusted by thousands of Pakistani families</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 hover:shadow-xl transition-all"
            >
              <div className="flex gap-1 mb-2 sm:mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400 sm:w-[18px] sm:h-[18px]" />
                ))}
              </div>
              <p className="text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">{testimonial.text}</p>
              <div className="border-t border-gray-700 pt-3 sm:pt-4">
                <p className="font-poppins font-bold text-white text-sm sm:text-base">{testimonial.name}</p>
                <p className="text-secondary text-[11px] sm:text-sm">{testimonial.service} • {testimonial.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}