export interface CheckoutData {
  items: CartItem[]
  shippingAddress: Address
  paymentMethod: 'RAZORPAY' | 'COD'
  couponCode?: string
  giftMessage?: string
  isGiftWrapped?: boolean
}

export interface CartItem {
  productId: string
  variantId: string
  name: string
  variantName: string
  price: number
  quantity: number
}

export interface Address {
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  phone?: string
  email: string
}
