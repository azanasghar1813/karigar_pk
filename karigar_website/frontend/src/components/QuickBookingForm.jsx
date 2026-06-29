import { useMemo, useState, useEffect } from 'react'
import { ChevronDown, Send } from 'lucide-react'
import api from '../config/api'

export default function QuickBookingForm() {
  const [city, setCity] = useState('Your City')
  const [area, setArea] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState('')
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [dbServices, setDbServices] = useState([])

  useEffect(() => {
    api.get('/services')
      .then(res => setDbServices(res.data))
      .catch(err => console.error('Failed to fetch services:', err))
  }, [])

  const cityAreas = {
    'Your City': ['Area 1', 'Area 2', 'Area 3', 'Area 4', 'Area 5'],
    Islamabad: ['F-6', 'F-7', 'F-10', 'G-11', 'Bahria Enclave'],
    Karachi: ['DHA', 'Clifton', 'Gulshan-e-Iqbal', 'North Nazimabad', 'Malir'],
    'Chowk Azam': ['Main Bazar', 'College Road', 'Canal Road', 'Station Road'],
    Layyah: ['Layyah City', 'Kot Sultan', 'Karor Lal Esan', 'Chobara']
  }

  const selectedCityAreas = useMemo(() => cityAreas[city] || [], [city])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const areaDisplay = area === 'other' ? address : area
      await api.post('/contact', {
        name,
        phone,
        message: `Service Request: ${service || 'Not specified'} | City: ${city} | Area: ${areaDisplay || 'Not specified'} | Address: ${address}`,
        source: 'homepage',
      })
      setIsSubmitted(true)
      setName(''); setPhone(''); setService(''); setArea(''); setAddress('')
      setTimeout(() => setIsSubmitted(false), 6000)
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-primary mb-2">
            Book your service
          </h2>
          <p className="text-slate-500 text-sm mb-6">A karigar will contact you within 30 minutes</p>

          {isSubmitted && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-5 font-semibold text-sm">
              ✅ Request received! A karigar will call you shortly.
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="+92 312-3456789"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-dark-text mb-2">Select Service</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
              >
                <option value="">Choose a service</option>
                {dbServices.map(s => (
                  <option key={s._id} value={s.name}>{s.name}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 bottom-3.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-dark-text mb-2">City</label>
              <select
                value={city}
                onChange={(e) => { setCity(e.target.value); setArea('') }}
                className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
              >
                <option>Your City</option>
                <option>Islamabad</option>
                <option>Karachi</option>
                <option>Chowk Azam</option>
                <option>Layyah</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 bottom-3.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-dark-text mb-2">Area</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
              >
                <option value="">Select area</option>
                {selectedCityAreas.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
                <option value="other">Other (write your area)</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 bottom-3.5 text-slate-500 pointer-events-none" />
            </div>

            {area === 'other' && (
              <div>
                <label className="block text-sm font-semibold text-dark-text mb-2">Your Area</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Enter your area name" />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-dark-text mb-2">Full Address (optional)</label>
              <textarea
                rows="2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Enter complete address"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl border-2 border-secondary bg-secondary text-white font-semibold shadow-md hover:bg-orange-600 transition-all disabled:opacity-70"
              >
                <Send size={16} />
                {isLoading ? 'Sending...' : 'Request a Call'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

