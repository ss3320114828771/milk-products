// ============================================================================
// Helper Functions
// ============================================================================

export const getOrderStatusLabel = (status: string) => {
  // @ts-ignore - Temporarily ignore type error
  return ORDER_STATUS_LABELS[status] || status
}

export const getPaymentStatusLabel = (status: string) => {
  // @ts-ignore - Temporarily ignore type error
  return PAYMENT_STATUS_LABELS[status] || status
}

export const getStockStatusLabel = (status: string) => {
  // @ts-ignore - Temporarily ignore type error
  return STOCK_STATUS_LABELS[status] || status
}

export const getStatusColor = (status: string, type: 'order' | 'payment' | 'stock'): string => {
  switch (type) {
    case 'order':
      // @ts-ignore
      return ORDER_STATUS_COLORS[status] || 'default'
    case 'payment':
      // @ts-ignore
      return PAYMENT_STATUS_COLORS[status] || 'default'
    case 'stock':
      // @ts-ignore
      return STOCK_STATUS_COLORS[status] || 'default'
    default:
      return 'default'
  }
}