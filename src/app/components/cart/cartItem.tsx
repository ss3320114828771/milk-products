'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

interface CartItemProps {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  quantity: number
  image?: string
  variant?: string
  maxQuantity?: number
  isSelected?: boolean
  onQuantityChange?: (id: string, quantity: number) => void
  onRemove?: (id: string) => void
  onToggleSelect?: (id: string, selected: boolean) => void
  onMoveToWishlist?: (id: string) => void
  showCheckbox?: boolean
  showActions?: boolean
  currency?: string
}

export function CartItem({
  id,
  productId,
  name,
  slug,
  price,
  originalPrice,
  quantity,
  image,
  variant,
  maxQuantity = 99,
  isSelected = true,
  onQuantityChange,
  onRemove,
  onToggleSelect,
  onMoveToWishlist,
  showCheckbox = true,
  showActions = true,
  currency = '$'
}: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [localQuantity, setLocalQuantity] = useState(quantity)
  const [isRemoving, setIsRemoving] = useState(false)

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxQuantity) return
    
    setLocalQuantity(newQuantity)
    setIsUpdating(true)
    
    try {
      if (onQuantityChange) {
        await onQuantityChange(id, newQuantity)
      }
    } catch (error) {
      setLocalQuantity(quantity) // Revert on error
      toast.error('Failed to update quantity')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    if (!confirm('Remove item from cart?')) return
    
    setIsRemoving(true)
    try {
      if (onRemove) {
        await onRemove(id)
      }
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    } finally {
      setIsRemoving(false)
    }
  }

  const handleMoveToWishlist = async () => {
    try {
      if (onMoveToWishlist) {
        await onMoveToWishlist(id)
      }
      toast.success('Moved to wishlist')
    } catch (error) {
      toast.error('Failed to move to wishlist')
    }
  }

  const totalPrice = price * localQuantity
  const totalOriginalPrice = originalPrice ? originalPrice * localQuantity : undefined

  return (
    <div className={`
      flex items-start gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg
      ${isRemoving ? 'opacity-50 pointer-events-none' : ''}
      ${isUpdating ? 'opacity-75' : ''}
    `}>
      {/* Checkbox */}
      {showCheckbox && (
        <div className="flex items-center pt-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onToggleSelect?.(id, e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
        </div>
      )}

      {/* Product Image */}
      <Link href={`/products/${slug}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl text-gray-400">📦</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <Link 
              href={`/products/${slug}`}
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 line-clamp-2"
            >
              {name}
            </Link>
            
            {/* Variant info */}
            {variant && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {variant}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                {currency}{price.toFixed(2)}
              </span>
              {originalPrice && originalPrice > price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    {currency}{originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Total price */}
          <div className="text-right">
            <div className="text-base font-bold text-gray-900 dark:text-white">
              {currency}{totalPrice.toFixed(2)}
            </div>
            {totalOriginalPrice && totalOriginalPrice > totalPrice && (
              <div className="text-xs text-gray-400 line-through">
                {currency}{totalOriginalPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between mt-4">
            {/* Quantity controls */}
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => handleQuantityChange(localQuantity - 1)}
                disabled={localQuantity <= 1 || isUpdating}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="w-12 text-center text-sm font-medium text-gray-900 dark:text-white">
                {localQuantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(localQuantity + 1)}
                disabled={localQuantity >= maxQuantity || isUpdating}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleMoveToWishlist}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Move to wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}