import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import type { UserRole } from '@prisma/client'

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin'

let adminBootstrapped = false

function getAdminEmail(): string {
  if (ADMIN_EMAIL) return ADMIN_EMAIL
  throw new Error(
    'ADMIN_EMAIL is not configured. Set ADMIN_EMAIL in your environment (e.g. .env or Render env vars).'
  )
}

function getAdminPassword(): string {
  if (ADMIN_PASSWORD) return ADMIN_PASSWORD
  throw new Error(
    'ADMIN_PASSWORD is not configured. Set ADMIN_PASSWORD in your environment before seeding the admin user.'
  )
}

async function ensureAdminExists() {
  if (adminBootstrapped) return
  const email = getAdminEmail()
  const password = getAdminPassword()
  const existing = await prisma.user.findUnique({ where: { email } })
  if (!existing) {
    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: { email, name: ADMIN_NAME, role: 'ADMIN', password: hashed },
    })
  } else if (!existing.password || existing.role !== 'ADMIN') {
    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { email },
      data: { password: hashed, role: 'ADMIN' },
    })
  }
  adminBootstrapped = true
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
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

        const email = credentials.email.toLowerCase().trim()

        // Bootstrap admin user on first login attempt for the configured admin email
        try {
          if (email === getAdminEmail()) {
            await ensureAdminExists()
          }
        } catch (err) {
          // Env var missing or DB down. Log the real cause and return
          // null so the user sees a generic "Invalid credentials" error
          // (and so a misconfigured deploy doesn't leak which env var
          // is missing via a 500 stack trace).
          console.error('[next-auth] admin bootstrap failed:', err)
          return null
        }

        let user
        try {
          user = await prisma.user.findUnique({ where: { email } })
        } catch (err) {
          console.error('[next-auth] user lookup failed:', err)
          return null
        }

        if (!user || !user.password) {
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
          role: user.role as UserRole,
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
        session.user.role = token.role as UserRole
      }
      if (token.phone && session.user) {
        session.user.phone = token.phone
      }
      if (token.whatsapp && session.user) {
        session.user.whatsapp = token.whatsapp
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
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }
      if (url.startsWith('/')) {
        return url
      }
      return `${baseUrl}${url}`
    },
  },
}

export function auth() {
  return getServerSession(authOptions)
}
