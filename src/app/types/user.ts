// types/user.ts

import { Order } from './order'
import { Product } from './product'

export interface User {
  id: string
  email: string
  name?: string
  role: 'user' | 'admin'
  avatar?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  orders?: Order[]  // Keep only what you have
}

export interface UserProfile extends User {
  wishlist?: Product[]  // Keep only what you have
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterInput {
  email: string
  password: string
  name?: string
}