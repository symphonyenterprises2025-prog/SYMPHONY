import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin'

async function main() {
  if (!ADMIN_EMAIL) {
    throw new Error('ADMIN_EMAIL is not set. Set it in your environment before running the seed.')
  }
  if (!ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD is not set. Set it in your environment before running the seed.')
  }

  // Clean up old admin email if exists
  await prisma.user.deleteMany({ where: { email: 'admin@symphony.com' } })

  const password = await bcrypt.hash(ADMIN_PASSWORD, 10)

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: ADMIN_NAME, role: 'ADMIN', password },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: 'ADMIN',
      password,
    },
  })

  console.log(`✅ Admin user: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
