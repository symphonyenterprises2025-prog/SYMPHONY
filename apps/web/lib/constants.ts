// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  EDITOR: 'EDITOR',
  CUSTOMER: 'CUSTOMER',
} as const

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const

// Payment providers
export const PAYMENT_PROVIDERS = {
  RAZORPAY: 'RAZORPAY',
  STRIPE: 'STRIPE',
  COD: 'COD',
} as const

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// Currency
export const DEFAULT_CURRENCY = 'INR'
export const CURRENCY_SYMBOL = '₹'

// Image sizes
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  card: { width: 400, height: 400 },
  detail: { width: 800, height: 800 },
  banner: { width: 1920, height: 600 },
} as const
