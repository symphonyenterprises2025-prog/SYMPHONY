import type { WhatsAppConfig, EmailConfig } from './types'

/**
 * Safely read environment variables, falling back to Node's process.env
 */
function env(key: string, fallback = ''): string {
  try {
    return (typeof process !== 'undefined' && process.env?.[key]) || fallback
  } catch {
    return fallback
  }
}

export function getWhatsAppConfig(): WhatsAppConfig {
  return {
    baseUrl: env('OPENWA_API_URL', 'http://localhost:2785/api'),
    apiKey: env('OPENWA_API_KEY'),
    sessionId: env('OPENWA_SESSION_ID', 'default'),
    adminPhone: env('OPENWA_ADMIN_PHONE', '917978974823'),
    enabled: env('OPENWA_ENABLED') === 'true',
  }
}

export function getEmailConfig(): EmailConfig {
  return {
    enabled: !!env('BREVO_API_KEY'),
  }
}