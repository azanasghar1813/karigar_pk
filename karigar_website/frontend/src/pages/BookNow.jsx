import { useState, useEffect, useContext } from 'react'
import api from '../config/api'
import { AuthContext } from '../context/AuthContext'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, Info, Star, MapPin, Clock, ArrowLeft, ShieldCheck, User } from 'lucide-react'
import { SITE_PHONE_DISPLAY, CITIES, SERVICES } from '../config/site'

export default function BookNow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [karigar, setKarigar] = useState(null)
  const [loadingKarigar, setLoadingKarigar] = useState(Boolean(id))
  const [formData, setFormData] = useState({
    serviceType: '',
    address: '',
    city: 'Lahore',
    phone: user ? (user.phone || '') : '',
    email: user ? (user.email || '') : '',
    description: '',
    name: user ? (user.fullName || '') : '',
    date: '',
    time: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [confirmedBookingId, setConfirmedBookingId] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }))
    }
  }, [user])

  useEffect(() => {
    const fetchKarigarDetails = async () => {
      if (!id) return
      setLoadingKarigar(true)
      try {
        const { data } = await api.get(`/karigars/${id}`)
        setKarigar(data)
        if (data.services && data.services.length > 0) {
          setFormData(prev => ({
            ...prev,
            serviceType: data.services[0],
            city: data.city || prev.city
          }))
        }
      } catch (err) {
        console.warn('Could not load specific karigar for booking:', err)
      } finally {
        setLoadingKarigar(false)
      }
    }

    fetchKarigarDetails()
  }, [id])

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const normalized = name === 'phone' ? formatPhone(value) : value

    setFormData(prev => ({
      ...prev,
      [name]: normalized
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Please log in or sign up first to confirm your booking.')
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

    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        serviceType: formData.serviceType,
        date: formData.date,
        time: formData.time,
        address: `${formData.address}, ${formData.city}`,
        notes: formData.description
      }

      if (id) {
        payload.karigar = id
      }

      const { data } = await api.post('/bookings', payload)
      setConfirmedBookingId(data._id)
      setIsSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="py-20 px-4 bg-field-booking min-h-screen flex items-center justify-center">
        <div className="container max-w-2xl">
          <div className="bg-gray-800 rounded-2xl p-8 sm:p-12 border border-gray-700 text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h1 className="font-poppins text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-gray-300 mb-6">
              Your service request has been received. {karigar ? `${karigar.fullName} has been notified and` : 'A verified karigar'} will contact you shortly to confirm arrival time.
            </p>

            <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-700 text-left space-y-3">
              {confirmedBookingId && (
                <div className="border-b border-gray-800 pb-2 mb-2 flex justify-between">
                  <span className="text-gray-400 text-sm">Booking ID:</span>
                  <span className="text-primary font-mono text-xs">{confirmedBookingId}</span>
                </div>
              )}
              {karigar && (
                <div className="border-b border-gray-800 pb-2 mb-2 flex justify-between">
                  <span className="text-gray-400 text-sm">Assigned Karigar:</span>
                  <span className="text-white font-semibold">{karigar.fullName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Service:</span>
                <span className="text-white font-semibold">{formData.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Date & Time:</span>
                <span className="text-white">{formData.date} at {formData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">City & Address:</span>
                <span className="text-white">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Payment:</span>
                <span className="text-green-400 font-semibold">Cash on Delivery (After work)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => navigate('/customer/dashboard')} 
                className="btn-secondary px-6 py-3 font-semibold rounded-xl"
              >
                View My Bookings
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 font-semibold rounded-xl transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 bg-field-booking min-h-screen">
      <div className="container max-w-2xl mx-auto">
        <Link to={id ? `/worker/${id}` : '/find-karigar'} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={18} /> {id ? 'Back to Worker Profile' : 'Back to Search'}
        </Link>

        {/* Selected Karigar Summary Card (Issue 3 Fix) */}
        {loadingKarigar ? (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8 animate-pulse text-center">
            <p className="text-gray-400">Loading karigar details...</p>
          </div>
        ) : karigar ? (
          <div className="bg-gradient-to-r from-gray-800 to-gray-850 rounded-2xl p-6 border border-gray-700 mb-8 shadow-lg flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-2xl flex-shrink-0">
              {karigar.fullName?.charAt(0)?.toUpperCase() || 'K'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-poppins font-bold text-white text-lg">{karigar.fullName}</h3>
                <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold bg-green-950/60 border border-green-800 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={12} /> Verified
                </span>
              </div>
              <p className="text-secondary text-sm font-semibold">{formData.serviceType || karigar.services?.[0]} • {karigar.city}</p>
              <div className="flex items-center gap-4 text-xs text-gray-300 mt-1">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} className="fill-current" /> {karigar.rating ? karigar.rating.toFixed(1) : '5.0'}
                </span>
                <span>•</span>
                <span>Rs. {karigar.hourlyRate || 500}/hr</span>
              </div>
            </div>
          </div>
        ) : null}

        <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-white mb-2">
          {karigar ? `Book ${karigar.fullName}` : 'Book a Verified Service'}
        </h1>
        <p className="text-gray-400 mb-8 text-sm">Fill in your schedule and details below. Pay cash only after work is done.</p>

        {!user && (
          <div className="mb-6 rounded-xl border border-yellow-700/60 bg-yellow-900/30 p-4 text-yellow-200 text-sm flex items-center justify-between">
            <span>You need an account to track your booking status.</span>
            <Link to="/login" className="font-bold underline text-white ml-2">Log in</Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700 shadow-xl space-y-6">
          {error && (
            <div className="rounded-xl border border-red-700 bg-red-900/30 px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Customer Info */}
          <div>
            <h2 className="font-poppins font-bold text-white text-base sm:text-lg mb-4 flex items-center gap-2">
              <User size={18} className="text-secondary" /> Your Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white font-semibold text-xs block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Muhammad Ali"
                  required
                  className="form-input text-sm"
                />
              </div>
              <div>
                <label className="text-white font-semibold text-xs block mb-1.5">Phone Number (03XX-XXXXXXX) *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="300-1234567"
                  required
                  className="form-input text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-white font-semibold text-xs block mb-1.5">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="form-input text-sm"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="border-t border-gray-700 pt-6">
            <h2 className="font-poppins font-bold text-white text-base sm:text-lg mb-4 flex items-center gap-2">
              <Clock size={18} className="text-secondary" /> Date & Time
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white font-semibold text-xs block mb-1.5">Preferred Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="form-input text-sm"
                />
              </div>
              <div>
                <label className="text-white font-semibold text-xs block mb-1.5">Preferred Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="form-input text-sm"
                />
              </div>
            </div>
          </div>

          {/* Service & Location */}
          <div className="border-t border-gray-700 pt-6">
            <h2 className="font-poppins font-bold text-white text-base sm:text-lg mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-secondary" /> Service & Location
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-white font-semibold text-xs block mb-1.5">Service Type *</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="form-input text-sm"
                >
                  <option value="" disabled>Select service</option>
                  {SERVICES.map(srv => (
                    <option key={srv} value={srv}>{srv}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white font-semibold text-xs block mb-1.5">City *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input text-sm"
                >
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-white font-semibold text-xs block mb-1.5">Street Address / House No. *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House #, Street #, Sector / Area"
                required
                className="form-input text-sm"
              />
            </div>

            <div>
              <label className="text-white font-semibold text-xs mb-1.5 flex items-center gap-1.5">
                Description of Problem *
                <span title="Please explain your exact problem to help the karigar bring right tools.">
                  <Info size={14} className="text-secondary" />
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your issue, e.g. switchboard sparking or tap leaking in master washroom."
                rows={3}
                required
                className="form-input text-sm"
              ></textarea>
            </div>
          </div>

          {/* Terms */}
          <div className="border-t border-gray-700 pt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded border-gray-600 bg-gray-700 text-secondary focus:ring-secondary"
              />
              <span className="text-gray-300 text-xs leading-relaxed">
                I agree to the terms and understand that payment is strictly Cash on Delivery after completion of work.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full rounded-xl bg-secondary py-3.5 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              karigar ? `Confirm Booking with ${karigar.fullName.split(' ')[0]}` : 'Confirm Booking'
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-blue-900/20 border border-blue-800/60 rounded-xl p-5">
          <h3 className="font-poppins font-bold text-white text-sm mb-2">Our Service Guarantee:</h3>
          <ul className="space-y-1.5 text-gray-300 text-xs">
            <li>✓ 100% verified CNIC and skilled technicians</li>
            <li>✓ Transparent pricing with zero hidden charges</li>
            <li>✓ Customer support available: {SITE_PHONE_DISPLAY}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
