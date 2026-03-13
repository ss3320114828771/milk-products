'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Package, 
  Heart, 
  Clock, 
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Star,
  Truck,
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MoreVertical
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  cancelledOrders: number
  totalSpent: number
  wishlistCount: number
  loyaltyPoints: number
  memberSince: string
}

interface RecentOrder {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: number
  estimatedDelivery?: string
}

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  inStock: boolean
}

interface Activity {
  id: string
  type: 'order' | 'wishlist' | 'review' | 'login'
  description: string
  timestamp: string
  icon: any
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockStats: DashboardStats = {
        totalOrders: 24,
        completedOrders: 18,
        pendingOrders: 4,
        cancelledOrders: 2,
        totalSpent: 1250.75,
        wishlistCount: 8,
        loyaltyPoints: 450,
        memberSince: '2024-01-15'
      }

      const mockOrders: RecentOrder[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          date: '2024-03-10',
          status: 'delivered',
          total: 45.97,
          items: 3,
          estimatedDelivery: '2024-03-12'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          date: '2024-03-08',
          status: 'shipped',
          total: 78.50,
          items: 5,
          estimatedDelivery: '2024-03-14'
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          date: '2024-03-05',
          status: 'processing',
          total: 23.99,
          items: 2,
          estimatedDelivery: '2024-03-15'
        },
        {
          id: '4',
          orderNumber: 'ORD-2024-004',
          date: '2024-03-01',
          status: 'pending',
          total: 92.45,
          items: 4,
          estimatedDelivery: '2024-03-16'
        }
      ]

      const mockWishlist: WishlistItem[] = [
        {
          id: '1',
          name: 'Organic A2 Milk',
          price: 5.99,
          image: '/images/products/milk-1.jpg',
          inStock: true
        },
        {
          id: '2',
          name: 'Aged Cheddar Cheese',
          price: 8.99,
          image: '/images/products/cheese-1.jpg',
          inStock: true
        },
        {
          id: '3',
          name: 'Greek Yogurt',
          price: 6.49,
          image: '/images/products/yogurt-1.jpg',
          inStock: false
        },
        {
          id: '4',
          name: 'Unsalted Butter',
          price: 4.99,
          image: '/images/products/butter-1.jpg',
          inStock: true
        }
      ]

      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'order',
          description: 'Order #ORD-2024-001 has been delivered',
          timestamp: '2 hours ago',
          icon: CheckCircle
        },
        {
          id: '2',
          type: 'wishlist',
          description: 'Added Aged Cheddar Cheese to wishlist',
          timestamp: '5 hours ago',
          icon: Heart
        },
        {
          id: '3',
          type: 'review',
          description: 'You reviewed Fresh Organic Milk',
          timestamp: '1 day ago',
          icon: Star
        },
        {
          id: '4',
          type: 'order',
          description: 'Order #ORD-2024-002 has been shipped',
          timestamp: '2 days ago',
          icon: Truck
        },
        {
          id: '5',
          type: 'login',
          description: 'New login from Chrome on Windows',
          timestamp: '3 days ago',
          icon: Clock
        }
      ]

      setStats(mockStats)
      setRecentOrders(mockOrders)
      setWishlistItems(mockWishlist)
      setActivities(mockActivities)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-600',
      processing: 'bg-blue-100 text-blue-600',
      shipped: 'bg-purple-100 text-purple-600',
      delivered: 'bg-green-100 text-green-600',
      cancelled: 'bg-red-100 text-red-600'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600'
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered': return CheckCircle
      case 'cancelled': return XCircle
      case 'shipped': return Truck
      case 'processing': return Clock
      default: return AlertCircle
    }
  }

  const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{label}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )

  // Stats array for the cards
  const statsData = stats ? [
    { icon: Package, label: 'Total Orders', value: stats.totalOrders.toString(), color: 'blue', trend: '+12%' },
    { icon: DollarSign, label: 'Total Spent', value: `$${stats.totalSpent.toFixed(2)}`, color: 'green', trend: '+8%' },
    { icon: Heart, label: 'Wishlist', value: `${stats.wishlistCount} items`, color: 'red', trend: null },
    { icon: Star, label: 'Loyalty Points', value: `${stats.loyaltyPoints} pts`, color: 'purple', trend: '+25' }
  ] : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded" />
                <div className="h-48 bg-gray-200 rounded" />
              </div>
              <div className="h-96 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, John! 👋
              </span>
            </h1>
            <p className="text-gray-600">
              Member since {new Date(stats.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link
              href="/dashboard/profile"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => toast.success('Logged out successfully!')}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Orders */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Orders</h2>
                <Link 
                  href="/dashboard/orders" 
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)
                  return (
                    <div 
                      key={order.id}
                      className="group relative bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Date</p>
                              <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total</p>
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Items</p>
                              <p className="font-medium">{order.items}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Est. Delivery</p>
                              <p className="font-medium">{order.estimatedDelivery || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-start space-x-2">
                          <Link
                            href={`/orders/${order.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar for shipped/delivered */}
                      {(order.status === 'shipped' || order.status === 'processing') && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Order Placed</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: order.status === 'shipped' ? '66%' : '33%' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Wishlist Preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Wishlist</h2>
                <Link 
                  href="/wishlist" 
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {wishlistItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="group relative bg-gray-50 rounded-lg p-3 hover:shadow-md transition-all duration-300">
                    <div className="relative w-full h-24 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-xs font-medium px-2 py-1 bg-red-500 rounded-full">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">${item.price.toFixed(2)}</span>
                      {item.inStock && (
                        <button className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors">
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/products"
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-5 h-5" />
                    <span>Shop Products</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/track-order"
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5" />
                    <span>Track Order</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/dashboard/profile"
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5" />
                    <span>Profile Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 group">
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 mb-1">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Loyalty Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Loyalty Points</h3>
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stats.loyaltyPoints}
                </div>
                <p className="text-sm text-gray-600">Points Earned</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Reward:</span>
                  <span className="font-medium">$10 off</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="text-xs text-gray-500">250 more points to unlock</p>
              </div>

              <button className="w-full mt-4 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                View Rewards
              </button>
            </div>

            {/* Saved Address */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Default Address</h3>
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="font-medium">John Doe</p>
                <p className="text-gray-600">123 Dairy Lane</p>
                <p className="text-gray-600">Farmington, CA 12345</p>
                <p className="text-gray-600">United States</p>
                <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
              </div>

              <Link
                href="/dashboard/addresses"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 group"
              >
                Manage Addresses
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section - Mobile */}
        <div className="mt-8 lg:hidden">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}