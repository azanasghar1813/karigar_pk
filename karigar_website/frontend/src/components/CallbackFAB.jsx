import { useState } from 'react'
import { Phone, X, MessageSquare } from 'lucide-react'
import api from '../config/api'

export default function CallbackFAB() {
  const [isOpen, setIsOpen] = useState(false)
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
    if (isSubmitting) return; // Prevent double click
    
    if (!formData.name || !formData.phone || !formData.service) {
      showToast('Please fill all fields', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      await api.post('/leads', {
        name: formData.name,
        email: formData.phone + '@phone.local', // Dummy email if required by backend
        phone: formData.phone,
        service: formData.service,
        message: 'Requested a callback via FAB',
        source: 'callback_fab'
      })
      showToast('Request sent! We will call you back shortly.')
      setIsOpen(false)
      setFormData({ name: '', phone: '', service: '' })
    } catch (error) {
      showToast('Failed to send request. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-xl text-white text-sm animate-fade-in ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.message}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-secondary text-white p-4 rounded-full shadow-2xl hover:bg-orange-600 hover:scale-105 transition-all z-40 flex items-center justify-center group"
        aria-label="Request Callback"
      >
        {isOpen ? (
          <X size={28} className="animate-in fade-in zoom-in duration-200" />
        ) : (
          <MessageSquare size={28} className="animate-in fade-in zoom-in duration-200" />
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] max-w-[340px] bg-white rounded-2xl shadow-2xl z-40 animate-slide-in border border-slate-100 overflow-hidden">
          <div className="bg-primary text-white p-5">
            <h3 className="font-poppins font-bold text-lg flex items-center gap-2">
              <Phone size={20} className="text-secondary" />
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
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary"
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
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Service Needed</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
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
              className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors mt-2"
            >
              {isSubmitting ? 'Sending...' : 'Request Callback'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
