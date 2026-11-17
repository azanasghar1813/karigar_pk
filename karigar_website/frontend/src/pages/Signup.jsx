import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Phone, Eye, EyeOff, User, MapPin, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'
import BrandLogo from '../components/BrandLogo'

export default function Signup() {
  const navigate = useNavigate()
  const { register, googleLogin } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 4) return digits
    return `${digits.slice(0, 4)}-${digits.slice(4)}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const normalizedValue = name === 'phone'
      ? formatPhone(value)
      : value

    setFormData({
      ...formData,
      [name]: normalizedValue
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    const cleanPhone = formData.phone.replace(/\D/g, '')
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      setError('Please enter a valid Pakistani phone number (e.g. 0300-1234567).')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setIsLoading(true)

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        address: formData.address.trim() || 'Pakistan',
        password: formData.password
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your data.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      await googleLogin(idToken)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message || 'Google signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white border border-[#E4EAF2] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Photo Panel */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 lg:p-10 overflow-hidden text-white bg-[#0A1F44]">
          <img
            src="/assets/images/plumber_pipes.webp"
            alt="Customer Signup"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.60] contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-[#0A1F44]/75 to-[#0A1F44]/30" />

          {/* Logo */}
          <div className="relative z-10">
            <BrandLogo variant="dark" size="md" />
          </div>

          {/* Center Content */}
          <div className="relative z-10 my-auto py-6">
            <h2 className="font-poppins text-3xl font-extrabold text-white mb-2 leading-tight">
              Create an Account
            </h2>
            <p className="text-gray-200 text-xs sm:text-sm mb-6 leading-relaxed">
              Book certified home services, track technician arrivals, and enjoy verified pricing.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-100">Verified Technicians Only</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-100">Transparent Pricing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-100">24/7 Dedicated Support</span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-gray-300">
            <span>Customer Protection</span>
            <span>🇵🇰 Across Pakistan</span>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            {/* Top Navigation Back Link */}
            <div className="mb-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B84] hover:text-[#0A1F44] transition-colors"
              >
                <ArrowLeft size={14} /> Back to Home
              </Link>
            </div>

            {/* KarigarPK Logo Centered */}
            <div className="flex items-center justify-center mb-3">
              <BrandLogo variant="light" size="md" />
            </div>

            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="font-poppins text-2xl font-bold text-[#0A1F44] mb-0.5">
                Join KarigarPK
              </h1>
              <p className="text-[#5A6B84] text-xs">
                Create your customer account in 30 seconds
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6B84]" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Usman Ali"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] placeholder-[#5A6B84] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6B84]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="usman@gmail.com"
                      required
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] placeholder-[#5A6B84] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                    Phone (03XX-XXXXXXX) *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6B84]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0300-1234567"
                      required
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] placeholder-[#5A6B84] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                  Area / Sector
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6B84]" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. DHA Phase 6"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] placeholder-[#5A6B84] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6B84]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      required
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6B84]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      required
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Google Signup */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#E4EAF2] bg-white hover:bg-gray-50 text-xs font-bold text-[#0E1E3A] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="mt-5 text-center">
              <p className="text-xs text-[#5A6B84]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#0A1F44] hover:text-[#FF7A00] font-bold">
                  Login
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
