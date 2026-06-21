import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, HardHat } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useContext(AuthContext)
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
            <button type="button" className="w-full bg-gray-900 hover:bg-gray-700 border border-gray-700 text-white py-3 rounded-lg font-semibold transition-colors mb-3">
              Login with Google
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