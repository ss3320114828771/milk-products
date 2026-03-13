'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RefreshCw,
  Shield,
  UserX,
  UserCheck,
  Download,
  Users,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'user' | 'admin' | 'moderator'
  status: 'active' | 'inactive' | 'banned'
  emailVerified: boolean
  createdAt: string
  lastLoginAt?: string
  _count: {
    orders: number
    reviews: number
    addresses: number
  }
  orders?: Order[]
  reviews?: Review[]
}

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
}

interface Review {
  id: string
  rating: number
  productId: string
  createdAt: string
}

interface UserTableProps {
  initialUsers?: User[]
  onUserUpdate?: (user: User) => void
  showFilters?: boolean
  pageSize?: number
}

type UserRole = 'user' | 'admin' | 'moderator' | 'all'
type UserStatus = 'active' | 'inactive' | 'banned' | 'all'

export function UserTable({ 
  initialUsers = [], 
  onUserUpdate,
  showFilters = true,
  pageSize = 10 
}: UserTableProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers)
  const [loading, setLoading] = useState(!initialUsers.length)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    role: 'all' as UserRole,
    status: 'all' as UserStatus,
    search: '',
    verified: 'all' as 'all' | 'verified' | 'unverified'
  })
  const [sort, setSort] = useState({
    field: 'createdAt' as keyof User | 'orders' | 'reviews',
    direction: 'desc' as 'asc' | 'desc'
  })
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [bulkAction, setBulkAction] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    banned: 0,
    admins: 0
  })

  const roleColors: Record<string, { bg: string; text: string }> = {
    admin: { bg: 'bg-purple-100', text: 'text-purple-800' },
    moderator: { bg: 'bg-blue-100', text: 'text-blue-800' },
    user: { bg: 'bg-gray-100', text: 'text-gray-800' }
  }

  const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
    active: { bg: 'bg-green-100', text: 'text-green-800', icon: UserCheck },
    inactive: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: UserX },
    banned: { bg: 'bg-red-100', text: 'text-red-800', icon: Ban }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sortBy: sort.field,
        sortOrder: sort.direction,
        ...(filters.role !== 'all' && { role: filters.role }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.verified !== 'all' && { verified: filters.verified === 'verified' ? 'true' : 'false' }),
        ...(filters.search && { search: filters.search })
      })

      const res = await fetch(`/api/admin/users?${queryParams}`)
      if (!res.ok) throw new Error('Failed to fetch users')
      
      const data = await res.json()
      setUsers(data.users)
      setFilteredUsers(data.users)
      setStats(data.stats)
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error('Failed to update user')

      const updatedUser = await res.json()
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u))
      setFilteredUsers(prev => prev.map(u => u.id === userId ? updatedUser : u))
      
      if (onUserUpdate) onUserUpdate(updatedUser)
      toast.success(`User ${status}`)
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })

      if (!res.ok) throw new Error('Failed to update role')

      const updatedUser = await res.json()
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u))
      setFilteredUsers(prev => prev.map(u => u.id === userId ? updatedUser : u))
      
      toast.success(`Role updated to ${role}`)
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete user')

      setUsers(prev => prev.filter(u => u.id !== userId))
      setFilteredUsers(prev => prev.filter(u => u.id !== userId))
      toast.success('User deleted')
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const bulkUpdate = async (action: string) => {
    if (!selectedUsers.length) {
      toast.error('Please select users')
      return
    }

    try {
      const res = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: selectedUsers,
          action
        })
      })

      if (!res.ok) throw new Error('Bulk update failed')

      await fetchUsers()
      setSelectedUsers([])
      setBulkAction('')
      toast.success(`Bulk ${action} completed`)
    } catch (error) {
      toast.error('Bulk update failed')
    }
  }

  const exportUsers = async () => {
    try {
      const res = await fetch('/api/admin/users/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: selectedUsers.length ? selectedUsers : undefined,
          filters
        })
      })

      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      
      toast.success('Users exported successfully')
    } catch (error) {
      toast.error('Export failed')
    }
  }

  const handleSort = (field: keyof User | 'orders' | 'reviews') => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleAllSelection = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id))
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusIcon = (status: string) => {
    const Icon = statusColors[status]?.icon || UserCheck
    return <Icon className="w-4 h-4" />
  }

  useEffect(() => {
    if (!initialUsers.length) {
      fetchUsers()
    }
  }, [currentPage, sort, filters])

  // Apply filters locally if using initial data
  useEffect(() => {
    if (initialUsers.length) {
      let filtered = [...initialUsers]

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(user =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone?.toLowerCase().includes(searchLower)
        )
      }

      if (filters.role !== 'all') {
        filtered = filtered.filter(user => user.role === filters.role)
      }

      if (filters.status !== 'all') {
        filtered = filtered.filter(user => user.status === filters.status)
      }

      if (filters.verified !== 'all') {
        filtered = filtered.filter(user => 
          filters.verified === 'verified' ? user.emailVerified : !user.emailVerified
        )
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aVal: any = a[sort.field as keyof User]
        let bVal: any = b[sort.field as keyof User]

        if (sort.field === 'orders') {
          aVal = a._count.orders
          bVal = b._count.orders
        } else if (sort.field === 'reviews') {
          aVal = a._count.reviews
          bVal = b._count.reviews
        }

        if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1
        return 0
      })

      setFilteredUsers(filtered)
    }
  }, [initialUsers, filters, sort])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Users ({filteredUsers.length})
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={exportUsers}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Export"
            >
              <Download className="w-5 h-5" />
            </button>
            
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
              onClick={fetchUsers}
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
            placeholder="Search users by name, email, phone..."
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
                  Role
                </label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as UserStatus }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Verified
                </label>
                <select
                  value={filters.verified}
                  onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setFilters({
                  role: 'all',
                  status: 'all',
                  search: '',
                  verified: 'all'
                })}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            <p className="text-2xl font-semibold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Banned</p>
            <p className="text-2xl font-semibold text-red-600">{stats.banned}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
            <p className="text-2xl font-semibold text-purple-600">{stats.admins}</p>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 flex items-center gap-2 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <span className="text-sm text-primary-600 dark:text-primary-400">
              {selectedUsers.length} users selected
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
              <option value="activate">Activate</option>
              <option value="deactivate">Deactivate</option>
              <option value="ban">Ban</option>
              <option value="delete">Delete</option>
              <option value="make-moderator">Make Moderator</option>
              <option value="make-admin">Make Admin</option>
            </select>
            <button
              onClick={() => setSelectedUsers([])}
              className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              <Trash2 className="w-5 h-5" />
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
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleAllSelection}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Role
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Status
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('orders')}
                  className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Orders
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('reviews')}
                  className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Reviews
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Joined
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedUsers.map((user) => (
              <tr 
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Phone className="w-3 h-3" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className={`
                      px-2 py-1 text-xs font-medium rounded-full border-0
                      ${roleColors[user.role].bg} ${roleColors[user.role].text}
                    `}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(user.status)}
                    <select
                      value={user.status}
                      onChange={(e) => updateUserStatus(user.id, e.target.value)}
                      className={`
                        px-2 py-1 text-xs font-medium rounded-full border-0
                        ${statusColors[user.status].bg} ${statusColors[user.status].text}
                      `}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/admin/orders?userId=${user.id}`}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{user._count.orders}</span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/admin/reviews?userId=${user.id}`}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400"
                  >
                    <Star className="w-4 h-4" />
                    <span>{user._count.reviews}</span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.lastLoginAt ? (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(user.lastLoginAt)}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Never</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowUserDetails(true)
                      }}
                      className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Edit User"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Send password reset email?')) {
                          fetch(`/api/admin/users/${user.id}/reset-password`, { method: 'POST' })
                            .then(() => toast.success('Reset email sent'))
                            .catch(() => toast.error('Failed to send'))
                        }
                      }}
                      className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Reset Password"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filters.search || filters.role !== 'all' || filters.status !== 'all'
                ? 'Try adjusting your filters'
                : 'No users have been created yet'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users
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

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowUserDetails(false)} />
            
            <div className="relative bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Details
                </h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-6">
                  {selectedUser.avatar ? (
                    <Image
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xl font-medium text-gray-600 dark:text-gray-400">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedUser.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${roleColors[selectedUser.role].bg} ${roleColors[selectedUser.role].text}
                      `}>
                        {selectedUser.role}
                      </span>
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${statusColors[selectedUser.status].bg} ${statusColors[selectedUser.status].text}
                      `}>
                        {selectedUser.status}
                      </span>
                      {selectedUser.emailVerified ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs text-yellow-600">Unverified</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                    <a href={`mailto:${selectedUser.email}`} className="text-sm text-primary-600 hover:underline">
                      {selectedUser.email}
                    </a>
                  </div>
                  {selectedUser.phone && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                      <a href={`tel:${selectedUser.phone}`} className="text-sm text-primary-600 hover:underline">
                        {selectedUser.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                    <ShoppingBag className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {selectedUser._count.orders}
                    </p>
                    <p className="text-xs text-gray-500">Orders</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                    <Star className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {selectedUser._count.reviews}
                    </p>
                    <p className="text-xs text-gray-500">Reviews</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                    <MapPin className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {selectedUser._count.addresses}
                    </p>
                    <p className="text-xs text-gray-500">Addresses</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Joined:</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {selectedUser.lastLoginAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Login:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(selectedUser.lastLoginAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Recent Orders */}
                {selectedUser.orders && selectedUser.orders.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Recent Orders
                    </h4>
                    <div className="space-y-2">
                      {selectedUser.orders.slice(0, 3).map(order => (
                        <Link
                          key={order.id}
                          href={`/admin/orders/${order.id}`}
                          className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">#{order.id.slice(-8)}</span>
                            <span className="text-sm">${order.total}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">{order.status}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}