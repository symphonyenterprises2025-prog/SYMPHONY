export type NotificationChannel = 'email' | 'whatsapp' | 'both'

export type NotificationEvent =
  | 'order.confirmed'
  | 'order.shipped'
  | 'order.delivered'
  | 'order.cancelled'
  | 'order.payment_failed'
  | 'admin.new_order'
  | 'admin.large_order'
  | 'auth.otp'
  | 'auth.welcome'
  | 'contact.inquiry'
  | 'corporate.inquiry'

export interface NotificationConfig {
  channels: NotificationChannel
  to: NotificationRecipient
}

export interface NotificationRecipient {
  email?: string
  name?: string
  phone?: string  // WhatsApp number with country code, no +
}

export interface OrderNotificationData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  total: number
  items: Array<{ name: string; quantity: number; price: number }>
  shippingAddress?: string
  status?: string
  statusMessage?: string
  trackingNumber?: string
  carrier?: string
  paymentMethod?: string
}

export interface AdminNotificationData {
  type: 'new_order' | 'large_order' | 'payment_failed' | 'low_stock'
  orderNumber?: string
  customerName?: string
  total?: number
  message: string
  link?: string
}

export interface AuthNotificationData {
  email: string
  name: string
  otp?: string
  phone?: string
}

export interface InquiryNotificationData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  type: 'contact' | 'corporate'
}

export type NotificationPayload =
  | { event: 'order.confirmed' | 'order.shipped' | 'order.delivered' | 'order.cancelled'; data: OrderNotificationData }
  | { event: 'order.payment_failed'; data: OrderNotificationData }
  | { event: 'admin.new_order' | 'admin.large_order'; data: AdminNotificationData }
  | { event: 'auth.otp' | 'auth.welcome'; data: AuthNotificationData }
  | { event: 'contact.inquiry' | 'corporate.inquiry'; data: InquiryNotificationData }

export interface NotificationResult {
  email?: { success: boolean; messageId?: string; error?: string }
  whatsapp?: { success: boolean; messageId?: string; error?: string }
}

export interface WhatsAppConfig {
  baseUrl: string
  apiKey: string
  sessionId: string
  adminPhone: string
  enabled: boolean
}

export interface EmailConfig {
  enabled: boolean
}