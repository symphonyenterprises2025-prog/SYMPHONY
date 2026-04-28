import { SiteHeader as ClientSiteHeader } from './site-header'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function SiteHeader() {
  const session = await auth()
  let cartCount = 0

  if (session?.user?.id) {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    })
    cartCount = cart?.items.length || 0
  }

  return <ClientSiteHeader cartCount={cartCount} />
}
