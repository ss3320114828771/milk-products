// app/hooks/useWishlist.ts
'use client'

import { useState, useEffect } from 'react'

export const useWishlist = () => {
  const [items, setItems] = useState<any[]>([])

  // Load from localStorage
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

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items))
  }, [items])

  const addToWishlist = (product: any) => {
    if (!items.some(item => item.id === product.id)) {
      setItems([...items, product])
    }
  }

  const removeFromWishlist = (productId: string) => {
    setItems(items.filter(item => item.id !== productId))
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId)
  }

  const clearWishlist = () => {
    setItems([])
  }

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: items.length
  }
}