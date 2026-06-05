import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { generateOTP, storeOTP } from '@/lib/otp'
import { sendTransactionalEmail } from '@/lib/email/brevo'
import { getOTPEmailTemplate } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rate-limit'
import { checkAuthHealth } from '@/lib/auth-health'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
})

function zodErrorMessage(err: z.ZodError): string {
  const issue = err.issues?.[0] ?? err.errors?.[0]
  return issue?.message ?? 'Invalid input'
}

function emailNotConfiguredResponse() {
  return NextResponse.json(
    {
      error:
        'Email service is not configured on this server. Please contact support@your-domain.com.',
    },
    { status: 503 }
  )
}

function dbMisconfiguredResponse(missing: string) {
  return NextResponse.json(
    {
      error:
        `Auth service is misconfigured: required database table "${missing}" is missing. ` +
        'The site administrator has been notified. Please try again in a few minutes.',
    },
    { status: 503 }
  )
}

export async function POST(request: NextRequest) {
  try {
    // Pre-flight: verify auth subsystem is healthy. Cached for 60s.
    const health = await checkAuthHealth()
    if (!health.ok) {
      const b = health.checks.brevo
      if (!b.apiKeyConfigured) {
        console.error('[register] BREVO_API_KEY missing -- OTP email cannot be sent')
        return emailNotConfiguredResponse()
      }
      if (b.apiKeyConfigured && !b.apiKeyValid) {
        console.error('[register] BREVO_API_KEY is invalid:', b.error)
        return NextResponse.json(
          { error: 'Email service is misconfigured (invalid API key). Please contact support.' },
          { status: 503 }
        )
      }
      if (b.apiKeyValid && b.senderVerified === false) {
        console.error(
          `[register] Brevo sender ${b.senderConfigured} is not verified. ` +
            'Verify it in Brevo dashboard -> Settings -> Senders & Domains.'
        )
        // Don't 503 here -- let the send fail with its own clear message.
      }
      if (!health.checks.otpTable.ok) {
        return dbMisconfiguredResponse('otp_codes')
      }
      if (!health.checks.userTable.ok) {
        return dbMisconfiguredResponse('users')
      }
      if (!health.checks.database.ok) {
        console.error('[register] DB unreachable:', health.checks.database.error)
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again in a moment.' },
          { status: 503 }
        )
      }
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const rl = await rateLimit(`register:${ip}`, 3, 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again in a minute.' },
        { status: 429 }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: zodErrorMessage(result.error) }, { status: 400 })
    }

    const { name, email, password, phone, whatsapp } = result.data
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    let existingUser
    try {
      existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    } catch (err) {
      if (err instanceof Error && /does not exist/i.test(err.message)) {
        return dbMisconfiguredResponse('users')
      }
      throw err
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Try signing in.' },
        { status: 409 }
      )
    }

    // Generate and store OTP
    const otp = generateOTP()
    try {
      await storeOTP(normalizedEmail, otp, 10)
    } catch (err) {
      if (err instanceof Error && /does not exist/i.test(err.message)) {
        return dbMisconfiguredResponse('otp_codes')
      }
      throw err
    }

    // Send OTP email
    try {
      await sendTransactionalEmail(
        normalizedEmail,
        name,
        'Verify Your Email - Symphony Enterprise',
        getOTPEmailTemplate(otp, name)
      )
    } catch (emailError) {
      console.error('[register] Brevo email send failed:', emailError)
      // Return 503 (not 500) so the client knows the issue is the email
      // service and the user can retry, rather than seeing a generic
      // 500. Also surface a clear message.
      return NextResponse.json(
        {
          error:
            'We could not send the verification email right now. ' +
            'Please try again in a few minutes, or contact support if the problem persists.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        message: 'OTP sent to your email. Please verify to complete registration.',
        requiresVerification: true,
        registrationData: { name, email: normalizedEmail, password, phone, whatsapp },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[register] unhandled error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
