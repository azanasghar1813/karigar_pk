import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, HardHat, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'
import BrandLogo from '../components/BrandLogo'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginKarigar, googleLogin } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
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
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white border border-[#E4EAF2] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
        
        {/* Left Side: Dark Navy Photographic Panel (matching Reference 2 "Login Page") */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 lg:p-10 overflow-hidden text-white bg-[#0A1F44]">
          {/* Brightened Background image */}
          <img
            src="/assets/images/electrician_panel.webp"
            alt="Verified Karigar at Work"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.60] contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-[#0A1F44]/75 to-[#0A1F44]/30" />

          {/* Logo at top */}
          <div className="relative z-10">
            <BrandLogo variant="dark" size="md" />
          </div>

          {/* Center Welcome */}
          <div className="relative z-10 my-auto py-6">
            <h2 className="font-poppins text-3xl font-extrabold text-white mb-2 leading-tight">
              Welcome Back!
            </h2>
            <p className="text-gray-200 text-xs sm:text-sm mb-6 leading-relaxed">
              Login to access your account and manage services.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-100">Book Services</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-100">Manage Bookings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
                  <CheckCircle2 size={15} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-100">Track Your Activity</span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-gray-300">
            <span>Verified Pro Network</span>
            <span>🇵🇰 Across Pakistan</span>
          </div>
        </div>

        {/* Right Side: Clean White Form Panel (matching Reference 2 "Login Page") */}
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
                Login to Your Account
              </h1>
              <p className="text-[#5A6B84] text-xs">
                Enter your details to continue
              </p>
            </div>

            {/* Customer vs Professional Toggle */}
            <div className="flex bg-[#F7F9FC] p-1 rounded-xl mb-5 border border-[#E4EAF2]">
              <button
                type="button"
                onClick={() => setActiveTab('customer')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'customer'
                    ? 'bg-white text-[#0A1F44] shadow-sm'
                    : 'text-[#5A6B84] hover:text-[#0A1F44]'
                }`}
              >
                <User size={13} /> Customer
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('karigar')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'karigar'
                    ? 'bg-white text-[#0A1F44] shadow-sm'
                    : 'text-[#5A6B84] hover:text-[#0A1F44]'
                }`}
              >
                <HardHat size={13} /> Professional
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6B84]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] placeholder-[#5A6B84] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6B84]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] placeholder-[#5A6B84] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6B84] hover:text-[#0A1F44]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#5A6B84]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#E4EAF2] text-[#FF7A00] focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="font-bold text-[#0A1F44] hover:text-[#FF7A00] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Orange Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing in...' : 'Login'}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Social Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px bg-[#E4EAF2] flex-1" />
              <span className="text-[11px] font-semibold text-[#5A6B84] uppercase tracking-wider">
                or continue with
              </span>
              <div className="h-px bg-[#E4EAF2] flex-1" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#E4EAF2] bg-white hover:bg-gray-50 text-xs font-bold text-[#0E1E3A] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => setError('Facebook login is currently disabled for security. Please use Google or Email.')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#E4EAF2] bg-white hover:bg-gray-50 text-xs font-bold text-[#0E1E3A] transition-colors"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-1">
              <p className="text-xs text-[#5A6B84]">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#0A1F44] hover:text-[#FF7A00] font-bold">
                  Sign up
                </Link>
              </p>
              <p className="text-xs text-[#5A6B84]">
                Are you a technician?{' '}
                <Link to="/register-karigar" className="text-[#FF7A00] hover:text-[#F06400] font-bold">
                  Join as a Pro
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
