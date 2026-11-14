import { useState, useEffect } from 'react'
import api from '../config/api'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Upload, Eye, EyeOff, CheckCircle2, HardHat, Building2, User, ArrowRight, ArrowLeft } from 'lucide-react'
import { CITIES, SERVICES } from '../config/site'

export default function RegisterKarigar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedService = searchParams.get('service')
  
  const [accountType, setAccountType] = useState('individual') // 'individual' or 'business'
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Lahore',
    services: preselectedService ? [preselectedService] : [],
    cnicNumber: '',
    cnicFrontFile: null,
    cnicBackFile: null,
    profilePhoto: null,
    bio: '',
    experience: '',
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
  const [dbServices, setDbServices] = useState(SERVICES.map(name => ({ _id: name, name })))

  useEffect(() => {
    api.get('/services')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setDbServices(res.data)
        }
      })
      .catch(err => console.warn('Using fallback bundled services:', err))
  }, [])

  const cities = CITIES

  const formatCnic = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 13)
    if (digits.length <= 5) return digits
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
  }

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
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

  const handleServiceToggle = (service) => {
    setFormData({
      ...formData,
      services: formData.services.includes(service)
        ? formData.services.filter(s => s !== service)
        : [...formData.services, service]
    })
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

  const handleNextStep = async (e) => {
    e.preventDefault()
    setError('')

    if (step === 1) {
      if (!formData.fullName || !formData.phone || !formData.email || formData.services.length === 0) {
        setError('Please fill in all required fields and select at least one service category.')
        return
      }
      if (!/^3\d{2}-\d{7}$/.test(formData.phone)) {
        setError('Phone number format must be: 312-3456789')
        return
      }
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (step === 2) {
      if (!formData.cnicNumber || !formData.cnicFrontFile || !formData.cnicBackFile || !formData.profilePhoto || !formData.password || !formData.confirmPassword) {
        setError('Please provide CNIC details, upload documents, photo, and set a password.')
        return
      }
      if (!/^\d{5}-\d{7}-\d$/.test(formData.cnicNumber)) {
        setError('Valid CNIC format is: 12345-1234567-1')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      setIsLoading(true)
      
      try {
        const data = new FormData()
        data.append('fullName', formData.fullName)
        data.append('phone', formData.phone)
        data.append('email', formData.email)
        data.append('city', formData.city)
        data.append('services', JSON.stringify(formData.services))
        data.append('cnicNumber', formData.cnicNumber)
        data.append('bio', formData.bio || `${accountType === 'business' ? 'Registered Workshop / Agency' : 'Professional Individual Service Provider'} operating in ${formData.city}`)
        data.append('experience', formData.experience || '2')
        data.append('password', formData.password)
        
        if (formData.cnicFrontFile) data.append('cnicFrontFile', formData.cnicFrontFile)
        if (formData.cnicBackFile) data.append('cnicBackFile', formData.cnicBackFile)
        if (formData.profilePhoto) data.append('profilePhoto', formData.profilePhoto)

        const res = await api.post('/karigars/register', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        localStorage.setItem('karigarUser', JSON.stringify(res.data))
        navigate('/karigar')
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1329] flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-[#131F3D] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[680px]">
        
        {/* Left Side: Professional Onboarding Hero (matching Image 2) */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 lg:p-10 overflow-hidden text-white">
          <img
            src="/assets/images/karigar_drill_portrait.jpg"
            alt="Grow Your Business with KarigarPK"
            className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1329] via-[#0B1329]/80 to-transparent"></div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center text-white font-black text-xl shadow-lg">
              🔨
            </div>
            <div className="font-poppins font-black text-2xl tracking-tight">
              Karigar<span className="text-[#FF6B00]">PK</span>
            </div>
          </div>

          {/* Center Pitch */}
          <div className="relative z-10 my-auto py-8">
            <span className="inline-block px-3 py-1 bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold uppercase rounded-full mb-3 tracking-wider">
              For Skilled Pros & Workshops
            </span>
            <h2 className="font-poppins text-3xl font-extrabold text-white mb-3 leading-snug">
              Grow Your Business with KarigarPK
            </h2>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
              Get more customers, increase your bookings, and build a trusted professional reputation across Pakistan.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#FF6B00] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-200">Free Registration & Zero Listing Cost</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#FF6B00] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-200">Reach Thousands of Clients Directly</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#FF6B00] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-200">Manage Your Schedule & Service Rates</span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 pt-4 border-t border-gray-700/60 flex items-center justify-between text-xs text-gray-400">
            <span>Verified Pro Badge</span>
            <span>Fast Approvals</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#0e172e]">
          <div className="max-w-md w-full mx-auto">
            
            {/* Header */}
            <div className="mb-6">
              <div className="md:hidden flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white text-base">
                  🔨
                </div>
                <div className="font-poppins font-black text-xl text-white">
                  Karigar<span className="text-[#FF6B00]">PK</span>
                </div>
              </div>
              <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-white mb-1">
                Join as a Professional
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                Register your business or individual service account
              </p>
            </div>

            {/* Account Type Tabs (matching Image 2) */}
            <div className="flex bg-[#0B1329] p-1 rounded-xl mb-6 border border-gray-800">
              <button
                type="button"
                onClick={() => setAccountType('individual')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  accountType === 'individual'
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User size={15} /> Individual
              </button>
              <button
                type="button"
                onClick={() => setAccountType('business')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  accountType === 'business'
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Building2 size={15} /> Business / Shop
              </button>
            </div>

            {/* Step Progress Tracker */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[#FF6B00]' : 'bg-gray-800'}`}></div>
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[#FF6B00]' : 'bg-gray-800'}`}></div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-2.5 rounded-xl mb-5 text-xs sm:text-sm">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    {accountType === 'business' ? 'Business / Workshop Name *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={accountType === 'business' ? 'e.g. Al Mustafa Electrical Services' : 'e.g. Muhammad Tariq'}
                    className="w-full bg-[#131F3D] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
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
                      className="w-full bg-[#131F3D] border border-gray-700 rounded-r-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="pro@example.com"
                    className="w-full bg-[#131F3D] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    City / Primary Service Area *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#131F3D] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                    required
                  >
                    {cities.map((c) => (
                      <option key={c} value={c} className="bg-[#0B1329] text-white">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-2">
                    Select Service Categories *
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-[#0B1329] border border-gray-800 rounded-xl">
                    {dbServices.map((service) => {
                      const isSelected = formData.services.includes(service.name)
                      return (
                        <button
                          key={service._id}
                          type="button"
                          onClick={() => handleServiceToggle(service.name)}
                          className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#FF6B00] text-white shadow-sm'
                              : 'bg-[#131F3D] text-gray-300 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <span className="truncate">{service.name}</span>
                          {isSelected && <span className="text-xs">✓</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-orange-500/25 flex items-center justify-center gap-2 mt-4"
                >
                  <span>Continue to Verification</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    NADRA CNIC Number *
                  </label>
                  <input
                    type="text"
                    name="cnicNumber"
                    value={formData.cnicNumber}
                    onChange={handleChange}
                    placeholder="12345-1234567-1"
                    className="w-full bg-[#131F3D] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className={`border border-dashed ${formData.cnicFrontFile ? 'border-[#FF6B00] bg-[#FF6B00]/5' : 'border-gray-700 bg-[#131F3D]'} rounded-xl p-3 cursor-pointer text-center hover:border-[#FF6B00] transition-colors block`}>
                    <input type="file" name="cnicFrontFile" onChange={handleFileChange} accept="image/*" className="hidden" />
                    {previews.cnicFrontFile ? (
                      <div>
                        <img src={previews.cnicFrontFile} alt="Front" className="mx-auto h-12 object-contain rounded mb-1" />
                        <span className="text-[11px] text-[#FF6B00] font-semibold">Front Loaded ✓</span>
                      </div>
                    ) : (
                      <div>
                        <Upload size={18} className="mx-auto text-gray-400 mb-1" />
                        <span className="text-[11px] text-gray-300 font-medium block">CNIC Front *</span>
                      </div>
                    )}
                  </label>

                  <label className={`border border-dashed ${formData.cnicBackFile ? 'border-[#FF6B00] bg-[#FF6B00]/5' : 'border-gray-700 bg-[#131F3D]'} rounded-xl p-3 cursor-pointer text-center hover:border-[#FF6B00] transition-colors block`}>
                    <input type="file" name="cnicBackFile" onChange={handleFileChange} accept="image/*" className="hidden" />
                    {previews.cnicBackFile ? (
                      <div>
                        <img src={previews.cnicBackFile} alt="Back" className="mx-auto h-12 object-contain rounded mb-1" />
                        <span className="text-[11px] text-[#FF6B00] font-semibold">Back Loaded ✓</span>
                      </div>
                    ) : (
                      <div>
                        <Upload size={18} className="mx-auto text-gray-400 mb-1" />
                        <span className="text-[11px] text-gray-300 font-medium block">CNIC Back *</span>
                      </div>
                    )}
                  </label>
                </div>

                <div>
                  <label className={`border border-dashed ${formData.profilePhoto ? 'border-[#FF6B00] bg-[#FF6B00]/5' : 'border-gray-700 bg-[#131F3D]'} rounded-xl p-3 cursor-pointer text-center hover:border-[#FF6B00] transition-colors block`}>
                    <input type="file" name="profilePhoto" onChange={handleFileChange} accept="image/*" className="hidden" />
                    {previews.profilePhoto ? (
                      <div className="flex items-center justify-center gap-3">
                        <img src={previews.profilePhoto} alt="Profile" className="w-10 h-10 object-cover rounded-full border border-[#FF6B00]" />
                        <span className="text-xs text-[#FF6B00] font-semibold">Photo Selected ✓</span>
                      </div>
                    ) : (
                      <div>
                        <Upload size={18} className="mx-auto text-gray-400 mb-1" />
                        <span className="text-xs text-gray-300 font-medium block">Upload Professional Profile Photo *</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Set Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 chars"
                      className="w-full bg-[#131F3D] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      className="w-full bg-[#131F3D] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-2 w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md hover:shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? <span>Registering...</span> : <span>Complete Registration</span>}
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Login Link */}
            <p className="text-center text-xs text-gray-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FF6B00] hover:underline font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
