import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const validateSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  subtotal: z.number().positive("Subtotal must be positive"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = validateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { code, subtotal } = result.data
    const upperCode = code.toUpperCase()

    // First check admin-created coupons
    let coupon = await prisma.coupon.findUnique({
      where: { code: upperCode },
    })

    // If not found, check user-specific coupons
    if (!coupon) {
      const userCoupon = await prisma.userCoupon.findUnique({
        where: { code: upperCode },
      })
      if (userCoupon && !userCoupon.used && (!userCoupon.expiresAt || userCoupon.expiresAt >= new Date())) {
        let discountAmount = 0
        if (userCoupon.discountType === 'PERCENTAGE') {
          discountAmount = Math.round(subtotal * Number(userCoupon.discountValue) / 100)
        } else {
          discountAmount = Number(userCoupon.discountValue)
        }
        return NextResponse.json({
          valid: true,
          coupon: {
            code: userCoupon.code,
            discountType: userCoupon.discountType,
            discountValue: Number(userCoupon.discountValue),
            discountAmount,
            description: userCoupon.description,
            isUserCoupon: true,
          },
        })
      }
    }

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 404 }
      )
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'This coupon is no longer active' },
        { status: 400 }
      )
    }

    const now = new Date()
    if (coupon.validFrom > now) {
      return NextResponse.json(
        { error: 'This coupon is not yet valid' },
        { status: 400 }
      )
    }

    if (coupon.validUntil && coupon.validUntil < now) {
      return NextResponse.json(
        { error: 'This coupon has expired' },
        { status: 400 }
      )
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: 'This coupon has reached its usage limit' },
        { status: 400 }
      )
    }

    if (coupon.minOrderValue && subtotal < Number(coupon.minOrderValue)) {
      return NextResponse.json(
        { error: `Minimum order value of ₹${Number(coupon.minOrderValue)} required` },
        { status: 400 }
      )
    }

    let discountAmount = 0
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round(subtotal * Number(coupon.discountValue) / 100)
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount))
      }
    } else {
      discountAmount = Number(coupon.discountValue)
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        discountAmount,
        description: coupon.description,
      },
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    )
  }
}
