import Link from '@/components/ui/safe-link'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { DeleteProductButton } from './delete-button'
import { ToggleActiveButton } from './toggle-active-button'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  await requireAdmin()

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      categories: true,
      _count: {
        select: {
          orderItems: true,
          cartItems: true,
          reviews: true,
        },
      },
    },
  })

  // Product has no back-relation for WishlistItem, so count separately.
  const productIds = products.map((p) => p.id)
  const wishlistGroups = await prisma.wishlistItem.groupBy({
    by: ['productId'],
    where: { productId: { in: productIds } },
    _count: { _all: true },
  })
  const wishlistCountByProduct = new Map<string, number>()
  for (const g of wishlistGroups) {
    wishlistCountByProduct.set(g.productId, g._count._all)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your store&apos;s products
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">History</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No products found. Add one to get started.
                  </td>
                </tr>
              ) : (
                products.map((product: typeof products[number]) => {
                  const orders = product._count.orderItems
                  const carts = product._count.cartItems
                  const wishlists = wishlistCountByProduct.get(product.id) ?? 0
                  const reviews = product._count.reviews
                  return (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-4 font-medium">{product.name}</td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {product.categories.length > 0
                          ? product.categories.map((c) => c.name).join(', ')
                          : 'Uncategorized'}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            product.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {orders > 0 ? (
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800"
                            title={`In ${orders} order${orders === 1 ? '' : 's'} — mark inactive to hard-delete`}
                          >
                            In {orders} order{orders === 1 ? '' : 's'}
                          </span>
                        ) : carts > 0 || wishlists > 0 ? (
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800"
                            title={`${carts} cart + ${wishlists} wishlist (no orders) — safe to delete`}
                          >
                            Clean
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700"
                            title="No related history"
                          >
                            Clean
                          </span>
                        )}
                        {reviews > 0 && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({reviews} review{reviews === 1 ? '' : 's'})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {product.isFeatured ? 'Yes' : 'No'}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-semibold hover:underline"
                          >
                            Edit
                          </Link>
                          <ToggleActiveButton
                            productId={product.id}
                            productName={product.name}
                            isActive={product.isActive}
                          />
                          <DeleteProductButton
                            productId={product.id}
                            productName={product.name}
                            orderItemCount={orders}
                            cartItemCount={carts}
                            wishlistItemCount={wishlists}
                            isActive={product.isActive}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <span className="font-semibold">Legend:</span>{' '}
          <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-red-100 text-red-800 mr-1">
            In N orders
          </span>
          soft-delete blocked, use Hard Delete.{' '}
          <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-amber-100 text-amber-800 mr-1">
            Clean
          </span>
          no orders, soft delete allowed (will remove carts and wishlists).
        </div>
      </div>
    </div>
  )
}
