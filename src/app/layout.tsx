import type { Metadata } from 'next'
import { Montserrat, Bebas_Neue, Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import CertificationsSection from '@/components/shared/CertificationsSection'
import ProveedoresSection from '@/components/shared/ProveedoresSection'
import StarField from '@/components/shared/StarField'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-brand',
  weight: ['400'],
  display: 'swap',
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
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
    <html lang="es" className={`${montserrat.variable} ${bebasNeue.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className={`${montserrat.className} antialiased`} style={{ background: '#050510', color: '#ffffff' }}>
        <div className="fixed inset-0 -z-10 galaxy-bg" aria-hidden>
          <StarField />
        </div>
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
