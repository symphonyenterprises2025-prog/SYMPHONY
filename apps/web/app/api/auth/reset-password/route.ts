import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { verifyOTP, deleteOTPs } from '@/lib/otp'
import { rateLimit } from '@/lib/rate-limit'

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().regex(/^\d{6}$/, 'Please enter the 6-digit code from your email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Tighter than the request endpoint: this one is guessable. A 6-digit code
    // is a million combinations, so cap attempts to keep brute force out of
    // reach within the 10-minute validity window.
    const rl = await rateLimit(`reset-password:${ip}`, 10, 15 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please request a new code and try again later.' },
        { status: 429 }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const parsed = resetPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase().trim()
    const { otp, password } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    // Same message for "no such account" and "wrong code", so this endpoint
    // cannot be used to enumerate accounts either.
    const invalidCodeResponse = NextResponse.json(
      { error: 'That code is invalid or has expired. Please request a new one.' },
      { status: 400 }
    )

    if (!user) {
      return invalidCodeResponse
    }

    const isValid = await verifyOTP(email, otp)
    if (!isValid) {
      return invalidCodeResponse
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    // Burn every code for this address so the one just used (and any older
    // outstanding ones) cannot be replayed to reset the password again.
    await deleteOTPs(email)

    return NextResponse.json(
      { message: 'Your password has been reset. You can now sign in with your new password.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[reset-password] unhandled error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
