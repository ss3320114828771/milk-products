'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  dateOfBirth?: string
  gender?: string
  role: string
  emailVerified: boolean
  createdAt: string
  lastLoginAt?: string
  preferences?: {
    newsletter: boolean
    smsUpdates: boolean
    emailOffers: boolean
    language?: string
    currency?: string
  }
  _count: {
    orders: number
    reviews: number
    addresses: number
    wishlist: number
  }
  addresses: Address[]
  orders: Order[]
  reviews: Review[]
}

interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  _count: { items: number }
}

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  product: {
    id: string
    name: string
    images: string[]
  }
}

interface UpdateProfileData {
  name?: string
  phone?: string
  bio?: string
  dateOfBirth?: string
  gender?: string
}

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface AddressData {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault?: boolean
}

export function useUser(userId?: string) {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const id = userId || 'me'
      const res = await fetch(`/api/user/${id}`)
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth/login')
          return
        }
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch profile')
      }
      
      const data = await res.json()
      setProfile(data)
    } catch (err: any) {
      setError(err.message)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [userId, router])

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const id = userId || 'me'
      const res = await fetch(`/api/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const response = await res.json()

      if (!res.ok) {
        throw new Error(response.error || 'Failed to update profile')
      }

      setProfile(prev => prev ? { ...prev, ...response.user } : null)
      toast.success('Profile updated successfully')
      return { success: true }
    } catch (err: any) {
      toast.error(err.message)
      return { success: false, error: err.message }
    }
  }

  const changePassword = async (data: ChangePasswordData) => {
    try {
      const id = userId || 'me'
      const res = await fetch(`/api/user/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'changePassword',
          ...data
        })
      })

      const response = await res.json()

      if (!res.ok) {
        throw new Error(response.error || 'Failed to change password')
      }

      toast.success('Password changed successfully')
      return { success: true }
    } catch (err: any) {
      toast.error(err.message)
      return { success: false, error: err.message }
    }
  }

  const updatePreferences = async (preferences: any) => {
    try {
      const id = userId || 'me'
      const res = await fetch(`/api/user/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updatePreferences',
          ...preferences
        })
      })

      const response = await res.json()

      if (!res.ok) {
        throw new Error(response.error || 'Failed to update preferences')
      }

      setProfile(prev => prev ? {
        ...prev,
        preferences: response.preferences
      } : null)
      
      toast.success('Preferences updated')
      return { success: true }
    } catch (err: any) {
      toast.error(err.message)
      return { success: false, error: err.message }
    }
  }

  const updateAvatar = async (avatarUrl: string) => {
    try {
      const id = userId || 'me'
      const res = await fetch(`/api/user/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateAvatar',
          avatar: avatarUrl
        })
      })

      const response = await res.json()

      if (!res.ok) {
        throw new Error(response.error || 'Failed to update avatar')
      }

      setProfile(prev => prev ? { ...prev, avatar: response.avatar } : null)
      toast.success('Avatar updated')
      return { success: true }
    } catch (err: any) {
      toast.error(err.message)
      return { success: false, error: err.message }
    }
  }

  const addAddress = async (address: AddressData) => {
    try {
      const id = userId || 'me'
      const res = await fetch(`/api/user/${id}/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address)
      })

      const response = await res.json()

      if (!res.ok) {
        throw new Error(response.error || 'Failed to add address')
      }

      await fetchProfile() // Refresh profile
      toast.success('Address added successfully')
      return { success: true, address: response.address }
    } catch (err: any) {
      toast.error(err.message)
      return { success: false, error: err.message }
    }
  }

  const deactivateAccount = async (reason?: string) => {
    try {
      const id = userId || 'me'
      const res = await fetch(`/api/user/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })

      const response = await res.json()

      if (!res.ok) {
        throw new Error(response.error || 'Failed to deactivate account')
      }

      toast.success('Account deactivated')
      router.push('/')
      return { success: true }
    } catch (err: any) {
      toast.error(err.message)
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    updatePreferences,
    updateAvatar,
    addAddress,
    deactivateAccount
  }
}