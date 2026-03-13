// app/test/page.tsx
'use client'

import { useCart } from '@/app/hooks/useCart'

export default function TestPage() {
  const { items, add, remove, clear, total } = useCart()

  return (
    <div>
      <button onClick={() => add('product-1')}>
        Add Product 1
      </button>
      
      <button onClick={() => add('product-2')}>
        Add Product 2
      </button>
      
      <button onClick={clear}>Clear Cart</button>
      
      <div>
        Cart ({total} items): {items.join(', ')}
      </div>
      
      {items.map(id => (
        <div key={id}>
          {id} 
          <button onClick={() => remove(id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}