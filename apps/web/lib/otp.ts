import { prisma } from './db'

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store OTP in database
export async function storeOTP(email: string, otp: string, expiresInMinutes: number = 10): Promise<void> {
  const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000)
  
  // Delete any existing OTP for this email
  await prisma.otpCode.deleteMany({
    where: { email }
  })
  
  // Create new OTP record
  await prisma.otpCode.create({
    data: {
      email,
      code: otp,
      expires,
      verified: false,
    }
  })
}

// Verify OTP
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const record = await prisma.otpCode.findUnique({
    where: {
      email_code: {
        email,
        code: otp,
      }
    }
  })
  
  if (!record || record.expires < new Date() || record.verified) {
    return false
  }
  
  // Mark OTP as verified
  await prisma.otpCode.update({
    where: { id: record.id },
    data: { verified: true }
  })
  
  return true
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
