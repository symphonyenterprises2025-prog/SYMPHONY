'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { updateProduct, deleteProduct, addProductImage, deleteProductImage, updateProductVariant } from '@/features/catalog/actions'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { X, Upload, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ProductImage {
  id: string
  url: string
  alt: string | null
  sortOrder: number
}

interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  comparePrice: number | null
  stock: number
}

export function EditProductForm({ product, categories }: { product: any & { images: ProductImage[], variants: ProductVariant[] }, categories: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<ProductImage[]>(product.images || [])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [variants, setVariants] = useState<ProductVariant[]>(product.variants || [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to upload image')
      }

      const data = await res.json()
      
      // Add image to product
      const newImage = await addProductImage(product.id, data.url, file.name)
      setImages([...images, newImage])
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleDeleteImage(imageId: string) {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      await deleteProductImage(imageId)
      setImages(images.filter((img: ProductImage) => img.id !== imageId))
    } catch (err: any) {
      setError(err.message || 'Failed to delete image')
    }
  }

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

    // Get variant data
    const variantId = formData.get('variantId') as string
    const price = parseFloat(formData.get('price') as string) || 0
    const comparePrice = parseFloat(formData.get('comparePrice') as string) || null
    const stock = parseInt(formData.get('stock') as string) || 0
    const sku = formData.get('sku') as string

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

      // Update variant if exists
      if (variantId) {
        await updateProductVariant(variantId, {
          price,
          comparePrice,
          stock,
          sku,
        })
      }

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

      {/* Hidden variant ID */}
      <input type="hidden" name="variantId" value={variants[0]?.id || ''} />

      {/* Pricing Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            min="0" 
            step="0.01" 
            required 
            defaultValue={variants[0]?.price || 0}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comparePrice">Compare Price (₹)</Label>
          <Input 
            id="comparePrice" 
            name="comparePrice" 
            type="number" 
            min="0" 
            step="0.01"
            defaultValue={variants[0]?.comparePrice || ''}
          />
        </div>
      </div>

      {/* Stock & SKU */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input 
            id="stock" 
            name="stock" 
            type="number" 
            min="0" 
            required
            defaultValue={variants[0]?.stock || 0}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input 
            id="sku" 
            name="sku" 
            required
            defaultValue={variants[0]?.sku || ''}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDesc">Short Description</Label>
        <Textarea id="shortDesc" name="shortDesc" defaultValue={product.shortDesc || ''} rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <Textarea id="description" name="description" defaultValue={product.description} rows={6} required />
      </div>

      {/* Product Images Section */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-semibold flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Product Images
        </Label>
        
        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {images.map((image: ProductImage, index: number) => (
              <div key={image.id} className="relative group aspect-square">
                <Image
                  src={image.url}
                  alt={image.alt || `Product image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          <span className="text-sm text-muted-foreground">
            Max 5MB. JPG, PNG, WebP, GIF
          </span>
        </div>
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
