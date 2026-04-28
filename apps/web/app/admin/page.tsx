import Link from "next/link";
import { prisma } from "@/lib/db";
import { Package, FileText, Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// Admin Dashboard Page
export default async function AdminDashboard() {
  await requireAdmin();

  let productsCount = 0;
  let blogsCount = 0;
  let ordersCount = 0;
  let usersCount = 0;
  let categoriesCount = 0;
  let collectionsCount = 0;

  try {
    productsCount = await prisma.product.count();
  } catch (e) {
    console.error("Error fetching products count:", e);
  }

  try {
    blogsCount = await prisma.blogPost.count();
  } catch (e) {
    console.error("Error fetching blogs count:", e);
  }

  try {
    ordersCount = await prisma.order.count();
  } catch (e) {
    console.error("Error fetching orders count:", e);
  }

  try {
    usersCount = await prisma.user.count({ where: { role: "CUSTOMER" } });
  } catch (e) {
    console.error("Error fetching users count:", e);
  }

  try {
    categoriesCount = await prisma.category.count();
  } catch (e) {
    console.error("Error fetching categories count:", e);
  }

  try {
    collectionsCount = await prisma.collection.count();
  } catch (e) {
    console.error("Error fetching collections count:", e);
  }

  // Fetch recent activity
  let recentOrders: any[] = [];
  let recentCustomers: any[] = [];
  
  try {
    recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        orderNumber: true,
        customerName: true,
        status: true,
        createdAt: true,
      },
    });
  } catch (e) {
    console.error("Error fetching recent orders:", e);
  }

  try {
    recentCustomers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
    });
  } catch (e) {
    console.error("Error fetching recent customers:", e);
  }

  const stats = [
    { title: "Total Products", value: productsCount, icon: Package, href: "/admin/products" },
    { title: "Blog Posts", value: blogsCount, icon: FileText, href: "/admin/blogs" },
    { title: "Orders", value: ordersCount, icon: ShoppingCart, href: "/admin/orders" },
    { title: "Customers", value: usersCount, icon: Users, href: "/admin/customers" },
    { title: "Categories", value: categoriesCount, icon: TrendingUp, href: "/admin/categories" },
    { title: "Collections", value: collectionsCount, icon: DollarSign, href: "/admin/collections" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the Symphony eCommerce Admin Dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="block border rounded-lg p-6 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">{stat.title}</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-semibold">Quick Actions</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/admin/products/new" className="block border rounded p-3 text-center hover:bg-slate-50 transition-colors">
              Add New Product
            </Link>
            <Link href="/admin/blogs/new" className="block border rounded p-3 text-center hover:bg-slate-50 transition-colors">
              Create Blog Post
            </Link>
            <Link href="/admin/categories/new" className="block border rounded p-3 text-center hover:bg-slate-50 transition-colors">
              Add Category
            </Link>
            <Link href="/admin/collections/new" className="block border rounded p-3 text-center hover:bg-slate-50 transition-colors">
              Create Collection
            </Link>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5" />
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.orderNumber} className="flex items-center justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">
                    Order {order.orderNumber} by {order.customerName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent orders</p>
            )}
            {recentCustomers.length > 0 && (
              <>
                {recentCustomers.map((customer) => (
                  <div key={customer.email} className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">
                      New customer: {customer.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </>
            )}
            {recentOrders.length === 0 && recentCustomers.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
