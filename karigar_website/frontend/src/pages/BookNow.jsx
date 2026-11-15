import { useState, useEffect, useContext } from 'react'
import api from '../config/api'
import { AuthContext } from '../context/AuthContext'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, Star, MapPin, Clock, ArrowLeft, Calendar, CreditCard, ChevronRight, AlertCircle, Phone, Check } from 'lucide-react'
import { SITE_PHONE_DISPLAY, CITIES, SERVICES } from '../config/site'

export default function BookNow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [currentStep, setCurrentStep] = useState(2) // 1: Service, 2: Details, 3: Payment, 4: Confirm
  const [karigar, setKarigar] = useState(null)
  const [loadingKarigar, setLoadingKarigar] = useState(Boolean(id))
  const [paymentMethod, setPaymentMethod] = useState('cod')
  
  const [formData, setFormData] = useState({
    serviceType: 'Electrician',
    address: '',
    city: 'Karachi',
    phone: user ? (user.phone || '') : '',
    email: user ? (user.email || '') : '',
    description: '',
    name: user ? (user.fullName || '') : '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM'
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
        console.warn('Could not load karigar details:', err)
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A1930] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Link */}
        <Link to="/find-karigar" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#0A1930] mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Search
        </Link>

        {/* 4-Step Stepper Header (matching reference image Panel 6) */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between relative max-w-xl mx-auto">
            {[
              { num: 1, title: 'Service' },
              { num: 2, title: 'Details' },
              { num: 3, title: 'Payment' },
              { num: 4, title: 'Confirm' }
            ].map((step) => {
              const isCompleted = currentStep > step.num
              const isCurrent = currentStep === step.num
              return (
                <div key={step.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-[#0A1930] text-white ring-4 ring-blue-100'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 ${
                      isCurrent ? 'text-[#0A1930]' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
            {/* Connecting line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 -z-0">
              <div
                className="h-full bg-[#0A1930] transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Booking Card Main (Clean White with borders & soft shadow) */}
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {/* STEP 4: SUCCESS */}
          {currentStep === 4 ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="font-poppins text-2xl font-bold text-[#0A1930] mb-1">
                Booking Confirmed!
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto mb-5">
                Your service has been scheduled. The verified professional will contact you prior to arrival.
              </p>

              {confirmedBookingId && (
                <div className="inline-block bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-600 mb-6">
                  Booking Reference: <strong className="text-[#0A1930]">{confirmedBookingId}</strong>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/customer-dashboard"
                  className="w-full sm:w-auto bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-sm"
                >
                  View My Bookings
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-xl text-xs transition-all"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          ) : currentStep === 3 ? (
            /* STEP 3: PAYMENT METHOD */
            <div>
              <h2 className="font-poppins text-xl font-bold text-[#0A1930] mb-1">
                Payment Method
              </h2>
              <p className="text-gray-500 text-xs mb-5">
                Choose how you would like to settle upon work completion
              </p>

              <div className="space-y-3 mb-6">
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#FF8A00] bg-orange-50/50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💵</span>
                    <div>
                      <h4 className="font-bold text-[#0A1930] text-sm">Cash on Delivery (Recommended)</h4>
                      <p className="text-gray-500 text-xs">Inspect work first, then pay directly to Karigar</p>
                    </div>
                  </div>
                  <input type="radio" checked={paymentMethod === 'cod'} readOnly className="text-[#FF8A00]" />
                </label>

                <label
                  onClick={() => setPaymentMethod('jazzcash')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'jazzcash'
                      ? 'border-[#FF8A00] bg-orange-50/50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <h4 className="font-bold text-[#0A1930] text-sm">JazzCash / EasyPaisa Direct</h4>
                      <p className="text-gray-500 text-xs">Transfer digitally after work is completed</p>
                    </div>
                  </div>
                  <input type="radio" checked={paymentMethod === 'jazzcash'} readOnly className="text-[#FF8A00]" />
                </label>
              </div>

              {/* Order breakdown */}
              <div className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-4 mb-6 text-xs space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Starting Service Rate</span>
                  <span className="font-bold text-[#0A1930]">PKR {karigar?.hourlyRate || 600}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Verification Fee</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-[#0A1930]">
                  <span>Total Due on Arrival</span>
                  <span className="text-[#FF8A00]">PKR {karigar?.hourlyRate || 600}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3.5 py-2 rounded-xl mb-4 text-xs">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: BOOK YOUR SERVICE (matching reference image Panel 6) */
            <div>
              <h2 className="font-poppins text-xl font-bold text-[#0A1930] mb-1">
                Book Your Service
              </h2>
              <p className="text-gray-500 text-xs mb-5">
                Fill in the details below to schedule your visit
              </p>

              {/* Selected Worker Summary Card (exact matching Panel 6) */}
              <div className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={karigar?.profilePhoto || '/assets/images/plumber_sink.jpg'}
                    alt={karigar?.fullName || 'Quick Fix Plumbers'}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                  />
                  <div>
                    <h3 className="font-poppins font-bold text-[#0A1930] text-sm sm:text-base">
                      {karigar?.fullName || 'Quick Fix Plumbers'}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs mt-0.5">
                      <Star size={13} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-[#0A1930]">{karigar?.rating ? karigar.rating.toFixed(1) : '4.8'}</span>
                      <span className="text-gray-400">({karigar?.reviewsCount || '2.8k reviews'})</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-poppins font-black text-base sm:text-lg text-[#0A1930]">
                    PKR {karigar?.hourlyRate || 600}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3.5 py-2 rounded-xl mb-4 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleProceedToPayment} className="space-y-4">
                
                {/* Date & Time Picker */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Select Date & Time *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white cursor-pointer"
                        required
                      >
                        <option value="10:00 AM">10:00 AM (Morning)</option>
                        <option value="01:00 PM">01:00 PM (Afternoon)</option>
                        <option value="04:00 PM">04:00 PM (Evening)</option>
                        <option value="07:00 PM">07:00 PM (Night)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">City *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white cursor-pointer"
                    >
                      {CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="312-3456789"
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Address / Sector *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House/Plot #, Street, Phase / Block"
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white"
                    required
                  />
                </div>

                {/* Big Orange Proceed Button (exact matching Panel 6) */}
                <button
                  type="submit"
                  className="w-full bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-orange-500/30 flex items-center justify-center gap-2 mt-2"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight size={16} />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
