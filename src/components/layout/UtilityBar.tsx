import { formatPrice } from '@/lib/utils'
import { FREE_SHIPPING_FROM, DELIVERY_DAYS } from '@/data/shipping'

export default function UtilityBar() {
  return (
    <div
      className="hidden sm:flex items-center justify-center font-sans-ui"
      style={{ background: 'var(--olive-dark)', color: '#E4E0D4', height: '40px' }}
    >
      <p className="nav-label text-center" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
        Envío sin cargo desde {formatPrice(FREE_SHIPPING_FROM)}{' '}
        <span style={{ color: 'var(--gold)' }}> · </span>
        Entregas {DELIVERY_DAYS.toLowerCase()}{' '}
        <span style={{ color: 'var(--gold)' }}> · </span>
        10% off en efectivo
      </p>
    </div>
  )
}
