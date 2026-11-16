import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Phone, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Lock, Upload, MapPin, Building2, Check, Clock, X, Info } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../config/api'
import { CITIES, SERVICES_CONFIG, CITY_COORDINATES } from '../config/site'

export default function ClaimListing() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Steps:
  // 0: Phone Confirm
  // 1: OTP Code
  // 2: Account Setup (Email + Password)
  // 3: 4-Part Form (A: Business, B: Photos, C: CNIC, D: Rate/Bio)
  // 4: Success Screen
  const [currentStep, setCurrentStep] = useState(0)
  const [listing, setListing] = useState(null)
  const [loadingListing, setLoadingListing] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // OTP state
  const [maskedPhone, setMaskedPhone] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(300)
  const [claimToken, setClaimToken] = useState('')

  // Step 2: Account Credentials
  const [accountData, setAccountData] = useState({
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Step 3: Form Data
  const [formData, setFormData] = useState({
    services: [],
    area: '',
    address: '',
    coordinates: null, // { lat, lng }
    hourlyRate: 500,
    experience: 3,
    whatsapp: '',
    workingHours: '09:00 AM - 07:00 PM',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    bio: '',
    cnicNumber: ''
  })

  // File Uploads
  const [profilePhotoFile, setProfilePhotoFile] = useState(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('')
  const [coverPhotoFile, setCoverPhotoFile] = useState(null)
  const [coverPhotoPreview, setCoverPhotoPreview] = useState('')
  const [galleryFiles, setGalleryFiles] = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [cnicFrontFile, setCnicFrontFile] = useState(null)
  const [cnicFrontPreview, setCnicFrontPreview] = useState('')
  const [cnicBackFile, setCnicBackFile] = useState(null)
  const [cnicBackPreview, setCnicBackPreview] = useState('')

  // Map pin-picker ref
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  // 1. Fetch Listing on Load
  useEffect(() => {
    let isMounted = true
    setLoadingListing(true)

    api.get(`/listings/${id}`)
      .then((res) => {
        if (!isMounted) return
        setListing(res.data)
        if (res.data) {
          setAccountData((prev) => ({ ...prev, ownerName: res.data.name || '' }))
          setFormData((prev) => ({
            ...prev,
            area: res.data.area || '',
            address: res.data.address || '',
            services: [res.data.service],
            whatsapp: res.data.phone || '',
            coordinates: res.data.coordinates?.lat ? res.data.coordinates : null
          }))
        }
        setLoadingListing(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Error fetching listing:', err)
        setError('Ye listing nahi mili ya link ghalat hai.')
        setLoadingListing(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  // Timer countdown for Step 1
  useEffect(() => {
    if (currentStep !== 1 || timer <= 0) return
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [currentStep, timer])

  // Leaflet Pin Picker Initialization for Step 3
  useEffect(() => {
    if (currentStep !== 3 || !mapContainerRef.current) return

    const cityCoords = CITY_COORDINATES[listing?.city] || CITY_COORDINATES['Lahore']
    const initLat = formData.coordinates?.lat || cityCoords.lat
    const initLng = formData.coordinates?.lng || cityCoords.lng

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initLat, initLng],
        zoom: 13,
        zoomControl: true,
        attributionControl: false
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      }).addTo(map)

      const pinIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background:#FF7A00;width:24px;height:24px;border:2px solid #FFF;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      const marker = L.marker([initLat, initLng], { icon: pinIcon }).addTo(map)
      markerRef.current = marker

      map.on('click', (e) => {
        const { lat, lng } = e.latlng
        marker.setLatLng([lat, lng])
        setFormData((prev) => ({
          ...prev,
          coordinates: { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) }
        }))
      })

      mapInstanceRef.current = map
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [currentStep, listing?.city])

  // Handle Step 0: Request OTP
  const handleRequestOtp = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      const res = await api.post(`/listings/${id}/claim/start`)
      if (res.data?.success) {
        setMaskedPhone(res.data.maskedPhone || '03XX-XXXXXXX')
        setTimer(res.data.expiresIn || 300)
        setCurrentStep(1)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP send failed. Please try again or contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Step 1: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault()
    const enteredOtp = otpDigits.join('')
    if (enteredOtp.length !== 6) {
      setError('Baraye meherbani 6-hanso ka OTP code mukammal darj karein.')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      const res = await api.post(`/listings/${id}/claim/verify`, { otp: enteredOtp })
      if (res.data?.success && res.data.claimToken) {
        setClaimToken(res.data.claimToken)
        setCurrentStep(2)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ghalat ya expired OTP code.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // OTP digit input handler
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...otpDigits]
    newDigits[index] = value.slice(-1)
    setOtpDigits(newDigits)
    setError('')

    // Auto-advance
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  // Handle Step 2: Account Submission
  const handleAccountSubmit = (e) => {
    e.preventDefault()
    if (!accountData.ownerName.trim() || accountData.ownerName.trim().length < 3) {
      setError('Owner name must be at least 3 characters.')
      return
    }
    if (!accountData.email.trim()) {
      setError('Please provide a valid email address.')
      return
    }
    if (accountData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (accountData.password !== accountData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setCurrentStep(3)
  }

  // Step 3: Format CNIC
  const handleCnicChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 13)
    if (val.length > 5 && val.length <= 12) {
      val = `${val.slice(0, 5)}-${val.slice(5)}`
    } else if (val.length > 12) {
      val = `${val.slice(0, 5)}-${val.slice(5, 12)}-${val.slice(12)}`
    }
    setFormData((prev) => ({ ...prev, cnicNumber: val }))
    setError('')
  }

  // Gallery file handler
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 6)
    setGalleryFiles(files)
    const previews = files.map((f) => URL.createObjectURL(f))
    setGalleryPreviews(previews)
  }

  // Submit Final Step 3 Form
  const handleFinalSubmit = async (e) => {
    e.preventDefault()

    if (!formData.bio || formData.bio.trim().length < 40) {
      setError('Business bio must be at least 40 characters long.')
      return
    }
    if (!formData.cnicNumber || !/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(formData.cnicNumber)) {
      setError('Please enter a valid 13-digit CNIC in the format: 00000-0000000-0')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const data = new FormData()
      data.append('claimToken', claimToken)
      data.append('ownerName', accountData.ownerName.trim())
      data.append('email', accountData.email.trim())
      data.append('password', accountData.password)
      data.append('phone', listing.phone)
      data.append('whatsapp', formData.whatsapp || listing.phone)
      data.append('area', formData.area)
      data.append('address', formData.address)
      data.append('hourlyRate', formData.hourlyRate)
      data.append('experience', formData.experience)
      data.append('bio', formData.bio.trim())
      data.append('cnicNumber', formData.cnicNumber)
      data.append('services', JSON.stringify(formData.services.length > 0 ? formData.services : [listing.service]))

      if (formData.coordinates) {
        data.append('coordinates', JSON.stringify(formData.coordinates))
      }

      // Attach Photos
      if (profilePhotoFile) data.append('profilePhoto', profilePhotoFile)
      if (coverPhotoFile) data.append('coverPhoto', coverPhotoFile)
      if (cnicFrontFile) data.append('cnicFront', cnicFrontFile)
      if (cnicBackFile) data.append('cnicBack', cnicBackFile)
      galleryFiles.forEach((f) => data.append('gallery', f))

      const res = await api.post(`/listings/${id}/claim/submit`, data, {
        headers: {
          Authorization: `Bearer ${claimToken}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res.data?.success) {
        setCurrentStep(4) // Success screen!
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim. Please check your data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingListing) {
    return (
      <div className="py-24 px-4 bg-[#F5F7FB] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#0A1F44] font-bold text-sm">Loading Listing Details...</p>
        </div>
      </div>
    )
  }

  if (error && !listing) {
    return (
      <div className="py-24 px-4 bg-[#F5F7FB] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 border border-[#E4EAF2] max-w-md w-full text-center shadow-xl">
          <AlertCircle size={44} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#0A1F44] mb-2 font-poppins">Listing Nahi Mili</h2>
          <p className="text-[#5A6B84] mb-6 text-sm leading-relaxed">{error}</p>
          <Link
            to="/find-karigar"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-md"
          >
            <ArrowLeft size={16} /> Browse Directory
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={`/listing/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B84] hover:text-[#0A1F44] transition-colors"
          >
            <ArrowLeft size={14} /> Wapis Listing Par Jayein
          </Link>

          <span className="text-xs font-bold text-[#FF7A00]">
            100% Free Business Claim
          </span>
        </div>

        {/* Progress Step Indicator */}
        {currentStep < 4 && (
          <div className="bg-white border border-[#E4EAF2] rounded-2xl p-4 mb-6 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className={currentStep >= 0 ? 'text-[#FF7A00]' : 'text-gray-400'}>1. Phone Confirm</span>
              <span className={currentStep >= 1 ? 'text-[#FF7A00]' : 'text-gray-400'}>2. OTP</span>
              <span className={currentStep >= 2 ? 'text-[#FF7A00]' : 'text-gray-400'}>3. Account</span>
              <span className={currentStep >= 3 ? 'text-[#FF7A00]' : 'text-gray-400'}>4. Verification</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#FF7A00] h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm p-4 rounded-2xl mb-6 flex items-center gap-2">
            <AlertCircle size={18} className="flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 0: Masked Phone Confirm */}
        {currentStep === 0 && (
          <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-10 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF7A00] flex items-center justify-center mx-auto mb-4">
              <Phone size={26} />
            </div>

            <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-1">
              Step 1 of 4 • Phone Verification
            </span>
            <h1 className="font-poppins text-2xl font-extrabold text-[#0A1F44] mb-2">
              Is this your business?
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6B84] mb-6">
              To verify your ownership of <strong>{listing?.name}</strong>, we will send a 6-digit OTP code to the registered phone number on this listing.
            </p>

            <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-4 max-w-sm mx-auto mb-6">
              <span className="text-xs text-[#5A6B84] block mb-1">Registered Phone Number</span>
              <p className="font-poppins font-extrabold text-lg text-[#0A1F44]">
                {listing?.phone ? listing.phone.replace(/(\d{4})\d{3}(\d{4})/, '$1-XXX-$2') : 'No phone listed'}
              </p>
            </div>

            <button
              type="button"
              disabled={isSubmitting || !listing?.phone}
              onClick={handleRequestOtp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-md shadow-orange-500/25 cursor-pointer disabled:bg-gray-300"
            >
              {isSubmitting ? 'Sending OTP...' : 'Send 6-Digit Verification OTP →'}
            </button>
          </div>
        )}

        {/* STEP 1: OTP Entry */}
        {currentStep === 1 && (
          <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-10 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0A1F44] flex items-center justify-center mx-auto mb-4">
              <Lock size={26} className="text-[#FF7A00]" />
            </div>

            <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-1">
              Step 2 of 4 • Enter OTP
            </span>
            <h2 className="font-poppins text-2xl font-extrabold text-[#0A1F44] mb-2">
              Enter Verification Code
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6B84] mb-6">
              6-digit OTP code sent to <strong>{maskedPhone}</strong>. It expires in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}.
            </p>

            {/* 6 Digit Input Boxes */}
            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-box-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl font-poppins font-extrabold border-2 border-[#E4EAF2] rounded-xl focus:border-[#FF7A00] focus:outline-none bg-[#F8FAFC] transition-colors"
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                disabled={isSubmitting || otpDigits.join('').length !== 6}
                onClick={handleVerifyOtp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A1F44] hover:bg-[#102747] text-white font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-md cursor-pointer disabled:bg-gray-300"
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP Code →'}
              </button>

              <button
                type="button"
                disabled={timer > 0 || isSubmitting}
                onClick={handleRequestOtp}
                className="text-xs font-bold text-[#FF7A00] hover:text-[#F06400] disabled:text-gray-400 cursor-pointer"
              >
                Resend Code {timer > 0 ? `(${timer}s)` : ''}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Account Setup */}
        {currentStep === 2 && (
          <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-10 shadow-sm">
            <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-1">
              Step 3 of 4 • Owner Account
            </span>
            <h2 className="font-poppins text-2xl font-extrabold text-[#0A1F44] mb-2">
              Setup Your Business Login
            </h2>
            <p className="text-xs text-[#5A6B84] mb-6">
              Create login credentials to manage bookings, update prices, and respond to customers.
            </p>

            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0A1F44] block mb-1">Owner Full Name</label>
                <input
                  type="text"
                  required
                  value={accountData.ownerName}
                  onChange={(e) => setAccountData({ ...accountData, ownerName: e.target.value })}
                  placeholder="e.g. Muhammad Aslam"
                  className="w-full p-2.5 text-xs sm:text-sm border border-[#E4EAF2] rounded-xl bg-[#F8FAFC] focus:bg-white focus:border-[#FF7A00] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0A1F44] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={accountData.email}
                  onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                  placeholder="name@business.com"
                  className="w-full p-2.5 text-xs sm:text-sm border border-[#E4EAF2] rounded-xl bg-[#F8FAFC] focus:bg-white focus:border-[#FF7A00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0A1F44] block mb-1">Password (min 6 chars)</label>
                  <input
                    type="password"
                    required
                    value={accountData.password}
                    onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full p-2.5 text-xs sm:text-sm border border-[#E4EAF2] rounded-xl bg-[#F8FAFC] focus:bg-white focus:border-[#FF7A00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0A1F44] block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={accountData.confirmPassword}
                    onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full p-2.5 text-xs sm:text-sm border border-[#E4EAF2] rounded-xl bg-[#F8FAFC] focus:bg-white focus:border-[#FF7A00] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-orange-500/20 cursor-pointer"
              >
                Continue to Verification Form →
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: The 4-Part Verification Form */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            
            {/* Part A: Business Info & Coordinates */}
            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-[#E4EAF2] pb-3 mb-4">
                <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block">Part A</span>
                <h3 className="font-poppins font-extrabold text-lg text-[#0A1F44]">Business Location & Services</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0A1F44] block mb-1">Area / Neighborhood</label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. DHA Phase 5"
                    className="w-full p-2.5 text-xs border border-[#E4EAF2] rounded-xl bg-[#F8FAFC] focus:bg-white focus:border-[#FF7A00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0A1F44] block mb-1">Detailed Street Address / Landmark</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Shop #, Plaza, Street, Landmark"
                    className="w-full p-2.5 text-xs border border-[#E4EAF2] rounded-xl bg-[#F8FAFC] focus:bg-white focus:border-[#FF7A00] focus:outline-none"
                  />
                </div>
              </div>

              {/* Pin-Picker Map */}
              <div>
                <label className="text-xs font-bold text-[#0A1F44] flex items-center justify-between mb-1">
                  <span>Pinpoint Shop Location on Map (Click to place pin)</span>
                  {formData.coordinates && (
                    <span className="text-[#FF7A00] font-bold text-[11px]">
                      📍 Lat: {formData.coordinates.lat}, Lng: {formData.coordinates.lng}
                    </span>
                  )}
                </label>
                <div ref={mapContainerRef} className="h-48 w-full rounded-2xl border border-[#E4EAF2] shadow-inner" />
              </div>
            </div>

            {/* Part B: Photos */}
            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-[#E4EAF2] pb-3 mb-4">
                <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block">Part B</span>
                <h3 className="font-poppins font-extrabold text-lg text-[#0A1F44]">Photos & Showcase</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0A1F44] block mb-1">Profile Photo / Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setProfilePhotoFile(e.target.files[0])
                        setProfilePhotoPreview(URL.createObjectURL(e.target.files[0]))
                      }
                    }}
                    className="text-xs w-full text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-[#FF7A00]"
                  />
                  {profilePhotoPreview && (
                    <img src={profilePhotoPreview} alt="Logo" className="w-16 h-16 rounded-xl object-cover mt-2 border" />
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0A1F44] block mb-1">Cover / Banner Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setCoverPhotoFile(e.target.files[0])
                        setCoverPhotoPreview(URL.createObjectURL(e.target.files[0]))
                      }
                    }}
                    className="text-xs w-full text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-[#FF7A00]"
                  />
                  {coverPhotoPreview && (
                    <img src={coverPhotoPreview} alt="Cover" className="h-16 w-32 rounded-xl object-cover mt-2 border" />
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0A1F44] block mb-1">Work Gallery (Max 6 Photos)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="text-xs w-full text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#0A1F44]"
                />
                {galleryPreviews.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {galleryPreviews.map((p, i) => (
                      <img key={i} src={p} alt="Gallery" className="w-14 h-14 rounded-lg object-cover border" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Part C: Government CNIC Verification (Private) */}
            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-[#E4EAF2] pb-3 mb-4">
                <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block">Part C</span>
                <h3 className="font-poppins font-extrabold text-lg text-[#0A1F44]">Identity Verification (Strictly Confidential)</h3>
              </div>

              {/* Strict Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 text-[#0A1F44] rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck size={22} className="text-[#22C55E] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-poppins font-bold text-xs sm:text-sm">Ye kabhi website par nahi dikhega</h4>
                  <p className="text-xs text-[#5A6B84] leading-relaxed mt-0.5">
                    Aapka CNIC number aur tasweer sirf KarigarPK verification team ke liye hain. Ye data public profiles, search results ya kisi card par kabhi show nahi hota.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0A1F44] block mb-1">Owner CNIC Number</label>
                <input
                  type="text"
                  required
                  value={formData.cnicNumber}
                  onChange={handleCnicChange}
                  placeholder="00000-0000000-0"
                  className="w-full p-2.5 text-xs sm:text-sm font-mono border border-[#E4EAF2] rounded-xl bg-[#F8FAFC] focus:bg-white focus:border-[#FF7A00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0A1F44] block mb-1">CNIC Front Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setCnicFrontFile(e.target.files[0])
                        setCnicFrontPreview(URL.createObjectURL(e.target.files[0]))
                      }
                    }}
                    className="text-xs w-full text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-100"
                  />
                  {cnicFrontPreview && <img src={cnicFrontPreview} alt="CNIC Front" className="h-16 w-24 object-cover rounded mt-2 border" />}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0A1F44] block mb-1">CNIC Back Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setCnicBackFile(e.target.files[0])
                        setCnicBackPreview(URL.createObjectURL(e.target.files[0]))
                      }
                    }}
                    className="text-xs w-full text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-100"
                  />
                  {cnicBackPreview && <img src={cnicBackPreview} alt="CNIC Back" className="h-16 w-24 object-cover rounded mt-2 border" />}
                </div>
              </div>
            </div>

            {/* Part D: Rates, Bio, Hours */}
            <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-[#E4EAF2] pb-3 mb-4">
                <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block">Part D</span>
                <h3 className="font-poppins font-extrabold text-lg text-[#0A1F44]">Rates, Availability & Bio</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0A1F44] block mb-1">Starting Inspection Rate (PKR)</label>
                  <input
                    type="number"
                    min="300"
                    step="50"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full p-2.5 text-xs border border-[#E4EAF2] rounded-xl bg-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0A1F44] block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full p-2.5 text-xs border border-[#E4EAF2] rounded-xl bg-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0A1F44] block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="03001234567"
                    className="w-full p-2.5 text-xs border border-[#E4EAF2] rounded-xl bg-[#F8FAFC]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#0A1F44]">Business Bio / Description</label>
                  <span className={`text-[11px] ${formData.bio.length < 40 ? 'text-red-500 font-bold' : 'text-emerald-600'}`}>
                    {formData.bio.length}/40 characters min
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Detail your trade background, specializations, warranties, and service areas (minimum 40 characters)..."
                  className="w-full p-3 text-xs sm:text-sm border border-[#E4EAF2] rounded-xl bg-[#F8FAFC] focus:bg-white focus:border-[#FF7A00] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-orange-500/25 cursor-pointer disabled:bg-gray-300"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Claim Application for Review →'}
              </button>
            </div>

          </form>
        )}

        {/* STEP 4: Success Screen */}
        {currentStep === 4 && (
          <div className="bg-white border border-[#E4EAF2] rounded-3xl p-8 sm:p-12 text-center shadow-lg animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#22C55E] flex items-center justify-center mx-auto mb-5 shadow-xs">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-[#22C55E] text-xs font-bold uppercase tracking-widest block mb-1">
              Application Submitted
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1F44] mb-3">
              Claim mil gayi — 24 ghanton mein WhatsApp par jawab milega
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6B84] max-w-md mx-auto mb-8 leading-relaxed">
              Humari team aapke business details aur CNIC ko verify kar rahi hai. Approval ke foran baad aapka profile <strong>Verified Pro</strong> badge ke sath live ho jayega aur direct bookings shuru ho jayengi.
            </p>

            <div className="bg-[#F8FAFC] border border-[#E4EAF2] rounded-2xl p-4 max-w-sm mx-auto mb-8 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#5A6B84]">Listing:</span>
                <span className="font-bold text-[#0A1F44]">{listing?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B84]">Status:</span>
                <span className="font-bold text-amber-600">Pending Admin Review</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B84]">Estimated Turnaround:</span>
                <span className="font-bold text-[#0A1F44]">Within 24 Hours</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/listing/${id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A1F44] hover:bg-[#102747] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all"
              >
                <span>View Directory Listing</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#0A1F44] font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-colors"
              >
                Login to Karigar Portal
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
