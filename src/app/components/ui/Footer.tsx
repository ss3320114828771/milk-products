// components/ui/footer.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'  // Missing import for useState
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react'

interface FooterProps {
  logo?: React.ReactNode
  description?: string
  sections?: FooterSection[]
  socialLinks?: SocialLink[]
  newsletter?: boolean
  copyright?: string
  className?: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface FooterLink {
  title: string
  href: string
}

interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube'
  href: string
}

export function Footer({
  logo = <span className="text-2xl font-bold text-blue-600">Store</span>,  // Changed primary-600 to blue-600
  description = 'Your one-stop shop for everything you need.',
  sections = [
    {
      title: 'Shop',
      links: [
        { title: 'All Products', href: '/products' },
        { title: 'New Arrivals', href: '/products/new' },
        { title: 'Best Sellers', href: '/products/best-sellers' },
        { title: 'Sale', href: '/products/sale' }
      ]
    },
    {
      title: 'Support',
      links: [
        { title: 'Contact Us', href: '/contact' },
        { title: 'FAQs', href: '/faqs' },
        { title: 'Shipping Info', href: '/shipping' },
        { title: 'Returns', href: '/returns' }
      ]
    },
    {
      title: 'Company',
      links: [
        { title: 'About Us', href: '/about' },
        { title: 'Blog', href: '/blog' },
        { title: 'Careers', href: '/careers' },
        { title: 'Privacy Policy', href: '/privacy' }
      ]
    }
  ],
  socialLinks = [
    { platform: 'facebook', href: 'https://facebook.com' },
    { platform: 'twitter', href: 'https://twitter.com' },
    { platform: 'instagram', href: 'https://instagram.com' },
    { platform: 'youtube', href: 'https://youtube.com' }
  ],
  newsletter = true,
  copyright = `© ${new Date().getFullYear()} Store. All rights reserved.`,
  className = ''
}: FooterProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5" />
      case 'twitter':
        return <Twitter className="w-5 h-5" />
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      case 'youtube':
        return <Youtube className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <footer className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/">{logo}</Link>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@store.com" className="hover:text-blue-600">
                  support@store.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <a href="tel:+1234567890" className="hover:text-blue-600">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>123 Store St, City, Country</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition-all"
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {newsletter && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Newsletter
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Subscribe to get updates on new products and exclusive offers.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {subscribed && (
                  <p className="text-sm text-green-600">Thanks for subscribing!</p>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{copyright}</p>
            
            {/* Payment Methods */}
            <div className="flex gap-2">
              <div className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-medium">VISA</div>
              <div className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-medium">MC</div>
              <div className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-medium">AMEX</div>
              <div className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-medium">PayPal</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}