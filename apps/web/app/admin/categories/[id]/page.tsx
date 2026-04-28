import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

async function updateCategory(formData: FormData) {
  'use server'
  
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const isActive = formData.get('isActive') === 'on'
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      isActive,
      sortOrder,
    }
  })

  redirect('/admin/categories')
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()

  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id }
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
          <p className="text-muted-foreground mt-1">
            Update category information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateCategory} className="space-y-4 max-w-2xl">
            <input type="hidden" name="id" value={category.id} />
            
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required defaultValue={category.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" name="slug" required defaultValue={category.slug} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} defaultValue={category.description || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={category.sortOrder} />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="isActive" name="isActive" defaultChecked={category.isActive} />
              <Label htmlFor="isActive" className="cursor-pointer">Active (Visible in store)</Label>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/categories">Cancel</Link>
              </Button>
              <Button type="submit">Update Category</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
