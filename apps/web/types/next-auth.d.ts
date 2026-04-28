import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      phone?: string | null
      whatsapp?: string | null
    }
  }
  interface User {
    id: string
    role?: string
    phone?: string | null
    whatsapp?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    phone?: string | null
    whatsapp?: string | null
  }
}
