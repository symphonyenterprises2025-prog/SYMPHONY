import axios, { AxiosInstance, AxiosError } from 'axios'
import type { WhatsAppConfig } from '../types'
import { getWhatsAppConfig } from '../config'

export class WhatsAppClient {
  private client: AxiosInstance
  private config: WhatsAppConfig

  constructor(config?: Partial<WhatsAppConfig>) {
    this.config = { ...getWhatsAppConfig(), ...config }
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
      },
    })
  }

  get isEnabled(): boolean {
    return this.config.enabled && !!this.config.apiKey
  }

  /**
   * Check if the WhatsApp session is connected and healthy
   */
  async checkConnection(): Promise<{ connected: boolean; status: string }> {
    try {
      const res = await this.client.get(`/sessions/${this.config.sessionId}`)
      return {
        connected: res.data?.status === 'connected',
        status: res.data?.status || 'unknown',
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNREFUSED') {
          return { connected: false, status: 'server_unreachable' }
        }
        return { connected: false, status: `error: ${error.message}` }
      }
      return { connected: false, status: 'unknown_error' }
    }
  }

  /**
   * Send a plain text message to a WhatsApp number
   */
  async sendText(to: string, text: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isEnabled) {
      return { success: false, error: 'WhatsApp not configured' }
    }

    try {
      const chatId = this.formatChatId(to)
      const res = await this.client.post(`/sessions/${this.config.sessionId}/messages/send-text`, {
        chatId,
        text,
      })
      return { success: true, messageId: res.data?.messageId || res.data?.id }
    } catch (error) {
      if (error instanceof AxiosError) {
        return { success: false, error: error.response?.data?.message || error.message }
      }
      return { success: false, error: 'Unknown error sending WhatsApp message' }
    }
  }

  /**
   * Send a media message (image, document, etc.)
   */
  async sendMedia(
    to: string,
    mediaUrl: string,
    caption?: string,
    type: 'image' | 'document' | 'video' = 'image'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isEnabled) {
      return { success: false, error: 'WhatsApp not configured' }
    }

    try {
      const chatId = this.formatChatId(to)
      const res = await this.client.post(`/sessions/${this.config.sessionId}/messages/send-media`, {
        chatId,
        media: mediaUrl,
        caption,
        type,
      })
      return { success: true, messageId: res.data?.messageId || res.data?.id }
    } catch (error) {
      if (error instanceof AxiosError) {
        return { success: false, error: error.response?.data?.message || error.message }
      }
      return { success: false, error: 'Unknown error sending WhatsApp media' }
    }
  }

  /**
   * Send a message with a button/link
   */
  async sendLink(to: string, text: string, link: string, linkTitle?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isEnabled) {
      return { success: false, error: 'WhatsApp not configured' }
    }

    // For OpenWA, send as text with the link embedded
    return this.sendText(to, `${text}\n\n${linkTitle || 'View Details'}: ${link}`)
  }

  /**
   * Format phone number to WhatsApp chat ID format
   */
  private formatChatId(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    // Ensure it ends with @c.us for WhatsApp
    return cleaned.endsWith('@c.us') ? cleaned : `${cleaned}@c.us`
  }
}

// Singleton instance
let instance: WhatsAppClient | null = null

export function getWhatsAppClient(config?: Partial<WhatsAppConfig>): WhatsAppClient {
  if (!instance || config) {
    instance = new WhatsAppClient(config)
  }
  return instance
}