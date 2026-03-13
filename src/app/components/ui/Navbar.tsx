'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X, Milk, Heart } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/dashboard', label: 'Dashboard', admin: true },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'glass-dark py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Milk className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MilkShop
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-all duration-300 group ${
                  pathname === link.href
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full ${
                  pathname === link.href ? 'w-full' : ''
                }`} />
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative group">
              <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-blue-400 transition-all duration-300 transform group-hover:scale-110" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-xs flex items-center justify-center text-white animate-pulse-slow">
                3
              </span>
            </Link>
            <Link href="/wishlist" className="group">
              <Heart className="w-6 h-6 text-gray-300 group-hover:text-red-400 transition-all duration-300 transform group-hover:scale-110" />
            </Link>
            <Link href="/auth/login" className="group">
              <User className="w-6 h-6 text-gray-300 group-hover:text-blue-400 transition-all duration-300 transform group-hover:scale-110" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-4 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex space-x-4 pt-4 border-t border-white/10">
              <Link href="/cart" className="text-gray-300 hover:text-blue-400">
                <ShoppingCart className="w-6 h-6" />
              </Link>
              <Link href="/wishlist" className="text-gray-300 hover:text-red-400">
                <Heart className="w-6 h-6" />
              </Link>
              <Link href="/auth/login" className="text-gray-300 hover:text-blue-400">
                <User className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}