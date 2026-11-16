import { useState } from 'react'
import { Phone, Mail, MapPin, Send, Clock, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { SITE_PHONE_DISPLAY, SITE_PHONE_E164, SITE_PHONE_WA, SITE_EMAIL } from '../config/site'
import api from '../config/api'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address')
      return
    }
    if (!formData.subject.trim()) {
      setError('Please select or enter a subject')
      return
    }
    if (!formData.message.trim()) {
      setError('Please enter your message')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await api.post('/leads', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        source: 'contact_page',
      })
      setIsSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setIsSubmitted(false), 8000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please reach us directly via helpline or WhatsApp.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#F5F7FB] min-h-screen text-[#0E1E3A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-2">
            Customer Care & Helpline
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl font-extrabold text-[#0A1F44] mb-3 tracking-tight">
            Contact KarigarPK
          </h1>
          <p className="text-[#5A6B84] text-sm sm:text-base leading-relaxed">
            Have questions about booking, technician onboarding, or corporate facilities? Reach out to our 24/7 dedicated support team.
          </p>
        </div>

        {/* Contact Info 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          
          {/* Phone Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E4EAF2] shadow-sm hover:border-[#FF7A00]/50 transition-all text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7A00] flex items-center justify-center mx-auto mb-3">
              <Phone size={22} />
            </div>
            <h3 className="font-poppins font-bold text-[#0A1F44] mb-1 text-sm">Direct Helpline</h3>
            <p className="text-[#5A6B84] mb-2 text-xs">Call our dispatch desk</p>
            <a 
              href={`tel:${SITE_PHONE_E164}`}
              className="text-[#FF7A00] hover:text-[#F06400] font-bold text-sm transition-colors"
            >
              {SITE_PHONE_DISPLAY}
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E4EAF2] shadow-sm hover:border-[#22C55E]/50 transition-all text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#22C55E] flex items-center justify-center mx-auto mb-3">
              <MessageCircle size={22} />
            </div>
            <h3 className="font-poppins font-bold text-[#0A1F44] mb-1 text-sm">WhatsApp Chat</h3>
            <p className="text-[#5A6B84] mb-2 text-xs">Instant messaging</p>
            <a 
              href={`https://wa.me/${SITE_PHONE_WA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22C55E] hover:underline font-bold text-sm"
            >
              Start Chat →
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E4EAF2] shadow-sm hover:border-[#FF7A00]/50 transition-all text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0A1F44] flex items-center justify-center mx-auto mb-3">
              <Mail size={22} />
            </div>
            <h3 className="font-poppins font-bold text-[#0A1F44] mb-1 text-sm">Official Email</h3>
            <p className="text-[#5A6B84] mb-2 text-xs">Support & inquiries</p>
            <a 
              href={`mailto:${SITE_EMAIL}`}
              className="text-[#0A1F44] hover:text-[#FF7A00] font-bold text-xs truncate block"
            >
              {SITE_EMAIL}
            </a>
          </div>

          {/* Location HQ */}
          <div className="bg-white rounded-3xl p-6 border border-[#E4EAF2] shadow-sm hover:border-[#FF7A00]/50 transition-all text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <MapPin size={22} />
            </div>
            <h3 className="font-poppins font-bold text-[#0A1F44] mb-1 text-sm">Headquarters</h3>
            <p className="text-[#5A6B84] mb-2 text-xs">Principal Office</p>
            <p className="text-xs font-semibold text-[#0A1F44]">Lahore, Punjab, Pakistan</p>
          </div>

        </div>

        {/* Contact Form Section */}
        <div className="bg-white border border-[#E4EAF2] rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto shadow-[0_8px_30px_rgba(10,31,68,0.06)]">
          <h2 className="font-poppins font-bold text-xl sm:text-2xl text-[#0A1F44] mb-1">
            Send Us a Message
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B84] mb-6">
            Fill out the form below and our customer representative will respond shortly.
          </p>

          {isSubmitted && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#22C55E] flex-shrink-0" />
              <span>Thank you! Your message has been submitted. Our team will get back to you soon.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0300-1234567"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Service inquiry / Support"
                  required
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                Your Message *
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we assist you?"
                required
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] focus:bg-white transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{isLoading ? 'Sending...' : 'Send Message'}</span>
              <Send size={14} />
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
