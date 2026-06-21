import { Users, Target, Heart, Zap } from 'lucide-react'

export default function About() {
  return (
    <div>

      <div className="bg-gradient-to-br from-primary to-blue-900 text-white py-12 px-4">
        <div className="container">
          <h1 className="font-poppins text-4xl font-bold mb-4">About Karigar</h1>
          <p className="text-gray-300 text-lg">Pakistan's Most Trusted Home Services Platform</p>
        </div>
      </div>

      <div className="py-16 px-4 bg-field-general">
        <div className="container max-w-4xl">
          {/* Mission */}
          <div className="mb-16">
            <h2 className="font-poppins text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              To connect Pakistani households with trusted, verified, and skilled professionals for all their home service needs. We believe in making quality services accessible, affordable, and reliable for everyone.
            </p>
          </div>

          {/* Vision */}
          <div className="mb-16">
            <h2 className="font-poppins text-3xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              To become Pakistan's #1 platform for home services, trusted by millions of customers and serving as the primary income source for thousands of skilled professionals across the country.
            </p>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="font-poppins text-3xl font-bold text-white mb-8">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-secondary text-4xl mb-4">
                  <Heart size={40} />
                </div>
                <h3 className="font-poppins text-xl font-bold text-white mb-2">Trust & Integrity</h3>
                <p className="text-gray-400">
                  We verify every karigar and maintain the highest standards of trust and professionalism.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-secondary text-4xl mb-4">
                  <Zap size={40} />
                </div>
                <h3 className="font-poppins text-xl font-bold text-white mb-2">Speed & Efficiency</h3>
                <p className="text-gray-400">
                  Quick response times and same-day service options for your convenience.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-secondary text-4xl mb-4">
                  <Target size={40} />
                </div>
                <h3 className="font-poppins text-xl font-bold text-white mb-2">Quality Services</h3>
                <p className="text-gray-400">
                  Our karigars are trained and verified to deliver the best quality work.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-secondary text-4xl mb-4">
                  <Users size={40} />
                </div>
                <h3 className="font-poppins text-xl font-bold text-white mb-2">Customer First</h3>
                <p className="text-gray-400">
                  Your satisfaction is our priority. We're here 24/7 to support you.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Karigar */}
          <div className="bg-gradient-to-r from-primary to-blue-900 rounded-xl p-8 text-white">
            <h2 className="font-poppins text-2xl font-bold mb-4">Why Choose Karigar?</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-secondary text-2xl">✓</span>
                <span>500+ verified and CNIC-verified karigars</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-secondary text-2xl">✓</span>
                <span>Affordable pricing with no hidden charges</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-secondary text-2xl">✓</span>
                <span>Same-day service available</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-secondary text-2xl">✓</span>
                <span>Cash on delivery - no advance payment needed</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-secondary text-2xl">✓</span>
                <span>24/7 customer support</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-secondary text-2xl">✓</span>
                <span>Secure booking and verified professionals</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}