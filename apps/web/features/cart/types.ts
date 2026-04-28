export interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  variantName: string
  price: number
  quantity: number
  image: string
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}
