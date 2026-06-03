import { configureNotificationService, type EmailSender, type EmailTemplateProvider } from '@symphony/notifications'
import { sendTransactionalEmail } from '@/lib/email/brevo'
import * as EmailTemplates from '@/lib/email/templates'

/**
 * Initialize the notification service with email sender and templates.
 * Called once during app startup (in layout.tsx or middleware).
 */
export function initializeNotifications(): void {
  const emailSender: EmailSender = async (toEmail, toName, subject, htmlContent) => {
    // The Brevo sendTransactionalEmail uses to, subject, htmlContent
    // Our wrapper adapts the interface
    return sendTransactionalEmail(toEmail, toName, subject, htmlContent)
  }

  const emailTemplates: EmailTemplateProvider = {
    getOTPEmailTemplate: (otp, name) => EmailTemplates.getOTPEmailTemplate(otp, name),
    getWelcomeEmailTemplate: (name) => EmailTemplates.getWelcomeEmailTemplate(name),
    getContactConfirmationTemplate: (name, subject) => EmailTemplates.getContactConfirmationTemplate(name, subject),
    getOrderConfirmationTemplate: (orderNumber, name, items, total, address) =>
      EmailTemplates.getOrderConfirmationTemplate(orderNumber, name, items, total, address),
    getOrderStatusUpdateTemplate: (orderNumber, name, status, message) =>
      EmailTemplates.getOrderStatusUpdateTemplate(orderNumber, name, status, message),
  }

  configureNotificationService({
    emailSender,
    emailTemplates,
  })
}