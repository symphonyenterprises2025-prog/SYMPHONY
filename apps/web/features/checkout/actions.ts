'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createOrder(data: {
  items: any[]
  shippingAddress: any
  paymentMethod: string
}) {
  const session = await auth()
  const userId = session?.user?.id

  // Calculate totals
  const subtotal = data.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  const shippingCost = 99
  const tax = subtotal * 0.18
  const total = subtotal + shippingCost + tax

  // Generate order number
  const orderNumber = `ORD-${Date.now()}`

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      customerEmail: session?.user?.email || data.shippingAddress.email,
      customerName: data.shippingAddress.firstName + ' ' + data.shippingAddress.lastName,
      customerPhone: data.shippingAddress.phone,
      status: 'PENDING',
      subtotal,
      shippingCost,
      tax,
      discount: 0,
      total,
      items: {
        create: data.items.map((item: any) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.name,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          productData: item,
        })),
      },
    },
  })

  revalidatePath('/account/orders')
  return order
}
