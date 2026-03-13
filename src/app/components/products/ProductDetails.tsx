'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Heart, 
  ShoppingCart, 
  Share2, 
  Star, 
  StarHalf,
  Minus,
  Plus,
  Truck,
  Shield,
  RefreshCw,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  CheckCircle,
  AlertCircle,
  Package,
  Ruler,
  Weight,
  MapPin,
  Clock,
  Award,
  ThumbsUp
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  costPrice?: number
  quantity: number
  lowStockThreshold?: number
  categories: Category[]
  tags: string[]
  images: ProductImage[]
  variants: ProductVariant[]
  attributes: ProductAttribute[]
  seo?: SEOData
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  weight?: number
  dimensions?: Dimensions
  shipping?: ShippingInfo
  meta?: ProductMeta
  rating?: number
  reviewCount?: number
  reviews?: Review[]
  brand?: string
  vendor?: string
  warranty?: string
  returnPolicy?: string
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductImage {
  id: string
  url: string
  alt?: string
  position: number
  isPrimary: boolean
}

interface ProductVariant {
  id: string
  sku: string
  attributes: Record<string, string>
  price: number
  compareAtPrice?: number
  quantity: number
  image?: string
  isActive: boolean
}

interface ProductAttribute {
  name: string
  value: string
  visible: boolean
  usedForVariations: boolean
}

interface SEOData {
  title: string
  description: string
  keywords: string[]
}

interface Dimensions {
  length: number
  width: number
  height: number
  unit: string
}

interface ShippingInfo {
  weight: number
  weightUnit: string
  shippingClass?: string
  freeShipping: boolean
}

interface ProductMeta {
  brand?: string
  manufacturer?: string
  countryOfOrigin?: string
  warranty?: string
  returnPolicy?: string
}

interface Review {
  id: string
  rating: number
  title?: string
  comment: string
  author: string
  authorAvatar?: string
  createdAt: string
  verified: boolean
  helpful: number
}

interface ProductDetailsProps {
  product: Product
  onAddToCart?: (product: Product, quantity: number, variant?: ProductVariant) => void
  onAddToWishlist?: (product: Product) => void
  onShare?: (platform: string) => void
  onReviewSubmit?: (review: any) => void
  relatedProducts?: Product[]
  className?: string
  currency?: string
}

export function ProductDetails({
  product,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onReviewSubmit,
  relatedProducts = [],
  className = '',
  currency = '$'
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'shipping'>('description')
  const [zoomImage, setZoomImage] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: '',
    name: ''
  })
  const [submittingReview, setSubmittingReview] = useState(false)

  const currentPrice = selectedVariant?.price || product.price
  const currentComparePrice = selectedVariant?.compareAtPrice || product.compareAtPrice
  const currentQuantity = selectedVariant?.quantity ?? product.quantity
  const discount = currentComparePrice ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100) : 0
  const isOutOfStock = currentQuantity === 0
  const isLowStock = currentQuantity > 0 && currentQuantity <= (product.lowStockThreshold || 5)

  // Get unique variant options
  const variantOptions = product.variants.reduce((acc, variant) => {
    Object.entries(variant.attributes).forEach(([key, value]) => {
      if (!acc[key]) acc[key] = new Set()
      acc[key].add(value)
    })
    return acc
  }, {} as Record<string, Set<string>>)

  const handleVariantSelect = (attribute: string, value: string) => {
    // Find variant that matches selected attributes
    const newAttributes = {
      ...selectedVariant?.attributes,
      [attribute]: value
    }

    const matchingVariant = product.variants.find(variant => {
      return Object.entries(newAttributes).every(([key, val]) => 
        variant.attributes[key] === val
      )
    })

    if (matchingVariant) {
      setSelectedVariant(matchingVariant)
    }
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= currentQuantity) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('Product is out of stock')
      return
    }

    if (onAddToCart) {
      onAddToCart(product, quantity, selectedVariant || undefined)
    }
    toast.success('Added to cart')
  }

  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist)
    if (onAddToWishlist) {
      onAddToWishlist(product)
    }
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleShare = (platform: string) => {
    if (onShare) {
      onShare(platform)
    }

    const url = window.location.href
    const text = `Check out ${product.name}`

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`)
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`)
        break
      case 'email':
        window.location.href = `mailto:?subject=${text}&body=${url}`
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success('Link copied to clipboard')
        break
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (reviewForm.rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setSubmittingReview(true)
    try {
      if (onReviewSubmit) {
        await onReviewSubmit(reviewForm)
      }
      toast.success('Review submitted successfully')
      setReviewForm({ rating: 0, title: '', comment: '', name: '' })
    } catch (error) {
      toast.error('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomPosition({ x, y })
  }

  const renderRatingStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && setReviewForm({ ...reviewForm, rating: star })}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-primary-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-gray-500 hover:text-primary-600">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          {product.categories.map((cat, index) => (
            <span key={cat.id}>
              <Link href={`/categories/${cat.slug}`} className="text-gray-500 hover:text-primary-600">
                {cat.name}
              </Link>
              {index < product.categories.length - 1 && <span className="mx-2 text-gray-400">/</span>}
            </span>
          ))}
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div 
              className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 cursor-zoom-in"
              onMouseEnter={() => setZoomImage(true)}
              onMouseLeave={() => setZoomImage(false)}
              onMouseMove={handleImageZoom}
            >
              {product.images[selectedImage] ? (
                <>
                  <Image
                    src={product.images[selectedImage].url}
                    alt={product.images[selectedImage].alt || product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  
                  {/* Zoom lens */}
                  {zoomImage && (
                    <div 
                      className="absolute inset-0 bg-cover bg-no-repeat"
                      style={{
                        backgroundImage: `url(${product.images[selectedImage].url})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: '200%'
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-400" />
                </div>
              )}

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(i => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(i => (i + 1) % product.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Zoom indicator */}
              <button
                onClick={() => setZoomImage(!zoomImage)}
                className="absolute bottom-4 right-4 p-2 bg-white/80 rounded-lg hover:bg-white"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`
                    relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden
                    ${selectedImage === index ? 'ring-2 ring-primary-600' : 'hover:ring-2 hover:ring-gray-300'}
                  `}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 20vw, 10vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Brand & SKU */}
            <div className="flex items-center justify-between mb-4">
              {product.brand && (
                <span className="text-sm text-gray-500">{product.brand}</span>
              )}
              <span className="text-sm text-gray-500">SKU: {selectedVariant?.sku || product.sku}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating !== undefined && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {renderRatingStars(product.rating)}
                  <span className="text-sm text-gray-500">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Write a review
                </button>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {currency}{currentPrice.toFixed(2)}
                </span>
                {currentComparePrice && currentComparePrice > currentPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      {currency}{currentComparePrice.toFixed(2)}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
              {product.costPrice && (
                <p className="text-sm text-gray-500 mt-1">
                  Cost: {currency}{product.costPrice.toFixed(2)}
                </p>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {product.shortDescription}
              </p>
            )}

            {/* Variants */}
            {Object.keys(variantOptions).length > 0 && (
              <div className="space-y-4 mb-6">
                {Object.entries(variantOptions).map(([name, values]) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {name}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(values).map((value) => {
                        const isSelected = selectedVariant?.attributes[name] === value
                        return (
                          <button
                            key={value}
                            onClick={() => handleVariantSelect(name, value)}
                            className={`
                              px-4 py-2 border rounded-lg transition-colors
                              ${isSelected
                                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                                : 'border-gray-300 dark:border-gray-700 hover:border-primary-400'
                              }
                            `}
                          >
                            {value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity:
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= currentQuantity}
                    className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Stock status */}
                {isOutOfStock ? (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="text-orange-600">Only {currentQuantity} left in stock</span>
                ) : (
                  <span className="text-green-600">In Stock</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 min-w-[200px] py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleAddToWishlist}
                className={`px-6 py-4 border rounded-lg font-medium transition-colors ${
                  isInWishlist
                    ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-700 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>

              {/* Share button */}
              <div className="relative">
                <button
                  onClick={() => setShareOpen(!shareOpen)}
                  className="px-6 py-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {shareOpen && (
                  <div className="absolute right-0 mt-2 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        <Twitter className="w-5 h-5 text-sky-500" />
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        <Linkedin className="w-5 h-5 text-blue-700" />
                      </button>
                      <button
                        onClick={() => handleShare('email')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        <Mail className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded relative"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">30-Day Returns</p>
                  <p className="text-xs text-gray-500">Hassle-free returns</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Secure Checkout</p>
                  <p className="text-xs text-gray-500">SSL encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex gap-8">
              {['description', 'specs', 'reviews', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`
                    py-4 px-1 border-b-2 font-medium capitalize transition-colors
                    ${activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                
                {/* Attributes */}
                {product.attributes.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {product.attributes.map((attr, index) => (
                        <li key={index}>
                          <strong>{attr.name}:</strong> {attr.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.sku && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">SKU</span>
                        <span className="font-medium">{product.sku}</span>
                      </div>
                    )}
                    {product.brand && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Brand</span>
                        <span className="font-medium">{product.brand}</span>
                      </div>
                    )}
                    {product.vendor && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Vendor</span>
                        <span className="font-medium">{product.vendor}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Weight</span>
                        <span className="font-medium">{product.weight} {product.shipping?.weightUnit || 'kg'}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Dimensions</span>
                        <span className="font-medium">
                          {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                        </span>
                      </div>
                    )}
                    {product.meta?.countryOfOrigin && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Country of Origin</span>
                        <span className="font-medium">{product.meta.countryOfOrigin}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Review Form */}
                <form onSubmit={handleReviewSubmit} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating *</label>
                      {renderRatingStars(reviewForm.rating, true)}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Review Title</label>
                      <input
                        type="text"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                        placeholder="Summarize your experience"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Review *</label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                        placeholder="Share your thoughts about this product"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-800 pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                {review.authorAvatar ? (
                                  <Image
                                    src={review.authorAvatar}
                                    alt={review.author}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <span className="text-lg font-medium">
                                    {review.author.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{review.author}</p>
                                <div className="flex items-center gap-2">
                                  {renderRatingStars(review.rating)}
                                  <span className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {review.verified && (
                              <span className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          {review.title && (
                            <h4 className="font-medium mb-2">{review.title}</h4>
                          )}
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{review.comment}</p>
                          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
                            <ThumbsUp className="w-4 h-4" />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">Standard Shipping</p>
                        <p className="text-sm text-gray-500">5-7 business days</p>
                        <p className="text-sm text-gray-500">$5.99 or FREE on orders over $50</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">Express Shipping</p>
                        <p className="text-sm text-gray-500">2-3 business days</p>
                        <p className="text-sm text-gray-500">$12.99</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">Overnight Shipping</p>
                        <p className="text-sm text-gray-500">Next business day</p>
                        <p className="text-sm text-gray-500">$24.99</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Return Policy</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {product.returnPolicy || product.meta?.returnPolicy || 
                      'We offer 30-day returns on all items. Items must be unused and in original packaging.'}
                  </p>
                </div>

                {product.warranty && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Warranty</h3>
                    <p className="text-gray-600 dark:text-gray-400">{product.warranty}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium group-hover:text-primary-600">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold mt-1">
                    {currency}{product.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}