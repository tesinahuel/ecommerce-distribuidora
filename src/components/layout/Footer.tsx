import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { STORE_ADDRESS, DELIVERY_DAYS, FREE_SHIPPING_FROM } from '@/data/shipping'
import { formatPrice } from '@/lib/utils'

const TIENDA_LINKS = [
  ['Catálogo completo', '/catalogo'],
  ['Orgánicos', '/catalogo?linea=organicos'],
  ['Naturales', '/catalogo?linea=naturales'],
  ['Frutos Secos', '/catalogo?linea=frutos-secos'],
  ['Convencionales', '/catalogo?linea=convencionales'],
  ['Combos', '/catalogo#packs'],
  ['Para empresas', '/empresas'],
]

const colTitleStyle = { color: 'var(--cream)', fontSize: '11px', letterSpacing: '0.2em' } as const

export default function Footer() {
  return (
    <footer id="contacto" className="font-sans-ui" style={{ background: 'var(--olive-darker)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2">
            <p className="font-display mb-3" style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--cream)' }}>
              Huevos Cósmicos
            </p>
            <p className="text-sm leading-relaxed mb-5 max-w-sm" style={{ color: '#A8A492', fontWeight: 300 }}>
              Distribuidores directos de huevos orgánicos, blancos, supremas, miel, aceites y conservas.
              Delivery a domicilio en Ramos Mejía y zona GBA.
            </p>
            <a
              href={`https://wa.me/${STORE_ADDRESS.whatsapp}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-label inline-flex items-center px-5 py-3"
              style={{ background: 'var(--gold)', color: 'var(--olive-darker)' }}
            >
              WhatsApp
            </a>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="nav-label mb-4 font-medium" style={colTitleStyle}>Tienda</h3>
            <ul className="space-y-2.5 text-sm" style={{ color: '#A8A492', fontWeight: 300 }}>
              {TIENDA_LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:opacity-80">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Entregas */}
          <div>
            <h3 className="nav-label mb-4 font-medium" style={colTitleStyle}>Entregas</h3>
            <p className="text-sm" style={{ color: '#A8A492', fontWeight: 300 }}>{DELIVERY_DAYS}</p>
            <p className="text-xs mt-1.5" style={{ color: '#7A7660' }}>Mañana 10-13 · Tarde 13-16 hs</p>
            <p className="text-xs mt-2" style={{ color: 'var(--gold-light)' }}>Envío sin cargo desde {formatPrice(FREE_SHIPPING_FROM)}</p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="nav-label mb-4 font-medium" style={colTitleStyle}>Contacto</h3>
            <ul className="space-y-3 text-sm" style={{ color: '#A8A492', fontWeight: 300 }}>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.4} style={{ color: 'var(--gold)' }} />
                <span>{STORE_ADDRESS.locality}, Buenos Aires</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" strokeWidth={1.4} style={{ color: 'var(--gold)' }} />
                <a href={`https://wa.me/${STORE_ADDRESS.whatsapp}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80">
                  {STORE_ADDRESS.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" strokeWidth={1.4} style={{ color: 'var(--gold)' }} />
                <a href={`mailto:${STORE_ADDRESS.email}`} className="transition-colors hover:opacity-80 text-xs break-all">
                  {STORE_ADDRESS.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.4} style={{ color: 'var(--gold)' }} />
                <span className="text-xs" style={{ color: '#7A7660' }}>{STORE_ADDRESS.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: '#6E6B57' }}>
          <p>© {new Date().getFullYear()} Huevos Cósmicos. Todos los derechos reservados.</p>
          <p>Distribuidores directos · Ramos Mejía, Buenos Aires</p>
        </div>
      </div>
    </footer>
  )
}
