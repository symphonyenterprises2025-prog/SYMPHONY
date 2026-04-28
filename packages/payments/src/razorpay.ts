import Razorpay from 'razorpay'
import type { PaymentOrder, PaymentResponse, PaymentProvider } from './types'

export class RazorpayProvider implements PaymentProvider {
  private instance: Razorpay

  constructor(keyId: string, keySecret: string) {
    this.instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  }

  async createOrder(amount: number, currency: string, receipt: string): Promise<PaymentOrder> {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
    }

    const order = await this.instance.orders.create(options)
    
    return {
      id: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      receipt: order.receipt,
    }
  }

  async verifyPayment(response: PaymentResponse): Promise<boolean> {
    const crypto = require('crypto')
    const secret = process.env.RAZORPAY_KEY_SECRET
        
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${response.orderId}|${response.paymentId}`)
      .digest('hex')

    return generatedSignature === response.signature
  }
}
