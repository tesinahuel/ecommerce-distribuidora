import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import CertificationsSection from '@/components/shared/CertificationsSection'
import ProveedoresSection from '@/components/shared/ProveedoresSection'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})
const jost = Jost({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Huevos Cósmicos | Despensa Saludable — Ramos Mejía, GBA',
  description: 'Delivery de huevos orgánicos, blancos, supremas de pollo, miel, aceites y conservas. Ramos Mejía y zona GBA. Martes, miércoles y jueves.',
  keywords: 'huevos orgánicos, huevos blancos, supremas, miel, aceite, delivery, Ramos Mejía, GBA',
  openGraph: {
    title: 'Huevos Cósmicos — Despensa Saludable',
    description: 'Delivery de productos naturales en GBA. Mar / Mié / Jue.',
    type: 'website',
    locale: 'es_AR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <body className={`${jost.className} antialiased`} style={{ background: 'var(--cream)', color: 'var(--text-primary)' }}>
        <Header />
        <CartDrawer />
        <main className="min-h-screen">{children}</main>
        <CertificationsSection />
        <ProveedoresSection />
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
