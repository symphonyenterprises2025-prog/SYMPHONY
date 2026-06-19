import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { WhatsAppChat } from '@/components/storefront/whatsapp-chat'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'Symphony eCommerce - Premium Gifting Solutions for Every Occasion',
  description: 'Discover premium personalized gifts, hampers, and corporate gifting solutions across India. Make every moment memorable with Symphony.',
  keywords: 'personalized gifts, corporate gifting, gift hampers, birthday gifts, anniversary gifts, premium gifts, India',
  authors: [{ name: 'Symphony eCommerce' }],
  openGraph: {
    title: 'Symphony eCommerce - Premium Gifting Solutions',
    description: 'Discover premium personalized gifts, hampers, and corporate gifting solutions across India.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Symphony eCommerce - Premium Gifting Solutions',
    description: 'Discover premium personalized gifts, hampers, and corporate gifting solutions across India.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
        <WhatsAppChat />
        {/* SupraAds Chatbot Widget */}
        <Script
          id="supraads-chatbot-embed"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var s = document.createElement('script');
                s.src = 'https://bot.supraads.in/widget/chatbot.js';
                s.async = true;
                s.dataset.siteId = '8a32d53d3946';
                s.dataset.apiUrl = 'https://bot.supraads.in';
                document.head.appendChild(s);
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
