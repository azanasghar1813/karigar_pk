import { useState, useEffect } from 'react'
import api from '../config/api'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Upload, Eye, EyeOff, CheckCircle2, Building2, User, ArrowRight, ArrowLeft, Phone, Mail, MapPin, Briefcase, ShieldCheck } from 'lucide-react'
import { CITIES, SERVICES_CONFIG } from '../config/site'
import { useCity } from '../context/CityContext'
import BrandLogo from '../components/BrandLogo'

export default function RegisterKarigar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { selectedCity } = useCity()
  const preselectedService = searchParams.get('service')
  const defaultCity = searchParams.get('city') || selectedCity || 'Lahore'
  
  const [accountType, setAccountType] = useState('individual') // 'individual' or 'business'
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: defaultCity,
    services: preselectedService ? [preselectedService] : ['Electrician'],
    cnicNumber: '',
    cnicFrontFile: null,
    cnicBackFile: null,
    profilePhoto: null,
    bio: '',
    hourlyRate: 500,
    experience: '3',
    address: '',
    password: '',
    confirmPassword: ''
  })
  const [previews, setPreviews] = useState({
    cnicFrontFile: null,
    cnicBackFile: null,
    profilePhoto: null
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const formatCnic = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 13)
    if (digits.length <= 5) return digits
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
  }

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 4) return digits
    return `${digits.slice(0, 4)}-${digits.slice(4)}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const normalized = name === 'cnicNumber'
      ? formatCnic(value)
      : name === 'phone'
        ? formatPhone(value)
        : value

    setFormData({
      ...formData,
      [name]: normalized
    })
    setError('')
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      })
      setPreviews({
        ...previews,
        [name]: URL.createObjectURL(files[0])
      })
    }
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    setError('')

    if (step === 1) {
      if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
        setError('Please enter your full name (minimum 3 characters).')
        return
      }
      const digits = formData.phone.replace(/\D/g, '')
      if (digits.length < 10 || digits.length > 11) {
        setError('Please enter a valid Pakistani phone number (e.g. 0300-1234567).')
        return
      }
      if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        setError('Please enter a valid email address.')
        return
      }
      if (!formData.services || formData.services.length === 0) {
        setError('Please select at least one primary service category.')
        return
      }
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    const cnicDigits = formData.cnicNumber.replace(/\D/g, '')
    if (cnicDigits.length !== 13) {
      setError('Please provide a valid 13-digit Pakistani CNIC number.')
      return
    }
    if (!formData.address.trim() || formData.address.trim().length < 8) {
      setError('Please enter your complete workshop / business address.')
      return
    }

    setIsLoading(true)

    try {
      const formPayload = new FormData()
      formPayload.append('fullName', formData.fullName.trim())
      formPayload.append('phone', formData.phone)
      formPayload.append('email', formData.email.trim())
      formPayload.append('password', formData.password)
      formPayload.append('city', formData.city)
      formPayload.append('address', `${formData.address.trim()}, ${formData.city}`)
      formPayload.append('accountType', accountType)
      formPayload.append('experience', formData.experience)
      formPayload.append('hourlyRate', formData.hourlyRate)
      formPayload.append('bio', formData.bio.trim() || `Professional ${formData.services[0]} serving residential and commercial clients in ${formData.city}.`)
      
      formData.services.forEach(srv => formPayload.append('services[]', srv))

      formPayload.append('cnicNumber', formData.cnicNumber)
      if (formData.cnicFrontFile) formPayload.append('cnicFront', formData.cnicFrontFile)
      if (formData.cnicBackFile) formPayload.append('cnicBack', formData.cnicBackFile)
      if (formData.profilePhoto) formPayload.append('profilePhoto', formData.profilePhoto)

      await api.post('/auth/register/karigar', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setIsSuccess(true)
    } catch (err) {
      console.error('Registration failed:', err)
      setError(err.response?.data?.message || 'Registration failed. Please check your data and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white border border-[#E4EAF2] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Professional Onboarding Hero (matching Reference 2 "Join as a Professional") */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 lg:p-10 overflow-hidden text-white bg-[#0A1F44]">
          <img
            src="/assets/images/karigar_drill_portrait.webp"
            alt="Grow Your Business with KarigarPK"
            className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.55] contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-[#0A1F44]/80 to-[#0A1F44]/30" />

          {/* Branded Logo */}
          <div className="relative z-10">
            <BrandLogo variant="dark" size="md" />
          </div>

          {/* Center Pitch */}
          <div className="relative z-10 my-auto py-6">
            <h2 className="font-poppins text-2xl lg:text-3xl font-extrabold text-white mb-2 leading-snug">
              Grow Your Business with KarigarPK
            </h2>
            <p className="text-gray-200 text-xs sm:text-sm mb-6 leading-relaxed">
              Get more customers, increase your bookings and grow your business.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-100">Free Registration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-100">Reach More Clients</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-100">Manage Your Services</span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-gray-300">
            <span>Verified Pro Network</span>
            <span>🇵🇰 Across Pakistan</span>
          </div>
        </div>

        {/* Right Side: Clean White Registration Form */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            {/* Top Navigation Back Link */}
            <div className="mb-4">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B84] hover:text-[#0A1F44] transition-colors"
              >
                <ArrowLeft size={14} /> Back to Home
              </Link>
            </div>

            {isSuccess ? (
              <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-50 text-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="font-poppins text-2xl font-extrabold text-[#0A1F44] mb-2">
                  Application Received!
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6B84] mb-6 leading-relaxed">
                  Our verification team will review your submitted CNIC documents and activate your public verified profile within 24 hours.
                </p>
                <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2] text-xs text-[#5A6B84] mb-6">
                  Status: <strong className="text-[#FF7A00]">Pending Document Verification</strong>
                </div>
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md"
                >
                  Proceed to Login →
                </Link>
              </div>
            ) : (
              <>
                {/* KarigarPK Logo Centered */}
                <div className="flex items-center justify-center mb-3">
                  <BrandLogo variant="light" size="md" />
                </div>

                {/* Header */}
                <div className="text-center mb-5">
                  <h1 className="font-poppins text-2xl font-bold text-[#0A1F44] mb-0.5">
                    Join as a Professional
                  </h1>
                  <p className="text-[#5A6B84] text-xs">
                    Register your business account (Step {step} of 2)
                  </p>
                </div>

                {/* Individual vs Business Tabs (Reference 2) */}
                <div className="flex bg-[#F7F9FC] p-1 rounded-xl mb-5 border border-[#E4EAF2]">
                  <button
                    type="button"
                    onClick={() => setAccountType('individual')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      accountType === 'individual'
                        ? 'bg-white text-[#0A1F44] shadow-sm'
                        : 'text-[#5A6B84] hover:text-[#0A1F44]'
                    }`}
                  >
                    <User size={13} /> Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('business')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      accountType === 'business'
                        ? 'bg-white text-[#0A1F44] shadow-sm'
                        : 'text-[#5A6B84] hover:text-[#0A1F44]'
                    }`}
                  >
                    <Building2 size={13} /> Business
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                    {error}
                  </div>
                )}

                {step === 1 ? (
                  /* STEP 1: Basic Information */
                  <form onSubmit={handleNextStep} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Muhammad Tariq"
                        required
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                        Phone Number (03XX-XXXXXXX) *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0300-1234567"
                        required
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tariq@gmail.com"
                        required
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                        Select Service Category *
                      </label>
                      <select
                        value={formData.services[0] || 'Electrician'}
                        onChange={(e) => setFormData({ ...formData, services: [e.target.value] })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all font-medium"
                      >
                        {SERVICES_CONFIG.map((s) => (
                          <option key={s.id} value={s.searchKey}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                        Launch City *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all font-medium"
                      >
                        {CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 mt-4"
                    >
                      <span>Continue to Verification</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                ) : (
                  /* STEP 2: Sensitive Verification (Protected Endpoint Only) */
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0A1F44]">CNIC & Security</span>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-bold text-[#FF7A00] hover:underline"
                      >
                        ← Back to Step 1
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                          Password *
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Min 6 chars"
                          required
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                          Confirm *
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Repeat pass"
                          required
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                        13-Digit CNIC Number *
                      </label>
                      <input
                        type="text"
                        name="cnicNumber"
                        value={formData.cnicNumber}
                        onChange={handleChange}
                        placeholder="35201-1234567-1"
                        required
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                          Hourly Rate (PKR) *
                        </label>
                        <input
                          type="number"
                          name="hourlyRate"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          min={300}
                          step={50}
                          required
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                          Experience (Years) *
                        </label>
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          min={1}
                          required
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                        Workshop / Shop Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Shop #, Street / Market, Area"
                        required
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00]"
                      />
                    </div>

                    {/* CNIC Front & Back Document Uploads */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0A1F44] mb-1">
                          CNIC Front Image
                        </label>
                        <label className="border border-dashed border-[#E4EAF2] hover:border-[#FF7A00] rounded-xl p-2.5 text-center flex flex-col items-center justify-center cursor-pointer bg-[#F7F9FC]">
                          <Upload size={14} className="text-[#5A6B84] mb-1" />
                          <span className="text-[10px] text-[#5A6B84] truncate max-w-full">
                            {formData.cnicFrontFile ? 'Front Attached ✓' : 'Upload Front'}
                          </span>
                          <input type="file" name="cnicFrontFile" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0A1F44] mb-1">
                          CNIC Back Image
                        </label>
                        <label className="border border-dashed border-[#E4EAF2] hover:border-[#FF7A00] rounded-xl p-2.5 text-center flex flex-col items-center justify-center cursor-pointer bg-[#F7F9FC]">
                          <Upload size={14} className="text-[#5A6B84] mb-1" />
                          <span className="text-[10px] text-[#5A6B84] truncate max-w-full">
                            {formData.cnicBackFile ? 'Back Attached ✓' : 'Upload Back'}
                          </span>
                          <input type="file" name="cnicBackFile" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                      <span>{isLoading ? 'Submitting Application...' : 'Register Now'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                )}

                <div className="mt-5 text-center">
                  <p className="text-xs text-[#5A6B84]">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#0A1F44] hover:text-[#FF7A00] font-bold">
                      Login
                    </Link>
                  </p>
                </div>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
