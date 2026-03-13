// lib/validations/order.ts
import { z } from 'zod'

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
})

export const paymentMethodSchema = z.enum(['card', 'paypal', 'cash'])

export const createOrderSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: paymentMethodSchema,
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().positive(),
  })),
  totalAmount: z.number().positive(),
})

export type Address = z.infer<typeof addressSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>