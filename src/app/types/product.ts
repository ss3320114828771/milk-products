// types/product.ts
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  stock: number
  rating: number
  createdAt: Date
  updatedAt: Date
}