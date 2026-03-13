'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  ArrowRight, 
  Milk,
  CheckCircle,
  XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })

  // Password strength validation
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  const validatePassword = (password: string) => {
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    setFormData({ ...formData, password })
    validatePassword(password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    // Check password strength
    const passwordValid = Object.values(passwordChecks).every(Boolean)
    if (!passwordValid) {
      toast.error('Please meet all password requirements')
      return
    }

    if (!formData.acceptTerms) {
      toast.error('Please accept terms and conditions')
      return
    }

    setLoading(true)

    try {
      // API call to register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Registration successful! Please login.')
        router.push('/auth/login')
      } else {
        toast.error(data.message || 'Registration failed')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const PasswordCheck = ({ valid, text }: { valid: boolean; text: string }) => (
    <div className="flex items-center space-x-2 text-sm">
      {valid ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-gray-300" />
      )}
      <span className={valid ? 'text-green-600' : 'text-gray-500'}>{text}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-4000" />
      </div>

      <div className="max-w-2xl w-full space-y-8 relative">
        {/* Logo and Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 group">
            <div className="relative">
              <Milk className="w-12 h-12 text-blue-500 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-pulse" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MilkShop
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us to start shopping fresh dairy products
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>

              {/* Password Strength Check */}
              {formData.password && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <PasswordCheck valid={passwordChecks.length} text="8+ characters" />
                  <PasswordCheck valid={passwordChecks.uppercase} text="Uppercase letter" />
                  <PasswordCheck valid={passwordChecks.lowercase} text="Lowercase letter" />
                  <PasswordCheck valid={passwordChecks.number} text="Number" />
                  <PasswordCheck valid={passwordChecks.special} text="Special character" />
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span>{loading ? 'Creating account...' : 'Create account'}</span>
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in here <span aria-hidden="true">→</span>
            </Link>
          </p>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
          <div className="p-2">
            <span className="block font-semibold text-green-600">✓ Free Delivery</span>
            On orders $50+
          </div>
          <div className="p-2">
            <span className="block font-semibold text-green-600">✓ Secure</span>
            SSL Encryption
          </div>
          <div className="p-2">
            <span className="block font-semibold text-green-600">✓ 24/7 Support</span>
            Live chat
          </div>
        </div>
      </div>
    </div>
  )
}