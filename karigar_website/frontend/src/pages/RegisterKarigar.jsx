import { useState, useEffect } from 'react'
import api from '../config/api'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Upload, Eye, EyeOff } from 'lucide-react'

export default function RegisterKarigar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedService = searchParams.get('service')
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    otp: '',
    city: 'Your City',
    services: preselectedService ? [preselectedService] : [],
    cnicNumber: '',
    cnicFrontFile: null,
    cnicBackFile: null,
    profilePhoto: null,
    bio: '',
    experience: '',
    email: '',
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
  const [dbServices, setDbServices] = useState([])

  useEffect(() => {
    api.get('/services')
      .then(res => setDbServices(res.data))
      .catch(err => console.error('Failed to fetch services:', err))
  }, [])

  const cities = ['Your City', 'Islamabad', 'Karachi', 'Chowk Azam', 'Layyah']

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

  const handleServiceToggle = (service) => {
    setFormData({
      ...formData,
      services: formData.services.includes(service)
        ? formData.services.filter(s => s !== service)
        : [...formData.services, service]
    })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      })
      // Create preview URL
      setPreviews({
        ...previews,
        [name]: URL.createObjectURL(files[0])
      })
    }
  }

  const handleNextStep = async (e) => {
    e.preventDefault()
    if (step === 1) {
      if (!formData.fullName || !formData.phone || !formData.email || formData.services.length === 0) {
        setError('Please fill all required fields')
        return
      }
      if (!/^3\d{2}-\d{7}$/.test(formData.phone)) {
        setError('Use phone format: 312-3456789')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!formData.cnicNumber || !formData.cnicFrontFile || !formData.cnicBackFile || !formData.profilePhoto || !formData.password || !formData.confirmPassword) {
        setError('Please complete all required fields and uploads')
        return
      }
      if (!/^\d{5}-\d{7}-\d$/.test(formData.cnicNumber)) {
        setError('Please enter valid CNIC format: 12345-1234567-1')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
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
        data.append('bio', formData.bio)
        data.append('experience', formData.experience)
        data.append('password', formData.password)
        
        if (formData.cnicFrontFile) data.append('cnicFrontFile', formData.cnicFrontFile)
        if (formData.cnicBackFile) data.append('cnicBackFile', formData.cnicBackFile)
        if (formData.profilePhoto) data.append('profilePhoto', formData.profilePhoto)

        const res = await api.post('/karigars/register', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        // On success
        localStorage.setItem('karigarUser', JSON.stringify(res.data))
        navigate('/')
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div>

      <div className="py-8 sm:py-12 px-4 bg-field-workers min-h-screen">
        <div className="container max-w-2xl">
          <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-white mb-2">Register as Karigar</h1>
          <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
            {preselectedService
              ? `Complete your registration to join as ${preselectedService}`
              : 'Start earning by providing home services'}
          </p>

          <div className="flex gap-4 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-lg ${s <= step ? 'bg-secondary' : 'bg-gray-700'}`}></div>
            ))}
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-gray-800 rounded-2xl p-4 sm:p-8 border border-gray-700">
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <h2 className="font-poppins font-bold text-white text-lg sm:text-xl mb-4 sm:mb-6">Basic Information</h2>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full name" className="form-input" required />
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-600 bg-gray-900 px-3 text-sm text-gray-300">🇵🇰 +92</span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="312-3456789" className="form-input rounded-l-none" required />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className="form-input" required />
                <select name="city" value={formData.city} onChange={handleChange} className="form-input" required>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                <div>
                  <label className="text-white font-semibold text-sm block mb-3 sm:mb-4">Select Your Services *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dbServices.length === 0 ? (
                      <div className="text-gray-400 text-sm">Loading services...</div>
                    ) : (
                      dbServices.map((service) => (
                        <label key={service._id} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.services.includes(service.name)} onChange={() => handleServiceToggle(service.name)} className="w-5 h-5 rounded border-gray-600 bg-gray-700" />
                          <span className="text-gray-300">{service.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <button type="submit" className="w-full rounded-xl bg-secondary px-4 py-3 text-white font-semibold hover:bg-orange-600 transition-colors">Next</button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <h2 className="font-poppins font-bold text-white text-lg sm:text-xl mb-4 sm:mb-6">CNIC & Account Setup</h2>
                <div>
                  <label className="text-white font-semibold text-sm block mb-2">CNIC Number *</label>
                  <input type="text" name="cnicNumber" value={formData.cnicNumber} onChange={handleChange} placeholder="12345-1234567-1" className="form-input" required />
                </div>

                <label className={`border-2 border-dashed ${formData.cnicFrontFile ? 'border-secondary' : 'border-gray-600'} rounded-lg p-4 sm:p-6 cursor-pointer hover:border-secondary transition-colors block relative overflow-hidden`}>
                  <input type="file" name="cnicFrontFile" onChange={handleFileChange} accept="image/*" className="hidden" />
                  {previews.cnicFrontFile ? (
                    <div className="text-center">
                      <img src={previews.cnicFrontFile} alt="CNIC Front Preview" className="mx-auto max-h-32 rounded-lg mb-2 object-contain" />
                      <p className="text-secondary text-xs sm:text-sm font-semibold">Change Image</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload size={28} className="mx-auto text-gray-400 mb-2 sm:w-8 sm:h-8" />
                      <p className="text-gray-300 text-sm sm:text-base">Upload CNIC Front Side *</p>
                    </div>
                  )}
                </label>

                <label className={`border-2 border-dashed ${formData.cnicBackFile ? 'border-secondary' : 'border-gray-600'} rounded-lg p-4 sm:p-6 cursor-pointer hover:border-secondary transition-colors block relative overflow-hidden`}>
                  <input type="file" name="cnicBackFile" onChange={handleFileChange} accept="image/*" className="hidden" />
                  {previews.cnicBackFile ? (
                    <div className="text-center">
                      <img src={previews.cnicBackFile} alt="CNIC Back Preview" className="mx-auto max-h-32 rounded-lg mb-2 object-contain" />
                      <p className="text-secondary text-xs sm:text-sm font-semibold">Change Image</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload size={28} className="mx-auto text-gray-400 mb-2 sm:w-8 sm:h-8" />
                      <p className="text-gray-300 text-sm sm:text-base">Upload CNIC Back Side *</p>
                    </div>
                  )}
                </label>

                <label className={`border-2 border-dashed ${formData.profilePhoto ? 'border-secondary' : 'border-gray-600'} rounded-lg p-4 sm:p-6 cursor-pointer hover:border-secondary transition-colors block relative overflow-hidden`}>
                  <input type="file" name="profilePhoto" onChange={handleFileChange} accept="image/*" className="hidden" />
                  {previews.profilePhoto ? (
                    <div className="text-center">
                      <img src={previews.profilePhoto} alt="Profile Photo Preview" className="mx-auto w-24 h-24 rounded-full mb-2 object-cover" />
                      <p className="text-secondary text-xs sm:text-sm font-semibold">Change Image</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload size={28} className="mx-auto text-gray-400 mb-2 sm:w-8 sm:h-8" />
                      <p className="text-gray-300 text-sm sm:text-base">Upload Profile Photo *</p>
                    </div>
                  )}
                </label>

                <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell customers about your experience" rows={3} className="form-input" />
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience in years" className="form-input" />

                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create password" className="form-input !pr-10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" className="form-input" required />

                <div className="flex gap-3 mt-6">
                  <button type="button" disabled={isLoading} onClick={() => setStep(1)} className="w-full rounded-xl border-2 border-primary px-4 py-3 text-primary hover:bg-primary hover:text-white transition-colors">Back</button>
                  <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-secondary px-4 py-3 text-white font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center">
                    {isLoading ? 'Registering...' : 'Register as Karigar'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="text-center text-gray-400 mt-6">
            Already registered? <Link to="/login" className="text-secondary hover:text-orange-500 font-semibold">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}