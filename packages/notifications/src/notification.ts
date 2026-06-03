import type {
  NotificationPayload,
  NotificationResult,
  NotificationEvent,
  OrderNotificationData,
  AuthNotificationData,
  InquiryNotificationData,
  AdminNotificationData,
} from './types'
import { getWhatsAppConfig, getEmailConfig } from './config'
import { getWhatsAppClient } from './whatsapp/client'
import * as Templates from './whatsapp/templates'

/**
 * Email sender function type - injected from the app layer
 */
export type EmailSender = (
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string
) => Promise<{ messageId: string }>

/**
 * Email template provider type - injected from the app layer
 */
export interface EmailTemplateProvider {
  getOTPEmailTemplate(otp: string, name: string): string
  getWelcomeEmailTemplate(name: string): string
  getContactConfirmationTemplate(name: string, subject: string): string
  getOrderConfirmationTemplate(
    orderNumber: string,
    name: string,
    items: Array<{ name: string; quantity: number; price: number }>,
    total: number,
    address: string
  ): string
  getOrderStatusUpdateTemplate(
    orderNumber: string,
    name: string,
    status: string,
    message?: string
  ): string
}

interface AppInjections {
  emailSender?: EmailSender
  emailTemplates?: EmailTemplateProvider
}

let injections: AppInjections = {}

/**
 * Set the email sender and template functions.
 * Called once during app bootstrap.
 */
export function configureNotificationService(deps: AppInjections): void {
  injections = deps
}

/**
 * Unified notification service.
 * Dispatches to email and/or WhatsApp based on configuration and event type.
 */
export async function sendNotification(payload: NotificationPayload): Promise<NotificationResult> {
  const result: NotificationResult = {}
  const waConfig = getWhatsAppConfig()
  const emailConfig = getEmailConfig()
  const { event, data } = payload

  try {
    const channels = getChannelsForEvent(event)

    // Send email
    if (channels.email && emailConfig.enabled && injections.emailSender && injections.emailTemplates) {
      result.email = await sendEmailNotification(event, data as any)
    }

    // Send WhatsApp
    if (channels.whatsapp && waConfig.enabled) {
      const waClient = getWhatsAppClient()
      result.whatsapp = await sendWhatsAppNotification(waClient, event, data as any)
    }
  } catch (error) {
    console.error(`[Notifications] Failed to send ${event}:`, error)
  }

  return result
}

/**
 * Send an admin alert notification (always goes to admin WhatsApp)
 */
export async function sendAdminAlert(data: AdminNotificationData): Promise<NotificationResult> {
  const waConfig = getWhatsAppConfig()
  const result: NotificationResult = {}

  if (!waConfig.enabled) return result

  const waClient = getWhatsAppClient()

  try {
    let text: string

    switch (data.type) {
      case 'new_order':
        text = Templates.formatAdminNewOrder(
          data.orderNumber || '',
          data.customerName || '',
          data.total || 0,
          0
        )
        break
      case 'large_order':
        text = Templates.formatAdminLargeOrder(
          data.orderNumber || '',
          data.customerName || '',
          data.total || 0
        )
        break
      default:
        text = Templates.formatAdminNotification(data.message)
    }

    result.whatsapp = await waClient.sendText(waConfig.adminPhone, text)
  } catch (error) {
    console.error('[Notifications] Failed to send admin alert:', error)
    result.whatsapp = { success: false, error: 'Failed to send admin alert' }
  }

  return result
}

/**
 * Determine which channels to use for a given event
 */
function getChannelsForEvent(event: NotificationEvent): { email: boolean; whatsapp: boolean } {
  // Admin alerts: WhatsApp only
  if (event.startsWith('admin.')) {
    return { email: false, whatsapp: true }
  }

  // Per-event override via env vars: NOTIFY_ORDER_CONFIRMED=email|whatsapp|both
  const envVarName = `NOTIFY_${event.toUpperCase().replace(/\./g, '_')}`
  const env = typeof process !== 'undefined' ? process.env : {}
  const config = (env as Record<string, string>)[envVarName] || 'both'

  switch (config) {
    case 'email':
      return { email: true, whatsapp: false }
    case 'whatsapp':
      return { email: false, whatsapp: true }
    case 'both':
    default:
      return { email: true, whatsapp: true }
  }
}

/**
 * Send email notification
 */
async function sendEmailNotification(
  event: NotificationEvent,
  data: OrderNotificationData | AuthNotificationData | InquiryNotificationData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!injections.emailSender || !injections.emailTemplates) {
    return { success: false, error: 'Email sender/templates not configured' }
  }

  try {
    const t = injections.emailTemplates
    let subject: string
    let htmlContent: string

    switch (event) {
      case 'order.confirmed': {
        const d = data as OrderNotificationData
        subject = `Order Confirmed - #${d.orderNumber}`
        htmlContent = t.getOrderConfirmationTemplate(
          d.orderNumber,
          d.customerName,
          d.items,
          d.total,
          d.shippingAddress || ''
        )
        break
      }
      case 'order.shipped':
      case 'order.delivered':
      case 'order.cancelled': {
        const d = data as OrderNotificationData
        subject = `Order Update - #${d.orderNumber}`
        htmlContent = t.getOrderStatusUpdateTemplate(
          d.orderNumber,
          d.customerName,
          d.status || event.split('.')[1].toUpperCase(),
          d.statusMessage
        )
        break
      }
      case 'order.payment_failed': {
        const d = data as OrderNotificationData
        subject = `Payment Failed - #${d.orderNumber}`
        htmlContent = t.getOrderStatusUpdateTemplate(d.orderNumber, d.customerName, 'PAYMENT_FAILED', 'Your payment did not go through. Please try again.')
        break
      }
      case 'auth.otp': {
        const d = data as AuthNotificationData
        subject = 'Your Verification Code - Symphony Enterprise'
        htmlContent = t.getOTPEmailTemplate(d.otp || '', d.name)
        break
      }
      case 'auth.welcome': {
        const d = data as AuthNotificationData
        subject = 'Welcome to Symphony Enterprise!'
        htmlContent = t.getWelcomeEmailTemplate(d.name)
        break
      }
      case 'contact.inquiry': {
        const d = data as InquiryNotificationData
        subject = `We've Received Your Inquiry - ${d.subject}`
        htmlContent = t.getContactConfirmationTemplate(d.name, d.subject)
        break
      }
      default:
        return { success: false, error: `No email template for event: ${event}` }
    }

    const toEmail = (data as OrderNotificationData).customerEmail || (data as AuthNotificationData).email
    const toName = (data as OrderNotificationData).customerName || (data as AuthNotificationData).name

    const result = await injections.emailSender(toEmail, toName, subject, htmlContent)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error(`[Notifications] Email error for ${event}:`, error)
    return { success: false, error: 'Email sending failed' }
  }
}

/**
 * Send WhatsApp notification
 */
async function sendWhatsAppNotification(
  waClient: ReturnType<typeof getWhatsAppClient>,
  event: NotificationEvent,
  data: any
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const phone = data.customerPhone || data.phone
  if (!phone) {
    return { success: false, error: 'No phone number provided' }
  }

  let text: string

  switch (event) {
    case 'order.confirmed':
      text = Templates.formatOrderConfirmed(
        data.orderNumber,
        data.customerName,
        data.total,
        data.items?.length || 0
      )
      break

    case 'order.shipped':
      text = Templates.formatOrderShipped(
        data.orderNumber,
        data.customerName,
        data.trackingNumber,
        data.carrier,
        data.estimatedDelivery
      )
      break

    case 'order.delivered':
      text = Templates.formatOrderDelivered(data.orderNumber, data.customerName)
      break

    case 'order.cancelled':
      text = Templates.formatOrderCancelled(data.orderNumber, data.customerName, data.statusMessage)
      break

    case 'order.payment_failed':
      text = Templates.formatPaymentFailed(
        data.orderNumber,
        data.customerName,
        data.total,
        data.paymentMethod
      )
      break

    case 'auth.otp':
      text = Templates.formatOTP(data.otp, data.name)
      break

    case 'auth.welcome':
      text = Templates.formatWelcome(data.name)
      break

    case 'contact.inquiry':
    case 'corporate.inquiry':
      text = Templates.formatInquiryReceived(data.name, data.subject, data.type)
      break

    default:
      return { success: false, error: `No WhatsApp template for event: ${event}` }
  }

  return waClient.sendText(phone, text)
}