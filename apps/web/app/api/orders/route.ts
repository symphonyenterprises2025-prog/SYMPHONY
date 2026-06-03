import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendTransactionalEmail, sendAdminNotification } from '@/lib/email/brevo'
import { getOrderConfirmationTemplate } from '@/lib/email/templates'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          address: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to place an order' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      customerEmail,
      customerName,
      customerPhone,
      items,
      shippingAddress,
      notes,
      giftMessage,
      isGiftWrapped,
      couponCode,
    } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    // Look up variant prices from database (server-side)
    const variantIds = items.map((item: any) => item.variantId)
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { name: true } } },
    })

    const variantMap = new Map(variants.map(v => [v.id, v]))

    // Validate stock and compute pricing server-side
    let subtotal = 0
    const orderItemsData: any[] = []

    for (const item of items) {
      const variant = variantMap.get(item.variantId)
      if (!variant) {
        return NextResponse.json(
          { error: `Variant ${item.variantId} not found` },
          { status: 400 }
        )
      }

      if (!variant.isActive) {
        return NextResponse.json(
          { error: `${variant.product.name} - ${variant.name} is no longer available` },
          { status: 400 }
        )
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${variant.product.name} - ${variant.name}. Available: ${variant.stock}` },
          { status: 400 }
        )
      }

      const itemTotal = Number(variant.price) * item.quantity
      subtotal += itemTotal

      orderItemsData.push({
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName || variant.product.name,
        variantName: item.variantName || variant.name,
        price: Number(variant.price),
        quantity: item.quantity,
        total: itemTotal,
        productData: item.productData || {},
      })
    }

    const shippingCost = subtotal > 999 ? 0 : 99
    const giftWrappingCost = isGiftWrapped ? 99 : 0
    const tax = Math.round(subtotal * 0.09)
    let discount = 0
    let couponId: string | undefined

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } })
      if (
        coupon &&
        coupon.isActive &&
        coupon.validFrom <= new Date() &&
        (!coupon.validUntil || coupon.validUntil >= new Date()) &&
        (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) &&
        (!coupon.minOrderValue || subtotal >= Number(coupon.minOrderValue))
      ) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = Math.round(subtotal * Number(coupon.discountValue) / 100)
          if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
            discount = Number(coupon.maxDiscount)
          }
        } else {
          discount = Number(coupon.discountValue)
        }
        couponId = coupon.id
      }
    }

    const total = subtotal + shippingCost + giftWrappingCost + tax - discount
    const orderNumber = `SYM-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerEmail,
          customerName,
          customerPhone,
          subtotal,
          shippingCost,
          tax,
          discount,
          total,
          notes,
          giftMessage,
          isGiftWrapped,
          status: 'PENDING',
          ...(couponId ? { coupon: { connect: { id: couponId } } } : {}),
          items: { create: orderItemsData },
          address: shippingAddress ? {
            create: {
              firstName: shippingAddress.firstName || '',
              lastName: shippingAddress.lastName || '',
              address1: shippingAddress.address1 || shippingAddress.address || '',
              city: shippingAddress.city || '',
              state: shippingAddress.state || '',
              postalCode: shippingAddress.postalCode || shippingAddress.pincode || '',
              country: 'India',
              phone: customerPhone,
              user: { connect: { id: session.user?.id } },
            },
          } : undefined,
        },
        include: { items: true, address: true },
      })

      for (const item of orderItemsData) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return newOrder
    })

    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usageCount: { increment: 1 } },
      })
    }

    const orderWithItems = order as any

    if (orderWithItems.customerEmail) {
      try {
        const emailItems = orderWithItems.items.map((item: any) => ({
          name: item.productName,
          quantity: item.quantity,
          price: Number(item.price),
        }))

        const addressStr = orderWithItems.address
          ? `${orderWithItems.address.firstName} ${orderWithItems.address.lastName}\n${orderWithItems.address.address1}${orderWithItems.address.address2 ? '\n' + orderWithItems.address.address2 : ''}\n${orderWithItems.address.city}, ${orderWithItems.address.state} ${orderWithItems.address.postalCode}\n${orderWithItems.address.country}`
          : 'Not provided'

        await sendTransactionalEmail(
          orderWithItems.customerEmail,
          orderWithItems.customerName || 'Customer',
          `Order Confirmation - ${orderWithItems.orderNumber}`,
          getOrderConfirmationTemplate(
            orderWithItems.orderNumber,
            orderWithItems.customerName || 'Customer',
            emailItems,
            Number(orderWithItems.total),
            addressStr
          )
        )
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError)
      }
    }

    // Send admin notification about new order
    try {
      const orderItemsList = orderWithItems.items.map((item: any) =>
        `• ${item.productName} (${item.variantName}) x ${item.quantity} - ₹${Number(item.price) * item.quantity}`
      ).join('<br>')

      await sendAdminNotification(
        `🆕 New Order - ${orderWithItems.orderNumber}`,
        `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>New Order Received</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; }
  .header { background: linear-gradient(135deg, #1f3763 0%, #2a4a7c 100%); padding: 30px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 24px; }
  .header p { color: #d0b57a; margin: 10px 0 0; }
  .content { padding: 30px; }
  .content h2 { color: #1f3763; }
  .details { background: #f8f2e5; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .details table { width: 100%; }
  .details td { padding: 8px 0; color: #444; }
  .details td:first-child { color: #666; width: 40%; }
  .footer { background: #f8f2e5; padding: 20px; text-align: center; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>New Order Received</h1>
    <p>Order #${orderWithItems.orderNumber}</p>
  </div>
  <div class="content">
    <h2>Customer Details</h2>
    <div class="details">
      <table>
        <tr><td>Name:</td><td><strong>${orderWithItems.customerName}</strong></td></tr>
        <tr><td>Email:</td><td>${orderWithItems.customerEmail}</td></tr>
        <tr><td>Phone:</td><td>${orderWithItems.customerPhone || 'Not provided'}</td></tr>
        <tr><td>Total:</td><td><strong>₹${Number(orderWithItems.total)}</strong></td></tr>
      </table>
    </div>
    <h2>Order Items</h2>
    <div class="details">
      <p>${orderItemsList}</p>
    </div>
    <p style="text-align:center;margin-top:20px;">
      <a href="${process.env.NEXTAUTH_URL}/admin/orders/${orderWithItems.id}" style="display:inline-block;background:#1f3763;color:#fff;padding:12px 24px;text-decoration:none;border-radius:30px;font-weight:600;">View in Admin</a>
    </p>
  </div>
  <div class="footer">
    <p>Symphony Enterprise - Admin Notification</p>
  </div>
</div>
</body>
</html>`
      )
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError)
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
