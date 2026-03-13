'use client'

import { useState } from 'react'
import { Mail, Send, CheckCircle, AlertCircle, Loader2, X, Bell, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface NewsletterProps {
  title?: string
  subtitle?: string
  buttonText?: string
  placeholder?: string
  successMessage?: string
  errorMessage?: string
  onSubmit?: (email: string) => Promise<void>
  showName?: boolean
  showConsent?: boolean
  variant?: 'default' | 'compact' | 'popup' | 'sidebar'
  position?: 'bottom' | 'center' | 'top-right'
  backgroundImage?: string
  backgroundColor?: string
  textColor?: string
  buttonColor?: string
  className?: string
  onClose?: () => void
}

export function Newsletter({
  title = 'Subscribe to Our Newsletter',
  subtitle = 'Get the latest updates and exclusive offers delivered straight to your inbox',
  buttonText = 'Subscribe',
  placeholder = 'Enter your email address',
  successMessage = 'Thanks for subscribing! Check your inbox for confirmation.',
  errorMessage = 'Something went wrong. Please try again.',
  onSubmit,
  showName = false,
  showConsent = true,
  variant = 'default',
  position = 'bottom',
  backgroundImage,
  backgroundColor = 'bg-primary-50 dark:bg-gray-900',
  textColor = 'text-gray-900 dark:text-white',
  buttonColor = 'bg-primary-600 hover:bg-primary-700',
  className = '',
  onClose
}: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [consent, setConsent] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (showConsent && !consent) {
      setError('Please agree to receive newsletters')
      return
    }

    setLoading(true)

    try {
      if (onSubmit) {
        await onSubmit(email)
      } else {
        // Default submission
        const res = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name })
        })

        if (!res.ok) throw new Error()
      }

      setSuccess(true)
      setEmail('')
      setName('')
      toast.success(successMessage)
      
      // Auto close popup after success
      if (variant === 'popup') {
        setTimeout(() => {
          setIsVisible(false)
          onClose?.()
        }, 3000)
      }
    } catch (error) {
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  // Popup variant
  if (variant === 'popup') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className={`
          relative max-w-md w-full rounded-xl shadow-2xl overflow-hidden
          ${backgroundColor} ${textColor}
        `}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Background image */}
          {backgroundImage && (
            <div className="absolute inset-0">
              <img
                src={backgroundImage}
                alt=""
                className="w-full h-full object-cover opacity-10"
              />
            </div>
          )}

          <div className="relative p-8">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>

            {success ? (
              // Success state
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {successMessage}
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              // Form
              <>
                <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{subtitle}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {showName && (
                    <div>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}

                  <div>
                    <input
                      type="email"
                      placeholder={placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`
                        w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500
                        ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
                      `}
                      required
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </p>
                    )}
                  </div>

                  {showConsent && (
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        I agree to receive marketing emails and accept the{' '}
                        <a href="/privacy" className="text-primary-600 hover:underline">
                          privacy policy
                        </a>
                      </span>
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`
                      w-full py-3 rounded-lg text-white font-medium
                      ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2
                    `}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {buttonText}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`rounded-xl overflow-hidden ${backgroundColor} ${className}`}>
        <div className="p-6">
          <Bell className="w-10 h-10 text-primary-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{subtitle}</p>

          {success ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Thanks for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                required
              />
              
              {showName && (
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {buttonText}
              </button>

              {error && (
                <p className="text-xs text-red-600">{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg overflow-hidden ${backgroundColor} ${className}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <h3 className="font-semibold">{title}</h3>
          </div>

          {success ? (
            <p className="text-sm text-green-600">✓ {successMessage}</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <section className={`py-16 ${backgroundColor} ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          {/* Content */}
          <h2 className={`text-3xl font-bold mb-4 ${textColor}`}>{title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{subtitle}</p>

          {success ? (
            // Success state
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-green-700 dark:text-green-300">{successMessage}</p>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  {showName && (
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 mb-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                    />
                  )}
                  <input
                    type="email"
                    placeholder={placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`
                      w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500
                      ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
                    `}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    px-6 py-3 rounded-lg text-white font-medium whitespace-nowrap
                    ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  `}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {buttonText}
                    </>
                  )}
                </button>
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}

              {showConsent && (
                <label className="flex items-center justify-center gap-2 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to receive newsletters and accept the{' '}
                    <a href="/privacy" className="text-primary-600 hover:underline">
                      privacy policy
                    </a>
                  </span>
                </label>
              )}

              <p className="text-xs text-gray-500 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}