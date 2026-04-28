export interface PricingResult {
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
}

export function calculatePricing(
  subtotal: number,
  discount: number = 0,
  shippingCost: number = 99,
  taxRate: number = 0.18
): PricingResult {
  const afterDiscount = subtotal - discount
  const tax = afterDiscount * taxRate
  const total = afterDiscount + shippingCost + tax

  return {
    subtotal,
    shippingCost,
    tax,
    discount,
    total,
  }
}

export function calculateDiscount(
  subtotal: number,
  couponCode: string | null
): number {
  // TODO: Implement coupon logic
  if (couponCode === 'WELCOME10') {
    return subtotal * 0.1
  }
  return 0
}
