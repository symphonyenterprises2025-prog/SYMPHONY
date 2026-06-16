import Link from '@/components/ui/safe-link'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function AdminAddOnsPage() {
  await requireAdmin()

  const addOns = await prisma.addOn.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { products: true, cartItems: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add-Ons</h1>
          <p className="text-muted-foreground mt-2">
            Manage optional extras like gift wrap, keychains, message cards
          </p>
        </div>
        <Link href="/admin/add-ons/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Add-On
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">All Add-Ons</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Products</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addOns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No add-ons found. Add one to get started.
                  </td>
                </tr>
              ) : (
                addOns.map((addOn) => (
                  <tr key={addOn.id} className="border-b">
                    <td className="px-4 py-4 font-medium">{addOn.name}</td>
                    <td className="px-4 py-4">₹{Number(addOn.price)}</td>
                    <td className="px-4 py-4 text-muted-foreground">{addOn._count.products}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${addOn.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {addOn.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/admin/add-ons/${addOn.id}`} className="font-semibold hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
