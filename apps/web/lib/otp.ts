import { prisma } from './db'
import bcrypt from 'bcryptjs'

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store OTP in database (hashed)
export async function storeOTP(email: string, otp: string, expiresInMinutes: number = 10): Promise<void> {
  const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000)
  const hashedCode = await bcrypt.hash(otp, 10)

  // Delete any existing OTP for this email
  await prisma.otpCode.deleteMany({
    where: { email }
  })

  // Create new OTP record with hashed code
  await prisma.otpCode.create({
    data: {
      email,
      code: hashedCode,
      expires,
      verified: false,
    }
  })
}

// Verify OTP against hashed code
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  // Find all unexpired, unverified OTP records for this email
  const records = await prisma.otpCode.findMany({
    where: {
      email,
      expires: { gt: new Date() },
      verified: false,
    },
    orderBy: { createdAt: 'desc' },
  })

  for (const record of records) {
    const isValid = await bcrypt.compare(otp, record.code)
    if (isValid) {
      // Mark OTP as verified
      await prisma.otpCode.update({
        where: { id: record.id },
        data: { verified: true },
      })
      return true
    }
  }

  return false
}

// Check if OTP exists and is valid
export async function hasValidOTP(email: string): Promise<boolean> {
  const count = await prisma.otpCode.count({
    where: {
      email,
      expires: {
        gt: new Date()
      },
      verified: false,
    }
  })

  return count > 0
}

// Get time remaining for OTP
export async function getOTPExpiryTime(email: string): Promise<Date | null> {
  const record = await prisma.otpCode.findFirst({
    where: {
      email,
      expires: {
        gt: new Date()
      },
      verified: false,
    },
    select: { expires: true }
  })

  return record?.expires || null
}

// Delete all OTPs for an email (cleanup)
export async function deleteOTPs(email: string): Promise<void> {
  await prisma.otpCode.deleteMany({
    where: { email }
  })
}
