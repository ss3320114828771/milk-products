// contexts/cart-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  stock: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: any, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
  cartCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load cart')
      }
    }
  }, [])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product: any, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id)

      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prev, {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '/placeholder.jpg',
        quantity,
        stock: product.stock || 99
      }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const isInCart = (productId: string) => {
    return items.some(item => item.productId === productId)
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      cartCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}