'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  updateProduct,
  deleteProduct,
  hardDeleteProduct,
  toggleProductActive,
  addProductImage,
  deleteProductImage,
  upsertProductVariant,
} from '@/features/catalog/actions'
import Link from '@/components/ui/safe-link'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { X, Upload, ImageIcon, Power, AlertTriangle, ShieldAlert, History } from 'lucide-react'
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

interface HistoryCounts {
  orderItems: number
  cartItems: number
  wishlistItems: number
  reviews: number
}

export function EditProductForm({
  product,
  categories,
  historyCounts,
}: {
  product: any & { images: ProductImage[]; variants: ProductVariant[] }
  categories: any[]
  historyCounts: HistoryCounts
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [togglingActive, setTogglingActive] = useState(false)
  const [hardDeleting, setHardDeleting] = useState(false)
  const [hardDeleteConfirm, setHardDeleteConfirm] = useState('')
  const [error, setError] = useState('')
  const [images, setImages] = useState<ProductImage[]>(product.images || [])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [variants, setVariants] = useState<ProductVariant[]>(product.variants || [])

  const { orderItems, cartItems, wishlistItems, reviews } = historyCounts
  const softDeleteBlocked = orderItems > 0
  const totalHistory =
    orderItems + cartItems + wishlistItems + reviews

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
    const categoryIds = categories
      .filter((_: any) => formData.get(`cat-${_.id}`) === 'on')
      .map((_: any) => _.id)
    const isActive = formData.get('isActive') === 'on'
    const isFeatured = formData.get('isFeatured') === 'on'
    const hasCustomization = formData.get('hasCustomization') === 'on'
    const customizationLabel = formData.get('customizationLabel') as string
    const socialProofLine1 = formData.get('socialProofLine1') as string
    const socialProofLine2 = formData.get('socialProofLine2') as string

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
        categoryIds,
        isActive,
        isFeatured,
        hasCustomization,
        customizationLabel,
        socialProofLine1,
        socialProofLine2,
      })

      await upsertProductVariant(product.id, {
        price,
        comparePrice,
        stock,
        sku,
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
    if (softDeleteBlocked) {
      setError(
        `Soft delete is blocked: this product is part of ${orderItems} past order${orderItems === 1 ? '' : 's'}. ` +
          'Mark the product Inactive first, then use Hard Delete below to remove it and its history.'
      )
      return
    }

    const extras: string[] = []
    if (cartItems > 0) extras.push(`${cartItems} cart item${cartItems === 1 ? '' : 's'}`)
    if (wishlistItems > 0)
      extras.push(`${wishlistItems} wishlist item${wishlistItems === 1 ? '' : 's'}`)
    if (reviews > 0) extras.push(`${reviews} review${reviews === 1 ? '' : 's'}`)
    const extraLine = extras.length > 0 ? `\n\nRelated data that will also be removed: ${extras.join(', ')}.` : ''

    if (
      !confirm(
        `Are you sure you want to delete "${product.name}"?\n\nIt has no past orders, so this is safe.${extraLine}\n\nThis action cannot be undone.`
      )
    ) {
      return
    }
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

  async function onToggleActive() {
    const next = !product.isActive
    const verb = next ? 'deactivate' : 'activate'
    const warn = next
      ? `"${product.name}" will be hidden from the storefront. You can reactivate it later, or use Hard Delete below to remove it.`
      : `"${product.name}" will be visible on the storefront again.`
    if (!confirm(`${verb.charAt(0).toUpperCase() + verb.slice(1)} this product?\n\n${warn}`)) {
      return
    }
    setTogglingActive(true)
    setError('')
    try {
      await toggleProductActive(product.id)
      router.refresh()
    } catch (err: any) {
      setError(err.message || `Failed to ${verb} product`)
      setTogglingActive(false)
    }
  }

  async function onHardDelete() {
    setError('')

    if (product.isActive) {
      setError(
        'Hard Delete is blocked: the product is still Active. Mark it Inactive first, then return here to hard delete.'
      )
      return
    }

    if (hardDeleteConfirm.trim() !== product.name) {
      setError(
        `To confirm, type the product name exactly as shown: "${product.name}"`
      )
      return
    }

    const summary = [
      `${orderItems} past order item${orderItems === 1 ? '' : 's'}`,
      `${cartItems} cart item${cartItems === 1 ? '' : 's'}`,
      `${wishlistItems} wishlist item${wishlistItems === 1 ? '' : 's'}`,
      `${reviews} review${reviews === 1 ? '' : 's'}`,
    ].join(', ')

    if (
      !confirm(
        `FINAL WARNING\n\n` +
          `This will PERMANENTLY delete "${product.name}" AND every record that references it:\n` +
          `  - ${summary}\n` +
          `  - All variants, images, and reviews\n\n` +
          `This action CANNOT be undone. Continue?`
      )
    ) {
      return
    }

    setHardDeleting(true)
    try {
      await hardDeleteProduct(product.id)
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to hard delete product')
      setHardDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-red-700 text-sm bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {/* Status & Visibility */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
              Storefront Status
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                  product.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="text-sm text-muted-foreground">
                {product.isActive
                  ? 'Visible to customers on the storefront.'
                  : 'Hidden from the storefront. Customers cannot see or order it.'}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant={product.isActive ? 'outline' : 'default'}
            onClick={onToggleActive}
            disabled={togglingActive || loading || deleting || hardDeleting}
            className="flex items-center gap-2"
          >
            <Power className="w-4 h-4" />
            {togglingActive
              ? 'Updating...'
              : product.isActive
                ? 'Mark Inactive'
                : 'Mark Active'}
          </Button>
        </div>
      </div>

      {/* Delete Information */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold">Delete Information</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {totalHistory === 0
            ? 'This product has no related records. It can be deleted safely (soft delete).'
            : `This product is referenced by ${totalHistory} related record${totalHistory === 1 ? '' : 's'} across the system:`}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div
            className={`rounded-md border p-3 ${
              orderItems > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Past orders</div>
            <div
              className={`text-2xl font-bold ${
                orderItems > 0 ? 'text-red-700' : 'text-gray-700'
              }`}
            >
              {orderItems}
            </div>
            <div className="text-xs text-muted-foreground">
              {orderItems > 0 ? 'blocks soft delete' : 'none'}
            </div>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Cart items</div>
            <div className="text-2xl font-bold text-gray-700">{cartItems}</div>
            <div className="text-xs text-muted-foreground">
              {cartItems > 0 ? 'will be cleaned' : 'none'}
            </div>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Wishlist</div>
            <div className="text-2xl font-bold text-gray-700">{wishlistItems}</div>
            <div className="text-xs text-muted-foreground">
              {wishlistItems > 0 ? 'will be cleaned' : 'none'}
            </div>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Reviews</div>
            <div className="text-2xl font-bold text-gray-700">{reviews}</div>
            <div className="text-xs text-muted-foreground">
              {reviews > 0 ? 'will be cleaned' : 'none'}
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm">
          {softDeleteBlocked ? (
            <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-800">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold">Soft delete is blocked</div>
                <div>
                  This product is part of {orderItems} past order{orderItems === 1 ? '' : 's'}.
                  Deleting it would destroy customer order history. Mark the product{' '}
                  <strong>Inactive</strong> above, then use <strong>Hard Delete</strong> below
                  to remove it and its history.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 rounded-md bg-green-50 border border-green-200 text-green-800">
              <span className="w-4 h-4 mt-0.5 flex-shrink-0 inline-block rounded-full bg-green-500" />
              <div>
                <div className="font-semibold">Soft delete is allowed</div>
                <div>
                  No past orders reference this product. Soft delete will remove it and clean
                  up related cart and wishlist entries. Order history is unaffected.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 border rounded-lg p-4 bg-white">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product.name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={product.slug} required />
        </div>

        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2">No categories found. Create one first.</p>
            )}
            {categories.map((cat) => {
              const checked = product.categories?.some((pc: any) => pc.id === cat.id)
              return (
                <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox id={`cat-${cat.id}`} name={`cat-${cat.id}`} defaultChecked={checked} />
                  {cat.name}
                </label>
              )
            })}
          </div>
        </div>

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
            <Input id="sku" name="sku" required defaultValue={variants[0]?.sku || ''} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDesc">Short Description</Label>
          <Textarea id="shortDesc" name="shortDesc" defaultValue={product.shortDesc || ''} rows={2} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={product.description}
            rows={6}
            required
          />
        </div>

        {/* Social Proof Section */}
        <div className="border rounded-lg p-4 space-y-3 bg-white">
          <Label className="text-base font-semibold">Social Proof</Label>
          <p className="text-xs text-muted-foreground">Static text shown on the product page to build trust.</p>
          <div className="space-y-2">
            <Label htmlFor="socialProofLine1">Line 1</Label>
            <Input id="socialProofLine1" name="socialProofLine1" defaultValue={product.socialProofLine1 || ''} placeholder="e.g. ★ 4.9 rating from 1,024 reviews" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialProofLine2">Line 2</Label>
            <Input id="socialProofLine2" name="socialProofLine2" defaultValue={product.socialProofLine2 || ''} placeholder="e.g. 10K+ happy customers worldwide" />
          </div>
        </div>

        {/* Customization Section */}
        <div className="border rounded-lg p-4 space-y-3 bg-white">
          <div className="flex items-center space-x-2">
            <Checkbox id="hasCustomization" name="hasCustomization" defaultChecked={product.hasCustomization} />
            <Label htmlFor="hasCustomization">Enable Customization</Label>
          </div>
          <p className="text-xs text-muted-foreground">Allow customers to provide custom text / upload an image for this product.</p>
          <div className="space-y-2">
            <Label htmlFor="customizationLabel">Customization Label</Label>
            <Input id="customizationLabel" name="customizationLabel" defaultValue={product.customizationLabel || ''} placeholder="e.g. Enter your message for the gift tag" />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <Label className="text-base font-semibold flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Product Images
          </Label>

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

        <div className="pt-4 flex justify-between flex-wrap gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={deleting || loading || softDeleteBlocked}
            title={
              softDeleteBlocked
                ? `Blocked: product is in ${orderItems} order${orderItems === 1 ? '' : 's'}. Use Hard Delete below.`
                : 'Delete product (preserves order history)'
            }
          >
            {deleting ? 'Deleting...' : 'Delete Product'}
          </Button>
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/products')}
              disabled={loading || deleting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || deleting}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>

      {/* Danger Zone: Hard Delete */}
      <div
        className={`border-2 rounded-lg p-4 ${
          product.isActive
            ? 'border-gray-200 bg-gray-50'
            : 'border-red-300 bg-red-50'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert
            className={`w-5 h-5 ${product.isActive ? 'text-gray-500' : 'text-red-600'}`}
          />
          <h3
            className={`font-semibold ${
              product.isActive ? 'text-gray-700' : 'text-red-800'
            }`}
          >
            Danger Zone — Hard Delete
          </h3>
        </div>

        {product.isActive ? (
          <div className="text-sm text-muted-foreground">
            Hard Delete is disabled while the product is <strong>Active</strong>. Mark the
            product Inactive above first.
          </div>
        ) : (
          <>
            <p className="text-sm text-red-800 mb-3">
              This will <strong>permanently</strong> delete the product AND every record
              that references it. This action <strong>cannot be undone</strong>.
            </p>
            <ul className="text-sm text-red-800 list-disc pl-5 mb-4 space-y-1">
              <li>
                <strong>{orderItems}</strong> past order item{orderItems === 1 ? '' : 's'}{' '}
                will be removed from customer order history
              </li>
              <li>
                <strong>{cartItems}</strong> cart item{cartItems === 1 ? '' : 's'} and{' '}
                <strong>{wishlistItems}</strong> wishlist item{wishlistItems === 1 ? '' : 's'}{' '}
                will be deleted
              </li>
              <li>
                <strong>{reviews}</strong> review{reviews === 1 ? '' : 's'} and all
                variants and images will be removed
              </li>
            </ul>
            <div className="space-y-2">
              <Label htmlFor="hardDeleteConfirm" className="text-red-800">
                Type <code className="px-1.5 py-0.5 rounded bg-white border border-red-300 font-mono">{product.name}</code> to
                confirm
              </Label>
              <Input
                id="hardDeleteConfirm"
                value={hardDeleteConfirm}
                onChange={(e) => setHardDeleteConfirm(e.target.value)}
                placeholder="Product name"
                className="border-red-300 focus-visible:ring-red-500"
                autoComplete="off"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={onHardDelete}
                disabled={
                  hardDeleting || hardDeleteConfirm.trim() !== product.name
                }
                className="w-full sm:w-auto"
              >
                {hardDeleting
                  ? 'Hard Deleting...'
                  : `Hard Delete Product & ${totalHistory} Related Record${totalHistory === 1 ? '' : 's'}`}
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        <Link href="/admin/products" className="hover:underline">
          ← Back to products
        </Link>
      </div>
    </div>
  )
}
