// components/ui/card.tsx
'use client'

import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    variant = 'default', 
    padding = 'md',
    interactive = false,
    className = '',
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
      outlined: 'bg-transparent border border-gray-300 dark:border-gray-700',
      elevated: 'bg-white dark:bg-gray-900 shadow-lg'
    }

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    }

    return (
      <div
        ref={ref}
        className={`
          rounded-lg transition-all
          ${variants[variant]}
          ${paddings[padding]}
          ${interactive ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between mb-4 ${className}`}
        {...props}
      >
        <div className="flex-1">
          {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
          {children}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card Content
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// Card Footer
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'