'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ProductFormProps {
  productId?: string
  initialData?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProductForm({ productId, initialData, onSuccess, onCancel }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price || 0,
    description: initialData?.description || '',
    status: initialData?.status || 'draft'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = productId ? 'PUT' : 'POST'
      const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to save')
      
      toast.success(productId ? 'Product updated' : 'Product created')
      if (onSuccess) onSuccess()
      else router.push('/admin/products')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {productId ? 'Edit Product' : 'New Product'}
        </h1>
        <div className="space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </form>
  )
}