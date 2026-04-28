'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/permissions'

export async function createAuditLog(data: {
  action: string
  entity: string
  entityId?: string
  changes?: any
}) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      ...data,
    },
  })
}
