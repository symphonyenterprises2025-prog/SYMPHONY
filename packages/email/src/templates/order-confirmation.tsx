import { Html } from '@react-email/components'

interface OrderConfirmationProps {
  customerName: string
  orderNumber: string
  total: string
}

export function OrderConfirmation({ customerName, orderNumber, total }: OrderConfirmationProps) {
  return (
    <Html>
      <body>
        <h1>Order Confirmed</h1>
        <p>Dear {customerName},</p>
        <p>Your order {orderNumber} has been confirmed.</p>
        <p>Total: {total}</p>
      </body>
    </Html>
  )
}
