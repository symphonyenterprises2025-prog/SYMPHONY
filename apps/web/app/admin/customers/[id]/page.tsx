import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Package } from 'lucide-react'
import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()

  const { id } = await params
  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      addresses: true,
      _count: {
        select: { orders: true }
      }
    }
  })

  if (!customer) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{customer.name || 'Customer'}</h2>
            <p className="text-muted-foreground mt-1">
              {customer.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
            {customer.role}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{customer.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{customer.role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Saved Addresses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.addresses.length > 0 ? (
                <div className="space-y-4">
                  {customer.addresses.map((address: typeof customer.addresses[number]) => (
                    <div key={address.id} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{address.firstName} {address.lastName}</p>
                        {address.isDefault && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{address.address1}</p>
                      {address.address2 && <p className="text-sm text-muted-foreground">{address.address2}</p>}
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} - {address.postalCode}
                      </p>
                      {address.phone && <p className="text-sm text-muted-foreground">{address.phone}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No addresses saved</p>
              )}
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.orders.length > 0 ? (
                <div className="space-y-4">
                  {customer.orders.map((order: typeof customer.orders[number]) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{order.total.toString()}</p>
                        <p className="text-sm text-amber-600">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No orders yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Orders</span>
                <span className="font-bold text-2xl">{customer._count.orders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-bold text-2xl">
                  ₹{customer.orders.reduce((sum: number, order: typeof customer.orders[number]) => sum + Number(order.total), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Average Order</span>
                <span className="font-bold text-2xl">
                  ₹{customer.orders.length > 0 
                    ? (customer.orders.reduce((sum: number, order: typeof customer.orders[number]) => sum + Number(order.total), 0) / customer.orders.length).toFixed(2)
                    : '0.00'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Call Customer
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Block Customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
