import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, HardHat } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, googleLogin } = useContext(AuthContext)
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

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    if (!gmailRegex.test(formData.email.trim())) {
      setError('Please enter a valid Gmail address')
      setIsLoading(false)
      return
    }

    try {
      const data = await login(formData.email, formData.password)
      
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
    <div>
      <div className="bg-field-auth min-h-screen px-4 py-10 sm:py-16 md:py-20 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-gray-800 rounded-2xl p-5 sm:p-8 border border-gray-700 shadow-xl">
            <h1 className="font-poppins text-3xl font-bold text-white mb-2 text-center">
              Login to Karigar
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Welcome back! Log in to your account
            </p>

            {/* Role Toggle Tabs */}
            <div className="flex bg-gray-900 rounded-lg p-1 mb-8 border border-gray-700">
              <button
                onClick={() => { setActiveTab('customer'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === 'customer' 
                    ? 'bg-secondary text-white shadow' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <User size={16} /> Customer
              </button>
              <button
                onClick={() => { setActiveTab('karigar'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === 'karigar' 
                    ? 'bg-primary text-white shadow' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <HardHat size={16} /> Karigar
              </button>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="text-white font-semibold text-sm block mb-2">Gmail Address</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@gmail.com"
                    className="form-input !pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="text-white font-semibold text-sm block mb-2">Password</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    className="form-input !pl-10 !pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link to="/forgot-password" className="text-sm text-secondary hover:text-orange-500 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  Remember me
                </label>

              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-secondary w-full mt-6"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">or</span>
              </div>
            </div>

            {/* Social Login */}
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-700 border border-gray-700 text-white py-3 rounded-lg font-semibold transition-colors mb-3 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isLoading ? 'Logging in...' : 'Login with Google'}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-gray-400 mt-6">
              Don't have an account?{' '}
              {activeTab === 'karigar' ? (
                <Link to="/register-karigar" className="text-secondary hover:text-orange-500 font-semibold transition-colors">
                  Apply here
                </Link>
              ) : (
                <Link to="/signup" className="text-secondary hover:text-orange-500 font-semibold transition-colors">
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