'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { createProduct } from '@/features/catalog/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

export function NewProductForm({ categories }: { categories: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const shortDesc = formData.get('shortDesc') as string
    const description = formData.get('description') as string
    const categoryIds = categories
      .filter((_: any) => formData.get(`cat-${_.id}`) === 'on')
      .map((_: any) => _.id)
    const price = parseFloat(formData.get('price') as string) || 0
    const comparePrice = parseFloat(formData.get('comparePrice') as string) || undefined
    const stock = parseInt(formData.get('stock') as string) || 0
    const sku = formData.get('sku') as string
    const isActive = formData.get('isActive') === 'on'
    const isFeatured = formData.get('isFeatured') === 'on'
    const hasCustomization = formData.get('hasCustomization') === 'on'
    const customizationLabel = formData.get('customizationLabel') as string
    const socialProofLine1 = formData.get('socialProofLine1') as string
    const socialProofLine2 = formData.get('socialProofLine2') as string

    try {
      const product = await createProduct({
        name,
        slug,
        description,
        shortDesc,
        categoryIds,
        price,
        comparePrice,
        stock,
        sku,
        isActive,
        isFeatured,
        hasCustomization,
        customizationLabel,
        socialProofLine1,
        socialProofLine2,
      })
      // Navigate to edit page to add images
      router.push(`/admin/products/${product.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" required placeholder="product-name" />
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-2">No categories found. Create one first.</p>
          )}
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox id={`cat-${cat.id}`} name={`cat-${cat.id}`} />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input id="price" name="price" type="number" min="0" step="0.01" required placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comparePrice">Compare Price (₹)</Label>
          <Input id="comparePrice" name="comparePrice" type="number" min="0" step="0.01" placeholder="0.00" />
        </div>
      </div>

      {/* Stock & SKU */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input id="stock" name="stock" type="number" min="0" required placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input id="sku" name="sku" required placeholder="PROD-001" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDesc">Short Description</Label>
        <Textarea id="shortDesc" name="shortDesc" rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <Textarea id="description" name="description" rows={6} required />
      </div>

      {/* Social Proof Section */}
      <div className="border rounded-lg p-4 space-y-3 bg-white">
        <Label className="text-base font-semibold">Social Proof</Label>
        <p className="text-xs text-muted-foreground">Static text shown on the product page to build trust.</p>
        <div className="space-y-2">
          <Label htmlFor="socialProofLine1">Line 1</Label>
          <Input id="socialProofLine1" name="socialProofLine1" placeholder="e.g. ★ 4.9 rating from 1,024 reviews" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="socialProofLine2">Line 2</Label>
          <Input id="socialProofLine2" name="socialProofLine2" placeholder="e.g. 10K+ happy customers worldwide" />
        </div>
      </div>

      {/* Customization Section */}
      <div className="border rounded-lg p-4 space-y-3 bg-white">
        <div className="flex items-center space-x-2">
          <Checkbox id="hasCustomization" name="hasCustomization" />
          <Label htmlFor="hasCustomization">Enable Customization</Label>
        </div>
        <p className="text-xs text-muted-foreground">Allow customers to provide custom text / upload an image for this product.</p>
        <div className="space-y-2">
          <Label htmlFor="customizationLabel">Customization Label</Label>
          <Input id="customizationLabel" name="customizationLabel" placeholder="e.g. Enter your message for the gift tag" />
        </div>
      </div>

      {/* Info about images */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <ImageIcon className="w-5 h-5 text-blue-500 mt-0.5" />
        <div>
          <p className="text-sm text-blue-700 font-medium">Product Images</p>
          <p className="text-sm text-blue-600">
            You can add product images after creating the product. Click &quot;Create Product&quot; to continue.
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-3 pt-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="isActive" name="isActive" defaultChecked />
          <Label htmlFor="isActive">Active (Visible in store)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isFeatured" name="isFeatured" />
          <Label htmlFor="isFeatured">Featured Product</Label>
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/products')} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}
