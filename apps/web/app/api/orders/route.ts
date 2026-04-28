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
    const body = await request.json()
    const {
      customerEmail,
      customerName,
      customerPhone,
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      notes,
      giftMessage,
      isGiftWrapped,
      paymentMethod,
    } = body

    // Generate order number
    const orderNumber = `SYM-${Date.now().toString().slice(-6)}`

    const order = await prisma.order.create({
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
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantName: item.variantName,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            productData: item.productData || {},
          })),
        },
        address: shippingAddress ? {
          connect: {
            id: shippingAddress.id,
          },
        } : undefined,
      },
      include: {
        items: true,
        address: true,
      },
    })

    // Send order confirmation email
    if (order.customerEmail) {
      try {
        const items = order.items.map((item: any) => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price,
        }))

        const shippingAddress = order.address
          ? `${order.address.firstName} ${order.address.lastName}\n${order.address.address1}${order.address.address2 ? '\n' + order.address.address2 : ''}\n${order.address.city}, ${order.address.state} ${order.address.postalCode}\n${order.address.country}`
          : 'Not provided'

        await sendTransactionalEmail(
          order.customerEmail,
          order.customerName || 'Customer',
          `Order Confirmation - ${order.orderNumber}`,
          getOrderConfirmationTemplate(
            order.orderNumber,
            order.customerName || 'Customer',
            items,
            Number(order.total),
            shippingAddress
          )
        )
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError)
        // Don't fail order creation if email fails
      }
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
