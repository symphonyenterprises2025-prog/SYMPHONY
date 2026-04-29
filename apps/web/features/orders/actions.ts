'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  })

  revalidatePath('/admin/orders')
  revalidatePath('/account/orders')
}
