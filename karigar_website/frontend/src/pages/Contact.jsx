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
    
    // Validation
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
    <div>

      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary to-blue-900 text-white py-12 px-4">
        <div className="container">
          <h1 className="font-poppins text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg">We're here to help! Reach out to our support team anytime</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4 bg-field-contact min-h-screen">
        <div className="container max-w-6xl">
          
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            
            {/* Phone Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-secondary transition-colors">
              <div className="text-secondary text-4xl mb-4 flex justify-center">
                <Phone size={40} />
              </div>
              <h3 className="font-poppins font-bold text-white mb-2 text-center">Phone</h3>
              <p className="text-gray-400 mb-3 text-center text-sm">Call us anytime</p>
              <a 
                href={`tel:${SITE_PHONE_E164}`}
                className="text-secondary hover:text-orange-500 font-semibold transition-colors block text-center"
              >
                {SITE_PHONE_DISPLAY}
              </a>
              <p className="text-gray-500 text-xs mt-3 text-center">Mon-Sat: 9AM - 9PM</p>
            </div>

            {/* Email Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-secondary transition-colors">
              <div className="text-secondary text-4xl mb-4 flex justify-center">
                <Mail size={40} />
              </div>
              <h3 className="font-poppins font-bold text-white mb-2 text-center">Email</h3>
              <p className="text-gray-400 mb-3 text-center text-sm">Send us an email</p>
              <a 
                href="mailto:karigarpk.live@gmail.com" 
                className="text-secondary hover:text-orange-500 font-semibold transition-colors block text-center break-all"
              >
                karigarpk.live@gmail.com
              </a>
              <p className="text-gray-500 text-xs mt-3 text-center">Response within 24 hours</p>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-secondary transition-colors">
              <div className="text-green-500 text-4xl mb-4 flex justify-center">
                <MessageCircle size={40} />
              </div>
              <h3 className="font-poppins font-bold text-white mb-2 text-center">WhatsApp</h3>
              <p className="text-gray-400 mb-3 text-center text-sm">Chat with us live</p>
              <a 
                href={`https://wa.me/${SITE_PHONE_WA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 font-semibold transition-colors block text-center"
              >
                {SITE_PHONE_DISPLAY}
              </a>
              <p className="text-gray-500 text-xs mt-3 text-center">Instant response</p>
            </div>

            {/* Address Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-secondary transition-colors">
              <div className="text-secondary text-4xl mb-4 flex justify-center">
                <MapPin size={40} />
              </div>
              <h3 className="font-poppins font-bold text-white mb-2 text-center">Address</h3>
              <p className="text-gray-400 mb-3 text-center text-sm">Visit us</p>
              <address className="text-secondary font-semibold transition-colors block text-center not-italic">
                Lahore, Pakistan
              </address>
              <p className="text-gray-500 text-xs mt-3 text-center">Available for site visits</p>
            </div>
          </div>

          {/* Main Contact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <h2 className="font-poppins text-2xl font-bold text-white mb-2">Send us a Message</h2>
                <p className="text-gray-400 mb-6">Fill out the form below and we'll get back to you as soon as possible</p>

                {/* Success Message */}
                {isSubmitted && (
                  <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-4 rounded-lg mb-6 flex items-center gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <p className="font-semibold">Thank you for contacting us!</p>
                      <p className="text-sm">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                    <span className="text-lg">✕</span>
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-white font-semibold text-sm block mb-2">
                        Full Name <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="text-white font-semibold text-sm block mb-2">
                        Email <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-white font-semibold text-sm block mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03427066034"
                      className="form-input"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-white font-semibold text-sm block mb-2">
                      Subject <span className="text-secondary">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">Select a subject</option>
                      <option value="general-inquiry">General Inquiry</option>
                      <option value="booking-issue">Booking Issue</option>
                      <option value="quality-complaint">Quality Complaint</option>
                      <option value="payment-issue">Payment Issue</option>
                      <option value="become-karigar">Become a Karigar</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-white font-semibold text-sm block mb-2">
                      Message <span className="text-secondary">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className="form-input resize-none"
                    ></textarea>
                    <p className="text-gray-500 text-xs mt-1">
                      {formData.message.length}/500 characters
                    </p>
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-3 text-gray-300">
                    <input 
                      type="checkbox" 
                      required
                      className="w-5 h-5 rounded border-gray-600 bg-gray-700 mt-1 cursor-pointer" 
                    />
                    <span className="text-sm">
                      I agree to the privacy policy and terms & conditions
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn-secondary w-full flex items-center justify-center gap-2 py-3 font-semibold ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                  >
                    <Send size={20} />
                    {isLoading ? (
                      <>
                        <span className="inline-block animate-spin">⏳</span>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar - Support Info */}
            <div className="lg:col-span-1">
              
              {/* Support Hours */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="text-secondary" size={24} />
                  <h3 className="font-poppins font-bold text-white">Support Hours</h3>
                </div>
                <div className="space-y-2 text-gray-300 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-semibold">9 AM - 9 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-semibold">10 AM - 8 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-semibold">By Appointment</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-4 border-t border-gray-700 pt-4">
                  ⚡ Emergency support available 24/7 via WhatsApp
                </p>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="font-poppins font-bold text-white mb-4">Quick Help</h3>
                <div className="space-y-3">
                  <a 
                    href="#faq" 
                    className="block text-secondary hover:text-orange-500 text-sm font-semibold transition-colors"
                  >
                    → Frequently Asked Questions
                  </a>
                  <a 
                    href="#booking-help" 
                    className="block text-secondary hover:text-orange-500 text-sm font-semibold transition-colors"
                  >
                    → How to Book a Service
                  </a>
                  <a 
                    href="#payment-help" 
                    className="block text-secondary hover:text-orange-500 text-sm font-semibold transition-colors"
                  >
                    → Payment & Refunds
                  </a>
                  <a 
                    href="#join-karigar" 
                    className="block text-secondary hover:text-orange-500 text-sm font-semibold transition-colors"
                  >
                    → Join as Karigar
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-8 text-white text-center shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <MessageCircle size={32} />
              <h3 className="font-poppins text-2xl font-bold">Need Quick Help?</h3>
            </div>
            <p className="mb-6 text-gray-100">Chat with us directly on WhatsApp for immediate assistance. We respond within minutes!</p>
            <a
              href={`https://wa.me/${SITE_PHONE_WA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:shadow-lg transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.935 1.286c-1.504.896-2.803 2.325-3.43 3.996-.626 1.671-.635 3.472-.01 5.167.624 1.695 1.922 3.124 3.426 4.02 1.504.896 3.231 1.286 4.935 1.286h.005c1.704 0 3.431-.39 4.935-1.286 1.504-.896 2.803-2.325 3.43-3.996.626-1.671.635-3.472.01-5.167-.624-1.695-1.922-3.124-3.426-4.02-1.503-.896-3.23-1.286-4.934-1.286zm11.615-2.656A11.953 11.953 0 0012 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Chat on WhatsApp Now
            </a>
          </div>

          {/* Info Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            
            {/* Response Time Info */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
              <h3 className="font-poppins font-bold text-white mb-2">📬 Response Time</h3>
              <p className="text-gray-300 text-sm">
                We typically respond to all inquiries within 24 hours. For urgent matters, please use WhatsApp for immediate assistance.
              </p>
            </div>

            {/* Data Security Info */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
              <h3 className="font-poppins font-bold text-white mb-2">🔒 Your Privacy</h3>
              <p className="text-gray-300 text-sm">
                Your information is safe with us. We never share your data with third parties and comply with all privacy regulations.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}