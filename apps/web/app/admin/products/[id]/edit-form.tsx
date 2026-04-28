'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { updateProduct, deleteProduct } from '@/features/catalog/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function EditProductForm({ product, categories }: { product: any, categories: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
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
    const categoryId = formData.get('categoryId') as string
    const isActive = formData.get('isActive') === 'on'
    const isFeatured = formData.get('isFeatured') === 'on'

    try {
      await updateProduct(product.id, {
        name,
        slug,
        description,
        shortDesc,
        categoryId,
        isActive,
        isFeatured,
      })
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    if (!confirm('Are you sure you want to delete this product?')) return
    setDeleting(true)
    try {
      await deleteProduct(product.id)
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to delete product')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={product.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={product.slug} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <select 
          id="categoryId" 
          name="categoryId" 
          defaultValue={product.categoryId}
          required 
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDesc">Short Description</Label>
        <Textarea id="shortDesc" name="shortDesc" defaultValue={product.shortDesc || ''} rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <Textarea id="description" name="description" defaultValue={product.description} rows={6} required />
      </div>

      <div className="flex flex-col space-y-3 pt-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="isActive" name="isActive" defaultChecked={product.isActive} />
          <Label htmlFor="isActive">Active (Visible in store)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isFeatured" name="isFeatured" defaultChecked={product.isFeatured} />
          <Label htmlFor="isFeatured">Featured Product</Label>
        </div>
      </div>

      <div className="pt-4 flex justify-between">
        <Button type="button" variant="destructive" onClick={onDelete} disabled={deleting || loading}>
          {deleting ? 'Deleting...' : 'Delete Product'}
        </Button>
        <div className="space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/products')} disabled={loading || deleting}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || deleting}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  )
}
