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
  Sparkles,
  ArrowRight,
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
  isFeatured?: boolean
  discount?: number
  stock?: number
  variants?: ProductVariant[]
}

interface ProductVariant {
  id: string
  name: string
  price?: number
}

interface FeaturedProductsProps {
  title?: string
  subtitle?: string
  products: Product[]
  layout?: 'grid' | 'carousel' | 'list' | 'compact'
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
  onAddToCart?: (product: Product, quantity?: number) => void
  onAddToWishlist?: (product: Product) => void
  className?: string
  currency?: string
}

export function FeaturedProducts({
  title = 'Featured Products',
  subtitle = 'Discover our hand-picked selection of top-rated products',
  products,
  layout = 'grid',
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
  className = '',
  currency = '$'
}: FeaturedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const itemsPerView = {
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6
  }[columns] || 4

  const maxIndex = Math.max(0, products.length - itemsPerView)

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      setWishlistItems(JSON.parse(saved))
    }
  }, [])

  // Autoplay
  useEffect(() => {
    if (!autoplay || isHovered || layout !== 'carousel') return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) > maxIndex ? 0 : prev + 1)
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [autoplay, autoplaySpeed, maxIndex, isHovered, layout])

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
    if (touchStart - touchEnd > 100) {
      handleNext()
    }
    if (touchStart - touchEnd < -100) {
      handlePrevious()
    }
  }

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setAddingToCart(product.id)
    
    try {
      if (onAddToCart) {
        await onAddToCart(product)
      } else {
        // Default add to cart logic
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

  const handleAddToWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    let updatedWishlist: string[]
    
    if (wishlistItems.includes(product.id)) {
      updatedWishlist = wishlistItems.filter(id => id !== product.id)
      toast.success('Removed from wishlist')
    } else {
      updatedWishlist = [...wishlistItems, product.id]
      toast.success('Added to wishlist')
      
      if (onAddToWishlist) {
        onAddToWishlist(product)
      }
    }
    
    setWishlistItems(updatedWishlist)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
  }

  const handleQuickView = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewProduct(product)
  }

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      case 5: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
      case 6: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
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

  const renderProductCard = (product: Product, index: number) => {
    const image = getProductImage(product)
    const discount = calculateDiscount(product)
    const isInWishlist = wishlistItems.includes(product.id)
    const isOutOfStock = product.stock === 0

    return (
      <div
        key={product.id}
        onClick={() => onProductClick?.(product)}
        className="group cursor-pointer"
      >
        {layout === 'list' ? (
          // List layout
          <Link href={`/products/${product.slug}`} className="flex items-center gap-6 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-all">
            {/* Image */}
            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              {image ? (
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  sizes="96px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl">📦</span>
                </div>
              )}
              
              {/* New badge */}
              {product.isNew && (
                <span className="absolute top-1 left-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                  New
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 line-clamp-1">
                {product.name}
              </h3>
              
              {/* Rating */}
              {showRating && product.rating !== undefined && (
                <div className="flex items-center gap-2 mt-1">
                  {renderRatingStars(product.rating)}
                  {product.reviewCount !== undefined && (
                    <span className="text-sm text-gray-500">({product.reviewCount})</span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {currency}{product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {currency}{product.compareAtPrice.toFixed(2)}
                  </span>
                )}
                {discount && (
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Stock status */}
              {isOutOfStock ? (
                <span className="inline-block mt-2 text-sm text-red-600">Out of stock</span>
              ) : product.stock && product.stock < 5 ? (
                <span className="inline-block mt-2 text-sm text-orange-600">
                  Only {product.stock} left
                </span>
              ) : null}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {showAddToCart && !isOutOfStock && (
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={addingToCart === product.id}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {addingToCart === product.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                </button>
              )}
              
              {showWishlist && (
                <button
                  onClick={(e) => handleAddToWishlist(product, e)}
                  className={`p-2 rounded-lg transition-colors ${
                    isInWishlist
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          </Link>
        ) : layout === 'compact' ? (
          // Compact layout
          <Link href={`/products/${product.slug}`} className="block text-center">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3">
              {image ? (
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
              )}
              
              {/* New badge */}
              {product.isNew && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                  New
                </span>
              )}
              
              {/* Discount badge */}
              {discount && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded">
                  -{discount}%
                </span>
              )}
            </div>
            
            <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 line-clamp-2">
              {product.name}
            </h3>
            
            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
              {currency}{product.price.toFixed(2)}
            </p>
            
            {showRating && product.rating !== undefined && (
              <div className="flex items-center justify-center gap-1 mt-1">
                {renderRatingStars(product.rating)}
                {product.reviewCount !== undefined && (
                  <span className="text-xs text-gray-500">({product.reviewCount})</span>
                )}
              </div>
            )}
          </Link>
        ) : (
          // Grid layout (default)
          <Link href={`/products/${product.slug}`} className="block relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all group">
            {/* Image container */}
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
              {image ? (
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl text-gray-400">📦</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                    New
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-2 py-0.5 bg-purple-500 text-white text-xs font-medium rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>

              {discount && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded">
                  -{discount}%
                </span>
              )}

              {/* Quick actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {showQuickView && (
                  <button
                    onClick={(e) => handleQuickView(product, e)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Quick view"
                  >
                    <Eye className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                
                {showAddToCart && !isOutOfStock && (
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addingToCart === product.id}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                    title="Add to cart"
                  >
                    {addingToCart === product.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-gray-700" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                )}
                
                {showWishlist && (
                  <button
                    onClick={(e) => handleAddToWishlist(product, e)}
                    className={`p-2 bg-white rounded-full hover:bg-gray-100 transition-colors ${
                      isInWishlist ? 'text-red-500' : 'text-gray-700'
                    }`}
                    title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>

              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                  <span className="px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 line-clamp-2 min-h-[3rem]">
                {product.name}
              </h3>
              
              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {product.variants.slice(0, 3).map((variant) => (
                    <span
                      key={variant.id}
                      className="w-2 h-2 rounded-full bg-gray-300"
                      title={variant.name}
                    />
                  ))}
                  {product.variants.length > 3 && (
                    <span className="text-xs text-gray-500">+{product.variants.length - 3}</span>
                  )}
                </div>
              )}

              {/* Rating */}
              {showRating && product.rating !== undefined && (
                <div className="flex items-center gap-2 mt-2">
                  {renderRatingStars(product.rating)}
                  {product.reviewCount !== undefined && (
                    <span className="text-sm text-gray-500">({product.reviewCount})</span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {currency}{product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {currency}{product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock indicator */}
              {!isOutOfStock && product.stock && product.stock < 5 && (
                <p className="text-xs text-orange-600 mt-2">
                  Only {product.stock} left in stock
                </p>
              )}
            </div>
          </Link>
        )}
      </div>
    )
  }

  // Render based on layout
  const renderContent = () => {
    if (layout === 'carousel') {
      return (
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={carouselRef}
            className="overflow-hidden"
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  {renderProductCard(product, index)}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          {products.length > itemsPerView && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
                aria-label="Next products"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {products.length > itemsPerView && (
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
      )
    }

    if (layout === 'list') {
      return (
        <div className="space-y-4">
          {products.map((product, index) => renderProductCard(product, index))}
        </div>
      )
    }

    if (layout === 'compact') {
      return (
        <div className={`grid ${getGridCols()} gap-4`}>
          {products.map((product, index) => renderProductCard(product, index))}
        </div>
      )
    }

    // Default grid layout
    return (
      <div className={`grid ${getGridCols()} gap-6`}>
        {products.map((product, index) => renderProductCard(product, index))}
      </div>
    )
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary-600" />
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {subtitle}
              </p>
            )}
          </div>

          {showViewAll && (
            <Link
              href={viewAllLink}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium group"
            >
              View All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Products */}
        {products.length > 0 ? (
          renderContent()
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Check back later for new products
            </p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setQuickViewProduct(null)} />
            
            <div className="relative bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ChevronRight className="w-5 h-5 rotate-45" />
              </button>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product image */}
                  <div>
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      {getProductImage(quickViewProduct) ? (
                        <Image
                          src={getProductImage(quickViewProduct)!}
                          alt={quickViewProduct.name}
                          width={500}
                          height={500}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-8xl text-gray-400">📦</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product details */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {quickViewProduct.name}
                    </h2>

                    {quickViewProduct.rating !== undefined && (
                      <div className="flex items-center gap-2 mb-4">
                        {renderRatingStars(quickViewProduct.rating)}
                        {quickViewProduct.reviewCount !== undefined && (
                          <span className="text-sm text-gray-500">
                            ({quickViewProduct.reviewCount} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {currency}{quickViewProduct.price.toFixed(2)}
                      </span>
                      {quickViewProduct.compareAtPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          {currency}{quickViewProduct.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-4 mb-6">
                      {quickViewProduct.stock !== undefined && (
                        <p className={quickViewProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                          {quickViewProduct.stock > 0 
                            ? `In stock (${quickViewProduct.stock} available)`
                            : 'Out of stock'
                          }
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      {showAddToCart && quickViewProduct.stock !== 0 && (
                        <button
                          onClick={() => {
                            handleAddToCart(quickViewProduct, new MouseEvent('click') as any)
                            setQuickViewProduct(null)
                          }}
                          className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                      )}
                      
                      <Link
                        href={`/products/${quickViewProduct.slug}`}
                        className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}