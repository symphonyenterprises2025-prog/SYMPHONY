type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
  total: number
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  createdAt: Date
  updatedAt: Date
}

type OrderItem = {
  id: string
  productName: string
  variantName: string
  price: number
  quantity: number
  total: number
}

type Payment = {
  id: string
  provider: string
  amount: number
  status: string
  paidAt: Date | null
}

type Shipment = {
  id: string
  trackingNumber: string | null
  carrier: string | null
  status: string
  shippedAt: Date | null
  deliveredAt: Date | null
}

export type OrderWithDetails = Order & {
  items: OrderItem[]
  payments: Payment[]
  shipments: Shipment[]
}
