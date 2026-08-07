import { prisma } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { NewProductForm } from './new-form'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  await requireAdmin()

  const [categories, collections, occasions] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.collection.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.occasion.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Product</h2>
        <p className="text-muted-foreground mt-2">
          Add a new product to your catalog.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <NewProductForm categories={categories} collections={collections} occasions={occasions} />
        </CardContent>
      </Card>
    </div>
  )
}
