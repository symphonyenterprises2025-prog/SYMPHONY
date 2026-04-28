export interface PaymentOrder {
  id: string
  amount: number
  currency: string
  receipt: string
}

export interface PaymentResponse {
  orderId: string
  paymentId: string
  signature: string
}

export interface PaymentProvider {
  createOrder(amount: number, currency: string, receipt: string): Promise<PaymentOrder>
  verifyPayment(response: PaymentResponse): Promise<boolean>
}
