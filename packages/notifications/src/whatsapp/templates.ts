/**
 * WhatsApp message templates for e-commerce notifications.
 * Uses plain text (WhatsApp doesn't support rich HTML).
 * Emoji-friendly for better engagement.
 */

export function formatOrderConfirmed(orderNumber: string, customerName: string, total: number, itemsCount: number): string {
  return `✅ *Order Confirmed!*\n\nHi ${customerName},\n\nYour order *#${orderNumber}* has been confirmed successfully.\n\n📦 Items: ${itemsCount}\n💰 Total: ₹${total.toFixed(2)}\n\nWe'll notify you once it's shipped. Thank you for shopping with Symphony Enterprise! 🎉`
}

export function formatOrderShipped(
  orderNumber: string,
  customerName: string,
  trackingNumber?: string,
  carrier?: string,
  estimatedDelivery?: string
): string {
  let msg = `🚚 *Your Order Has Been Shipped!*\n\nHi ${customerName},\n\nYour order *#${orderNumber}* is on its way!\n`
  if (trackingNumber) msg += `\n📮 Tracking: ${trackingNumber}`
  if (carrier) msg += `\n🚛 Carrier: ${carrier}`
  if (estimatedDelivery) msg += `\n📅 Expected: ${estimatedDelivery}`
  msg += `\n\nTrack your order: ${process.env.NEXTAUTH_URL || 'https://symphonyenterprise.in'}/account/orders\n\nThank you for choosing Symphony Enterprise!`
  return msg
}

export function formatOrderDelivered(orderNumber: string, customerName: string): string {
  return `🎉 *Order Delivered!*\n\nHi ${customerName},\n\nYour order *#${orderNumber}* has been delivered successfully!\n\nWe hope you love your purchase. If you have any feedback, reply to this message.\n\nThank you for choosing Symphony Enterprise! ❤️`
}

export function formatOrderCancelled(orderNumber: string, customerName: string, reason?: string): string {
  let msg = `❌ *Order Cancelled*\n\nHi ${customerName},\n\nYour order *#${orderNumber}* has been cancelled.\n`
  if (reason) msg += `\nReason: ${reason}`
  msg += `\n\nIf you have any questions, please contact us. We're here to help!\n\n📞 +91 7978974823`
  return msg
}

export function formatPaymentFailed(orderNumber: string, customerName: string, amount: number, method?: string): string {
  let msg = `⚠️ *Payment Failed*\n\nHi ${customerName},\n\nYour payment of ₹${amount.toFixed(2)} for order *#${orderNumber}* has failed.\n`
  if (method) msg += `\nPayment Method: ${method}`
  msg += `\n\nPlease try again or use a different payment method to complete your order.\n\n🔗 ${process.env.NEXTAUTH_URL || 'https://symphonyenterprise.in'}/cart`
  return msg
}

export function formatAdminNewOrder(orderNumber: string, customerName: string, total: number, itemsCount: number): string {
  return `📦 *New Order Received*\n\nOrder: *#${orderNumber}*\nCustomer: ${customerName}\nTotal: ₹${total.toFixed(2)}\nItems: ${itemsCount}\n\n🔗 ${process.env.NEXTAUTH_URL || 'https://symphonyenterprise.in'}/admin/orders/${orderNumber}`
}

export function formatAdminLargeOrder(orderNumber: string, customerName: string, total: number): string {
  return `🔔 *Large Order Alert!* 🎉\n\nOrder: *#${orderNumber}*\nCustomer: ${customerName}\nTotal: ₹${total.toFixed(2)}\n\nThis order exceeds ₹10,000 — please prioritize processing.\n\n🔗 ${process.env.NEXTAUTH_URL || 'https://symphonyenterprise.in'}/admin/orders/${orderNumber}`
}

export function formatOTP(otp: string, name: string): string {
  return `🔐 *Login Verification*\n\nHi ${name},\n\nYour verification code is:\n\n*${otp}*\n\nThis code is valid for 10 minutes. Please do not share it with anyone.\n\nIf you didn't request this, you can ignore this message.`
}

export function formatWelcome(name: string): string {
  return `👋 *Welcome to Symphony Enterprise!*\n\nHi ${name},\n\nYour account has been created successfully! 🎉\n\nStart exploring our premium gifting collection:\n🔗 ${process.env.NEXTAUTH_URL || 'https://symphonyenterprise.in'}/shop\n\nFor any assistance, reply to this message or call us at +91 7978974823`
}

export function formatInquiryReceived(name: string, subject: string, type: 'contact' | 'corporate'): string {
  const prefix = type === 'corporate' ? '🏢' : '📋'
  return `${prefix} *Inquiry Received*\n\nHi ${name},\n\nThank you for reaching out! We've received your inquiry regarding "${subject}".\n\nOur team will review and get back to you within 24 hours.\n\nIn the meantime, explore our products:\n🔗 ${process.env.NEXTAUTH_URL || 'https://symphonyenterprise.in'}/shop`
}

export function formatAdminInquiryAlert(name: string, email: string, subject: string, type: 'contact' | 'corporate'): string {
  const prefix = type === 'corporate' ? '🏢' : '📋'
  return `${prefix} *New ${type === 'corporate' ? 'Corporate' : 'Contact'} Inquiry*\n\nFrom: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nCheck admin panel for details.`
}

export function formatAdminNotification(message: string): string {
  return `🔔 *Admin Notification*\n\n${message}`
}