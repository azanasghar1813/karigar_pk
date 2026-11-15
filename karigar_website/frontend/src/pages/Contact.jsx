import { useState } from 'react'
import { Phone, Mail, MapPin, Send, Clock, MessageCircle } from 'lucide-react'
import { SITE_PHONE_DISPLAY, SITE_PHONE_E164, SITE_PHONE_WA } from '../config/site'
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
    setFormData({
      ...formData,
      [name]: value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!formData.email.trim()) {
      setError('Please enter your email')
      return
    }
    if (!formData.subject.trim()) {
      setError('Please enter subject')
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
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        source: 'contact_page',
      })
      setIsSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setIsSubmitted(false), 6000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0A1930]">

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-[#FF8A00] text-xs font-bold uppercase tracking-widest block mb-1.5">Customer Care</span>
          <h1 className="font-poppins text-3xl sm:text-5xl font-black text-[#0A1930] mb-2">Contact Us</h1>
          <p className="text-gray-500 text-sm sm:text-base">We're here to help! Reach out to our dedicated support team anytime</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-10 sm:py-14 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            
            {/* Phone Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm hover:border-[#FF8A00] transition-colors">
              <div className="text-[#FF8A00] mb-3 flex justify-center">
                <Phone size={32} />
              </div>
              <h3 className="font-poppins font-bold text-[#0A1930] mb-1 text-center text-sm">Phone Helpline</h3>
              <p className="text-gray-400 mb-2 text-center text-xs">Direct call support</p>
              <a 
                href={`tel:${SITE_PHONE_E164}`}
                className="text-[#FF8A00] hover:text-[#E67A00] font-bold transition-colors block text-center text-sm"
              >
                {SITE_PHONE_DISPLAY}
              </a>
              <p className="text-gray-400 text-[11px] mt-2 text-center">Mon-Sat: 9AM - 9PM</p>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm hover:border-[#FF8A00] transition-colors">
              <div className="text-[#102747] mb-3 flex justify-center">
                <Mail size={32} />
              </div>
              <h3 className="font-poppins font-bold text-[#0A1930] mb-1 text-center text-sm">Email Inquiries</h3>
              <p className="text-gray-400 mb-2 text-center text-xs">Official correspondence</p>
              <a 
                href="mailto:karigarpk.live@gmail.com" 
                className="text-[#0A1930] hover:text-[#FF8A00] font-semibold transition-colors block text-center break-all text-xs"
              >
                karigarpk.live@gmail.com
              </a>
              <p className="text-gray-400 text-[11px] mt-2 text-center">Fast response within 24h</p>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm hover:border-emerald-500 transition-colors">
              <div className="text-[#25D366] mb-3 flex justify-center">
                <MessageCircle size={32} />
              </div>
              <h3 className="font-poppins font-bold text-[#0A1930] mb-1 text-center text-sm">WhatsApp Chat</h3>
              <p className="text-gray-400 mb-2 text-center text-xs">Chat with us live</p>
              <a 
                href={`https://wa.me/${SITE_PHONE_WA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:text-green-600 font-bold transition-colors block text-center text-sm"
              >
                {SITE_PHONE_DISPLAY}
              </a>
              <p className="text-gray-400 text-[11px] mt-2 text-center">Instant response</p>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm hover:border-[#FF8A00] transition-colors">
              <div className="text-[#FF8A00] mb-3 flex justify-center">
                <MapPin size={32} />
              </div>
              <h3 className="font-poppins font-bold text-[#0A1930] mb-1 text-center text-sm">Head Office</h3>
              <p className="text-gray-400 mb-2 text-center text-xs">Pakistan</p>
              <address className="text-[#0A1930] font-semibold transition-colors block text-center not-italic text-xs">
                Lahore, Punjab, Pakistan
              </address>
              <p className="text-gray-400 text-[11px] mt-2 text-center">Operations nationwide</p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-poppins text-2xl font-bold text-[#0A1930] mb-1 text-center">Send us a Message</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6 text-center">Fill out the form below and our team will get back to you promptly.</p>

            {isSubmitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-5 text-xs sm:text-sm text-center">
                ✓ Message sent successfully! Our team will contact you shortly.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-xs sm:text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="312-3456789"
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Inquiry about..."
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Message *</label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you today?"
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl p-3 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] focus:bg-white"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-orange-500/25 disabled:opacity-50"
              >
                {isLoading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
