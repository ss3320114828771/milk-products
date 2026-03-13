'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Minus, 
  Plus, 
  Truck,
  Shield,
  RefreshCw,
  Check,
  Share2,
  Facebook,
  Twitter,
  Mail,
  ChevronRight,
  Clock,
  Package,
  Award,
  Leaf,
  Droplet,
  Scale,
  Thermometer
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  weight: string
  nutritionalInfo: {
    calories: number
    protein: number
    fat: number
    carbs: number
    calcium: number
  }
  isOrganic: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  deliveryInfo: {
    free: boolean
    estimatedDays: string
  }
  origin: string
  expiryDays: number
  storage: string
}

interface Review {
  id: string
  user: string
  avatar: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export default function ProductDetailsPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    fetchProductData()
  }, [productId])

  const fetchProductData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProduct: Product = {
        id: productId,
        name: 'Premium Organic A2 Milk',
        description: `Experience the purest form of milk with our Premium Organic A2 Milk. Sourced from grass-fed cows that are never treated with hormones or antibiotics, this milk is rich in essential nutrients and has a naturally creamy taste.

Our A2 milk contains only the A2 type of beta-casein protein, which is easier to digest and may be a better choice for those with milk sensitivity. Each batch is carefully tested to ensure the highest quality standards.

Perfect for your morning cereal, coffee, or simply enjoying a cold glass, this milk delivers the authentic taste of traditional dairy farming with modern nutritional benefits.`,
        price: 5.99,
        category: 'MILK',
        stock: 45,
        images: [
          '/images/products/milk-1.jpg',
          '/images/products/milk-2.jpg',
          '/images/products/milk-3.jpg',
          '/images/products/milk-4.jpg',
        ],
        weight: '1L',
        nutritionalInfo: {
          calories: 150,
          protein: 8,
          fat: 8,
          carbs: 12,
          calcium: 30,
        },
        isOrganic: true,
        isFeatured: true,
        rating: 4.8,
        reviewCount: 128,
        deliveryInfo: {
          free: true,
          estimatedDays: '1-2',
        },
        origin: 'California, USA',
        expiryDays: 7,
        storage: 'Refrigerate at 2-4°C',
      }

      const mockReviews: Review[] = [
        {
          id: '1',
          user: 'Sarah Johnson',
          avatar: '/images/avatars/user-1.jpg',
          rating: 5,
          comment: 'Best milk I\'ve ever tasted! So creamy and fresh. Will definitely order again.',
          date: '2024-03-10',
          verified: true,
        },
        {
          id: '2',
          user: 'Michael Chen',
          avatar: '/images/avatars/user-2.jpg',
          rating: 5,
          comment: 'Great quality and fast delivery. My kids love it!',
          date: '2024-03-08',
          verified: true,
        },
        {
          id: '3',
          user: 'Emily Williams',
          avatar: '/images/avatars/user-3.jpg',
          rating: 4,
          comment: 'Very good milk, but delivery was a day late.',
          date: '2024-03-05',
          verified: true,
        },
      ]

      const mockRelated: Product[] = [
        {
          id: '2',
          name: 'Aged Cheddar Cheese',
          description: 'Premium aged cheddar',
          price: 8.99,
          category: 'CHEESE',
          stock: 30,
          images: ['/images/products/cheese-1.jpg'],
          weight: '250g',
          nutritionalInfo: {
            calories: 400,
            protein: 25,
            fat: 33,
            carbs: 1,
            calcium: 40,
          },
          isOrganic: false,
          isFeatured: true,
          rating: 4.7,
          reviewCount: 89,
          deliveryInfo: { free: true, estimatedDays: '1-2' },
          origin: 'Wisconsin, USA',
          expiryDays: 30,
          storage: 'Refrigerate',
        },
        {
          id: '3',
          name: 'Greek Yogurt',
          description: 'Creamy Greek yogurt',
          price: 6.49,
          category: 'YOGURT',
          stock: 25,
          images: ['/images/products/yogurt-1.jpg'],
          weight: '500g',
          nutritionalInfo: {
            calories: 120,
            protein: 12,
            fat: 6,
            carbs: 5,
            calcium: 15,
          },
          isOrganic: true,
          isFeatured: false,
          rating: 4.9,
          reviewCount: 156,
          deliveryInfo: { free: true, estimatedDays: '1-2' },
          origin: 'California, USA',
          expiryDays: 14,
          storage: 'Refrigerate',
        },
        {
          id: '4',
          name: 'Unsalted Butter',
          description: 'Creamy unsalted butter',
          price: 4.99,
          category: 'BUTTER',
          stock: 50,
          images: ['/images/products/butter-1.jpg'],
          weight: '250g',
          nutritionalInfo: {
            calories: 720,
            protein: 1,
            fat: 81,
            carbs: 0,
            calcium: 2,
          },
          isOrganic: false,
          isFeatured: false,
          rating: 4.6,
          reviewCount: 67,
          deliveryInfo: { free: true, estimatedDays: '1-2' },
          origin: 'Vermont, USA',
          expiryDays: 60,
          storage: 'Refrigerate',
        },
      ]

      setProduct(mockProduct)
      setReviews(mockReviews)
      setRelatedProducts(mockRelated)
    } catch (error) {
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`, {
      icon: '🛒',
    })
  }

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist)
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!', {
      icon: isInWishlist ? '💔' : '❤️',
    })
  }

  const handleShare = (platform: string) => {
    setShowShareMenu(false)
    toast.success(`Shared on ${platform}!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Skeleton */}
              <div>
                <div className="h-96 bg-gray-200 rounded-2xl mb-4" />
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-gray-200 rounded-lg" />
                  ))}
                </div>
              </div>
              
              {/* Content Skeleton */}
              <div className="space-y-6">
                <div className="h-8 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-24 bg-gray-200 rounded" />
                <div className="h-12 w-1/3 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/products" className="text-gray-500 hover:text-blue-600 transition-colors">
            Products
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{product.category}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden mb-4 group">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex space-x-2">
                {product.isOrganic && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Leaf className="w-4 h-4 mr-1" />
                    Organic
                  </span>
                )}
                {product.stock < 10 && (
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Only {product.stock} left!
                  </span>
                )}
              </div>

              {/* Share Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="relative p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
                
                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl p-2 min-w-[150px] z-50">
                    {[
                      { icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
                      { icon: Twitter, label: 'Twitter', color: 'text-sky-500' },
                      { icon: Mail, label: 'Email', color: 'text-gray-600' },
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleShare(item.label)}
                        className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedImage === index 
                      ? 'ring-2 ring-blue-500 scale-105' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">{product.name}</span>
            </h1>

            {/* Price & Weight */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-gradient">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-gray-500">/ {product.weight}</span>
              {product.deliveryInfo.free && (
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  Free Delivery
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description.split('\n')[0]}
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Truck, label: 'Free Delivery', value: product.deliveryInfo.free ? 'Available' : 'Paid' },
                { icon: Package, label: 'In Stock', value: `${product.stock} units` },
                { icon: Clock, label: 'Delivery', value: `${product.deliveryInfo.estimatedDays} days` },
                { icon: Award, label: 'Quality', value: 'Premium' },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <item.icon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-medium text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} available
                </span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={toggleWishlist}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    isInWishlist
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-200 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Shield, text: 'Secure Payment' },
                  { icon: RefreshCw, text: 'Easy Returns' },
                  { icon: Check, text: 'Quality Guarantee' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex space-x-8">
              {['description', 'nutrition', 'reviews', 'delivery'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-medium capitalize transition-all duration-300 relative ${
                    activeTab === tab
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Product Description</h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
                
                {/* Additional Details */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h4 className="font-semibold mb-3">Origin</h4>
                    <p className="text-gray-600">{product.origin}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Storage</h4>
                    <p className="text-gray-600">{product.storage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Shelf Life</h4>
                    <p className="text-gray-600">{product.expiryDays} days from delivery</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Certification</h4>
                    <p className="text-gray-600">{product.isOrganic ? 'USDA Organic' : 'Conventional'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h3 className="text-xl font-bold mb-6">Nutritional Information</h3>
                <p className="text-sm text-gray-500 mb-4">Per serving (240ml)</p>
                
                <div className="space-y-4">
                  {[
                    { label: 'Calories', value: product.nutritionalInfo.calories, unit: 'kcal' },
                    { label: 'Protein', value: product.nutritionalInfo.protein, unit: 'g' },
                    { label: 'Total Fat', value: product.nutritionalInfo.fat, unit: 'g' },
                    { label: 'Carbohydrates', value: product.nutritionalInfo.carbs, unit: 'g' },
                    { label: 'Calcium', value: product.nutritionalInfo.calcium, unit: '% DV' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-gray-900">{item.value} {item.unit}</span>
                    </div>
                  ))}
                </div>

                {/* Nutrition Icons */}
                <div className="grid grid-cols-4 gap-4 mt-8">
                  {[
                    { icon: Droplet, label: 'No Hormones' },
                    { icon: Leaf, label: 'Non-GMO' },
                    { icon: Scale, label: 'Gluten Free' },
                    { icon: Thermometer, label: 'Pasteurized' },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-2">
                        <item.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Customer Reviews</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Write a Review
                  </button>
                </div>

                {/* Rating Summary */}
                <div className="flex items-center space-x-8 mb-8 p-6 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gradient">{product.rating}</div>
                    <div className="flex mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{product.reviewCount} reviews</p>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const percentage = rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1
                      return (
                        <div key={rating} className="flex items-center space-x-2">
                          <span className="text-sm w-8">{rating} ★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-8">{percentage}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={review.avatar}
                              alt={review.user}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold">{review.user}</h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div>
                <h3 className="text-xl font-bold mb-6">Delivery Information</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Truck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Delivery Options</h4>
                        <p className="text-gray-600 text-sm">
                          Standard Delivery: 2-3 business days - $5.99<br />
                          Express Delivery: 1-2 business days - $9.99<br />
                          Same Day Delivery: Available in select areas - $14.99
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Package className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Packaging</h4>
                        <p className="text-gray-600 text-sm">
                          All dairy products are shipped in insulated boxes with ice packs to maintain freshness.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <RefreshCw className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Returns</h4>
                        <p className="text-gray-600 text-sm">
                          If you're not satisfied with your purchase, contact us within 24 hours for a full refund.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold mb-4">Delivery Areas</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      We currently deliver to the following areas:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        New York Metro Area
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Los Angeles County
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Chicago Metro
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        San Francisco Bay Area
                      </li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-4">
                      Enter your zip code at checkout to check availability
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-8">
            <span className="text-gradient">You Might Also Like</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.isOrganic && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Organic
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.reviewCount})
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gradient">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">{product.weight}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}