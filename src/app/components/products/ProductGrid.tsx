'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Grid,
  List,
  LayoutGrid,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  Eye,
  Heart,
  ShoppingCart,
  Star,
  Filter
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
  brand?: string
  vendor?: string
}

interface ProductGridProps {
  products: Product[]
  totalProducts?: number
  loading?: boolean
  layout?: 'grid' | 'list' | 'compact'
  columns?: 2 | 3 | 4 | 5 | 6
  gap?: 'none' | 'sm' | 'md' | 'lg'
  showRating?: boolean
  showAddToCart?: boolean
  showWishlist?: boolean
  showQuickView?: boolean
  showPagination?: boolean
  showLoadMore?: boolean
  infiniteScroll?: boolean
  pageSize?: number
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onLoadMore?: () => void
  onProductClick?: (product: Product) => void
  onAddToCart?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
  onQuickView?: (product: Product) => void
  emptyStateMessage?: string
  loadingComponent?: React.ReactNode
  className?: string
  currency?: string
}

export function ProductGrid({
  products,
  totalProducts,
  loading = false,
  layout = 'grid',
  columns = 4,
  gap = 'md',
  showRating = true,
  showAddToCart = true,
  showWishlist = true,
  showQuickView = true,
  showPagination = true,
  showLoadMore = false,
  infiniteScroll = false,
  pageSize = 12,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onLoadMore,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  emptyStateMessage = 'No products found',
  loadingComponent,
  className = '',
  currency = '$'
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>(layout)
  const [isInWishlist, setIsInWishlist] = useState<Set<string>>(new Set())
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set())
  const [visibleProducts, setVisibleProducts] = useState<Product[]>(products)
  const [hasMore, setHasMore] = useState(currentPage < totalPages)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      setIsInWishlist(new Set(JSON.parse(saved)))
    }
  }, [])

  // Update visible products when products prop changes
  useEffect(() => {
    setVisibleProducts(products)
    setHasMore(currentPage < totalPages)
  }, [products, currentPage, totalPages])

  // Infinite scroll observer
  useEffect(() => {
    if (!infiniteScroll || !loadMoreRef.current || !hasMore || loading) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          handleLoadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [infiniteScroll, hasMore, isLoadingMore, loading])

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

  const handleLoadMore = () => {
    if (onLoadMore) {
      setIsLoadingMore(true)
      onLoadMore()
      // Reset loading state after a short delay to prevent double triggers
      setTimeout(() => setIsLoadingMore(false), 500)
    }
  }

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleImageError = (productId: string) => {
    setImageLoadErrors(prev => new Set(prev).add(productId))
  }

  const getGridCols = () => {
    if (viewMode === 'list') return 'grid-cols-1'
    if (viewMode === 'compact') {
      switch (columns) {
        case 2: return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        case 3: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        case 4: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        case 5: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        case 6: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
        default: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
      }
    }
    
    switch (columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 5: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      case 6: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }
  }

  const getGapClass = () => {
    switch (gap) {
      case 'none': return 'gap-0'
      case 'sm': return 'gap-2 sm:gap-3'
      case 'md': return 'gap-4 sm:gap-5'
      case 'lg': return 'gap-6 sm:gap-8'
      default: return 'gap-4 sm:gap-5'
    }
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
    const imageUrl = !imageLoadErrors.has(product.id) 
      ? product.image || product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url
      : null
    const discount = product.discount || (product.compareAtPrice 
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
      : 0)
    const isOutOfStock = product.stock === 0
    const inWishlist = isInWishlist.has(product.id)

    if (viewMode === 'list') {
      return (
        <div
          key={product.id}
          onClick={() => onProductClick?.(product)}
          className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative sm:w-48 h-48 bg-gray-100 dark:bg-gray-800">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 192px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={() => handleImageError(product.id)}
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
                {discount > 0 && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                    -{discount}%
                  </span>
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

            {/* Content */}
            <div className="flex-1 p-6">
              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
              )}

              {/* Title */}
              <Link href={`/products/${product.slug}`} className="block">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 mb-2">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              {showRating && product.rating !== undefined && (
                <div className="flex items-center gap-2 mb-3">
                  {renderRatingStars(product.rating)}
                  {product.reviewCount !== undefined && (
                    <span className="text-sm text-gray-500">({product.reviewCount})</span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currency}{product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    {currency}{product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {showAddToCart && !isOutOfStock && (
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addingToCart === product.id}
                    className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {addingToCart === product.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                )}

                {showWishlist && (
                  <button
                    onClick={(e) => handleAddToWishlist(product, e)}
                    className={`p-2 border rounded-lg transition-colors ${
                      inWishlist
                        ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                )}

                {showQuickView && (
                  <button
                    onClick={(e) => handleQuickView(product, e)}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (viewMode === 'compact') {
      return (
        <div
          key={product.id}
          onClick={() => onProductClick?.(product)}
          className="group cursor-pointer"
        >
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-2">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => handleImageError(product.id)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}

            {/* Badges */}
            {discount > 0 && (
              <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                -{discount}%
              </span>
            )}

            {/* Quick actions */}
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              {showAddToCart && !isOutOfStock && (
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={addingToCart === product.id}
                  className="w-full py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center gap-1"
                >
                  {addingToCart === product.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 line-clamp-2 mb-1">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-gray-900 dark:text-white">
              {currency}{product.price.toFixed(2)}
            </span>
            {showWishlist && (
              <button
                onClick={(e) => handleAddToWishlist(product, e)}
                className={`p-1.5 rounded-full transition-colors ${
                  inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {showRating && product.rating !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              {renderRatingStars(product.rating)}
            </div>
          )}
        </div>
      )
    }

    // Default grid layout
    return (
      <div
        key={product.id}
        onClick={() => onProductClick?.(product)}
        className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
      >
        {/* Image container */}
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => handleImageError(product.id)}
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
            {discount > 0 && (
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
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 line-clamp-2 min-h-[3rem]">
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
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {loadingComponent || (
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        )}
      </div>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {emptyStateMessage}
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters or check back later
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* View mode toggle for list/grid */}
      <div className="flex items-center justify-between mb-6">
        {totalProducts !== undefined && (
          <p className="text-sm text-gray-500">
            Showing {products.length} of {totalProducts} products
          </p>
        )}
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary-600 text-white'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="List view"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'compact'
                ? 'bg-primary-600 text-white'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Compact view"
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product grid */}
      <div className={`grid ${getGridCols()} ${getGapClass()}`}>
        {visibleProducts.map(renderProductCard)}
      </div>

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      )}

      {/* Load more button */}
      {showLoadMore && hasMore && !infiniteScroll && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {infiniteScroll && hasMore && (
        <div ref={loadMoreRef} className="h-10" />
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`
                w-10 h-10 rounded-lg transition-colors
                ${currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}