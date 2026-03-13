// hooks/useCart.ts
'use client'

import { useState } from 'react'

export function useCart() {
  const [items, setItems] = useState<string[]>([])

  const add = (itemId: string) => {
    setItems([...items, itemId])
  }

  const remove = (itemId: string) => {
    setItems(items.filter(id => id !== itemId))
  }

  const clear = () => {
    setItems([])
  }

  const total = items.length

  return { items, add, remove, clear, total }
}