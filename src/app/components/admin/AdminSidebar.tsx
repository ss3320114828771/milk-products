'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  Tag, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Star,
  Truck,
  Bell,
  Shield,
  Menu,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

interface MenuItem {
  title: string
  path: string
  icon: React.ReactNode
  badge?: number
  submenu?: SubMenuItem[]
}

interface SubMenuItem {
  title: string
  path: string
}

interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalProducts: number
  pendingOrders: number
  lowStock: number
  pendingReviews: number
}

export function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: stats?.pendingOrders,
      submenu: [
        { title: 'All Orders', path: '/admin/orders' },
        { title: 'Pending', path: '/admin/orders/pending' },
        { title: 'Processing', path: '/admin/orders/processing' },
        { title: 'Shipped', path: '/admin/orders/shipped' },
        { title: 'Delivered', path: '/admin/orders/delivered' },
        { title: 'Cancelled', path: '/admin/orders/cancelled' },
      ]
    },
    {
      title: 'Products',
      path: '/admin/products',
      icon: <Package className="w-5 h-5" />,
      badge: stats?.lowStock,
      submenu: [
        { title: 'All Products', path: '/admin/products' },
        { title: 'Add New', path: '/admin/products/new' },
        { title: 'Categories', path: '/admin/categories' },
        { title: 'Brands', path: '/admin/brands' },
        { title: 'Low Stock', path: '/admin/products/low-stock' },
        { title: 'Inventory', path: '/admin/inventory' },
      ]
    },
    {
      title: 'Customers',
      path: '/admin/customers',
      icon: <Users className="w-5 h-5" />,
      badge: stats?.totalUsers,
      submenu: [
        { title: 'All Customers', path: '/admin/customers' },
        { title: 'New Customers', path: '/admin/customers/new' },
        { title: 'VIP Customers', path: '/admin/customers/vip' },
        { title: 'Banned Users', path: '/admin/customers/banned' },
      ]
    },
    {
      title: 'Marketing',
      path: '/admin/marketing',
      icon: <Tag className="w-5 h-5" />,
      submenu: [
        { title: 'Discounts', path: '/admin/discounts' },
        { title: 'Coupons', path: '/admin/coupons' },
        { title: 'Campaigns', path: '/admin/campaigns' },
        { title: 'Newsletter', path: '/admin/newsletter' },
      ]
    },
    {
      title: 'Reviews',
      path: '/admin/reviews',
      icon: <Star className="w-5 h-5" />,
      badge: stats?.pendingReviews,
      submenu: [
        { title: 'All Reviews', path: '/admin/reviews' },
        { title: 'Pending Approval', path: '/admin/reviews/pending' },
        { title: 'Reported', path: '/admin/reviews/reported' },
      ]
    },
    {
      title: 'Shipping',
      path: '/admin/shipping',
      icon: <Truck className="w-5 h-5" />,
      submenu: [
        { title: 'Zones', path: '/admin/shipping/zones' },
        { title: 'Rates', path: '/admin/shipping/rates' },
        { title: 'Tracking', path: '/admin/shipping/tracking' },
      ]
    },
    {
      title: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      submenu: [
        { title: 'Overview', path: '/admin/analytics' },
        { title: 'Sales', path: '/admin/analytics/sales' },
        { title: 'Traffic', path: '/admin/analytics/traffic' },
        { title: 'Reports', path: '/admin/analytics/reports' },
      ]
    },
    {
      title: 'Notifications',
      path: '/admin/notifications',
      icon: <Bell className="w-5 h-5" />,
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
      submenu: [
        { title: 'General', path: '/admin/settings/general' },
        { title: 'Payment', path: '/admin/settings/payment' },
        { title: 'Shipping', path: '/admin/settings/shipping' },
        { title: 'Tax', path: '/admin/settings/tax' },
        { title: 'Email', path: '/admin/settings/email' },
        { title: 'SEO', path: '/admin/settings/seo' },
      ]
    },
    {
      title: 'Security',
      path: '/admin/security',
      icon: <Shield className="w-5 h-5" />,
      submenu: [
        { title: 'Roles', path: '/admin/security/roles' },
        { title: 'Permissions', path: '/admin/security/permissions' },
        { title: 'Activity Log', path: '/admin/security/logs' },
        { title: 'Backup', path: '/admin/security/backup' },
      ]
    }
  ]

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) throw new Error('Failed to fetch stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (!res.ok) throw new Error('Logout failed')
      
      toast.success('Logged out successfully')
      router.push('/auth/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const toggleSubmenu = (title: string) => {
    setExpandedMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(path)
  }

  const isSubmenuActive = (submenu: SubMenuItem[]) => {
    return submenu.some(item => pathname === item.path)
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  // Mobile menu toggle
  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const sidebarClasses = `
    fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
    transition-all duration-300 z-30
    ${collapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `

  const renderMenuItem = (item: MenuItem) => {
    const active = isActive(item.path)
    const hasSubmenu = item.submenu && item.submenu.length > 0
    const expanded = expandedMenus.includes(item.title)
    const submenuActive = hasSubmenu && isSubmenuActive(item.submenu!)

    return (
      <div key={item.path} className="px-2 py-1">
        {!hasSubmenu ? (
          <Link
            href={item.path}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative
              ${active 
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
              ${collapsed ? 'justify-center' : 'justify-start'}
            `}
          >
            {item.icon}
            {!collapsed && (
              <>
                <span className="flex-1 text-sm font-medium">{item.title}</span>
                {item.badge ? (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </>
            )}
            {collapsed && item.badge ? (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            ) : null}
          </Link>
        ) : (
          <>
            <button
              onClick={() => toggleSubmenu(item.title)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative
                ${active || submenuActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
                ${collapsed ? 'justify-center' : 'justify-between'}
              `}
            >
              <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                {item.icon}
                {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
              </div>
              {!collapsed && (
                <div className="flex items-center gap-2">
                  {item.badge ? (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                  {expanded ? (
                    <ChevronRight className="w-4 h-4 transform rotate-90 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 transition-transform" />
                  )}
                </div>
              )}
              {collapsed && item.badge ? (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              ) : null}
            </button>
            
            {!collapsed && expanded && (
              <div className="ml-4 mt-1 space-y-1">
                {item.submenu?.map((subItem) => (
                  <Link
                    key={subItem.path}
                    href={subItem.path}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${pathname === subItem.path
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <span className="w-1 h-1 bg-current rounded-full"></span>
                    <span className="text-sm">{subItem.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed bottom-4 right-4 z-40 p-3 bg-primary-600 text-white rounded-full shadow-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Logo area */}
        <div className={`
          flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800
          ${collapsed ? 'justify-center' : 'justify-between'}
        `}>
          {!collapsed ? (
            <>
              <Link href="/admin" className="text-xl font-bold text-primary-600">
                Admin
              </Link>
              <button
                onClick={onToggle}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {menuItems.map(renderMenuItem)}

          {/* Logout button */}
          <div className="px-2 py-1 mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                ${collapsed ? 'justify-center' : 'justify-start'}
              `}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}