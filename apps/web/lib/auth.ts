import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check for hardcoded admin credentials (fallback)
        if (
          credentials.email === 'admin@symphonyenterprise.co.in' &&
          credentials.password === 'Prakash@2026'
        ) {
          return {
            id: 'admin-1',
            email: 'admin@symphonyenterprise.co.in',
            name: 'Admin',
            role: 'ADMIN',
          }
        }

        // Check database for user authentication
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        }) as any

        if (!user) {
          return null
        }

        // Verify password (if user has password set)
        if (!user.password) {
          // User exists but no password set - likely OAuth user or needs password reset
          return null
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          whatsapp: user.whatsapp,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.role && session.user) {
        session.user.role = token.role as string
      }
      if (token.phone && session.user) {
        session.user.phone = token.phone as string
      }
      if (token.whatsapp && session.user) {
        session.user.whatsapp = token.whatsapp as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.phone = user.phone
        token.whatsapp = user.whatsapp
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // If URL is already absolute, return it as-is
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }
      // If URL is relative, return it
      if (url.startsWith('/')) {
        return url
      }
      // Otherwise, construct from baseUrl
      return `${baseUrl}${url}`
    },
  },
}

export function auth() {
  return getServerSession(authOptions)
}
