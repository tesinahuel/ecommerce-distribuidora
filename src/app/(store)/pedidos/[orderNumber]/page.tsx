import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Clock, Package, Truck, XCircle, ArrowLeft } from 'lucide-react'
import { getOrderByNumber } from '@/lib/orders'
import { formatPrice, formatDate } from '@/lib/utils'
import { STORE_ADDRESS, DELIVERY_DAYS } from '@/data/shipping'
import { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: typeof Clock }> = {
  pendiente:         { label: 'Pendiente de confirmación', color: '#B08A1F', bg: '#F1EADC', border: '#E6DFD1', icon: Clock },
  confirmado:        { label: 'Confirmado', color: '#3A6EA5', bg: '#EAF1F8', border: '#D6E4F0', icon: CheckCircle },
  'en-preparacion':  { label: 'En preparación', color: '#C9A227', bg: '#F1EADC', border: '#E6DFD1', icon: Package },
  enviado:           { label: 'En camino', color: '#6E5FA5', bg: '#EFEBF8', border: '#DFD6F0', icon: Truck },
  entregado:         { label: 'Entregado', color: '#3F6B3A', bg: '#EAF2E8', border: '#D6E8D1', icon: CheckCircle },
  cancelado:         { label: 'Cancelado', color: '#A5453A', bg: '#F8ECEA', border: '#F0D6D1', icon: XCircle },
}

const SHIFT_LABELS: Record<string, string> = {
  mañana: 'Mañana (10 a 13 hs)',
  tarde: 'Tarde (13 a 16 hs)',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ orderNumber: string }>
  searchParams: Promise<{ nuevo?: string }>
}

export default async function OrderPage({ params, searchParams }: PageProps) {
  const { orderNumber } = await params
  const { nuevo } = await searchParams
  const order = await getOrderByNumber(orderNumber)

  if (!order) return notFound()

  const status = STATUS_CONFIG[order.status]
  const StatusIcon = status.icon
  const sectionStyle = { background: 'var(--card-white)', border: '1px solid var(--hairline)' }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans-ui" style={{ background: 'var(--cream)' }}>
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft className="w-4 h-4" strokeWidth={1.6} /> Volver al inicio
      </Link>

      {/* Success banner */}
      {nuevo === 'true' && (
        <div className="p-6 mb-6 text-center" style={{ background: 'var(--beige)', border: '1px solid var(--hairline)' }}>
          <h2 className="font-display mb-1" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>¡Pedido recibido!</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Te contactamos por WhatsApp al <strong style={{ color: 'var(--text-primary)' }}>{order.customer.phone}</strong> para confirmar tu pedido y coordinar la entrega.
          </p>
        </div>
      )}

      {/* Payment instructions */}
      {order.paymentMethod === 'efectivo' && (
        <div className="p-4 mb-4 text-sm" style={sectionStyle}>
          <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Pago en efectivo (10% OFF aplicado)</p>
          <p style={{ color: 'var(--text-secondary)' }}>Preparate el monto exacto de <strong style={{ color: 'var(--text-primary)' }}>{formatPrice(order.total)}</strong>. Lo abonás cuando recibís el pedido.</p>
        </div>
      )}
      {order.paymentMethod === 'transferencia' && (
        <div className="p-4 mb-4" style={sectionStyle}>
          <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Instrucciones — Transferencia bancaria</p>
          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            Transferí <strong style={{ color: 'var(--text-primary)' }}>{formatPrice(order.total)}</strong> al alias:
          </p>
          <p className="font-mono font-bold text-lg mb-2" style={{ color: 'var(--gold)' }}>huevos.cosmicos.uala</p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Una vez realizada la transferencia, envianos el comprobante por WhatsApp para confirmar tu pedido.
          </p>
        </div>
      )}

      {/* Order header */}
      <div className="p-5 mb-4" style={sectionStyle}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Número de pedido</p>
            <p className="font-display" style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)' }}>{order.orderNumber}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium" style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.color }}>
            <StatusIcon className="w-4 h-4" strokeWidth={1.6} />
            {status.label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Cliente</p>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{order.customer.name}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>WhatsApp</p>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{order.customer.phone}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Forma de pago</p>
            <p className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
              {order.paymentMethod === 'efectivo' ? 'Efectivo (10% off)' : 'Transferencia bancaria'}
            </p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Estado del pago</p>
            <p
              className="font-medium"
              style={{ color: order.paymentStatus === 'pagado' ? '#3F6B3A' : order.paymentStatus === 'rechazado' ? '#A5453A' : '#B08A1F' }}
            >
              {order.paymentStatus === 'pagado' ? 'Pagado' : order.paymentStatus === 'rechazado' ? 'Rechazado' : 'Pendiente'}
            </p>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      {order.shippingAddress && (
        <div className="p-5 mb-4 text-sm" style={sectionStyle}>
          <h3 className="font-display mb-3" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Entrega</h3>
          <div className="space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
            <p>{order.shippingAddress.street} {order.shippingAddress.number}, {order.shippingAddress.locality}</p>
            <p>Turno: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{SHIFT_LABELS[order.shippingAddress.shift] ?? order.shippingAddress.shift}</span></p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Días de entrega: {DELIVERY_DAYS}</p>
            {order.shippingAddress.notes && (
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{order.shippingAddress.notes}</p>
            )}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="p-5 mb-4" style={sectionStyle}>
        <h3 className="font-display mb-3" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Productos</h3>
        <ul className="divide-y" style={{ borderColor: 'var(--hairline)' }}>
          {order.items.map((item, i) => (
            <li key={i} className="py-2.5 flex justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>{item.productName} <span style={{ color: 'var(--text-tertiary)' }}>x{item.quantity}</span></span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{formatPrice(item.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="pt-3 mt-1 space-y-1.5 text-sm" style={{ borderTop: '1px solid var(--hairline)' }}>
          <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
            <span>Subtotal</span>
            <span style={{ color: 'var(--text-primary)' }}>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
            <span>Envío</span>
            <span style={{ color: 'var(--text-primary)' }}>{order.shippingCost === 0 ? '¡Gratis!' : formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between font-display pt-1" style={{ fontSize: '1.1rem', fontWeight: 600, borderTop: '1px solid var(--hairline)' }}>
            <span style={{ color: 'var(--text-primary)' }}>Total</span>
            <span style={{ color: 'var(--olive-dark)' }}>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <a
          href={`https://wa.me/${STORE_ADDRESS.whatsapp}?text=${encodeURIComponent(`Hola! Te escribo por mi pedido ${order.orderNumber}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-label inline-flex items-center gap-2 px-6 py-3"
          style={{ background: 'var(--olive-dark)', color: '#fff' }}
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  )
}
