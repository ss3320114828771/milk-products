'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star,
  Package,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  image?: string
  images?: { url: string; isPrimary: boolean }[]
  rating?: number
  reviewCount?: number
  isNew?: boolean
  discount?: number
  stock?: number
  brand?: string
  category?: string
}

interface RelatedProductsProps {
  products: Product[]
  currentProductId?: string
  title?: string
  subtitle?: string
  layout?: 'grid' | 'carousel'
  columns?: 2 | 3 | 4 | 5 | 6
  showRating?: boolean
  showAddToCart?: boolean
  showWishlist?: boolean
  showQuickView?: boolean
  showViewAll?: boolean
  viewAllLink?: string
  autoplay?: boolean
  autoplaySpeed?: number
  onProductClick?: (product: Product) => void
  onAddToCart?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
  onQuickView?: (product: Product) => void
  loading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
  currency?: string
}

export function RelatedProducts({
  products,
  currentProductId,
  title = 'You May Also Like',
  subtitle = 'Products you might be interested in',
  layout = 'carousel',
  columns = 4,
  showRating = true,
  showAddToCart = true,
  showWishlist = true,
  showQuickView = true,
  showViewAll = true,
  viewAllLink = '/products',
  autoplay = false,
  autoplaySpeed = 5000,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  loading = false,
  error,
  onRetry,
  className = '',
  currency = '$'
}: RelatedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState<Set<string>>(new Set())
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Filter out current product
  const filteredProducts = products.filter(p => p.id !== currentProductId)
  
  const itemsPerView = {
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6
  }[columns] || 4

  const maxIndex = Math.max(0, filteredProducts.length - itemsPerView)

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      setIsInWishlist(new Set(JSON.parse(saved)))
    }
  }, [])

  // Autoplay
  useEffect(() => {
    if (!autoplay || isHovered || layout !== 'carousel' || filteredProducts.length <= itemsPerView) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) > maxIndex ? 0 : prev + 1)
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [autoplay, autoplaySpeed, maxIndex, isHovered, layout, filteredProducts.length, itemsPerView])

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext()
    }
    if (touchStart - touchEnd < -50) {
      handlePrevious()
    }
  }

  const handleAddToWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const newWishlist = new Set(isInWishlist)
    if (newWishlist.has(product.id)) {
      newWishlist.delete(product.id)
      toast.success('Removed from wishlist')
    } else {
      newWishlist.add(product.id)
      toast.success('Added to wishlist')
      if (onAddToWishlist) {
        onAddToWishlist(product)
      }
    }

    setIsInWishlist(newWishlist)
    localStorage.setItem('wishlist', JSON.stringify([...newWishlist]))
  }

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setAddingToCart(product.id)
    
    try {
      if (onAddToCart) {
        await onAddToCart(product)
      } else {
        // Default add to cart
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1
          })
        })
      }
      
      toast.success(`${product.name} added to cart`)
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(null)
    }
  }

  const handleQuickView = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onQuickView) {
      onQuickView(product)
    }
  }

  const getProductImage = (product: Product): string | undefined => {
    if (product.image) return product.image
    if (product.images) {
      const primary = product.images.find(img => img.isPrimary)
      return primary?.url || product.images[0]?.url
    }
    return undefined
  }

  const calculateDiscount = (product: Product): number | undefined => {
    if (product.discount) return product.discount
    if (product.compareAtPrice && product.price < product.compareAtPrice) {
      return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    }
    return undefined
  }

  const renderRatingStars = (rating: number = 0) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  const renderProductCard = (product: Product) => {
    const image = getProductImage(product)
    const discount = calculateDiscount(product)
    const inWishlist = isInWishlist.has(product.id)
    const isOutOfStock = product.stock === 0

    return (
      <div
        key={product.id}
        onClick={() => onProductClick?.(product)}
        className="group cursor-pointer"
      >
        <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                  New
                </span>
              )}
              {discount && discount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Quick actions */}
            <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {showWishlist && (
                <button
                  onClick={(e) => handleAddToWishlist(product, e)}
                  className={`p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform ${
                    inWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              )}
              
              {showQuickView && (
                <button
                  onClick={(e) => handleQuickView(product, e)}
                  className="p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-primary-600 hover:scale-110 transition-transform"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="px-3 py-1 bg-black text-white text-sm font-medium rounded">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="p-4">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
            )}

            {/* Title */}
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            {showRating && product.rating !== undefined && (
              <div className="flex items-center gap-2 mt-2">
                {renderRatingStars(product.rating)}
                {product.reviewCount !== undefined && (
                  <span className="text-xs text-gray-500">({product.reviewCount})</span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {currency}{product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through ml-2">
                    {currency}{product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {showAddToCart && !isOutOfStock && (
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={addingToCart === product.id}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  title="Add to cart"
                >
                  {addingToCart === product.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600 dark:text-gray-400 mb-8">{subtitle}</p>}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  // No products
  if (filteredProducts.length === 0) {
    return null
  }

  // Grid layout
  if (layout === 'grid') {
    return (
      <section className={`py-12 ${className}`}>
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
              {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-2">{subtitle}</p>}
            </div>
            
            {showViewAll && (
              <Link
                href={viewAllLink}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link>
            )}
          </div>

          {/* Products grid */}
          <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-6`}>
            {filteredProducts.slice(0, columns * 2).map(renderProductCard)}
          </div>
        </div>
      </section>
    )
  }

  // Carousel layout (default)
  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-2">{subtitle}</p>}
          </div>
          
          <div className="flex items-center gap-4">
            {showViewAll && (
              <Link
                href={viewAllLink}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link>
            )}
            
            {/* Carousel controls */}
            {filteredProducts.length > itemsPerView && (
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Previous products"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Next products"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                {renderProductCard(product)}
              </div>
            ))}
          </div>

          {/* Gradient overlays */}
          {currentIndex > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
          )}
          {currentIndex < maxIndex && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Dots indicator */}
        {filteredProducts.length > itemsPerView && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`
                  w-2 h-2 rounded-full transition-all
                  ${currentIndex === index 
                    ? 'w-6 bg-primary-600' 
                    : 'bg-gray-300 dark:bg-gray-700 hover:bg-primary-400'
                  }
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}