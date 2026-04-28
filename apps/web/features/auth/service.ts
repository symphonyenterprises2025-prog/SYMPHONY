import { prisma } from '@/lib/db'
import type { UserRole } from '@prisma/client'

export class AuthService {
  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    })
  }

  static async createUser(data: {
    email: string
    name: string
    role?: UserRole
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role || 'CUSTOMER',
      },
    })
  }

  static async updateUser(id: string, data: { name?: string; email?: string }) {
    return prisma.user.update({
      where: { id },
      data,
    })
  }

  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  }
}
