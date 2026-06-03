// ============================================================
// @symphony/notifications - Unified notification service
// ============================================================

// --- Types ---
export type {
  NotificationChannel,
  NotificationEvent,
  NotificationRecipient,
  NotificationConfig,
  NotificationPayload,
  NotificationResult,
  OrderNotificationData,
  AdminNotificationData,
  AuthNotificationData,
  InquiryNotificationData,
  WhatsAppConfig,
  EmailConfig,
} from './types'

// --- Core notification service ---
export {
  sendNotification,
  sendAdminAlert,
  configureNotificationService,
} from './notification'

export type {
  EmailSender,
  EmailTemplateProvider,
} from './notification'

// --- WhatsApp client ---
export { WhatsAppClient, getWhatsAppClient } from './whatsapp/client'

// --- Config helpers ---
export { getWhatsAppConfig, getEmailConfig } from './config'

// --- WhatsApp message templates ---
export * as WhatsAppTemplates from './whatsapp/templates'