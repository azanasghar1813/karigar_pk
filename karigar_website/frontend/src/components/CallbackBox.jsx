import { useState } from 'react'
import { Phone } from 'lucide-react'
import api from '../config/api'

export default function CallbackBox() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const services = [
    'Electrician',
    'Plumber',
    'Carpenter',
    'Painter',
    'AC Repair',
    'Locksmith',
    'CCTV Install',
    'General Repair'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return;

    if (!formData.name || !formData.phone || !formData.service) {
      showToast('Please fill all fields', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      await api.post('/leads', {
        name: formData.name,
        phone: formData.phone,
        service: formData.service,
        message: 'Requested a callback via Homepage Form',
        source: 'homepage'
      })
      showToast('Request sent! We will call you back shortly.')
      setFormData({ name: '', phone: '', service: '' })
    } catch (error) {
      showToast('Failed to send request. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md ml-auto border border-slate-100">
      {toast && (
        <div className={`px-4 py-3 text-white text-sm text-center font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.message}
        </div>
      )}
      
      <div className="bg-primary text-white p-5">
        <h3 className="font-poppins font-bold text-xl flex items-center gap-2">
          <Phone size={24} className="text-secondary" />
          Request a Callback
        </h3>
        <p className="text-sm text-blue-200 mt-1">Leave your details and we'll call you right back.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="Ali Khan"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary text-slate-800"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="0300 1234567"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary text-slate-800"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Service Needed</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary bg-white text-slate-800"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            required
          >
            <option value="" disabled>Select a service</option>
            {services.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors mt-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Request Callback'}
        </button>
      </form>
    </div>
  )
}
