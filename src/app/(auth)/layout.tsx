import type { Metadata } from 'next'
import Link from 'next/link'
import { Milk, Shield, Truck, Clock, Star, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: {
    template: '%s | MilkShop Authentication',
    default: 'Authentication | MilkShop'
  },
  description: 'Secure authentication for MilkShop - Your premium dairy products store'
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Side - Auth Forms */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          {/* Brand Logo - Mobile Only */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <div className="relative">
                <Milk className="w-10 h-10 text-blue-600 group-hover:text-blue-700 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MilkShop
              </span>
            </Link>
          </div>

          {/* Auth Forms */}
          {children}
        </div>

        {/* Right Side - Hero Section (Hidden on Mobile) */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float animation-delay-4000" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-12">
            {/* Logo */}
            <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
              <div className="relative">
                <Milk className="w-24 h-24 text-white/90" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-pulse animation-delay-1000" />
              </div>
            </div>

            {/* Welcome Message */}
            <h1 className="text-4xl font-bold text-center mb-4">
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                MilkShop Family
              </span>
            </h1>

            <p className="text-xl text-center text-white/80 mb-12 max-w-md">
              Join thousands of happy customers enjoying the freshest dairy products delivered to their doorstep.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 max-w-md">
              {[
                { icon: Shield, text: '100% Fresh', color: 'green' },
                { icon: Truck, text: 'Free Delivery', color: 'blue' },
                { icon: Clock, text: '24/7 Support', color: 'purple' },
                { icon: Star, text: 'Premium Quality', color: 'yellow' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 transform hover:scale-105 transition-all duration-300"
                >
                  <div className={`p-2 bg-${feature.color}-400/20 rounded-lg`}>
                    <feature.icon className={`w-5 h-5 text-${feature.color}-300`} />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="mt-12 text-center">
              <div className="flex justify-center -space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-pink-300 border-2 border-white flex items-center justify-center text-gray-800 font-bold text-sm"
                  >
                    {['JD', 'SK', 'AR', 'MT', 'KL'][i-1]}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                  +2k
                </div>
              </div>
              <p className="text-white/80 text-sm">
                Trusted by <span className="font-bold text-white">2,500+</span> happy customers
              </p>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-white/80">4.9/5 Rating</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 left-10 text-white/20 text-sm">
              © 2026 MilkShop. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}