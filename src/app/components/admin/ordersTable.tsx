'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calendar,
  RefreshCw,
  FileText,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  ShoppingBag
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  customer: {
    id: string
    name: string
    email: string
    phone?: string
    avatar?: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  shippingAddress: Address
  billingAddress?: Address
  createdAt: string
  updatedAt: string
  deliveredAt?: string
  notes?: string
  trackingNumber?: string
  shippingProvider?: string
}

interface OrderItem {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  total: number
  image?: string
  variant?: string
}

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'confirmed' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded'

type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded' 
  | 'partially_refunded'

interface OrdersTableProps {
  initialOrders?: Order[]
  onOrderUpdate?: (order: Order) => void
  showFilters?: boolean
  showExport?: boolean
  pageSize?: number
}

interface FilterState {
  status: OrderStatus | 'all'
  paymentStatus: PaymentStatus | 'all'
  dateRange: 'today' | 'week' | 'month' | 'custom' | 'all'
  search: string
  minAmount?: number
  maxAmount?: number
  customDateStart?: string
  customDateEnd?: string
}

interface SortState {
  field: keyof Order | 'customer.name'
  direction: 'asc' | 'desc'
}

export function OrdersTable({ 
  initialOrders = [], 
  onOrderUpdate,
  showFilters = true,
  showExport = true,
  pageSize = 10
}: OrdersTableProps) {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders)
  const [loading, setLoading] = useState(!initialOrders.length)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    search: ''
  })
  const [sort, setSort] = useState<SortState>({
    field: 'createdAt',
    direction: 'desc'
  })
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [bulkAction, setBulkAction] = useState<string>('')
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'excel'>('csv')

  const statusColors: Record<OrderStatus, { bg: string; text: string; icon: any }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    processing: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Package },
    confirmed: { bg: 'bg-purple-100', text: 'text-purple-800', icon: CheckCircle },
    shipped: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: Truck },
    delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    refunded: { bg: 'bg-gray-100', text: 'text-gray-800', icon: RefreshCw }
  }

  const paymentStatusColors: Record<PaymentStatus, { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    paid: { bg: 'bg-green-100', text: 'text-green-800' },
    failed: { bg: 'bg-red-100', text: 'text-red-800' },
    refunded: { bg: 'bg-gray-100', text: 'text-gray-800' },
    partially_refunded: { bg: 'bg-orange-100', text: 'text-orange-800' }
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sortBy: sort.field,
        sortOrder: sort.direction,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.paymentStatus !== 'all' && { paymentStatus: filters.paymentStatus }),
        ...(filters.dateRange !== 'all' && { dateRange: filters.dateRange }),
        ...(filters.search && { search: filters.search }),
        ...(filters.minAmount && { minAmount: filters.minAmount.toString() }),
        ...(filters.maxAmount && { maxAmount: filters.maxAmount.toString() })
      })

      const res = await fetch(`/api/admin/orders?${queryParams}`)
      if (!res.ok) throw new Error('Failed to fetch orders')
      
      const data = await res.json()
      setOrders(data.orders)
      setFilteredOrders(data.orders)
    } catch (error) {
      toast.error('Failed to load orders')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error('Failed to update order')

      const updatedOrder = await res.json()
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o))
      setFilteredOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o))
      
      if (onOrderUpdate) onOrderUpdate(updatedOrder)
      toast.success('Order status updated')
    } catch (error) {
      toast.error('Failed to update order')
    }
  }

  const updatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus })
      })

      if (!res.ok) throw new Error('Failed to update payment status')

      const updatedOrder = await res.json()
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o))
      setFilteredOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o))
      
      toast.success('Payment status updated')
    } catch (error) {
      toast.error('Failed to update payment status')
    }
  }

  const bulkUpdate = async (action: string) => {
    if (!selectedOrders.length) {
      toast.error('Please select orders')
      return
    }

    try {
      const res = await fetch('/api/admin/orders/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: selectedOrders,
          action
        })
      })

      if (!res.ok) throw new Error('Bulk update failed')

      await fetchOrders()
      setSelectedOrders([])
      setBulkAction('')
      toast.success(`Bulk ${action} completed`)
    } catch (error) {
      toast.error('Bulk update failed')
    }
  }

  const exportOrders = async () => {
    try {
      const res = await fetch(`/api/admin/orders/export?format=${exportFormat}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: selectedOrders.length ? selectedOrders : undefined,
          filters
        })
      })

      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders-export.${exportFormat}`
      a.click()
      
      toast.success('Orders exported successfully')
    } catch (error) {
      toast.error('Export failed')
    }
  }

  const printOrders = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Orders Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>
            <h1>Orders Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${(selectedOrders.length ? 
                  orders.filter(o => selectedOrders.includes(o.id)) : 
                  filteredOrders
                ).map(order => `
                  <tr>
                    <td>${order.orderNumber}</td>
                    <td>${order.customer.name}</td>
                    <td>$${order.total.toFixed(2)}</td>
                    <td>${order.status}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleSort = (field: SortState['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const toggleAllSelection = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id))
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    const Icon = statusColors[status].icon
    return <Icon className="w-4 h-4" />
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  useEffect(() => {
    if (!initialOrders.length) {
      fetchOrders()
    }
  }, [currentPage, sort, filters])

  // Apply filters locally if not using API
  useEffect(() => {
    if (initialOrders.length) {
      let filtered = [...initialOrders]

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(order =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.customer.name.toLowerCase().includes(searchLower) ||
          order.customer.email.toLowerCase().includes(searchLower)
        )
      }

      // Apply status filter
      if (filters.status !== 'all') {
        filtered = filtered.filter(order => order.status === filters.status)
      }

      // Apply payment status filter
      if (filters.paymentStatus !== 'all') {
        filtered = filtered.filter(order => order.paymentStatus === filters.paymentStatus)
      }

      // Apply date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.createdAt)
          
          switch (filters.dateRange) {
            case 'today':
              return orderDate >= today
            case 'week':
              const weekAgo = new Date(today)
              weekAgo.setDate(weekAgo.getDate() - 7)
              return orderDate >= weekAgo
            case 'month':
              const monthAgo = new Date(today)
              monthAgo.setMonth(monthAgo.getMonth() - 1)
              return orderDate >= monthAgo
            default:
              return true
          }
        })
      }

      // Apply amount filter
      if (filters.minAmount !== undefined) {
        filtered = filtered.filter(order => order.total >= filters.minAmount!)
      }
      if (filters.maxAmount !== undefined) {
        filtered = filtered.filter(order => order.total <= filters.maxAmount!)
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aVal: any = a[sort.field as keyof Order]
        let bVal: any = b[sort.field as keyof Order]

        if (sort.field === 'customer.name') {
          aVal = a.customer.name
          bVal = b.customer.name
        }

        if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1
        return 0
      })

      setFilteredOrders(filtered)
    }
  }, [initialOrders, filters, sort])

  const totalPages = Math.ceil(filteredOrders.length / pageSize)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Orders ({filteredOrders.length})
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {showExport && (
              <>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800"
                >
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                  <option value="pdf">PDF</option>
                </select>
                <button
                  onClick={exportOrders}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Export"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={printOrders}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Print"
                >
                  <Printer className="w-5 h-5" />
                </button>
              </>
            )}
            
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`
                p-2 rounded-lg transition-colors
                ${showFilterPanel 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
              title="Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            
            <button
              onClick={fetchOrders}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders by number, customer, email..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as OrderStatus | 'all' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Status
                </label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value as PaymentStatus | 'all' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                  <option value="partially_refunded">Partially Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minAmount || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAmount || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setFilters({
                  status: 'all',
                  paymentStatus: 'all',
                  dateRange: 'all',
                  search: '',
                  minAmount: undefined,
                  maxAmount: undefined
                })}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Bulk actions */}
        {selectedOrders.length > 0 && (
          <div className="mt-4 flex items-center gap-2 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <span className="text-sm text-primary-600 dark:text-primary-400">
              {selectedOrders.length} orders selected
            </span>
            <select
              value={bulkAction}
              onChange={(e) => {
                setBulkAction(e.target.value)
                if (e.target.value) {
                  bulkUpdate(e.target.value)
                }
              }}
              className="ml-auto px-3 py-1 text-sm border border-primary-300 dark:border-primary-700 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="">Bulk Actions</option>
              <option value="process">Mark as Processing</option>
              <option value="ship">Mark as Shipped</option>
              <option value="deliver">Mark as Delivered</option>
              <option value="cancel">Cancel Orders</option>
              <option value="delete">Delete Orders</option>
            </select>
            <button
              onClick={() => setSelectedOrders([])}
              className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={toggleAllSelection}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('orderNumber')}
                  className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Order #
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('customer.name')}
                  className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Customer
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('total')}
                  className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Total
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Date
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedOrders.map((order) => (
              <tr 
                key={order.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/admin/orders/${order.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    #{order.orderNumber}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {order.customer.avatar ? (
                      <Image
                        src={order.customer.avatar}
                        alt={order.customer.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {order.customer.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.customer.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.customer.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} units
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(order.total)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatCurrency(order.subtotal)} + {formatCurrency(order.shipping)} shipping
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className={`
                      px-2 py-1 text-xs font-medium rounded-full border-0
                      ${statusColors[order.status].bg} ${statusColors[order.status].text}
                    `}
                    style={{ width: 'auto' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${paymentStatusColors[order.paymentStatus].bg} ${paymentStatusColors[order.paymentStatus].text}
                  `}>
                    {order.paymentStatus.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowOrderDetails(true)
                      }}
                      className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/admin/orders/${order.id}/edit`}
                      className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Edit Order"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => window.open(`/admin/orders/${order.id}/invoice`, '_blank')}
                      className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filters.search || filters.status !== 'all' || filters.paymentStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Start by creating your first order'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowOrderDetails(false)} />
            
            <div className="relative bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Order Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Order Status</h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payment Status</h4>
                    <span className={`
                      px-3 py-1 text-sm font-medium rounded-full
                      ${paymentStatusColors[selectedOrder.paymentStatus].bg} ${paymentStatusColors[selectedOrder.paymentStatus].text}
                    `}>
                      {selectedOrder.paymentStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Customer Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer.name}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${selectedOrder.customer.email}`} className="hover:text-primary-600">
                              {selectedOrder.customer.email}
                            </a>
                          </div>
                          {selectedOrder.customer.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:${selectedOrder.customer.phone}`} className="hover:text-primary-600">
                                {selectedOrder.customer.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/admin/customers/${selectedOrder.customer.id}`}
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Shipping Address</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          {selectedOrder.shippingAddress.street}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {selectedOrder.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Order Items</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Product</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">SKU</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Price</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                  </p>
                                  {item.variant && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {item.variant}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {item.sku}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-right text-gray-900 dark:text-white">
                              {formatCurrency(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <td colSpan={4} className="px-4 py-2 text-right text-sm text-gray-600 dark:text-gray-400">
                            Subtotal:
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(selectedOrder.subtotal)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="px-4 py-2 text-right text-sm text-gray-600 dark:text-gray-400">
                            Shipping:
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(selectedOrder.shipping)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="px-4 py-2 text-right text-sm text-gray-600 dark:text-gray-400">
                            Tax:
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(selectedOrder.tax)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                            Total:
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(selectedOrder.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Tracking Information */}
                {(selectedOrder.trackingNumber || selectedOrder.shippingProvider) && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Tracking Information</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-4">
                        {selectedOrder.shippingProvider && (
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Provider</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedOrder.shippingProvider}
                            </p>
                          </div>
                        )}
                        {selectedOrder.trackingNumber && (
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Tracking #</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedOrder.trackingNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Order Notes</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Close
                </button>
                <Link
                  href={`/admin/orders/${selectedOrder.id}/edit`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Edit Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}