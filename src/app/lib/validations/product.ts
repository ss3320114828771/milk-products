// lib/validations/product.ts
import { z } from 'zod'

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  images: z.array(z.string().url()),
  stock: z.number().int().min(0),
  rating: z.number().min(0).max(5).default(0),
  numReviews: z.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const reviewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(1),
  comment: z.string().min(1),
  createdAt: z.date(),
})

export const productFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
  rating: z.number().optional(),
  sortBy: z.enum(['price-asc', 'price-desc', 'rating', 'newest']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
})

export type Product = z.infer<typeof productSchema>
export type Review = z.infer<typeof reviewSchema>
export type ProductFilter = z.infer<typeof productFilterSchema>