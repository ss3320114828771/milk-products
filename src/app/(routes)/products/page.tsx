'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Grid3x3,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
  Star,
  ShoppingCart,
  Heart,
  Filter,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Flame,
  TrendingUp,
  Clock
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
  isOrganic: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  discount?: number
  isNew?: boolean
  isBestseller?: boolean
}

interface Category {
  id: string
  name: string
  count: number
  icon: string
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [sortBy, setSortBy] = useState('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    organic: false,
    inStock: false,
    discounted: false,
    rating: 0
  })

  const productsPerPage = 12

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, selectedCategory, priceRange, sortBy, filters, searchQuery])

  const fetchProducts = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Organic A2 Milk',
          description: 'Fresh organic A2 milk from grass-fed cows',
          price: 5.99,
          category: 'Milk',
          stock: 45,
          images: ['/images/products/milk-1.jpg'],
          weight: '1L',
          isOrganic: true,
          isFeatured: true,
          rating: 4.8,
          reviewCount: 128,
          isNew: true,
          isBestseller: true
        },
        {
          id: '2',
          name: 'Aged Cheddar Cheese',
          description: 'Premium aged cheddar cheese, 24 months',
          price: 8.99,
          category: 'Cheese',
          stock: 30,
          images: ['/images/products/cheese-1.jpg'],
          weight: '250g',
          isOrganic: false,
          isFeatured: true,
          rating: 4.7,
          reviewCount: 89,
          discount: 10,
          isBestseller: true
        },
        {
          id: '3',
          name: 'Greek Yogurt',
          description: 'Creamy Greek yogurt, high in protein',
          price: 6.49,
          category: 'Yogurt',
          stock: 25,
          images: ['/images/products/yogurt-1.jpg'],
          weight: '500g',
          isOrganic: true,
          isFeatured: false,
          rating: 4.9,
          reviewCount: 156,
          isNew: true
        },
        {
          id: '4',
          name: 'Unsalted Butter',
          description: 'Creamy unsalted butter, perfect for baking',
          price: 4.99,
          category: 'Butter',
          stock: 50,
          images: ['/images/products/butter-1.jpg'],
          weight: '250g',
          isOrganic: false,
          isFeatured: false,
          rating: 4.6,
          reviewCount: 67,
          discount: 15
        },
        {
          id: '5',
          name: 'Heavy Whipping Cream',
          description: 'Rich heavy cream for desserts',
          price: 5.49,
          category: 'Cream',
          stock: 8,
          images: ['/images/products/cream-1.jpg'],
          weight: '500ml',
          isOrganic: true,
          isFeatured: true,
          rating: 4.8,
          reviewCount: 45,
          isBestseller: true
        },
        {
          id: '6',
          name: 'Mozzarella Cheese',
          description: 'Fresh mozzarella cheese, perfect for pizza',
          price: 7.99,
          category: 'Cheese',
          stock: 0,
          images: ['/images/products/mozzarella-1.jpg'],
          weight: '200g',
          isOrganic: false,
          isFeatured: false,
          rating: 4.5,
          reviewCount: 34,
          discount: 20
        },
        {
          id: '7',
          name: 'Organic Cottage Cheese',
          description: 'Low-fat cottage cheese, high in protein',
          price: 4.49,
          category: 'Cheese',
          stock: 20,
          images: ['/images/products/cottage-1.jpg'],
          weight: '400g',
          isOrganic: true,
          isFeatured: false,
          rating: 4.4,
          reviewCount: 28,
          isNew: true
        },
        {
          id: '8',
          name: 'Buttermilk',
          description: 'Traditional cultured buttermilk',
          price: 3.99,
          category: 'Milk',
          stock: 15,
          images: ['/images/products/buttermilk-1.jpg'],
          weight: '1L',
          isOrganic: false,
          isFeatured: false,
          rating: 4.3,
          reviewCount: 19
        },
        {
          id: '9',
          name: 'Goat Cheese',
          description: 'Creamy goat cheese log',
          price: 6.99,
          category: 'Cheese',
          stock: 12,
          images: ['/images/products/goat-cheese-1.jpg'],
          weight: '150g',
          isOrganic: true,
          isFeatured: true,
          rating: 4.7,
          reviewCount: 42,
          isBestseller: true
        },
        {
          id: '10',
          name: 'Sour Cream',
          description: 'Cultured sour cream, 18% fat',
          price: 3.49,
          category: 'Cream',
          stock: 35,
          images: ['/images/products/sour-cream-1.jpg'],
          weight: '300g',
          isOrganic: false,
          isFeatured: false,
          rating: 4.2,
          reviewCount: 23
        },
        {
          id: '11',
          name: 'Parmesan Cheese',
          description: 'Aged Parmesan, grated',
          price: 9.99,
          category: 'Cheese',
          stock: 18,
          images: ['/images/products/parmesan-1.jpg'],
          weight: '200g',
          isOrganic: false,
          isFeatured: true,
          rating: 4.9,
          reviewCount: 67,
          discount: 5
        },
        {
          id: '12',
          name: 'Yogurt Drink',
          description: 'Probiotic yogurt drink, assorted flavors',
          price: 2.99,
          category: 'Yogurt',
          stock: 40,
          images: ['/images/products/yogurt-drink-1.jpg'],
          weight: '250ml',
          isOrganic: true,
          isFeatured: false,
          rating: 4.5,
          reviewCount: 31,
          isNew: true
        }
      ]

      const mockCategories: Category[] = [
        { id: 'all', name: 'All Products', count: 45, icon: '📦' },
        { id: 'Milk', name: 'Milk', count: 12, icon: '🥛' },
        { id: 'Cheese', name: 'Cheese', count: 15, icon: '🧀' },
        { id: 'Yogurt', name: 'Yogurt', count: 8, icon: '🍦' },
        { id: 'Butter', name: 'Butter', count: 5, icon: '🧈' },
        { id: 'Cream', name: 'Cream', count: 5, icon: '🥛' }
      ]

      setProducts(mockProducts)
      setCategories(mockCategories)
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Organic filter
    if (filters.organic) {
      filtered = filtered.filter(p => p.isOrganic)
    }

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0)
    }

    // Discounted filter
    if (filters.discounted) {
      filtered = filtered.filter(p => p.discount && p.discount > 0)
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating)
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
        break
      default:
        // featured - keep original order
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setPriceRange([0, 100])
    setSearchQuery('')
    setFilters({
      organic: false,
      inStock: false,
      discounted: false,
      rating: 0
    })
    setSortBy('featured')
  }

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const ProductCard = ({ product }: { product: Product }) => {
    const [isInWishlist, setIsInWishlist] = useState(false)

    return (
      <Link href={`/products/${product.id}`}>
        <div className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.isOrganic && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Leaf className="w-3 h-3 mr-1" />
                  Organic
                </span>
              )}
              {product.isNew && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Flame className="w-3 h-3 mr-1" />
                  New
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Bestseller
                </span>
              )}
              {product.discount && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Stock Status */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsInWishlist(!isInWishlist)
                toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!')
              }}
              className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs text-gray-500">{product.weight}</span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-3">
              <div className="flex">
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
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                {product.discount ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gradient">
                      ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-gradient">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  toast.success('Added to cart!')
                }}
                disabled={product.stock === 0}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  const ProductListItem = ({ product }: { product: Product }) => (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative md:w-48 h-48">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {product.isOrganic && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Organic
                </span>
              )}
              {product.discount && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <h3 className="text-xl font-bold mt-2">{product.name}</h3>
              </div>
              <span className="text-sm text-gray-500">{product.weight}</span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
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
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between">
              <div>
                {product.discount ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gradient">
                      ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gradient">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toast.success('Added to wishlist!')
                  }}
                  className="p-2 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toast.success('Added to cart!')
                  }}
                  disabled={product.stock === 0}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Stock Status */}
            {product.stock > 0 && product.stock < 10 && (
              <p className="text-sm text-orange-600 mt-2">
                Only {product.stock} left in stock!
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
            
            {/* Filter Bar Skeleton */}
            <div className="h-12 bg-gray-200 rounded mb-8" />
            
            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded" />
              ))}
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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Our Products</span>
          </h1>
          <p className="text-gray-600">
            Discover our range of fresh, high-quality dairy products
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`
            lg:w-64 flex-shrink-0
            ${showFilters ? 'block' : 'hidden lg:block'}
          `}>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                      <span className="text-sm opacity-75">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-24 px-3 py-1 border border-gray-200 rounded-lg"
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-24 px-3 py-1 border border-gray-200 rounded-lg"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.organic}
                    onChange={(e) => setFilters({ ...filters, organic: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span>Organic Only</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.discounted}
                    onChange={(e) => setFilters({ ...filters, discounted: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span>On Sale</span>
                </label>

                <div>
                  <h4 className="font-semibold mb-2">Minimum Rating</h4>
                  <div className="flex items-center space-x-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilters({ ...filters, rating })}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          filters.rating === rating
                            ? 'bg-yellow-400 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {rating}+ ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedProducts.map((product) => (
                      <ProductListItem key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}