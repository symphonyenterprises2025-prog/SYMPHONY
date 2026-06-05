import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { verifyOTP, deleteOTPs } from '@/lib/otp'
import { sendTransactionalEmail } from '@/lib/email/brevo'
import { getWelcomeEmailTemplate } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rate-limit'
import { checkAuthHealth } from '@/lib/auth-health'

const verifySchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  name: z.string().min(2, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
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

export async function POST(request: Request) {
  try {
    const health = await checkAuthHealth()
    if (!health.ok) {
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
    const rl = await rateLimit(`verify-otp:${ip}`, 5, 60 * 1000)
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

    const result = verifySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: zodErrorMessage(result.error) }, { status: 400 })
    }

    const { email, otp, name, password, phone, whatsapp } = result.data
    const normalizedEmail = email.toLowerCase().trim()

    // Verify OTP
    let isValid: boolean
    try {
      isValid = await verifyOTP(normalizedEmail, otp)
    } catch (err) {
      if (err instanceof Error && /does not exist/i.test(err.message)) {
        return dbMisconfiguredResponse('otp_codes')
      }
      throw err
    }
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if user already exists (race-safe: rely on the unique
    // constraint and translate P2002 into a friendly 409)
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      })
      if (existingUser) {
        await deleteOTPs(normalizedEmail)
        return NextResponse.json(
          { error: 'An account with this email already exists. Try signing in.' },
          { status: 409 }
        )
      }
    } catch (err) {
      if (err instanceof Error && /does not exist/i.test(err.message)) {
        return dbMisconfiguredResponse('users')
      }
      throw err
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    let user
    try {
      user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          phone: phone || null,
          whatsapp: whatsapp || null,
          role: 'CUSTOMER',
          emailVerified: new Date(),
        },
      })
    } catch (err) {
      // Unique violation: another request created the user in between
      // our findUnique and create. Treat as a normal 409.
      const code = (err as { code?: string })?.code
      if (code === 'P2002') {
        await deleteOTPs(normalizedEmail)
        return NextResponse.json(
          { error: 'An account with this email already exists. Try signing in.' },
          { status: 409 }
        )
      }
      if (err instanceof Error && /does not exist/i.test(err.message)) {
        return dbMisconfiguredResponse('users')
      }
      throw err
    }

    // Clean up OTP (best effort -- not fatal)
    try {
      await deleteOTPs(normalizedEmail)
    } catch (err) {
      console.error('[verify-otp] OTP cleanup failed:', err)
    }

    // Send welcome email (best effort -- not fatal)
    try {
      await sendTransactionalEmail(
        normalizedEmail,
        name || 'Customer',
        'Welcome to Symphony Enterprise!',
        getWelcomeEmailTemplate(name || 'Customer')
      )
    } catch (emailError) {
      console.error('[verify-otp] welcome email failed:', emailError)
    }

    return NextResponse.json(
      { message: 'Account created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('[verify-otp] unhandled error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
