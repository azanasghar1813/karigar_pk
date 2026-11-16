import { useState, useEffect, useContext, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, Star, MapPin, Clock, ArrowLeft, Calendar, CreditCard, ChevronRight, AlertCircle, Phone, Check, ShieldCheck, Lock, User, Home, ArrowRight } from 'lucide-react'
import api from '../config/api'
import { AuthContext } from '../context/AuthContext'
import { CITIES, SERVICES_CONFIG } from '../config/site'
import RatingBadge from '../components/RatingBadge'
import UserAvatar from '../components/UserAvatar'

const BOOKING_TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM'
]

export default function BookNow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [currentStep, setCurrentStep] = useState(2) // 1: Service, 2: Details, 3: Payment, 4: Confirm
  const [karigar, setKarigar] = useState(null)
  const [loadingKarigar, setLoadingKarigar] = useState(Boolean(id))
  const [paymentMethod, setPaymentMethod] = useState('cod') // 'cod' or 'jazzcash'

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  const [formData, setFormData] = useState({
    fullName: user?.name || user?.fullName || '',
    phone: user?.phone || '',
    serviceType: 'Electrician',
    city: 'Lahore',
    address: '',
    date: todayStr,
    time: BOOKING_TIME_SLOTS[0],
    notes: ''
  })

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || user.fullName || '',
        phone: prev.phone || user.phone || ''
      }))
    }
  }, [user])

  // Fetch karigar details
  useEffect(() => {
    let isMounted = true
    if (!id) return

    setLoadingKarigar(true)
    api.get(`/karigars/${id}`)
      .then((res) => {
        if (!isMounted) return
        const kData = res.data
        setKarigar(kData)
        if (kData) {
          setFormData((prev) => ({
            ...prev,
            serviceType: kData.services && kData.services.length > 0 ? kData.services[0] : prev.serviceType,
            city: kData.city && CITIES.includes(kData.city) ? kData.city : prev.city
          }))
        }
        setLoadingKarigar(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.warn('Could not load karigar details:', err)
        setLoadingKarigar(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  // Pricing breakdown: Service rate + PKR 50 processing fee
  // Selected service startingPrice directly matches dropdown selection to prevent discrepancies
  const serviceRate = useMemo(() => {
    const matched = SERVICES_CONFIG.find((s) => s.searchKey === formData.serviceType || s.name === formData.serviceType)
    if (matched && matched.startingPrice) {
      return Number(matched.startingPrice)
    }
    if (karigar && karigar.hourlyRate) {
      return Number(karigar.hourlyRate)
    }
    return 500
  }, [karigar, formData.serviceType])

  const processingFee = 50
  const totalAmount = serviceRate + processingFee

  // Format Pakistani phone: 03XX-XXXXXXX
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (val.length > 4) {
      val = `${val.slice(0, 4)}-${val.slice(4)}`
    }
    setFormData((prev) => ({ ...prev, phone: val }))
    setError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleConfirmBooking = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      setError('Please provide your full name (at least 3 characters).')
      return
    }
    const cleanDigits = formData.phone.replace(/\D/g, '')
    if (cleanDigits.length < 10 || cleanDigits.length > 11) {
      setError('Please enter a valid Pakistani mobile number (e.g. 0300-1234567).')
      return
    }
    if (!formData.address.trim() || formData.address.trim().length < 8) {
      setError('Please provide your complete service address (house/street, area).')
      return
    }
    if (!formData.date || formData.date < todayStr) {
      setError('Please select a valid service date (today or later).')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        karigar: id || undefined,
        karigarId: id || undefined,
        service: formData.serviceType,
        serviceType: formData.serviceType,
        slot: formData.time,
        time: formData.time,
        date: formData.date,
        address: `${formData.address.trim()}, ${formData.city}`,
        customerName: formData.fullName.trim(),
        customerPhone: formData.phone,
        paymentMethod: paymentMethod,
        serviceCharge: serviceRate,
        processingFee: processingFee,
        totalAmount: totalAmount,
        notes: formData.notes || 'Standard booking request'
      }

      const { data } = await api.post('/bookings', payload)
      setConfirmedBooking(data)
      setCurrentStep(4)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Booking submission error:', err)
      setError(err.response?.data?.message || 'Failed to submit booking. Please check your details and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1100px] mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to={id ? `/worker/${id}` : '/find-karigar'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B84] hover:text-[#0A1F44] transition-colors"
          >
            <ArrowLeft size={14} /> Back to {id ? 'Profile' : 'Directory'}
          </Link>
        </div>

        {/* Notice Banner when accessed without Karigar ID */}
        {!id && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A00] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-sm text-[#0A1F44]">
                  Aap ne koi makhsoos karigar select nahi kiya
                </h4>
                <p className="text-xs text-[#5A6B84] mt-0.5">
                  Aap yeh general form fill kar sakte hain, ya hamari verified directory se direct kisi karigar ko choose karein.
                </p>
              </div>
            </div>
            <Link
              to="/find-karigar"
              className="inline-flex items-center gap-1.5 bg-[#0A1F44] hover:bg-[#FF7A00] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              <span>Explore Verified Karigars</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* 4-Step Stepper Header (matching Reference 2 "Booking Page") */}
        <div className="bg-white border border-[#E4EAF2] rounded-2xl p-4 sm:p-5 mb-8 shadow-sm">
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
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                      isCompleted
                        ? 'bg-[#22C55E] text-white'
                        : isCurrent
                        ? 'bg-[#0A1F44] text-white ring-4 ring-blue-100'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <Check size={15} /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-1.5 ${
                      isCurrent
                        ? 'text-[#0A1F44]'
                        : isCompleted
                        ? 'text-[#22C55E]'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
            {/* Connecting Stepper Bar */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 -z-0">
              <div
                className="h-full bg-[#0A1F44] transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* STEP 4: SUCCESS CONFIRMATION SCREEN */}
        {currentStep === 4 ? (
          <div className="bg-white border border-[#E4EAF2] rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 text-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <span className="text-[#22C55E] text-xs font-bold uppercase tracking-widest block mb-1">
              Booking Placed Successfully
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1F44] mb-2">
              Appointment Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6B84] max-w-md mx-auto mb-6">
              A booking confirmation has been registered. The verified professional will contact you at your phone number to coordinate arrival.
            </p>

            {/* Booking Details Card */}
            <div className="bg-[#F7F9FC] border border-[#E4EAF2] rounded-2xl p-5 text-left space-y-2.5 mb-8 text-xs sm:text-sm">
              <div className="flex justify-between items-center border-b border-[#E4EAF2] pb-2">
                <span className="text-[#5A6B84]">Booking Reference:</span>
                <span className="font-mono font-bold text-[#0A1F44] text-xs bg-orange-50 text-[#FF7A00] px-2 py-0.5 rounded border border-orange-200">
                  {confirmedBooking?._id ? `BK-${confirmedBooking._id.slice(-6).toUpperCase()}` : 'BK-' + Math.random().toString(36).substr(2, 6).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5A6B84]">Professional:</span>
                <span className="font-bold text-[#0A1F44]">{karigar?.fullName || 'Assigned Karigar'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5A6B84]">Service:</span>
                <span className="font-bold text-[#0A1F44]">{formData.serviceType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5A6B84]">Appointment Date & Time:</span>
                <span className="font-bold text-[#0A1F44]">{formData.date} ({formData.time})</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#E4EAF2] pt-2">
                <span className="text-[#5A6B84]">Total Due ({paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Transfer'}):</span>
                <span className="font-black text-[#FF7A00] text-base">PKR {totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/customer-dashboard"
                className="w-full sm:w-auto bg-[#0A1F44] hover:bg-[#102747] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md"
              >
                View My Bookings →
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto bg-white border border-[#E4EAF2] text-[#0A1F44] hover:bg-gray-50 font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          /* STEP 2 & 3: TWO-COLUMN BOOKING WORKFLOW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Karigar Overview Card + Booking Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Karigar Preview Card (Matching Reference 2 "Booking Page") */}
              {karigar && (
                <div className="bg-white border border-[#E4EAF2] rounded-2xl p-4 shadow-sm flex items-center gap-4">
                  <UserAvatar
                    src={karigar.profilePhoto}
                    name={karigar.fullName}
                    className="w-16 h-16 rounded-xl object-cover bg-[#0A1F44]"
                    textClassName="text-base font-bold text-white"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-poppins font-bold text-sm sm:text-base text-[#0A1F44] truncate">
                        {karigar.fullName}
                      </h3>
                      {karigar.verificationStatus === 'approved' && (
                        <ShieldCheck size={14} className="text-[#22C55E]" />
                      )}
                    </div>
                    <div className="my-1">
                      <RatingBadge rating={karigar.rating} reviewsCount={karigar.reviewsCount} size="sm" />
                    </div>
                    <p className="text-xs text-[#5A6B84] truncate">
                      {formData.serviceType} • {karigar.city || formData.city}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] text-[#5A6B84] block">Rate</span>
                    <span className="font-black text-sm text-[#0A1F44]">PKR {serviceRate}</span>
                  </div>
                </div>
              )}

              {/* Form Card */}
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                
                {error && (
                  <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="flex-shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {currentStep === 2 ? (
                  /* STEP 2: DETAILS FORM */
                  <form onSubmit={handleProceedToPayment} className="space-y-4">
                    <h2 className="font-poppins font-bold text-xl text-[#0A1F44] mb-1">
                      Book Your Service
                    </h2>
                    <p className="text-xs text-[#5A6B84] mb-5">
                      Fill out your contact and location details to schedule this appointment.
                    </p>

                    {/* Customer Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Tariq Mansoor"
                        required
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Customer Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                        Phone Number (03XX-XXXXXXX) *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="0300-1234567"
                        required
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Service Type Selection */}
                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                        Selected Service *
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all font-medium"
                      >
                        {SERVICES_CONFIG.map((s) => (
                          <option key={s.id} value={s.searchKey}>{s.name} (PKR {s.startingPrice})</option>
                        ))}
                      </select>
                    </div>

                    {/* Date & Time Slot Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                          Appointment Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          min={todayStr}
                          value={formData.date}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                          Preferred Time Window *
                        </label>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all font-medium"
                        >
                          {BOOKING_TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* City Select */}
                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                        City *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                      >
                        {CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Address Textarea */}
                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                        Complete Street / House Address *
                      </label>
                      <textarea
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House #, Street #, Sector / Phase, Landmark..."
                        required
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all resize-none"
                      />
                    </div>

                    {/* Optional Notes */}
                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                        Problem Description / Notes (Optional)
                      </label>
                      <input
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="e.g. Main breaker tripping continuously"
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Payment Method Option */}
                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-2">
                        Payment Method *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === 'cod'
                              ? 'border-[#FF7A00] bg-orange-50/20 ring-1 ring-[#FF7A00]'
                              : 'border-[#E4EAF2] hover:border-gray-300 bg-[#F7F9FC]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="mt-0.5 accent-[#FF7A00]"
                          />
                          <div>
                            <span className="font-bold text-xs text-[#0A1F44] block">Cash on Delivery (COD)</span>
                            <span className="text-[11px] text-[#5A6B84] block mt-0.5">Pay after service completion</span>
                          </div>
                        </label>

                        <label
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === 'jazzcash'
                              ? 'border-[#FF7A00] bg-orange-50/20 ring-1 ring-[#FF7A00]'
                              : 'border-[#E4EAF2] hover:border-gray-300 bg-[#F7F9FC]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="jazzcash"
                            checked={paymentMethod === 'jazzcash'}
                            onChange={() => setPaymentMethod('jazzcash')}
                            className="mt-0.5 accent-[#FF7A00]"
                          />
                          <div>
                            <span className="font-bold text-xs text-[#0A1F44] block">JazzCash / EasyPaisa</span>
                            <span className="text-[11px] text-[#5A6B84] block mt-0.5">Mobile wallet transfer upon arrival</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-3 space-y-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
                      >
                        <span>{isSubmitting ? 'Confirming Appointment...' : `Confirm Booking (PKR ${totalAmount})`}</span>
                        <Check size={16} />
                      </button>
                      <p className="text-[11px] text-center text-[#5A6B84] leading-relaxed">
                        ⚠️ Payment Note: Payment kaam mukammal hone ke baad direct karigar ko ada karni hai (Cash on Delivery / JazzCash / EasyPaisa).
                      </p>
                    </div>
                  </form>
                ) : (
                  /* STEP 3: PAYMENT METHOD FORM */
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-poppins font-bold text-xl text-[#0A1F44]">
                        Select Payment Method
                      </h2>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs font-bold text-[#5A6B84] hover:text-[#0A1F44]"
                      >
                        ← Edit Details
                      </button>
                    </div>

                    <p className="text-xs text-[#5A6B84]">
                      Choose how you would like to settle the service invoice.
                    </p>

                    <div className="space-y-3">
                      {/* Cash on Delivery */}
                      <label
                        className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === 'cod'
                            ? 'border-[#FF7A00] bg-orange-50/20 ring-1 ring-[#FF7A00]'
                            : 'border-[#E4EAF2] hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-1 accent-[#FF7A00]"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-sm text-[#0A1F44] block">Cash on Delivery (COD)</span>
                          <span className="text-xs text-[#5A6B84] block mt-0.5">
                            Pay the professional directly in cash after the job is completed to your satisfaction.
                          </span>
                        </div>
                      </label>

                      {/* JazzCash / EasyPaisa Direct */}
                      <label
                        className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === 'jazzcash'
                            ? 'border-[#FF7A00] bg-orange-50/20 ring-1 ring-[#FF7A00]'
                            : 'border-[#E4EAF2] hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="jazzcash"
                          checked={paymentMethod === 'jazzcash'}
                          onChange={() => setPaymentMethod('jazzcash')}
                          className="mt-1 accent-[#FF7A00]"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-sm text-[#0A1F44] block">JazzCash / EasyPaisa</span>
                          <span className="text-xs text-[#5A6B84] block mt-0.5">
                            Direct mobile wallet transfer upon service arrival.
                          </span>
                        </div>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-[#E4EAF2]">
                      <button
                        type="button"
                        onClick={handleConfirmBooking}
                        disabled={isSubmitting}
                        className="w-full bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
                      >
                        <span>{isSubmitting ? 'Confirming Appointment...' : `Confirm & Book Now (PKR ${totalAmount})`}</span>
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* RIGHT COLUMN: Booking Summary Card (Exact from Reference 2 "Booking Page") */}
            <div className="lg:col-span-5 sticky top-[100px]">
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 shadow-sm">
                
                <h3 className="font-poppins font-bold text-base text-[#0A1F44] mb-4">
                  Booking Summary
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-[#5A6B84]">
                    <span>Service Charge</span>
                    <span className="font-bold text-[#0A1F44]">PKR {serviceRate}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#5A6B84]">
                    <span>Processing Fee</span>
                    <span className="font-bold text-[#0A1F44]">PKR {processingFee}</span>
                  </div>

                  <div className="border-t border-[#E4EAF2] pt-3 flex items-center justify-between">
                    <span className="font-bold text-sm text-[#0A1F44]">Total</span>
                    <span className="font-black text-lg text-[#FF7A00]">
                      PKR {totalAmount}
                    </span>
                  </div>
                </div>

                {/* Appointment Schedule Preview */}
                <div className="mt-5 p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2] text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0A1F44] font-semibold">
                    <Calendar size={13} className="text-[#FF7A00]" />
                    <span>{formData.date || 'Date not chosen'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5A6B84]">
                    <Clock size={13} className="text-[#FF7A00]" />
                    <span>{formData.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5A6B84]">
                    <MapPin size={13} className="text-[#FF7A00]" />
                    <span>{formData.city}, Pakistan</span>
                  </div>
                </div>

                {/* Secure Payment Note */}
                <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[#5A6B84]">
                  <Lock size={13} className="text-[#22C55E]" />
                  <span>Secure Payment Guarantee</span>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
