import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Phone, Eye, EyeOff, User, FileText, MapPin, HardHat, ArrowRight } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { register } = useContext(AuthContext)
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