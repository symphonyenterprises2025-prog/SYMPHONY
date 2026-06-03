import { Providers } from './providers'
import { WhatsAppChat } from '@/components/storefront/whatsapp-chat'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {children}
      <WhatsAppChat />
    </Providers>
  )
}
