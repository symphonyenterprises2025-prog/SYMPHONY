import axios from 'axios'

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

export interface EmailParams {
  to: Array<{ email: string; name?: string }>
  subject: string
  htmlContent: string
  sender?: { email: string; name: string }
  cc?: Array<{ email: string; name?: string }>
  bcc?: Array<{ email: string; name?: string }>
  replyTo?: { email: string; name?: string }
}

export async function sendEmail(params: EmailParams): Promise<{ messageId: string }> {
  const apiKey = process.env.BREVO_API_KEY
  
  if (!apiKey) {
    console.error('BREVO_API_KEY is not configured')
    throw new Error('Email service not configured')
  }

  const sender = params.sender || {
    email: process.env.BREVO_SENDER_EMAIL || 'symphonyenterprise2025@gmail.com',
    name: process.env.BREVO_SENDER_NAME || 'Symphony Enterprise'
  }

  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender,
        to: params.to,
        subject: params.subject,
        htmlContent: params.htmlContent,
        ...(params.cc && { cc: params.cc }),
        ...(params.bcc && { bcc: params.bcc }),
        ...(params.replyTo && { replyTo: params.replyTo }),
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )

    return { messageId: response.data.messageId }
  } catch (error: any) {
    console.error('Brevo email send error:', error.response?.data || error.message)
    throw new Error('Failed to send email')
  }
}

export async function sendTransactionalEmail(
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string
): Promise<{ messageId: string }> {
  return sendEmail({
    to: [{ email: toEmail, name: toName }],
    subject,
    htmlContent,
  })
}

export async function sendAdminNotification(
  subject: string,
  htmlContent: string
): Promise<{ messageId: string }> {
  const adminEmail = process.env.ADMIN_EMAIL || 'symphonyenterprise2025@gmail.com'
  
  return sendEmail({
    to: [{ email: adminEmail, name: 'Admin' }],
    subject,
    htmlContent,
  })
}
