import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Phone, Eye, EyeOff, User, FileText, MapPin, HardHat, ArrowRight } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'

export default function Signup() {
  const navigate = useNavigate()
  const { register, googleLogin } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    cnic: '',
    address: '',
    phone: '',
    otp: '',
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
      setError('Please fill all required fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!/^3\d{2}-\d{7}$/.test(formData.phone)) {
      setError('Use phone format: 312-3456789')
      return
    }

    if (!/^\d{5}-\d{7}-\d$/.test(formData.cnic)) {
      setError('Use CNIC format: 12345-1234567-1')
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
    <div>

      <div className="bg-field-auth min-h-screen px-4 py-10 sm:py-16 md:py-20 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-gray-800 rounded-2xl p-5 sm:p-8 border border-gray-700 shadow-xl">
            <h1 className="font-poppins text-3xl font-bold text-white mb-2 text-center">
              Create Your Profile
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Sign up to create your profile and book services easily
            </p>

            {/* Role Toggle Tabs */}
            <div className="flex bg-gray-900 rounded-lg p-1 mb-8 border border-gray-700">
              <button
                onClick={() => setActiveTab('customer')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === 'customer' 
                    ? 'bg-secondary text-white shadow' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <User size={16} /> Customer
              </button>
              <button
                onClick={() => setActiveTab('karigar')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === 'karigar' 
                    ? 'bg-primary text-white shadow' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <HardHat size={16} /> Karigar
              </button>
            </div>

            {activeTab === 'karigar' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
                  <HardHat size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Join our Workforce</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Karigar accounts require verification of skills. Please proceed to our dedicated Karigar portal to apply.
                </p>
                <Link to="/join-karigar" className="btn-primary w-full flex justify-center items-center gap-2">
                  Apply as Karigar <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white font-semibold text-sm block mb-2">Full Name</label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="form-input !pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="text-white font-semibold text-sm block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      id="signup-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="form-input !pl-10"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white font-semibold text-sm block mb-2">CNIC Number</label>
                  <div className="relative">
                    <FileText size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      name="cnic"
                      value={formData.cnic}
                      onChange={handleChange}
                      placeholder="12345-1234567-1"
                      className="form-input !pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white font-semibold text-sm block mb-2">Address</label>
                  <div className="relative">
                    <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Your full address"
                      className="form-input !pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-phone" className="text-white font-semibold text-sm block mb-2">Phone Number</label>
                  <div className="relative flex">
                    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-600 bg-gray-900 px-3 text-sm text-gray-300">
                      🇵🇰 +92
                    </span>
                    <input
                      id="signup-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="312-3456789"
                      className="form-input rounded-l-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-password" className="text-white font-semibold text-sm block mb-2">Password</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="form-input !pl-10 !pr-10"
                      autoComplete="new-password"
                      required
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
                </div>

                <div>
                  <label htmlFor="signup-confirm-password" className="text-white font-semibold text-sm block mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      id="signup-confirm-password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className="form-input !pl-10"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>

                <label className="flex items-center gap-2 text-gray-300 text-sm">
                  <input type="checkbox" required className="w-4 h-4 rounded" />
                  I agree to Terms & Conditions
                </label>

                <button type="submit" disabled={isLoading} className="btn-secondary w-full mt-6 flex justify-center items-center">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">or</span>
                  </div>
                </div>

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
                  {isLoading ? 'Creating Account...' : 'Continue with Google'}
                </button>
              </form>
            </>
            )}

            {/* Login Link */}
            <p className="text-center text-gray-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary hover:text-orange-500 font-semibold transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}