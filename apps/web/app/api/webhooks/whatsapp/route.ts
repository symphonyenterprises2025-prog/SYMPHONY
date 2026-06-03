import { NextRequest, NextResponse } from 'next/server'
import { getWhatsAppConfig } from '@symphony/notifications'

/**
 * OpenWA Webhook Handler
 *
 * OpenWA sends events to this endpoint when:
 * - A message is received
 * - Session status changes
 * - QR code is updated
 *
 * Configure this URL in OpenWA dashboard:
 * POST http://your-domain/api/webhooks/whatsapp
 */

export async function POST(request: NextRequest) {
  const waConfig = getWhatsAppConfig()

  if (!waConfig.enabled) {
    return NextResponse.json({ message: 'WhatsApp not enabled' }, { status: 200 })
  }

  try {
    const body = await request.json()
    const { event, data } = body

    // Verify webhook signature (if configured in OpenWA)
    const signature = request.headers.get('x-webhook-signature')
    // In production, verify HMAC signature here if you set a webhook secret
    // const expectedSig = crypto.createHmac('sha256', waConfig.apiKey).update(JSON.stringify(body)).digest('hex')
    // if (signature !== expectedSig) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })

    console.log(`[WhatsApp Webhook] Event: ${event}`, JSON.stringify(data).slice(0, 500))

    switch (event) {
      case 'message.received': {
        // Customer sent a message to your WhatsApp
        const { from, text, chatName } = data
        if (text?.body) {
          // TODO: Forward to admin email or store for admin to view
          console.log(`📩 Message from ${chatName || from}: ${text.body}`)
        }
        break
      }

      case 'message.status': {
        // Delivery/read status update
        console.log(`📨 Message ${data.id} status: ${data.status}`)
        break
      }

      case 'session.status': {
        // Session connected/disconnected
        const status = data?.status || 'unknown'
        console.log(`🔌 WhatsApp session status: ${status}`)
        break
      }

      case 'session.qr': {
        // New QR code generated (needs scan)
        console.log('📱 New QR code generated — scan with WhatsApp!')
        break
      }

      default:
        console.log(`[WhatsApp Webhook] Unhandled event: ${event}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Health check endpoint for OpenWA to ping
 */
export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
}