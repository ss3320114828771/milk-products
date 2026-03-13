// contexts/wishlist-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface Product {
  id: string
  name?: string
  price?: number
  image?: string
}

interface WishlistContextType {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load wishlist')
      }
    }
  }, [])

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items))
  }, [items])

  const addToWishlist = (product: Product) => {
    setItems(prev => {
      // Check if product already exists
      const exists = prev.some(item => item.id === product.id)
      if (exists) return prev
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId))
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId)
  }

  const clearWishlist = () => {
    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}