import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'
import Link from '@/components/ui/safe-link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

async function updateCoupon(formData: FormData) {
  'use server'
  
  const id = formData.get('id') as string
  const code = (formData.get('code') as string).toUpperCase()
  const description = formData.get('description') as string
  const discountType = formData.get('discountType') as string
  const discountValue = parseFloat(formData.get('discountValue') as string)
  const minOrderValue = formData.get('minOrderValue') ? parseFloat(formData.get('minOrderValue') as string) : null
  const maxDiscount = formData.get('maxDiscount') ? parseFloat(formData.get('maxDiscount') as string) : null
  const usageLimit = formData.get('usageLimit') ? parseInt(formData.get('usageLimit') as string) : null
  const validFrom = new Date(formData.get('validFrom') as string)
  const validUntil = formData.get('validUntil') ? new Date(formData.get('validUntil') as string) : null
  const isActive = formData.get('isActive') === 'on'

  await prisma.coupon.update({
    where: { id },
    data: {
      code,
      description,
      discountType: discountType as 'PERCENTAGE' | 'FIXED_AMOUNT',
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
      isActive,
    }
  })

  redirect('/admin/coupons')
}

async function deleteCoupon(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await prisma.coupon.delete({ where: { id } })
  redirect('/admin/coupons')
}

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()

  const { id } = await params
  const coupon = await prisma.coupon.findUnique({ where: { id } })

  if (!coupon) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/coupons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Coupon</h2>
          <p className="text-muted-foreground mt-1">
            Update coupon information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coupon Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateCoupon} className="space-y-4 max-w-2xl">
            <input type="hidden" name="id" value={coupon.id} />
            
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code *</Label>
              <Input id="code" name="code" required defaultValue={coupon.code} className="uppercase" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={2} defaultValue={coupon.description || ''} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <select id="discountType" name="discountType" required defaultValue={coupon.discountType} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value *</Label>
                <Input id="discountValue" name="discountValue" type="number" step="0.01" required defaultValue={Number(coupon.discountValue)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderValue">Min Order Value (₹)</Label>
                <Input id="minOrderValue" name="minOrderValue" type="number" step="0.01" defaultValue={coupon.minOrderValue ? Number(coupon.minOrderValue) : ''} placeholder="500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
                <Input id="maxDiscount" name="maxDiscount" type="number" step="0.01" defaultValue={coupon.maxDiscount ? Number(coupon.maxDiscount) : ''} placeholder="200" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input id="usageLimit" name="usageLimit" type="number" defaultValue={coupon.usageLimit || ''} placeholder="Leave empty for unlimited" />
              <p className="text-xs text-muted-foreground">Current usage: {coupon.usageCount}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input id="validFrom" name="validFrom" type="date" required defaultValue={coupon.validFrom.toISOString().split('T')[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input id="validUntil" name="validUntil" type="date" defaultValue={coupon.validUntil ? coupon.validUntil.toISOString().split('T')[0] : ''} />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="isActive" name="isActive" defaultChecked={coupon.isActive} />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>

            <div className="pt-4 flex justify-between">
              <form action={deleteCoupon}>
                <input type="hidden" name="id" value={coupon.id} />
                <Button type="submit" variant="destructive">Delete Coupon</Button>
              </form>
              <div className="space-x-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/coupons">Cancel</Link>
                </Button>
                <Button type="submit">Update Coupon</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
