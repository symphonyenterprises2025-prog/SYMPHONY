import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean up old admin email if exists
  await prisma.user.deleteMany({ where: { email: 'admin@symphony.com' } })

  const password = await bcrypt.hash('Prakash@2026', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'symphonyenterprises2025@gmail.com' },
    update: { name: 'Admin', role: 'ADMIN', password },
    create: {
      email: 'symphonyenterprises2025@gmail.com',
      name: 'Admin',
      role: 'ADMIN',
      password,
    },
  })

  console.log('✅ Admin user:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
