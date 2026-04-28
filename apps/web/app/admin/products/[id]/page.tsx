import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { EditProductForm } from './edit-form'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()

  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' }
  })

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
        <p className="text-muted-foreground mt-2">
          Update the details of your product.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <EditProductForm product={product} categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
