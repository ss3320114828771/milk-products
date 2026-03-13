// components/ui/modal.tsx
'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
  closeOnClickOutside?: boolean
  closeOnEsc?: boolean
  footer?: React.ReactNode
  showFooter?: boolean
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
  loading?: boolean
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  closeOnClickOutside = true,
  closeOnEsc = true,
  footer,
  showFooter = false,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  loading = false,
  className = ''
}: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeOnEsc, onClose])

  if (!mounted || !isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          w-full ${sizes[size]} bg-white dark:bg-gray-900 rounded-lg shadow-xl
          animate-in fade-in zoom-in duration-200
          ${className}
        `}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>}
            {showClose && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        {(showFooter || footer) && (
          <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-800">
            {footer || (
              <>
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  {cancelText}
                </Button>
                <Button
                  variant={confirmVariant}
                  onClick={onConfirm}
                  loading={loading}
                >
                  {confirmText}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Confirmation Modal
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  loading = false
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showFooter
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmVariant={confirmVariant}
      loading={loading}
    >
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </Modal>
  )
}