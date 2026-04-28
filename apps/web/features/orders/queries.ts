import { prisma } from '@/lib/db'

export async function getOrders(userId?: string) {
  return prisma.order.findMany({
    where: userId ? { userId } : undefined,
    include: {
      items: true,
      payments: true,
      shipments: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      payments: true,
      shipments: {
        include: {
          address: true,
        },
      },
      address: true,
    },
  })
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payments: true,
      shipments: true,
    },
  })
}
