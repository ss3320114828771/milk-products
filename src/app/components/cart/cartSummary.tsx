'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ShoppingBag, 
  Truck, 
  Shield, 
  Tag, 
  ArrowRight,
  Loader2,
  Percent,
  Gift,
  Lock
} from 'lucide-react'
import toast from 'react-hot-toast'

interface CartSummaryProps {
  subtotal: number
  shipping?: number
  tax?: number
  discount?: number
  couponCode?: string
  total: number
  itemCount: number
  isCheckout?: boolean
  onApplyCoupon?: (code: string) => Promise<void>
  onCheckout?: () => void
  minOrderAmount?: number
  freeShippingThreshold?: number
  shippingMethod?: string
  estimatedDelivery?: string
  showBreakdown?: boolean
  showCoupon?: boolean
  showCheckoutButton?: boolean
  className?: string
  currency?: string
}

export function CartSummary({
  subtotal,
  shipping = 0,
  tax = 0,
  discount = 0,
  couponCode,
  total,
  itemCount,
  isCheckout = false,
  onApplyCoupon,
  onCheckout,
  minOrderAmount = 0,
  freeShippingThreshold,
  shippingMethod = 'Standard Shipping',
  estimatedDelivery,
  showBreakdown = true,
  showCoupon = true,
  showCheckoutButton = true,
  className = '',
  currency = '$'
}: CartSummaryProps) {
  const router = useRouter()
  const [couponInput, setCouponInput] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  const shippingCost = freeShippingThreshold && subtotal >= freeShippingThreshold ? 0 : shipping
  const finalTotal = total - discount + shippingCost + tax
  const remainingForFreeShipping = freeShippingThreshold ? Math.max(0, freeShippingThreshold - subtotal) : 0
  const meetsMinOrder = subtotal >= minOrderAmount

  const handleApplyCoupon = async () => {
    if (!couponInput.trim() || !onApplyCoupon) return

    setApplyingCoupon(true)
    setCouponError('')
    setCouponSuccess('')

    try {
      await onApplyCoupon(couponInput)
      setCouponSuccess('Coupon applied successfully!')
      setCouponInput('')
    } catch (error: any) {
      setCouponError(error.message || 'Invalid coupon code')
    } finally {
      setApplyingCoupon(false)
    }
  }

  const handleCheckout = () => {
    if (!meetsMinOrder) {
      toast.error(`Minimum order amount is ${currency}${minOrderAmount}`)
      return
    }

    if (onCheckout) {
      onCheckout()
    } else {
      router.push('/checkout')
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Order Summary
        </h2>

        {/* Free shipping progress */}
        {freeShippingThreshold && remainingForFreeShipping > 0 && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400 mb-2">
              <Truck className="w-4 h-4" />
              <span>Add {currency}{remainingForFreeShipping.toFixed(2)} more for free shipping</span>
            </div>
            <div className="w-full h-2 bg-blue-100 dark:bg-blue-900/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Price breakdown */}
        {showBreakdown && (
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal ({itemCount} items)</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {currency}{subtotal.toFixed(2)}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  Discount
                </span>
                <span className="text-green-600 font-medium">
                  -{currency}{discount.toFixed(2)}
                </span>
              </div>
            )}

            {couponCode && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Gift className="w-4 h-4" />
                  Coupon ({couponCode})
                </span>
                <span className="text-green-600 font-medium">
                  -{currency}{discount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Truck className="w-4 h-4" />
                Shipping
              </span>
              {shippingCost === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">
                  {currency}{shippingCost.toFixed(2)}
                </span>
              )}
            </div>

            {shippingMethod && shippingCost > 0 && (
              <p className="text-xs text-gray-500 pl-5">{shippingMethod}</p>
            )}

            {estimatedDelivery && (
              <p className="text-xs text-gray-500 pl-5">
                Estimated delivery: {estimatedDelivery}
              </p>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tax</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {currency}{tax.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 my-3 pt-3">
              <div className="flex justify-between text-base font-semibold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">
                  {currency}{finalTotal.toFixed(2)}
                </span>
              </div>
              {tax > 0 && (
                <p className="text-xs text-gray-500 mt-1 text-right">
                  Including {currency}{tax.toFixed(2)} in taxes
                </p>
              )}
            </div>
          </div>
        )}

        {/* Coupon input */}
        {showCoupon && onApplyCoupon && (
          <div className="mb-4">
            <label htmlFor="coupon" className="sr-only">Coupon code</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="coupon"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                disabled={applyingCoupon}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponInput.trim() || applyingCoupon}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {applyingCoupon ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Percent className="w-4 h-4" />
                )}
                Apply
              </button>
            </div>
            {couponError && (
              <p className="mt-1 text-xs text-red-600">{couponError}</p>
            )}
            {couponSuccess && (
              <p className="mt-1 text-xs text-green-600">{couponSuccess}</p>
            )}
          </div>
        )}

        {/* Checkout button */}
        {showCheckoutButton && (
          <div className="space-y-3">
            <button
              onClick={handleCheckout}
              disabled={!meetsMinOrder || isCheckout}
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isCheckout ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {!meetsMinOrder && minOrderAmount > 0 && (
              <p className="text-xs text-red-600 text-center">
                Minimum order amount is {currency}{minOrderAmount}
              </p>
            )}

            {/* Payment methods */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Lock className="w-3 h-3" />
              <span>Secure checkout</span>
              <Shield className="w-3 h-3 ml-2" />
              <span>Buyer protection</span>
            </div>

            {/* Accepted cards */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-xs text-gray-400">We accept:</span>
              <div className="flex gap-1">
                <div className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded text-[8px] flex items-center justify-center">VISA</div>
                <div className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded text-[8px] flex items-center justify-center">MC</div>
                <div className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded text-[8px] flex items-center justify-center">AMEX</div>
                <div className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded text-[8px] flex items-center justify-center">PP</div>
              </div>
            </div>
          </div>
        )}

        {/* Continue shopping link */}
        {!isCheckout && (
          <div className="mt-4 text-center">
            <Link 
              href="/products" 
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}