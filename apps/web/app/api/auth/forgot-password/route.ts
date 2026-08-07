import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { generateOTP, storeOTP } from '@/lib/otp'
import { sendTransactionalEmail } from '@/lib/email/brevo'
import { getPasswordResetOTPTemplate } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rate-limit'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

// Deliberately identical whether or not the account exists. /api/auth/register
// already leaks existence via its 409, but a reset endpoint is the classic
// enumeration target -- anyone could otherwise walk a list of emails and learn
// which ones are customers here.
const GENERIC_RESPONSE = {
  message:
    'If an account exists for that email, we have sent a 6-digit reset code to it. Please check your inbox and spam folder.',
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const rl = await rateLimit(`forgot-password:${ip}`, 5, 15 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many reset requests. Please try again in a few minutes.' },
        { status: 429 }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const parsed = forgotPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true },
    })

    // No account: stop here, but answer exactly as if we had sent something.
    if (!user) {
      return NextResponse.json(GENERIC_RESPONSE, { status: 200 })
    }

    const otp = generateOTP()
    await storeOTP(email, otp, 10)

    try {
      await sendTransactionalEmail(
        email,
        user.name || 'there',
        'Reset Your Password - Symphony Enterprise',
        getPasswordResetOTPTemplate(otp, user.name || 'there')
      )
    } catch (emailError) {
      // The account does exist here, so a failure is ours, not the user's.
      // Saying "check your inbox" would leave them waiting for an email that
      // is never coming.
      console.error('[forgot-password] Brevo email send failed:', emailError)
      return NextResponse.json(
        {
          error:
            'We could not send the reset email right now. Please try again in a few minutes, ' +
            'or contact info@symphonyenterprise.co.in.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json(GENERIC_RESPONSE, { status: 200 })
  } catch (error) {
    console.error('[forgot-password] unhandled error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
