import { useState, useContext } from 'react'
import api from '../config/api'
import { AuthContext } from '../context/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Info } from 'lucide-react'
import { SITE_PHONE_DISPLAY } from '../config/site'

export default function BookNow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    serviceType: '',
    address: '',
    city: 'Your City',
    phone: '',
    email: user ? user.email : '',
    description: '',
    name: user ? user.fullName : '',
    date: '',
    time: ''
  })
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const normalized = name === 'phone' ? formatPhone(value) : value

    setFormData({
      ...formData,
      [name]: normalized
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to book a service.')
      return
    }

    const phoneRegex = /^3\d{2}-\d{7}$/
    if (!formData.address || !formData.phone || !formData.name || !formData.email || !formData.description || !formData.serviceType || !formData.date || !formData.time) {
      setError('Please fill all required fields')
      return
    }
    if (!phoneRegex.test(formData.phone)) {
      setError('Use phone format: 312-3456789')
      return
    }

    try {
      await api.post('/bookings', {
        karigar: id,
        serviceType: formData.serviceType,
        date: formData.date,
        time: formData.time,
        address: `${formData.address}, ${formData.city}`,
        notes: formData.description
      })
      setIsSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking')
    }
  }

  if (isSubmitted) {
    return (
      <div>
        <div className="py-20 px-4 bg-field-booking min-h-screen flex items-center">
          <div className="container max-w-2xl">
            <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 text-center">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h1 className="font-poppins text-3xl font-bold text-white mb-3">Booking Confirmed!</h1>
              <p className="text-gray-300 mb-4">
                Your service booking has been confirmed. A karigar will contact you within 30 minutes.
              </p>
              <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-700">
                <div className="text-left space-y-3">
                  <p className="text-gray-400"><span className="text-secondary font-semibold">Name:</span> {formData.name}</p>
                  <p className="text-gray-400"><span className="text-secondary font-semibold">Phone:</span> +92 {formData.phone}</p>
                  <p className="text-gray-400"><span className="text-secondary font-semibold">Address:</span> {formData.address}</p>
                  <p className="text-gray-400"><span className="text-secondary font-semibold">Service Type:</span> {formData.serviceType}</p>
                </div>
              </div>
              <button onClick={() => navigate('/')} className="w-full sm:w-auto rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 transition-colors">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>

      <div className="py-12 px-4 bg-field-booking min-h-screen">
        <div className="container max-w-2xl">
          <h1 className="font-poppins text-3xl font-bold text-white mb-8">Book a Service</h1>

          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            {error && (
              <div className="mb-6 rounded-lg border border-red-700 bg-red-900/30 px-4 py-3 text-red-300">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="font-poppins font-bold text-white text-lg mb-4">Your Information</h2>

              <div className="mb-4">
                <label className="text-white font-semibold text-sm block mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-white font-semibold text-sm block mb-2">Phone Number *</label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-600 bg-gray-900 px-3 text-sm text-gray-300">
                      🇵🇰 +92
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="312-3456789"
                      required
                      className="form-input rounded-l-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white font-semibold text-sm block mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-white font-semibold text-sm block mb-2">Preferred Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="text-white font-semibold text-sm block mb-2">Preferred Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="mb-8 border-t border-gray-700 pt-8">
              <h2 className="font-poppins font-bold text-white text-lg mb-4">Service Details</h2>

              <div className="mb-4">
                <label className="text-white font-semibold text-sm block mb-2">Service Type *</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="" disabled>Select service type</option>
                  <option>Electrician</option>
                  <option>Plumber</option>
                  <option>Carpenter</option>
                  <option>AC Repair</option>
                  <option>Painter</option>
                  <option>Locksmith</option>
                  <option>CCTV Install</option>
                  <option>General Repair</option>
                  <option>Household Chores</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="text-white font-semibold text-sm block mb-2">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option>Your City</option>
                  <option>Karachi</option>
                  <option>Islamabad</option>
                  <option>Rawalpindi</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="text-white font-semibold text-sm block mb-2">Service Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                  Description of Work *
                  <span title="Explain what issue you are facing, where it happens, and any urgent details.">
                    <Info size={15} className="text-secondary" />
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your problem in simple words, e.g. kitchen sink leakage since yesterday."
                  rows={4}
                  required
                  className="form-input"
                ></textarea>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-8 border-t border-gray-700 pt-8">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700"
                />
                <span className="text-gray-300 text-sm">
                  I agree to the terms and conditions. I will pay cash after the job is completed.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full rounded-xl bg-secondary px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-orange-600 transition-colors">
              Submit Booking
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 bg-blue-900/30 border border-blue-700 rounded-lg p-6">
            <h3 className="font-poppins font-bold text-white mb-3">Booking Information</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✓ A karigar will contact you within 30 minutes</li>
              <li>✓ Payment is Cash on Delivery after work completion</li>
              <li>✓ You can modify your booking up to 2 hours before</li>
              <li>✓ Call our support: {SITE_PHONE_DISPLAY}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}