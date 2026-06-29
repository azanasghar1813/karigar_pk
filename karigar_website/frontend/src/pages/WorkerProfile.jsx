import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Clock, Phone, CheckCircle, Briefcase, Award } from 'lucide-react'

export default function WorkerProfile() {
  const { id } = useParams()

  // Mock data - will be replaced with API call
  const worker = {
    id: id,
    name: 'Ahmad Khan',
    service: 'Electrician',
    city: 'Your City',
    rating: 4.9,
    reviews: 128,
    price: '500/hr',
    verified: true,
    bio: '15+ years experience in electrical work',
    image: 'AK',
    description: 'Experienced electrician specializing in residential and commercial installations. Available for emergency services 24/7.',
    skills: ['Wiring Installation', 'Electrical Repairs', 'Lighting Design', 'Safety Inspection', 'Load Calculation'],
    experience: '15+ Years',
    responseTime: '30 minutes',
    successRate: '99%',
    reviews_list: [
      {
        customer: 'Fatima Khan',
        rating: 5,
        text: 'Excellent work! Very professional and punctual. Highly recommended.',
        date: '2 days ago'
      },
      {
        customer: 'Ali Raza',
        rating: 5,
        text: 'Fixed my wiring issue perfectly. Great customer service!',
        date: '1 week ago'
      },
      {
        customer: 'Sara Ahmed',
        rating: 4,
        text: 'Good work, slightly overpriced but worth it.',
        date: '2 weeks ago'
      }
    ],
    availability: ['Monday-Friday: 8AM - 8PM', 'Saturday: 10AM - 6PM', 'Sunday: By appointment']
  }

  return (
    <div>

      <div className="py-12 px-4 bg-field-workers min-h-screen">
        <div className="container max-w-4xl">
          {/* Profile Header */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-poppins font-bold text-3xl">
                  {worker.image}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-poppins text-3xl font-bold text-white">{worker.name}</h1>
                  {worker.verified && (
                    <span className="badge badge-success">✓ Verified</span>
                  )}
                </div>

                <p className="text-secondary font-semibold mb-2">{worker.service} • {worker.city}</p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{worker.rating}</span>
                    <span className="text-gray-400">({worker.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <Phone size={20} />
                    <span>Rs. {worker.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={20} />
                    <span>{worker.responseTime} response</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{worker.bio}</p>

                <Link
                  to={`/book/${worker.id}`}
                  className="btn-secondary inline-block"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
              <Briefcase className="text-secondary mx-auto mb-2" size={32} />
              <p className="text-gray-400 text-sm">Experience</p>
              <p className="font-poppins font-bold text-white text-lg">{worker.experience}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
              <Clock className="text-secondary mx-auto mb-2" size={32} />
              <p className="text-gray-400 text-sm">Response Time</p>
              <p className="font-poppins font-bold text-white text-lg">{worker.responseTime}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
              <Award className="text-secondary mx-auto mb-2" size={32} />
              <p className="text-gray-400 text-sm">Success Rate</p>
              <p className="font-poppins font-bold text-white text-lg">{worker.successRate}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h2 className="font-poppins font-bold text-white text-xl mb-4">Skills & Services</h2>
            <div className="flex flex-wrap gap-3">
              {worker.skills.map((skill, idx) => (
                <span key={idx} className="badge badge-primary">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h2 className="font-poppins font-bold text-white text-xl mb-4">Availability</h2>
            <div className="space-y-2">
              {worker.availability.map((slot, idx) => (
                <p key={idx} className="text-gray-300 flex items-center gap-2">
                  <CheckCircle size={20} className="text-secondary" />
                  {slot}
                </p>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="font-poppins font-bold text-white text-xl mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {worker.reviews_list.map((review, idx) => (
                <div key={idx} className="border-b border-gray-700 pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-poppins font-bold text-white">{review.customer}</p>
                    <p className="text-gray-400 text-sm">{review.date}</p>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}