import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'
import Link from '@/components/ui/safe-link'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

async function updateAddOn(formData: FormData) {
  'use server'

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const isActive = formData.get('isActive') === 'on'

  await prisma.addOn.update({
    where: { id },
    data: { name, description, price, isActive },
  })

  redirect('/admin/add-ons')
}

async function deleteAddOn(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await prisma.addOn.delete({ where: { id } })
  redirect('/admin/add-ons')
}

export default async function EditAddOnPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()

  const { id } = await params
  const addOn = await prisma.addOn.findUnique({ where: { id } })

  if (!addOn) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/add-ons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Add-On</h2>
          <p className="text-muted-foreground mt-1">
            Update add-on information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add-On Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateAddOn} className="space-y-4 max-w-2xl">
            <input type="hidden" name="id" value={addOn.id} />

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required defaultValue={addOn.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={2} defaultValue={addOn.description || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input id="price" name="price" type="number" min="0" step="0.01" required defaultValue={Number(addOn.price)} />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="isActive" name="isActive" defaultChecked={addOn.isActive} />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>

            <div className="pt-4 flex justify-between">
              <form action={deleteAddOn}>
                <input type="hidden" name="id" value={addOn.id} />
                <Button type="submit" variant="destructive">Delete Add-On</Button>
              </form>
              <div className="space-x-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/add-ons">Cancel</Link>
                </Button>
                <Button type="submit">Update Add-On</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
