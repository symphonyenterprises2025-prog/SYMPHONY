import type { User, Address } from '@prisma/client'

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
