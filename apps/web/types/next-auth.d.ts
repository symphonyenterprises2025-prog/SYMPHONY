import 'next-auth'
import type { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
      phone?: string | null
      whatsapp?: string | null
    }
  }

  interface User {
    id: string
    role: UserRole
    phone?: string | null
    whatsapp?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    phone?: string | null
    whatsapp?: string | null
  }
}
