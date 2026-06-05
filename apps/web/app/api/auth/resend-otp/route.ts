import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { generateOTP, storeOTP } from '@/lib/otp'
import { sendTransactionalEmail } from '@/lib/email/brevo'
import { getOTPEmailTemplate } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rate-limit'
import { checkAuthHealth } from '@/lib/auth-health'

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
})

function zodErrorMessage(err: z.ZodError): string {
  const issue = err.issues?.[0] ?? err.errors?.[0]
  return issue?.message ?? 'Invalid input'
}

function dbMisconfiguredResponse(missing: string) {
  return NextResponse.json(
    {
      error: `Auth service is misconfigured: required database table "${missing}" is missing. ` +
        'The site administrator has been notified. Please try again in a few minutes.',
    },
    { status: 503 }
  )
}

function emailNotConfiguredResponse() {
  return NextResponse.json(
    { error: 'Email service is not configured on this server. Please contact support.' },
    { status: 503 }
  )
}

export async function POST(request: Request) {
  try {
    const health = await checkAuthHealth()
    if (!health.ok) {
      if (!health.checks.brevoKey.configured) return emailNotConfiguredResponse()
      if (!health.checks.otpTable.ok) return dbMisconfiguredResponse('otp_codes')
      if (!health.checks.userTable.ok) return dbMisconfiguredResponse('users')
      if (!health.checks.database.ok) {
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
    const rl = await rateLimit(`resend-otp:${ip}`, 3, 60 * 1000)
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

    const result = resendSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: zodErrorMessage(result.error) }, { status: 400 })
    }

    const { email, name } = result.data
    const normalizedEmail = email.toLowerCase().trim()

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
      // Don't reveal whether the account exists; just say the OTP
      // was "sent" so an attacker can't enumerate emails.
      return NextResponse.json({ message: 'If the email is valid, a new OTP has been sent.' }, { status: 200 })
    }

    const otp = generateOTP()
    try {
      await storeOTP(normalizedEmail, otp, 10)
    } catch (err) {
      if (err instanceof Error && /does not exist/i.test(err.message)) {
        return dbMisconfiguredResponse('otp_codes')
      }
      throw err
    }

    try {
      await sendTransactionalEmail(
        normalizedEmail,
        name || 'Customer',
        'Verify Your Email - Symphony Enterprise',
        getOTPEmailTemplate(otp, name || 'Customer')
      )
    } catch (emailError) {
      console.error('[resend-otp] Brevo email send failed:', emailError)
      return NextResponse.json(
        {
          error:
            'We could not send a new verification email right now. ' +
            'Please try again in a few minutes.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json({ message: 'If the email is valid, a new OTP has been sent.' }, { status: 200 })
  } catch (error) {
    console.error('[resend-otp] unhandled error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
