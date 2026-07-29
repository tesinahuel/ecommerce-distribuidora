import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { STORE_ADDRESS, DELIVERY_DAYS } from '@/data/shipping'

export default function Footer() {
  return (
    <footer id="contacto" className="border-t" style={{ background: '#03030f', borderColor: 'rgba(212,175,55,0.15)' }}>
      <div className="cosmic-sep-gold" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl border" style={{ background: '#0d0d2b', borderColor: 'rgba(212,175,55,0.4)' }}>
                🥚
              </div>
              <div>
                <p className="brand-title leading-tight" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  Huevos Cósmicos
                </p>
                <p className="brand-subtitle mt-0.5" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                  Despensa Saludable
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-sm" style={{ color: '#777' }}>
              Distribuidores directos de huevos orgánicos, blancos, supremas, miel, aceites y conservas.
              Delivery a domicilio en Ramos Mejía y zona GBA.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href={`https://wa.me/${STORE_ADDRESS.whatsapp}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-red text-sm font-semibold px-4 py-2 rounded-lg text-white"
              >
                WhatsApp
              </a>
              <a
                href="https://instagram.com/huevoscosmicos"
                target="_blank" rel="noopener noreferrer"
                className="text-sm font-semibold px-4 py-2 rounded-lg border transition-colors hover:text-white"
                style={{ borderColor: 'rgba(212,175,55,0.4)', color: '#D4AF37' }}
              >
                @HUEVOSCOSMICOS
              </a>
              <Link href="/catalogo" className="text-sm px-4 py-2 rounded-lg border transition-colors hover:text-white" style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#888' }}>
                Ver catálogo
              </Link>
            </div>
          </div>

          {/* Líneas */}
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: '#D4AF37', letterSpacing: '0.12em' }}>Líneas</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#777' }}>
              {[
                ['🌿 Agroecológicos', '/catalogo?linea=agroecologicos'],
                ['💪 Proteína Pura', '/catalogo?linea=proteina-pura'],
                ['🫒 Aceites', '/catalogo?linea=aceites'],
                ['🥣 Desayuno', '/catalogo?linea=desayuno'],
                ['⚡ Línea Fit', '/catalogo?linea=linea-fit'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>

            <h3 className="font-bold mt-6 mb-3 text-sm uppercase tracking-wider" style={{ color: '#D4AF37', letterSpacing: '0.12em' }}>Entregas</h3>
            <p className="text-sm" style={{ color: '#777' }}>{DELIVERY_DAYS}</p>
            <p className="text-xs mt-1" style={{ color: '#555' }}>Mañana 10-13 · Tarde 13-16 hs</p>
            <p className="text-xs mt-1 font-semibold" style={{ color: '#CC2200' }}>Envío gratis desde $50.000</p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: '#D4AF37', letterSpacing: '0.12em' }}>Contacto</h3>
            <ul className="space-y-3 text-sm" style={{ color: '#777' }}>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#CC2200' }} />
                <span>{STORE_ADDRESS.locality}, Buenos Aires</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" style={{ color: '#CC2200' }} />
                <a href={`https://wa.me/${STORE_ADDRESS.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {STORE_ADDRESS.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" style={{ color: '#CC2200' }} />
                <a href={`mailto:${STORE_ADDRESS.email}`} className="hover:text-white transition-colors text-xs break-all">
                  {STORE_ADDRESS.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#CC2200' }} />
                <span className="text-xs" style={{ color: '#555' }}>{STORE_ADDRESS.hours}</span>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-xl border" style={{ background: 'rgba(204,34,0,0.08)', borderColor: 'rgba(204,34,0,0.25)' }}>
              <p className="text-xs font-bold mb-0.5 text-white">💵 10% OFF pagando en efectivo</p>
              <p className="text-xs" style={{ color: '#aaa' }}>Transferencia sin descuento adicional</p>
              <p className="text-xs font-mono mt-1" style={{ color: '#D4AF37' }}>huevos.cosmicos.uala</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="cosmic-sep" />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs" style={{ color: '#444' }}>
          <p>© {new Date().getFullYear()} Huevos Cósmicos. Todos los derechos reservados.</p>
          <p>Distribuidores directos · Ramos Mejía, Buenos Aires</p>
        </div>
      </div>
    </footer>
  )
}
