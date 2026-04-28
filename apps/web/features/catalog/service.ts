import { prisma } from '@/lib/db'

export class CatalogService {
  static async createProduct(data: {
    name: string
    slug: string
    description: string
    shortDesc?: string
    categoryId: string
  }) {
    return prisma.product.create({
      data,
    })
  }

  static async updateProduct(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data,
    })
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    })
  }

  static async createCategory(data: {
    name: string
    slug: string
    description?: string
    parentId?: string
  }) {
    return prisma.category.create({
      data,
    })
  }

  static async updateCategory(id: string, data: any) {
    return prisma.category.update({
      where: { id },
      data,
    })
  }

  static async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    })
  }
}
