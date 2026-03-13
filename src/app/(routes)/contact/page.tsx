'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  User,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Package,
  CreditCard,
  Truck,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    orderNumber: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('contact')
  const [selectedSubject, setSelectedSubject] = useState('general')

  const subjects = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'order', label: 'Order Status' },
    { value: 'product', label: 'Product Question' },
    { value: 'delivery', label: 'Delivery Issue' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (formData.phone && !/^[\d\s\+\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }

    if (!formData.subject) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setLoading(true)

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        orderNumber: ''
      })
      setSelectedSubject('general')
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Support',
      details: '+1 (555) 123-4567',
      subdetails: 'Mon-Fri, 9am-6pm',
      action: 'Call Now',
      link: 'tel:+15551234567',
      color: 'green'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@milkshop.com',
      subdetails: '24/7 Support',
      action: 'Send Email',
      link: 'mailto:hello@milkshop.com',
      color: 'blue'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Dairy Lane',
      subdetails: 'Farmington, CA 12345',
      action: 'Get Directions',
      link: 'https://maps.google.com/?q=123+Dairy+Lane+Farmington+CA',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon - Sat: 8am - 8pm',
      subdetails: 'Sunday: 9am - 5pm',
      action: 'View Hours',
      link: '#hours',
      color: 'orange'
    }
  ]

  const faqs = [
    {
      question: 'How fresh are your products?',
      answer: 'All our products are delivered within 24 hours of production. We maintain cold chain throughout delivery to ensure maximum freshness.'
    },
    {
      question: 'What is your delivery area?',
      answer: 'We currently deliver within a 50-mile radius of our farms. You can check delivery availability by entering your zip code.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only deliver within the continental United States. We\'re working on expanding internationally!'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer 100% satisfaction guarantee. If you\'re not happy with any product, contact us within 24 hours for a full refund.'
    }
  ]

  const quickHelp = [
    {
      icon: Package,
      title: 'Track Order',
      description: 'Check your order status',
      link: '/track-order'
    },
    {
      icon: CreditCard,
      title: 'Payment Issues',
      description: 'Get help with payments',
      link: '/help/payment'
    },
    {
      icon: Truck,
      title: 'Delivery Info',
      description: 'Learn about delivery',
      link: '/help/delivery'
    },
    {
      icon: RefreshCw,
      title: 'Returns',
      description: 'Start a return',
      link: '/help/returns'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20" />
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float animation-delay-2000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {/* Breadcrumb */}
          <nav className="flex justify-center items-center space-x-2 text-sm mb-6">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-white/50" />
            <span className="text-white font-semibold">Contact Us</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Touch With Us
            </span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Have questions about our products? Need help with an order? 
            We're here to help you 24/7.
          </p>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="url(#gradient)" fillOpacity="0.1"/>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1440" y2="0">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="relative -mt-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickHelp.map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                key={index}
                href={item.link}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-white/20"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${item.color}-100 text-${item.color}-600 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-1">{item.details}</p>
                <p className="text-sm text-gray-500 mb-4">{item.subdetails}</p>
                <a
                  href={item.link}
                  className={`inline-flex items-center text-${item.color}-600 hover:text-${item.color}-700 font-medium text-sm transition-colors group/link`}
                >
                  {item.action}
                  <ChevronRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
                {['contact', 'support'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'contact' ? 'Contact Form' : 'Support Ticket'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.name ? 'border-red-300' : 'border-gray-200'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.email ? 'border-red-300' : 'border-gray-200'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone & Subject */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`block w-full px-4 py-3 border ${
                        errors.phone ? 'border-red-300' : 'border-gray-200'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50`}
                      placeholder="+1 234 567 8900"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => {
                        setSelectedSubject(e.target.value)
                        setFormData({ ...formData, subject: e.target.value })
                      }}
                      className={`block w-full px-4 py-3 border ${
                        errors.subject ? 'border-red-300' : 'border-gray-200'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50`}
                    >
                      {subjects.map((subject) => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Number (conditional) */}
                {selectedSubject === 'order' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Number
                    </label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                      placeholder="e.g., ORD-2024-001"
                    />
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className={`block w-full px-4 py-3 border ${
                      errors.message ? 'border-red-300' : 'border-gray-200'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none`}
                    placeholder="How can we help you?"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    {formData.message.length}/500 characters minimum
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Form Footer */}
                <p className="text-xs text-gray-500 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  We typically respond within 24 hours
                </p>
              </form>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Live Chat */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <MessageSquare className="w-12 h-12 mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">Live Chat</h3>
              <p className="text-white/80 mb-4">
                Chat with our support team for instant help
              </p>
              <button className="w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                Start Chat
              </button>
              <p className="text-xs text-white/60 mt-3">
                Available 24/7
              </p>
            </div>

            {/* FAQ Preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">FAQs</h3>
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              
              <div className="space-y-4">
                {faqs.slice(0, 3).map((faq, index) => (
                  <div key={index} className="group">
                    <button
                      onClick={() => {
                        const answer = document.getElementById(`faq-${index}`)
                        answer?.classList.toggle('hidden')
                      }}
                      className="w-full text-left font-medium text-gray-900 hover:text-blue-600 transition-colors flex items-center justify-between"
                    >
                      <span>{faq.question}</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p id={`faq-${index}`} className="hidden mt-2 text-sm text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/faq"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-4 group"
              >
                View all FAQs
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social Links */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Facebook, name: 'Facebook', color: 'blue', link: '#' },
                  { icon: Twitter, name: 'Twitter', color: 'sky', link: '#' },
                  { icon: Instagram, name: 'Instagram', color: 'pink', link: '#' },
                  { icon: Youtube, name: 'YouTube', color: 'red', link: '#' }
                ].map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={index}
                      href={social.link}
                      className={`flex items-center space-x-2 p-3 bg-${social.color}-50 rounded-lg hover:bg-${social.color}-100 transition-colors group`}
                    >
                      <Icon className={`w-5 h-5 text-${social.color}-600`} />
                      <span className={`text-sm font-medium text-${social.color}-700`}>
                        {social.name}
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">
            <span className="text-gradient">Visit Our Farm</span>
          </h2>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-bounce" />
                  <p className="text-gray-600 mb-2">123 Dairy Lane, Farmington, CA 12345</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>Open in Google Maps</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Map Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Our Main Farm</h3>
                <p className="text-white/80">Open for visits: Sat & Sun, 10am - 4pm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-8 text-center">
            <span className="text-gradient">Business Hours</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-4">Customer Support</h3>
              <p className="text-gray-600">Monday - Friday: 8am - 8pm</p>
              <p className="text-gray-600">Saturday: 9am - 6pm</p>
              <p className="text-gray-600">Sunday: 10am - 4pm</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-4">Store Hours</h3>
              <p className="text-gray-600">Monday - Saturday: 9am - 9pm</p>
              <p className="text-gray-600">Sunday: 10am - 6pm</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-4">Delivery Hours</h3>
              <p className="text-gray-600">Monday - Friday: 9am - 8pm</p>
              <p className="text-gray-600">Saturday: 10am - 6pm</p>
              <p className="text-gray-600">Sunday: 12pm - 5pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}