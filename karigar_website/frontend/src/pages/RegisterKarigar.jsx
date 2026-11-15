import { useState, useEffect } from 'react'
import api from '../config/api'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Upload, Eye, EyeOff, CheckCircle2, Building2, User, ArrowRight, ArrowLeft, Phone, Mail, MapPin, Briefcase } from 'lucide-react'
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
    city: 'Karachi',
    services: preselectedService ? [preselectedService] : ['Electrician'],
    cnicNumber: '',
    cnicFrontFile: null,
    cnicBackFile: null,
    profilePhoto: null,
    bio: '',
    experience: '3',
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
      .catch(err => console.warn('Using fallback services:', err))
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
        setError('Please fill in all required fields.')
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
        data.append('experience', formData.experience || '3')
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
    <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white border border-gray-200/90 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Professional Onboarding Hero (matching reference image) */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 lg:p-10 overflow-hidden text-white bg-[#0A1930]">
          <img
            src="/assets/images/karigar_drill_portrait.jpg"
            alt="Grow Your Business with KarigarPK"
            className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1930] via-[#0A1930]/85 to-[#0A1930]/40"></div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF8A00] flex items-center justify-center text-white font-black text-lg shadow-md">
              🔨
            </div>
            <div className="font-poppins font-black text-xl tracking-tight text-white">
              Karigar<span className="text-[#FF8A00]">PK</span>
            </div>
          </div>

          {/* Center Pitch (exact text from reference image) */}
          <div className="relative z-10 my-auto py-6">
            <h2 className="font-poppins text-2xl lg:text-3xl font-extrabold text-white mb-2 leading-snug">
              Grow Your Business with KarigarPK
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Get more customers, increase your bookings and grow your business.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF8A00]/20 flex items-center justify-center text-[#FF8A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-200">Free Registration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF8A00]/20 flex items-center justify-center text-[#FF8A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-200">Reach More Clients</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF8A00]/20 flex items-center justify-center text-[#FF8A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-200">Manage Your Services</span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 pt-4 border-t border-gray-700/60 flex items-center justify-between text-xs text-gray-400">
            <span>Verified Pro Network</span>
            <span>🇵🇰 All Major Cities</span>
          </div>
        </div>

        {/* Right Side: Clean White Registration Form (matching reference image) */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            {/* KarigarPK Logo Centered */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF8A00] flex items-center justify-center text-white text-base shadow">
                🔨
              </div>
              <div className="font-poppins font-black text-xl text-[#0A1930]">
                Karigar<span className="text-[#FF8A00]">PK</span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="font-poppins text-2xl font-bold text-[#0A1930] mb-0.5">
                Join as a Professional
              </h1>
              <p className="text-gray-500 text-xs">
                Register your business account
              </p>
            </div>

            {/* Account Type Tabs: Individual vs Business (from reference image) */}
            <div className="flex bg-[#F1F5F9] p-1 rounded-xl mb-5 border border-gray-200">
              <button
                type="button"
                onClick={() => setAccountType('individual')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  accountType === 'individual'
                    ? 'bg-white text-[#0A1930] shadow-sm'
                    : 'text-gray-500 hover:text-[#0A1930]'
                }`}
              >
                <User size={14} /> Individual
              </button>
              <button
                type="button"
                onClick={() => setAccountType('business')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  accountType === 'business'
                    ? 'bg-white text-[#0A1930] shadow-sm'
                    : 'text-gray-500 hover:text-[#0A1930]'
                }`}
              >
                <Building2 size={14} /> Business
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3.5 py-2 rounded-xl mb-4 text-xs">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-3.5">
                <div>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={accountType === 'business' ? 'Business / Shop Name' : 'Full Name'}
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-[#0A1930] placeholder-gray-400 focus:outline-none focus:border-[#FF8A00] focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number (e.g. 312-3456789)"
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-[#0A1930] placeholder-gray-400 focus:outline-none focus:border-[#FF8A00] focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-[#0A1930] placeholder-gray-400 focus:outline-none focus:border-[#FF8A00] focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Service Category Dropdown */}
                <div>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select
                      value={formData.services[0] || 'Electrician'}
                      onChange={(e) => setFormData({ ...formData, services: [e.target.value] })}
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white appearance-none cursor-pointer"
                    >
                      {dbServices.map(s => (
                        <option key={s._id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City / Area Dropdown */}
                <div>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white appearance-none cursor-pointer"
                    >
                      {cities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Orange Register Now Button (matching reference image) */}
                <button
                  type="submit"
                  className="w-full bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-orange-500/30 flex items-center justify-center gap-2 mt-2"
                >
                  <span>Register Now</span>
                </button>
              </form>
            ) : (
              /* Step 2: CNIC Verification & Password */
              <form onSubmit={handleNextStep} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">NADRA CNIC Number *</label>
                  <input
                    type="text"
                    name="cnicNumber"
                    value={formData.cnicNumber}
                    onChange={handleChange}
                    placeholder="12345-1234567-1"
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className={`border border-dashed ${formData.cnicFrontFile ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-[#F8FAFC]'} rounded-xl p-2.5 cursor-pointer text-center block`}>
                    <input type="file" name="cnicFrontFile" onChange={handleFileChange} accept="image/*" className="hidden" />
                    <Upload size={16} className="mx-auto text-gray-400 mb-1" />
                    <span className="text-[11px] text-gray-600 font-medium block">
                      {previews.cnicFrontFile ? 'Front Loaded ✓' : 'CNIC Front *'}
                    </span>
                  </label>

                  <label className={`border border-dashed ${formData.cnicBackFile ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-[#F8FAFC]'} rounded-xl p-2.5 cursor-pointer text-center block`}>
                    <input type="file" name="cnicBackFile" onChange={handleFileChange} accept="image/*" className="hidden" />
                    <Upload size={16} className="mx-auto text-gray-400 mb-1" />
                    <span className="text-[11px] text-gray-600 font-medium block">
                      {previews.cnicBackFile ? 'Back Loaded ✓' : 'CNIC Back *'}
                    </span>
                  </label>
                </div>

                <div>
                  <label className={`border border-dashed ${formData.profilePhoto ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-[#F8FAFC]'} rounded-xl p-2.5 cursor-pointer text-center block`}>
                    <input type="file" name="profilePhoto" onChange={handleFileChange} accept="image/*" className="hidden" />
                    <Upload size={16} className="mx-auto text-gray-400 mb-1" />
                    <span className="text-xs text-gray-600 font-medium block">
                      {previews.profilePhoto ? 'Profile Photo Selected ✓' : 'Upload Profile Photo / Workshop Logo *'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password (min 6)"
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0A1930] focus:outline-none focus:border-[#FF8A00]"
                    required
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0A1930] focus:outline-none focus:border-[#FF8A00]"
                    required
                  />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-3 rounded-xl text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md disabled:opacity-50"
                  >
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Login Link */}
            <p className="text-center text-xs text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-[#0A1930] hover:text-[#FF8A00] font-bold">
                Login
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
