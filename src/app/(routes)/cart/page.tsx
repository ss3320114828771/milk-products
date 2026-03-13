'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Tag,
  Shield,
  Truck,
  CreditCard,
  ShoppingBag,
  Heart,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

// Temporary interface - will come from Prisma
interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  weight: string
  stock: number
  isOrganic?: boolean
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Fetch cart items on load
  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCart: CartItem[] = [
        {
          id: '1',
          productId: 'p1',
          name: 'Fresh Organic Milk',
          price: 4.99,
          quantity: 2,
          image: '/images/products/milk-1.jpg',
          weight: '1L',
          stock: 10,
          isOrganic: true
        },
        {
          id: '2',
          productId: 'p2',
          name: 'Aged Cheddar Cheese',
          price: 8.99,
          quantity: 1,
          image: '/images/products/cheese-1.jpg',
          weight: '250g',
          stock: 5,
          isOrganic: false
        },
        {
          id: '3',
          productId: 'p3',
          name: 'Greek Yogurt',
          price: 5.99,
          quantity: 3,
          image: '/images/products/yogurt-1.jpg',
          weight: '500g',
          stock: 8,
          isOrganic: true
        }
      ]
      
      setCartItems(mockCart)
      setSelectedItems(mockCart.map(item => item.id))
    } catch (error) {
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    const item = cartItems.find(i => i.id === itemId)
    if (item && newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available`)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )

    // API call would go here
    toast.success('Cart updated')
  }

  const removeItem = async (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
    setSelectedItems(prev => prev.filter(id => id !== itemId))
    toast.success('Item removed from cart')
  }

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map(item => item.id))
    }
  }

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoApplied(true)
      setPromoDiscount(10)
      toast.success('Promo code applied! 10% discount')
    } else if (promoCode.toUpperCase() === 'FREESHIP') {
      setPromoApplied(true)
      setPromoDiscount(0)
      toast.success('Free shipping applied!')
    } else {
      toast.error('Invalid promo code')
    }
  }

  // Calculate totals
  const subtotal = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const shipping = subtotal > 50 ? 0 : 5.99
  const discount = promoApplied && promoCode.toUpperCase() === 'SAVE10' ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Empty Cart Animation */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
              <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6 relative" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet. 
              Explore our fresh dairy products and start shopping!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Shop Now</span>
              </Link>
              <Link
                href="/wishlist"
                className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-white hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
                <span>View Wishlist</span>
              </Link>
            </div>

            {/* Featured Categories */}
            <div className="mt-16">
              <h3 className="text-xl font-semibold mb-6">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {['Milk', 'Cheese', 'Yogurt', 'Butter'].map((cat, i) => (
                  <Link
                    key={i}
                    href={`/products?category=${cat.toUpperCase()}`}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center"
                  >
                    <div className="text-2xl mb-2">
                      {cat === 'Milk' && '🥛'}
                      {cat === 'Cheese' && '🧀'}
                      {cat === 'Yogurt' && '🍦'}
                      {cat === 'Butter' && '🧈'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{cat}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Shopping Cart</span>
            </h1>
            <p className="text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          {/* Continue Shopping */}
          <Link
            href="/products"
            className="hidden sm:flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors group"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cartItems.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-colors"
                />
                <span className="font-medium text-gray-700">Select All</span>
              </label>
              <span className="text-sm text-gray-500">
                {selectedItems.length} of {cartItems.length} selected
              </span>
            </div>

            {/* Cart Items List */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group"
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="mt-4 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-colors"
                  />

                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.isOrganic && (
                      <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Organic
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">{item.weight}</p>
                      </div>
                      
                      {/* Price */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-gradient">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-500 ml-2">
                          {item.stock} available
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors group"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile Continue Shopping */}
            <div className="lg:hidden text-center pt-4">
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                    disabled={promoApplied}
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={promoApplied || !promoCode}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Promo code applied!
                    <button
                      onClick={() => {
                        setPromoApplied(false)
                        setPromoDiscount(0)
                        setPromoCode('')
                      }}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </p>
                )}
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">Try: SAVE10 (10% off)</p>
                  <p className="text-xs text-gray-500">FREESHIP (Free shipping)</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({selectedItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>${shipping.toFixed(2)}</span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-gradient">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {subtotal < 50 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Free shipping in</span>
                    <span className="font-medium text-blue-600">
                      ${(50 - subtotal).toFixed(2)} more
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(subtotal / 50) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button
                disabled={selectedItems.length === 0}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center space-x-2 mb-4"
              >
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Checkout</span>
              </button>

              {/* Payment Methods */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-3">We accept</p>
                <div className="flex justify-center space-x-3">
                  {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method, i) => (
                    <span key={i} className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                  <div>
                    <Shield className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <span className="text-gray-600">Secure Payment</span>
                  </div>
                  <div>
                    <Truck className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <span className="text-gray-600">Free Delivery</span>
                  </div>
                  <div>
                    <Heart className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <span className="text-gray-600">Fresh Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You Might Also Like */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">
            <span className="text-gradient">You Might Also Like</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Link
                key={i}
                href={`/products/recommended-${i}`}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <Image
                    src={`/images/products/recommended-${i}.jpg`}
                    alt={`Recommended Product ${i}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Product Name</h3>
                <p className="text-sm text-gray-500 mb-2">1L</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gradient">$4.99</span>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}