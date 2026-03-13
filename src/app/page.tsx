import { prisma } from './lib/prisma'
import Link from 'next/link'
import Image from 'next/image' // Added Image import

export const revalidate = 60

export default async function Home() {
  try {
    const [featuredProducts, newProducts] = await Promise.all([
      prisma.product.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' }
      })
    ])

    const displayFeatured = featuredProducts.length > 0 ? featuredProducts : newProducts

    return (
      <div className="relative">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-4000" />
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to Our Store</h1>
            <p className="text-xl">Fresh products delivered to your door</p>
          </div>
        </section>
        
        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Featured Products
              </span>
            </h2>
            <p className="text-gray-600 text-lg">Discover our hand-picked selection of premium dairy products</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayFeatured.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.id}`}
                className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
              >
                {/* Image placeholder - always show a placeholder */}
                <div className="relative h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-purple-600 font-bold">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Category Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Milk', 'Cheese', 'Yogurt', 'Butter'].map(cat => (
                <Link
                  key={cat}
                  href={`/categories/${cat.toLowerCase()}`}
                  className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow"
                >
                  <span className="text-lg font-medium">{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                New Arrivals
              </span>
            </h2>
            <p className="text-gray-600 text-lg">Fresh from our farms to your table</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
              >
                {/* Image placeholder - always show a placeholder */}
                <div className="relative h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-purple-600 font-bold">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    )
  }
}