type User = {
  id: string
  name: string | null
  email: string
  role: string
  image: string | null
  phone: string | null
  createdAt: Date
  updatedAt: Date
}

type Address = {
  id: string
  firstName: string
  lastName: string
  address1: string
  address2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone: string | null
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserWithAddresses = User & {
  addresses: Address[]
}

export type AuthUser = {
  id: string
  name: string | null
  email: string
  role: string
  image: string | null
}
