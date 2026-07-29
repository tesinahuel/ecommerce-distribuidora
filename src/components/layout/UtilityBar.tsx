import { Truck, MessageCircle, User } from 'lucide-react'
import { STORE_ADDRESS } from '@/data/shipping'

export default function UtilityBar() {
  return (
    <div
      className="hidden sm:block font-sans-ui text-white"
      style={{ background: 'var(--olive-dark)', height: '40px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Envíos a GBA y CABA</span>
        </div>
        <div className="hidden md:block">
          Despensa saludable · Directo del productor a tu mesa
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${STORE_ADDRESS.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>WhatsApp</span>
          </a>
          <span className="flex items-center gap-1.5 opacity-90">
            <User className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Mi cuenta</span>
          </span>
        </div>
      </div>
    </div>
  )
}
