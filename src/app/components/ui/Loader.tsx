// components/ui/loader.tsx
'use client'

import { Loader2 } from 'lucide-react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'bar'
  color?: 'primary' | 'white' | 'gray'
  fullScreen?: boolean
  text?: string
  className?: string
}

export function Loader({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  fullScreen = false,
  text,
  className = ''
}: LoaderProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colors = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-400'
  }

  const spinnerLoader = (
    <Loader2 className={`animate-spin ${sizes[size]} ${colors[color]}`} />
  )

  const dotsLoader = (
    <div className="flex gap-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`
            ${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'}
            ${colors[color]}
            rounded-full animate-bounce
          `}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )

  const pulseLoader = (
    <div className="relative">
      <div className={`${sizes[size]} ${colors[color]} rounded-full opacity-75 animate-ping`} />
      <div className={`absolute inset-0 ${sizes[size]} ${colors[color]} rounded-full opacity-25`} />
    </div>
  )

  const barLoader = (
    <div className="w-full max-w-xs h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full ${colors[color]} animate-[progress_1s_ease-in-out_infinite]`} 
        style={{ width: '30%' }} />
    </div>
  )

  const getLoader = () => {
    switch (variant) {
      case 'dots':
        return dotsLoader
      case 'pulse':
        return pulseLoader
      case 'bar':
        return barLoader
      default:
        return spinnerLoader
    }
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          {getLoader()}
          {text && <p className="mt-4 text-gray-600 dark:text-gray-400">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {getLoader()}
      {text && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  )
}

// Skeleton Loader
interface SkeletonProps {
  type?: 'text' | 'circle' | 'rectangle' | 'card'
  width?: string | number
  height?: string | number
  className?: string
}

export function Skeleton({ type = 'text', width, height, className = '' }: SkeletonProps) {
  const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded'

  const styles = {
    text: `h-4 ${width ? `w-${width}` : 'w-full'}`,
    circle: `rounded-full ${width ? `w-${width}` : 'w-10'} ${height ? `h-${height}` : 'h-10'}`,
    rectangle: `${width ? `w-${width}` : 'w-full'} ${height ? `h-${height}` : 'h-20'}`,
    card: 'w-full h-32 rounded-lg'
  }

  return <div className={`${baseClass} ${styles[type]} ${className}`} />
}