// types/order.ts
export interface Order {
  id: string
  userId: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
}