import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Phone, Eye, EyeOff, User, MapPin, CheckCircle2, ArrowRight } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'

export default function Signup() {
  const navigate = useNavigate()
  const { register, googleLogin } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    cnic: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    const normalizedValue = name === 'cnic'
      ? formatCnic(value)
      : name === 'phone'
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

    if (!formData.fullName || !formData.email || !formData.phone || !formData.cnic || !formData.address || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!/^3\d{2}-\d{7}$/.test(formData.phone)) {
      setError('Phone format must be: 312-3456789')
      return
    }

    if (!/^\d{5}-\d{7}-\d$/.test(formData.cnic)) {
      setError('CNIC format must be: 12345-1234567-1')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cnic: formData.cnic,
        address: formData.address,
        password: formData.password
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      
      const data = await googleLogin(idToken)
      
      if (data.role === 'admin') {
        navigate('/admin')
      } else if (data.role === 'karigar') {
        navigate('/karigar')
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message || 'Google registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1329] flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-[#131F3D] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[660px]">
        {/* Left Side: Brand Visual */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 lg:p-10 overflow-hidden text-white">
          <img
            src="/assets/images/plumber_pipes.jpg"
            alt="Customer Signup with KarigarPK"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.35]"
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

          {/* Value points */}
          <div className="relative z-10 my-auto py-8">
            <span className="inline-block px-3 py-1 bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold uppercase rounded-full mb-3 tracking-wider">
              For Homeowners & Businesses
            </span>
            <h2 className="font-poppins text-3xl font-extrabold text-white mb-3 leading-snug">
              Fast, Reliable Services at Your Doorstep
            </h2>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
              Create an account to quickly discover top-rated electricians, plumbers, AC technicians, and craftsmen in your area.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#FF6B00] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-200">Book in 3 Simple Steps</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#FF6B00] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-200">Pay Cash on Completion</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#FF6B00] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-200">100% CNIC Verified Staff</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-gray-700/60 flex items-center justify-between text-xs text-gray-400">
            <span>Customer Protection</span>
            <span>Are you a pro? <Link to="/register-karigar" className="text-[#FF6B00] hover:underline">Apply here</Link></span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#0e172e]">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <div className="md:hidden flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white text-base">
                  🔨
                </div>
                <div className="font-poppins font-black text-xl text-white">
                  Karigar<span className="text-[#FF6B00]">PK</span>
                </div>
              </div>
              <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-white mb-1.5">
                Create Your Account
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                Sign up to book verified local services across Pakistan
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-2.5 rounded-xl mb-5 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Full Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Asad Ullah"
                    className="w-full bg-[#131F3D] border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      className="w-full bg-[#131F3D] border border-gray-700 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Phone Number *</label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-700 bg-gray-900 px-2.5 text-xs text-gray-300">
                      🇵🇰
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="312-3456789"
                      className="w-full bg-[#131F3D] border border-gray-700 rounded-r-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">CNIC Number *</label>
                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    placeholder="12345-1234567-1"
                    className="w-full bg-[#131F3D] border border-gray-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Address / Sector *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. DHA Phase 5, Lahore"
                      className="w-full bg-[#131F3D] border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 chars"
                      className="w-full bg-[#131F3D] border border-gray-700 rounded-xl pl-3 pr-8 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full bg-[#131F3D] border border-gray-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-orange-500/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isLoading ? <span>Creating Account...</span> : <span>Create Customer Account</span>}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#0e172e] text-gray-400">or sign up with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-[#131F3D] hover:bg-gray-800 border border-gray-700 text-white text-xs sm:text-sm py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="text-center text-xs text-gray-400 mt-5">
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
