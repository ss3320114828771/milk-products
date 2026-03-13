'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Share2,
  ChevronRight,
  Star,
  ShoppingBag,
  AlertCircle,
  Check,
  X,
  MoveRight,
  Tag,
  Clock,
  Truck,
  Bell  // Added missing Bell import
} from 'lucide-react'
import toast from 'react-hot-toast'

interface WishlistItem {
  id: string
  productId: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  weight: string
  inStock: boolean
  stockCount?: number
  rating: number
  reviewCount: number
  isOrganic: boolean
  isNew?: boolean
  addedAt: string
  discount?: number
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [shareModal, setShareModal] = useState(false)
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      // Mock data - replace with actual API call
      const mockWishlist: WishlistItem[] = [
        {
          id: '1',
          productId: 'p1',
          name: 'Premium Organic A2 Milk',
          description: 'Fresh organic A2 milk from grass-fed cows',
          price: 5.99,
          originalPrice: 6.99,
          category: 'Milk',
          image: '/images/products/milk-1.jpg',
          weight: '1L',
          inStock: true,
          stockCount: 45,
          rating: 4.8,
          reviewCount: 128,
          isOrganic: true,
          isNew: true,
          addedAt: '2024-03-10',
          discount: 15
        },
        {
          id: '2',
          productId: 'p2',
          name: 'Aged Cheddar Cheese',
          description: 'Premium aged cheddar cheese, 24 months',
          price: 8.99,
          category: 'Cheese',
          image: '/images/products/cheese-1.jpg',
          weight: '250g',
          inStock: true,
          stockCount: 30,
          rating: 4.7,
          reviewCount: 89,
          isOrganic: false,
          addedAt: '2024-03-08'
        },
        {
          id: '3',
          productId: 'p3',
          name: 'Greek Yogurt',
          description: 'Creamy Greek yogurt, high in protein',
          price: 6.49,
          category: 'Yogurt',
          image: '/images/products/yogurt-1.jpg',
          weight: '500g',
          inStock: false,
          stockCount: 0,
          rating: 4.9,
          reviewCount: 156,
          isOrganic: true,
          isNew: true,
          addedAt: '2024-03-05'
        },
        {
          id: '4',
          productId: 'p4',
          name: 'Unsalted Butter',
          description: 'Creamy unsalted butter, perfect for baking',
          price: 4.99,
          originalPrice: 5.99,
          category: 'Butter',
          image: '/images/products/butter-1.jpg',
          weight: '250g',
          inStock: true,
          stockCount: 50,
          rating: 4.6,
          reviewCount: 67,
          isOrganic: false,
          addedAt: '2024-03-01',
          discount: 17
        },
        {
          id: '5',
          productId: 'p5',
          name: 'Heavy Whipping Cream',
          description: 'Rich heavy cream for desserts',
          price: 5.49,
          category: 'Cream',
          image: '/images/products/cream-1.jpg',
          weight: '500ml',
          inStock: true,
          stockCount: 8,
          rating: 4.8,
          reviewCount: 45,
          isOrganic: true,
          addedAt: '2024-02-28'
        },
        {
          id: '6',
          productId: 'p6',
          name: 'Mozzarella Cheese',
          description: 'Fresh mozzarella cheese, perfect for pizza',
          price: 7.99,
          category: 'Cheese',
          image: '/images/products/mozzarella-1.jpg',
          weight: '200g',
          inStock: false,
          stockCount: 0,
          rating: 4.5,
          reviewCount: 34,
          isOrganic: false,
          addedAt: '2024-02-25'
        }
      ]

      setWishlistItems(mockWishlist)
    } catch (error) {
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
    setSelectedItems(prev => prev.filter(id => id !== itemId))
    toast.success('Item removed from wishlist')
  }

  const handleRemoveSelected = () => {
    setWishlistItems(prev => prev.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
    toast.success(`${selectedItems.length} items removed from wishlist`)
  }

  const handleAddToCart = (item: WishlistItem) => {
    if (!item.inStock) {
      toast.error('This item is out of stock')
      return
    }
    toast.success(`${item.name} added to cart!`)
  }

  const handleAddAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock)
    if (inStockItems.length === 0) {
      toast.error('No items in stock')
      return
    }
    toast.success(`${inStockItems.length} items added to cart!`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wishlist',
          text: `Check out my wishlist with ${wishlistItems.length} items!`,
          url: window.location.href
        })
      } catch (error) {
        setShareModal(true)
      }
    } else {
      setShareModal(true)
    }
  }

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(wishlistItems.map(item => item.id))
    }
  }

  const getSortedItems = () => {
    switch (sortBy) {
      case 'price-low':
        return [...wishlistItems].sort((a, b) => a.price - b.price)
      case 'price-high':
        return [...wishlistItems].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...wishlistItems].sort((a, b) => b.rating - a.rating)
      case 'recent':
      default:
        return [...wishlistItems].sort((a, b) => 
          new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
            <div className="h-4 w-96 bg-gray-200 rounded mb-8" />
            
            {/* Controls Skeleton */}
            <div className="h-12 bg-gray-200 rounded mb-8" />
            
            {/* Wishlist Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const sortedItems = getSortedItems()
  const inStockCount = wishlistItems.filter(item => item.inStock).length
  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0)

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Empty Wishlist Animation */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse" />
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6 relative" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save your favorite items here and never miss out on the products you love.
              Start exploring our collection!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Explore Products</span>
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-white hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Tag className="w-5 h-5" />
                <span>Browse Categories</span>
              </Link>
            </div>

            {/* How it Works */}
            <div className="mt-16">
              <h3 className="text-xl font-semibold mb-8">How to build your wishlist</h3>
              <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {[
                  { icon: Heart, text: 'Click the heart icon on any product' },
                  { icon: ShoppingBag, text: 'Browse through our collections' },
                  { icon: Bell, text: 'Get notified about price drops' }
                ].map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white mb-4">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-gray-600">{step.text}</p>
                  </div>
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                My Wishlist
              </span>
            </h1>
            <p className="text-gray-600">
              You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>

          {/* Wishlist Stats */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
              <p className="text-sm text-gray-500">In Stock</p>
              <p className="text-xl font-bold text-green-600">{inStockCount}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                ${totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Select All */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === wishlistItems.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500 transition-colors"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({selectedItems.length})
                </span>
              </label>

              {selectedItems.length > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Selected</span>
                </button>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>

              {/* Add All to Cart */}
              <button
                onClick={handleAddAllToCart}
                disabled={inStockCount === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add All to Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Selection Checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelectItem(item.id)}
                  className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500 transition-colors"
                />
              </div>

              {/* Image Container */}
              <Link href={`/products/${item.productId}`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-1">
                    {item.discount && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        -{item.discount}%
                      </span>
                    )}
                    {item.isOrganic && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Organic
                      </span>
                    )}
                    {item.isNew && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  {/* Out of Stock Overlay */}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                {/* Category & Weight */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">{item.weight}</span>
                </div>

                {/* Product Name */}
                <Link href={`/products/${item.productId}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-red-600 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(item.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({item.reviewCount})
                  </span>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    {item.originalPrice ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        item.inStock
                          ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stock Warning */}
                {item.inStock && item.stockCount && item.stockCount < 10 && (
                  <p className="text-xs text-orange-600 mt-2 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Only {item.stockCount} left in stock!
                  </p>
                )}

                {/* Added Date */}
                <p className="text-xs text-gray-400 mt-2">
                  Added {new Date(item.addedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors group"
          >
            <span>Continue Shopping</span>
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Price Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-8">
              <div>
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Potential Savings</p>
                <p className="text-xl font-bold text-green-600">
                  ${wishlistItems
                    .filter(item => item.originalPrice)
                    .reduce((sum, item) => sum + (item.originalPrice! - item.price), 0)
                    .toFixed(2)}
                </p>
              </div>
              <button
                onClick={handleAddAllToCart}
                disabled={inStockCount === 0}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all duration-300"
              >
                Add All to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {shareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-fadeIn">
              <button
                onClick={() => setShareModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold mb-4">Share Wishlist</h3>
              
              <div className="space-y-4">
                {/* Share Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Link
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/shared-wishlist/123`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/shared-wishlist/123`)
                        toast.success('Link copied!')
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Social Share */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share via
                  </label>
                  <div className="flex space-x-3">
                    {[
                      { icon: '📘', name: 'Facebook', color: 'bg-blue-600' },
                      { icon: '🐦', name: 'Twitter', color: 'bg-sky-500' },
                      { icon: '📧', name: 'Email', color: 'bg-gray-600' },
                      { icon: '💬', name: 'WhatsApp', color: 'bg-green-500' }
                    ].map((platform, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setShareModal(false)
                          toast.success(`Shared on ${platform.name}!`)
                        }}
                        className={`flex-1 ${platform.color} text-white py-2 rounded-lg hover:opacity-90 transition-opacity`}
                      >
                        <span className="text-lg mr-1">{platform.icon}</span>
                        <span className="text-sm">{platform.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}