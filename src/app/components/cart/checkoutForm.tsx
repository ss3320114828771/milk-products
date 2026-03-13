'use client'

import { useState } from 'react'

interface CheckoutFormProps {
  onSubmit?: (data: any) => void
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ZIP Code</label>
          <input
            type="text"
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-3">Payment Details</h3>
        
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              value={formData.cardExpiry}
              onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="CVC"
              value={formData.cardCvc}
              onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-6"
      >
        Place Order
      </button>
    </form>
  )
}