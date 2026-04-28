import { Html } from '@react-email/components'

interface OrderShippedProps {
  customerName: string
  orderNumber: string
  trackingNumber: string
}

export function OrderShipped({ customerName, orderNumber, trackingNumber }: OrderShippedProps) {
  return (
    <Html>
      <body>
        <h1>Order Shipped</h1>
        <p>Dear {customerName},</p>
        <p>Your order {orderNumber} has been shipped.</p>
        <p>Tracking Number: {trackingNumber}</p>
      </body>
    </Html>
  )
}
