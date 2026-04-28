import { prisma } from '@/lib/db'

export class ContentService {
  static async createContentPage(data: {
    title: string
    slug: string
    content: string
    metaTitle?: string
    metaDesc?: string
  }) {
    return prisma.contentPage.create({
      data,
    })
  }

  static async updateContentPage(id: string, data: any) {
    return prisma.contentPage.update({
      where: { id },
      data,
    })
  }

  static async deleteContentPage(id: string) {
    return prisma.contentPage.delete({
      where: { id },
    })
  }
}
