'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Lock,
  Bell,
  Shield,
  CreditCard,
  Package,
  Heart,
  LogOut,
  Upload
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other' | ''
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  preferences: {
    newsletter: boolean
    smsUpdates: boolean
    emailOffers: boolean
  }
  joinDate: string
  lastLogin: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [avatarHover, setAvatarHover] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})

  // Mock data - replace with actual API call
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      // Mock data
      const mockProfile: UserProfile = {
        id: 'usr_123456',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        avatar: '/images/avatars/user-1.jpg',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        address: {
          street: '123 Dairy Lane',
          city: 'Farmington',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        preferences: {
          newsletter: true,
          smsUpdates: false,
          emailOffers: true
        },
        joinDate: '2024-01-15',
        lastLogin: '2024-03-12T10:30:00'
      }
      
      setProfile(mockProfile)
      setFormData(mockProfile)
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address as any,
        [field]: value
      }
    }))
  }

  const handlePreferenceChange = (field: keyof UserProfile['preferences']) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences as any,
        [field]: !(prev.preferences as any)?.[field]
      }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1500))
      setProfile(formData as UserProfile)
      setEditMode(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile as UserProfile)
    setEditMode(false)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In real app, upload to cloud storage
      const url = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, avatar: url }))
      toast.success('Avatar updated!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded" />
              </div>
              <div className="lg:col-span-3 space-y-4">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-64 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">My Profile</span>
            </h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
          
          {/* Last Login */}
          <div className="hidden sm:block text-right">
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium text-gray-900">
              {new Date(profile.lastLogin).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl sticky top-24">
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div 
                  className="relative inline-block"
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                >
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Upload Overlay */}
                  {avatarHover && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                <h2 className="text-xl font-bold mt-4">{profile.name}</h2>
                <p className="text-sm text-gray-500">Member since {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-white/50 hover:text-blue-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                      {activeTab === tab.id && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  )
                })}
              </nav>

              {/* Logout Button */}
              <button
                onClick={() => toast.success('Logged out successfully!')}
                className="w-full flex items-center space-x-3 px-4 py-3 mt-6 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  {/* Header with Edit/Save */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {saving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-gray-400" />
                            <span>{profile.name}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        {editMode ? (
                          <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span>{profile.email}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        {editMode ? (
                          <input
                            type="date"
                            value={formData.dateOfBirth || ''}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        {editMode ? (
                          <select
                            value={formData.gender || ''}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="capitalize">{profile.gender}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Address</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={formData.address?.street || ''}
                              onChange={(e) => handleAddressChange('street', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <span>{profile.address.street}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={formData.address?.city || ''}
                              onChange={(e) => handleAddressChange('city', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              {profile.address.city}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={formData.address?.state || ''}
                              onChange={(e) => handleAddressChange('state', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              {profile.address.state}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={formData.address?.zipCode || ''}
                              onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              {profile.address.zipCode}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={formData.address?.country || ''}
                              onChange={(e) => handleAddressChange('country', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              {profile.address.country}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Newsletter</p>
                            <p className="text-sm text-gray-500">Receive weekly updates</p>
                          </div>
                          {editMode ? (
                            <input
                              type="checkbox"
                              checked={formData.preferences?.newsletter || false}
                              onChange={() => handlePreferenceChange('newsletter')}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                          ) : (
                            <span className={profile.preferences.newsletter ? 'text-green-600' : 'text-gray-400'}>
                              {profile.preferences.newsletter ? 'Subscribed' : 'Not Subscribed'}
                            </span>
                          )}
                        </label>

                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">SMS Updates</p>
                            <p className="text-sm text-gray-500">Order updates via SMS</p>
                          </div>
                          {editMode ? (
                            <input
                              type="checkbox"
                              checked={formData.preferences?.smsUpdates || false}
                              onChange={() => handlePreferenceChange('smsUpdates')}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                          ) : (
                            <span className={profile.preferences.smsUpdates ? 'text-green-600' : 'text-gray-400'}>
                              {profile.preferences.smsUpdates ? 'Enabled' : 'Disabled'}
                            </span>
                          )}
                        </label>

                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Email Offers</p>
                            <p className="text-sm text-gray-500">Special deals and promotions</p>
                          </div>
                          {editMode ? (
                            <input
                              type="checkbox"
                              checked={formData.preferences?.emailOffers || false}
                              onChange={() => handlePreferenceChange('emailOffers')}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                          ) : (
                            <span className={profile.preferences.emailOffers ? 'text-green-600' : 'text-gray-400'}>
                              {profile.preferences.emailOffers ? 'Subscribed' : 'Not Subscribed'}
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    {/* Password Change */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                          />
                        </div>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Two Factor Authentication */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                      <p className="text-gray-600 mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        Enable 2FA
                      </button>
                    </div>

                    {/* Active Sessions */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-gray-500">Chrome on Windows • IP: 192.168.1.1</p>
                          </div>
                          <span className="text-green-600 text-sm">Active Now</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Mobile App</p>
                            <p className="text-sm text-gray-500">iPhone 14 • Last active 2h ago</p>
                          </div>
                          <button className="text-red-600 text-sm hover:text-red-700">
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { title: 'Order Updates', desc: 'Get notified about order status' },
                      { title: 'Promotions', desc: 'Receive special offers and discounts' },
                      { title: 'Product Recommendations', desc: 'Personalized product suggestions' },
                      { title: 'Newsletter', desc: 'Weekly dairy news and recipes' },
                      { title: 'Delivery Alerts', desc: 'Real-time delivery tracking' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
                  <div className="space-y-4">
                    {[
                      { type: 'Visa', last4: '4242', exp: '12/25', default: true },
                      { type: 'Mastercard', last4: '8888', exp: '08/24', default: false }
                    ].map((card, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <CreditCard className="w-8 h-8 text-gray-400" />
                          <div>
                            <p className="font-medium">{card.type} •••• {card.last4}</p>
                            <p className="text-sm text-gray-500">Expires {card.exp}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {card.default && (
                            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                              Default
                            </span>
                          )}
                          <button className="text-red-600 hover:text-red-700">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
                      + Add Payment Method
                    </button>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Order #ORD-2024-00{i}</span>
                          <span className="text-sm text-green-600">Delivered</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Placed on March {i}, 2024</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">3 items • $45.97</span>
                          <Link href={`/orders/ORD-2024-00${i}`} className="text-blue-600 hover:text-blue-700 text-sm">
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                    
                    <Link
                      href="/dashboard/orders"
                      className="block text-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All Orders
                    </Link>
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-semibold">Product Name {i}</h3>
                          <p className="text-sm text-gray-500">$4.99</p>
                          <button className="text-sm text-blue-600 hover:text-blue-700 mt-1">
                            Add to Cart
                          </button>
                        </div>
                        <button className="text-red-400 hover:text-red-600">
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}