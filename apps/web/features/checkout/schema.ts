import { z } from 'zod'

export const checkoutSchema = z.object({
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address1: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email(),
  }),
  paymentMethod: z.enum(['RAZORPAY', 'COD']),
  couponCode: z.string().optional(),
  giftMessage: z.string().optional(),
  isGiftWrapped: z.boolean().default(false),
})
