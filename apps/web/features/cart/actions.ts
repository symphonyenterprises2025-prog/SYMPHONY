'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function syncCart(items: any[]) {
  const session = await auth()
  if (!session?.user?.id) return

  const cart = await prisma.cart.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
  })

  // Clear existing items
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  })

  // Add new items
  for (const item of items) {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      },
    })
  }
}
