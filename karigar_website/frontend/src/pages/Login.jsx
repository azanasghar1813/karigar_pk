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
    <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white border border-gray-200/90 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
        
        {/* Left Side: Dark Navy Photographic Panel (matching reference image) */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 lg:p-10 overflow-hidden text-white bg-[#0A1930]">
          {/* Background image overlay */}
          <img
            src="/assets/images/electrician_panel.jpg"
            alt="Electrician Work"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1930] via-[#0A1930]/85 to-[#0A1930]/40"></div>

          {/* Logo at top */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF8A00] flex items-center justify-center text-white font-black text-lg shadow-md">
              🔨
            </div>
            <div className="font-poppins font-black text-xl tracking-tight text-white">
              Karigar<span className="text-[#FF8A00]">PK</span>
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 my-auto py-6">
            <h2 className="font-poppins text-2xl lg:text-3xl font-extrabold text-white mb-2 leading-snug">
              Welcome Back!
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Login to access your account and manage services.
            </p>

            {/* Feature Bullets (from reference image) */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF8A00]/20 flex items-center justify-center text-[#FF8A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-200">Book Services</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF8A00]/20 flex items-center justify-center text-[#FF8A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-200">Manage Bookings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF8A00]/20 flex items-center justify-center text-[#FF8A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-200">Track Your Activity</span>
              </div>
            </div>
          </div>

          {/* Bottom badge */}
          <div className="relative z-10 pt-4 border-t border-gray-700/60 text-xs text-gray-400">
            <span>Pakistan's Local Business Network</span>
          </div>
        </div>

        {/* Right Side: Clean White Form (matching reference image) */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            {/* KarigarPK Brand Logo Centered */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#FF8A00] flex items-center justify-center text-white text-base shadow">
                🔨
              </div>
              <div className="font-poppins font-black text-xl text-[#0A1930]">
                Karigar<span className="text-[#FF8A00]">PK</span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="font-poppins text-2xl font-bold text-[#0A1930] mb-1">
                Login to Your Account
              </h1>
              <p className="text-gray-500 text-xs">
                Enter your details to continue
              </p>
            </div>

            {/* Customer vs Pro Toggle */}
            <div className="flex bg-[#F1F5F9] p-1 rounded-xl mb-5 border border-gray-200">
              <button
                type="button"
                onClick={() => { setActiveTab('customer'); setError(''); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'customer'
                    ? 'bg-white text-[#0A1930] shadow-sm'
                    : 'text-gray-500 hover:text-[#0A1930]'
                }`}
              >
                <User size={14} /> Customer
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('karigar'); setError(''); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'karigar'
                    ? 'bg-[#0A1930] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#0A1930]'
                }`}
              >
                <HardHat size={14} /> Professional
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3.5 py-2 rounded-xl mb-4 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-[#0A1930] placeholder-gray-400 focus:outline-none focus:border-[#FF8A00] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-[#0A1930] placeholder-gray-400 focus:outline-none focus:border-[#FF8A00] focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#FF8A00] focus:ring-0" />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-gray-500 hover:text-[#FF8A00] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Orange Login Button (matching reference image) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-orange-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">or continue with</span>
              </div>
            </div>

            {/* Social Buttons (Google & Facebook from Reference Image) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs py-2 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => alert('Facebook sign in is being configured with Meta API.')}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs py-2 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            {/* Bottom Link */}
            <p className="text-center text-xs text-gray-500 mt-5">
              Don't have an account?{' '}
              <Link to="/register-karigar" className="text-[#0A1930] hover:text-[#FF8A00] font-bold">
                Join as a Pro
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
