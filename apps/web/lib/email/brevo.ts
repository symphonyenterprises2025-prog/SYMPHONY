import axios from 'axios'

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'
const BREVO_ACCOUNT_URL = 'https://api.brevo.com/v3/account'
const BREVO_SENDERS_URL = 'https://api.brevo.com/v3/senders'

export interface EmailParams {
  to: Array<{ email: string; name?: string }>
  subject: string
  htmlContent: string
  sender?: { email: string; name: string }
  cc?: Array<{ email: string; name?: string }>
  bcc?: Array<{ email: string; name?: string }>
  replyTo?: { email: string; name?: string }
}

function extractBrevoErrorMessage(err: unknown): string {
  // Axios errors expose the upstream response on err.response.data.
  // Brevo's body looks like { code: '<status>', message: '<text>' }.
  const ax = err as { response?: { data?: unknown }; message?: string }
  const data = ax?.response?.data
  if (data && typeof data === 'object') {
    const d = data as { code?: string; message?: string; detail?: string }
    if (d.message) return d.message
    if (d.detail) return d.detail
    if (d.code) return `Brevo error ${d.code}`
  }
  if (data && typeof data === 'string' && data.length > 0) {
    return data
  }
  return ax?.message || 'Failed to send email'
}

export async function sendEmail(params: EmailParams): Promise<{ messageId: string }> {
  const apiKey = process.env.BREVO_API_KEY

  if (!apiKey) {
    console.error('[brevo] BREVO_API_KEY is not configured')
    throw new Error(
      'Email service is not configured (BREVO_API_KEY missing). ' +
        'Add it in your hosting environment (e.g. Render dashboard) and redeploy.'
    )
  }

  const sender = params.sender || {
    email: process.env.BREVO_SENDER_EMAIL || 'symphonyenterprise2025@gmail.com',
    name: process.env.BREVO_SENDER_NAME || 'Symphony Enterprise',
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
          Accept: 'application/json',
        },
      }
    )

    return { messageId: response.data.messageId }
  } catch (error) {
    const detail = extractBrevoErrorMessage(error)
    console.error('[brevo] send failed:', detail, '| sender=', sender.email)
    // Re-throw with the real reason so the calling route can surface
    // it to the user and so Render logs show the actual cause.
    throw new Error(detail)
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

const ADMIN_EMAIL = 'symphonyenterprise2025@gmail.com'

export async function sendAdminNotification(
  subject: string,
  htmlContent: string
): Promise<{ messageId: string }> {
  return sendEmail({
    to: [{ email: ADMIN_EMAIL, name: 'Admin' }],
    subject,
    htmlContent,
  })
}

export interface BrevoHealth {
  ok: boolean
  apiKeyConfigured: boolean
  apiKeyValid?: boolean
  senderConfigured?: string
  senderVerified?: boolean
  accountEmail?: string
  plan?: string
  error?: string
}

let brevoHealthCache: { at: number; result: BrevoHealth } | null = null
const BREVO_HEALTH_TTL_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Diagnostic: verify the Brevo API key works and the configured
 * sender is verified. Used by checkAuthHealth() to surface a clear
 * "[auth-health] brevo: KEY OK, sender VERIFIED" line on cold start,
 * and by ad-hoc debugging.
 *
 * Endpoint cost: 2 GETs (account, senders list). Cached for 5 min
 * per process so the per-request overhead is zero in steady state.
 */
export async function checkBrevoHealth(): Promise<BrevoHealth> {
  if (brevoHealthCache && Date.now() - brevoHealthCache.at < BREVO_HEALTH_TTL_MS) {
    return brevoHealthCache.result
  }

  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    const r: BrevoHealth = { ok: false, apiKeyConfigured: false, error: 'BREVO_API_KEY missing' }
    brevoHealthCache = { at: Date.now(), result: r }
    return r
  }

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL || 'symphonyenterprise2025@gmail.com'

  try {
    const accountResp = await axios.get(BREVO_ACCOUNT_URL, {
      headers: { 'api-key': apiKey, Accept: 'application/json' },
      timeout: 10_000,
    })
    const accountEmail: string | undefined = accountResp.data?.email
    const plan: string | undefined = accountResp.data?.plan?.[0]?.type

    // Verify the sender. Brevo returns the list of senders with an
    // `active` flag that becomes true once the verification link is
    // clicked. We only flag a warning, not a hard failure, if the
    // configured sender isn't verified yet -- emails will fail with a
    // 401/403 at send time and that error gets surfaced to the user.
    let senderVerified = false
    try {
      const sendersResp = await axios.get(BREVO_SENDERS_URL, {
        headers: { 'api-key': apiKey, Accept: 'application/json' },
        timeout: 10_000,
      })
      const senders: Array<{ email: string; active: boolean }> =
        sendersResp.data?.senders || []
      const match = senders.find(
        (s) => s.email.toLowerCase() === senderEmail.toLowerCase()
      )
      senderVerified = !!match?.active
    } catch (err) {
      // Senders list might 403 on some plans. Treat as "unknown"
      // rather than failing the whole health check.
      console.error('[brevo-health] senders list failed:', extractBrevoErrorMessage(err))
    }

    const result: BrevoHealth = {
      ok: true,
      apiKeyConfigured: true,
      apiKeyValid: true,
      senderConfigured: senderEmail,
      senderVerified,
      accountEmail,
      plan,
    }
    brevoHealthCache = { at: Date.now(), result }
    return result
  } catch (err) {
    const detail = extractBrevoErrorMessage(err)
    const result: BrevoHealth = {
      ok: false,
      apiKeyConfigured: true,
      apiKeyValid: false,
      senderConfigured: senderEmail,
      error: detail,
    }
    brevoHealthCache = { at: Date.now(), result }
    return result
  }
}
