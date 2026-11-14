import { useState, useEffect, useContext } from 'react'
import api from '../config/api'
import { AuthContext } from '../context/AuthContext'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, Star, MapPin, Clock, ArrowLeft, ShieldCheck, Calendar, CreditCard, ChevronRight, AlertCircle, Phone, Check } from 'lucide-react'
import { SITE_PHONE_DISPLAY, CITIES, SERVICES } from '../config/site'

export default function BookNow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [currentStep, setCurrentStep] = useState(2) // 1: Service, 2: Details, 3: Payment, 4: Confirm
  const [karigar, setKarigar] = useState(null)
  const [loadingKarigar, setLoadingKarigar] = useState(Boolean(id))
  const [paymentMethod, setPaymentMethod] = useState('cod') // 'cod', 'jazzcash', 'easypaisa'
  
  const [formData, setFormData] = useState({
    serviceType: 'Electrician',
    address: '',
    city: 'Lahore',
    phone: user ? (user.phone || '') : '',
    email: user ? (user.email || '') : '',
    description: '',
    name: user ? (user.fullName || '') : '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM'
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

  const handleProceedToPayment = (e) => {
    e.preventDefault()
    if (!user) {
      setError('Please log in or sign up first to proceed with your booking.')
      return
    }
    if (!formData.address || !formData.phone || !formData.date || !formData.time) {
      setError('Please provide date, time, address, and contact phone.')
      return
    }
    setCurrentStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirmBooking = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        serviceType: formData.serviceType,
        date: formData.date,
        time: formData.time,
        address: `${formData.address}, ${formData.city}`,
        notes: formData.description || 'Standard service request'
      }

      if (id) {
        payload.karigar = id
      }

      const { data } = await api.post('/bookings', payload)
      setConfirmedBookingId(data._id)
      setCurrentStep(4)
      setIsSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1329] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link to="/find-karigar" className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Search
        </Link>

        {/* 4-Step Stepper Header (matching Image 2 "Booking Page") */}
        <div className="bg-[#131F3D] border border-gray-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto">
            {[
              { num: 1, title: 'Service' },
              { num: 2, title: 'Details' },
              { num: 3, title: 'Payment' },
              { num: 4, title: 'Confirm' }
            ].map((step, idx) => {
              const isCompleted = currentStep > step.num
              const isCurrent = currentStep === step.num
              return (
                <div key={step.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all shadow-md ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-[#FF6B00] text-white ring-4 ring-[#FF6B00]/25'
                        : 'bg-[#0B1329] border border-gray-700 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-semibold mt-2 ${
                      isCurrent ? 'text-[#FF6B00]' : isCompleted ? 'text-emerald-400' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
            {/* Connecting lines */}
            <div className="absolute top-4 sm:top-5 left-8 right-8 h-0.5 bg-gray-800 -z-0">
              <div
                className="h-full bg-[#FF6B00] transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Booking Card Main */}
        <div className="bg-[#131F3D] border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          
          {/* STEP 4: CONFIRMATION SUCCESS */}
          {currentStep === 4 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-gray-300 text-sm max-w-md mx-auto mb-6">
                Your service has been scheduled. The verified professional will contact you prior to arrival.
              </p>

              {confirmedBookingId && (
                <div className="inline-block bg-[#0B1329] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-300 mb-8">
                  Booking Reference: <strong className="text-[#FF6B00]">{confirmedBookingId}</strong>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/customer-dashboard"
                  className="w-full sm:w-auto bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-md"
                >
                  View My Bookings
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto bg-[#0B1329] hover:bg-gray-800 border border-gray-700 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          ) : currentStep === 3 ? (
            /* STEP 3: PAYMENT METHOD (Processing Fee / COD) */
            <div>
              <h2 className="font-poppins text-xl sm:text-2xl font-bold text-white mb-2">
                Select Payment Method
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">
                Choose how you would like to pay for the service upon completion
              </p>

              <div className="space-y-3 mb-8">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#FF6B00] bg-[#FF6B00]/10'
                      : 'border-gray-800 bg-[#0B1329] hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-[#FF6B00]">
                      💵
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Cash on Delivery (Recommended)</h4>
                      <p className="text-gray-400 text-xs">Inspect work first, then pay directly to Karigar</p>
                    </div>
                  </div>
                  <input type="radio" checked={paymentMethod === 'cod'} readOnly className="text-[#FF6B00]" />
                </label>

                {/* JazzCash / EasyPaisa */}
                <label
                  onClick={() => setPaymentMethod('jazzcash')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'jazzcash'
                      ? 'border-[#FF6B00] bg-[#FF6B00]/10'
                      : 'border-gray-800 bg-[#0B1329] hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-red-500 font-bold text-sm">
                      JC
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">JazzCash / EasyPaisa Direct</h4>
                      <p className="text-gray-400 text-xs">Direct digital transfer after work completion</p>
                    </div>
                  </div>
                  <input type="radio" checked={paymentMethod === 'jazzcash'} readOnly className="text-[#FF6B00]" />
                </label>
              </div>

              {/* Order Breakdown */}
              <div className="bg-[#0B1329] border border-gray-800 rounded-2xl p-5 mb-8 text-xs text-gray-300 space-y-2.5">
                <div className="flex justify-between">
                  <span>Estimated Karigar Starting Rate</span>
                  <span className="font-bold text-white">PKR {karigar?.hourlyRate || 600}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Verification Fee</span>
                  <span className="text-emerald-400 font-bold">FREE (Promotional)</span>
                </div>
                <div className="border-t border-gray-800 pt-2 flex justify-between text-sm font-extrabold text-white">
                  <span>Estimated Total</span>
                  <span className="text-[#FF6B00]">PKR {karigar?.hourlyRate || 600}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-2.5 rounded-xl mb-5 text-xs sm:text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-[#0B1329] hover:bg-gray-800 border border-gray-700 text-gray-300 font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="flex-2 w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming Booking...' : 'Confirm & Book Service →'}
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: BOOKING DETAILS (matching Image 2 "Booking Page") */
            <div>
              <h2 className="font-poppins text-xl sm:text-2xl font-bold text-white mb-2">
                Book Your Service
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">
                Fill in your visit details to schedule verified service
              </p>

              {/* Selected Worker Summary Card (matching Image 2) */}
              <div className="bg-[#0B1329] border border-gray-800 rounded-2xl p-4 sm:p-5 mb-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={karigar?.profilePhoto || '/assets/images/plumber_sink.jpg'}
                    alt={karigar?.fullName || 'Quick Fix Plumbers'}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-[#FF6B00]"
                  />
                  <div>
                    <h3 className="font-poppins font-bold text-white text-sm sm:text-base">
                      {karigar?.fullName || 'Quick Fix Plumbers'}
                    </h3>
                    <div className="flex items-center gap-1.5 text-yellow-400 text-xs mt-0.5">
                      <Star size={13} className="fill-yellow-400" />
                      <span className="font-bold">{karigar?.rating ? karigar.rating.toFixed(1) : '4.8'}</span>
                      <span className="text-gray-400 font-normal">({karigar?.reviewsCount || '2.8k reviews'})</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-gray-400 block">Starting from</span>
                  <span className="font-poppins font-black text-lg sm:text-xl text-[#FF6B00]">
                    PKR {karigar?.hourlyRate || 600}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-2.5 rounded-xl mb-5 text-xs sm:text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleProceedToPayment} className="space-y-4">
                {/* Date & Time Picker (matching Image 2) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                      Select Date *
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-[#0B1329] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                      Select Preferred Time Slot *
                    </label>
                    <div className="relative">
                      <Clock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full bg-[#0B1329] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                        required
                      >
                        <option value="09:00 AM">09:00 AM - Morning Slot</option>
                        <option value="11:00 AM">11:00 AM - Midday Slot</option>
                        <option value="02:00 PM">02:00 PM - Afternoon Slot</option>
                        <option value="04:00 PM">04:00 PM - Evening Slot</option>
                        <option value="06:00 PM">06:00 PM - Late Slot</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                      City *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#0B1329] border border-gray-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                    >
                      {CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-700 bg-gray-900 px-3 text-xs text-gray-300">
                        🇵🇰 +92
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="312-3456789"
                        className="w-full bg-[#0B1329] border border-gray-700 rounded-r-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    Service Address / Sector *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House/Plot #, Street, Phase / Block"
                    className="w-full bg-[#0B1329] border border-gray-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    Describe the issue / Instructions (Optional)
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide details about the issue or task so the karigar brings appropriate tools."
                    className="w-full bg-[#0B1329] border border-gray-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                  ></textarea>
                </div>

                {/* Big Orange Proceed Button (matching Image 2) */}
                <button
                  type="submit"
                  className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 mt-4"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
