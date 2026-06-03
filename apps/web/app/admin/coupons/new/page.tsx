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
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

async function createCoupon(formData: FormData) {
  'use server'
  
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

  await prisma.coupon.create({
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

export default async function NewCouponPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/coupons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Coupon</h2>
          <p className="text-muted-foreground mt-1">
            Create a new discount coupon
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coupon Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCoupon} className="space-y-4 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code *</Label>
              <Input id="code" name="code" required placeholder="e.g., WELCOME20" className="uppercase" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={2} placeholder="Coupon description..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <select id="discountType" name="discountType" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value *</Label>
                <Input id="discountValue" name="discountValue" type="number" step="0.01" required placeholder="10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderValue">Min Order Value (₹)</Label>
                <Input id="minOrderValue" name="minOrderValue" type="number" step="0.01" placeholder="500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
                <Input id="maxDiscount" name="maxDiscount" type="number" step="0.01" placeholder="200" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input id="usageLimit" name="usageLimit" type="number" placeholder="100 (leave empty for unlimited)" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input id="validFrom" name="validFrom" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input id="validUntil" name="validUntil" type="date" />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="isActive" name="isActive" defaultChecked />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/coupons">Cancel</Link>
              </Button>
              <Button type="submit">Create Coupon</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
