import { z } from 'zod'

export const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().min(1),
})
