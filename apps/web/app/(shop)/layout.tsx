import { Providers } from './providers'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}
