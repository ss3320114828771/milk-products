// src/app/page.tsx
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

// Product type define karo
interface Product {
  id: string
  name: string
  price: number
  description?: string
  image?: string
  isOrganic?: boolean
  weight?: string
}

export default async function Home() {
  try {
    
    // 🔥 FIX: MOCK DATA - No Prisma queries!
    const featuredProducts: Product[] = [
      {
        id: '1',
        name: 'Premium Organic Milk',
        price: 5.99,
        description: 'Fresh organic milk from grass-fed cows',
        image: '/images/milk.jpg',
        isOrganic: true,
        weight: '1L'
      },
      {
        id: '2',
        name: 'Aged Cheddar Cheese',
        price: 8.99,
        description: '24 months aged cheddar cheese',
        image: '/images/cheese.jpg',
        isOrganic: false,
        weight: '250g'
      },
      {
        id: '3',
        name: 'Greek Yogurt',
        price: 6.49,
        description: 'Creamy Greek yogurt',
        image: '/images/yogurt.jpg',
        isOrganic: true,
        weight: '500g'
      },
      {
        id: '4',
        name: 'Unsalted Butter',
        price: 4.99,
        description: 'Creamy unsalted butter',
        image: '/images/butter.jpg',
        isOrganic: false,
        weight: '250g'
      }
    ]

    const newProducts: Product[] = [
      {
        id: '5',
        name: 'Heavy Cream',
        price: 5.49,
        description: 'Rich heavy cream for desserts',
        image: '/images/cream.jpg',
        isOrganic: true,
        weight: '500ml'
      },
      {
        id: '6',
        name: 'Mozzarella Cheese',
        price: 7.99,
        description: 'Fresh mozzarella cheese',
        image: '/images/mozzarella.jpg',
        isOrganic: false,
        weight: '200g'
      },
      {
        id: '7',
        name: 'Buttermilk',
        price: 3.99,
        description: 'Cultured buttermilk',
        image: '/images/buttermilk.jpg',
        isOrganic: true,
        weight: '1L'
      },
      {
        id: '8',
        name: 'Cottage Cheese',
        price: 4.49,
        description: 'Low-fat cottage cheese',
        image: '/images/cottage.jpg',
        isOrganic: false,
        weight: '400g'
      }
    ]

    const displayFeatured = featuredProducts

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
            <p className="text-xl">Fresh dairy products delivered to your door</p>
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
            {displayFeatured.map((product: Product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.id}`}
                className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
              >
                {/* Image placeholder */}
                <div className="relative h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.weight}</p>
                <p className="text-purple-600 font-bold mt-2">${product.price.toFixed(2)}</p>
                {product.isOrganic && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Organic
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Category Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Milk', icon: '🥛' },
                { name: 'Cheese', icon: '🧀' },
                { name: 'Yogurt', icon: '🥣' },
                { name: 'Butter', icon: '🧈' }
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={`/categories/${cat.name.toLowerCase()}`}
                  className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow"
                >
                  <span className="text-3xl mb-2 block">{cat.icon}</span>
                  <span className="text-lg font-medium">{cat.name}</span>
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
            {newProducts.map((product: Product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
              >
                {/* Image placeholder */}
                <div className="relative h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.weight}</p>
                <p className="text-purple-600 font-bold mt-2">${product.price.toFixed(2)}</p>
                {product.isOrganic && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error:', error)
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