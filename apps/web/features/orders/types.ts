import type { Order, OrderItem, Payment, Shipment } from '@prisma/client'

export type OrderWithDetails = Order & {
  items: OrderItem[]
  payments: Payment[]
  shipments: Shipment[]
}
