import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, HardHat, CheckCircle2, ArrowRight } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginKarigar, googleLogin } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'customer') // 'customer' or 'karigar'
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!formData.email || !formData.password) {
      setError('Please fill all fields')
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const loginMethod = activeTab === 'karigar' ? loginKarigar : login
      const data = await loginMethod(formData.email.trim(), formData.password)
      
      if (data.role === 'admin') {
        navigate('/admin')
      } else if (data.role === 'karigar') {
        navigate('/karigar')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
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
      setError(err.response?.data?.message || err.message || 'Google login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1329] flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-[#131F3D] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        {/* Left Side: Brand & Visual Showcase (matching Image 2) */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 lg:p-10 overflow-hidden text-white">
          {/* Background image with deep overlay */}
          <img
            src="/assets/images/electrician_panel.jpg"
            alt="KarigarPK Work"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1329] via-[#0B1329]/80 to-transparent"></div>

          {/* Logo at top */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center text-white font-black text-xl shadow-lg">
              🔨
            </div>
            <div className="font-poppins font-black text-2xl tracking-tight">
              Karigar<span className="text-[#FF6B00]">PK</span>
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 my-auto py-8">
            <h2 className="font-poppins text-3xl font-extrabold text-white mb-3 leading-snug">
              Welcome Back!
            </h2>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
              Login to access your verified account, book skilled professionals, and track your jobs in real-time.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#FF6B00] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-200">Book Verified Services</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#FF6B00] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-200">Manage Bookings Easily</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#FF6B00] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-200">Track Work & Direct Chat</span>
              </div>
            </div>
          </div>

          {/* Bottom badge */}
          <div className="relative z-10 pt-4 border-t border-gray-700/60 flex items-center justify-between text-xs text-gray-400">
            <span>100% Verified Network</span>
            <span>🇵🇰 Across Pakistan</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#0e172e]">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="md:hidden flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white text-base">
                  🔨
                </div>
                <div className="font-poppins font-black text-xl text-white">
                  Karigar<span className="text-[#FF6B00]">PK</span>
                </div>
              </div>
              <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-white mb-1.5">
                Login to Your Account
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                Enter your details below to continue
              </p>
            </div>

            {/* Role Tabs */}
            <div className="flex bg-[#0B1329] p-1 rounded-xl mb-6 border border-gray-800">
              <button
                type="button"
                onClick={() => { setActiveTab('customer'); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'customer'
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User size={15} /> Customer
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('karigar'); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'karigar'
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <HardHat size={15} /> Professional / Karigar
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-2.5 rounded-xl mb-5 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-[#131F3D] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#FF6B00] hover:text-orange-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full bg-[#131F3D] border border-gray-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-gray-900 text-[#FF6B00] focus:ring-0" />
                  <span>Remember me on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#0e172e] text-gray-400">or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-[#131F3D] hover:bg-gray-800 border border-gray-700 text-white text-xs sm:text-sm py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2.5 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Login with Google</span>
            </button>

            {/* Bottom Link */}
            <p className="text-center text-xs text-gray-400 mt-6">
              Don't have an account?{' '}
              {activeTab === 'karigar' ? (
                <Link to="/register-karigar" className="text-[#FF6B00] hover:underline font-semibold">
                  Join as a Pro
                </Link>
              ) : (
                <Link to="/signup" className="text-[#FF6B00] hover:underline font-semibold">
                  Sign up here
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
