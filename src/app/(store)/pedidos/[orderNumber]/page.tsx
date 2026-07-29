import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Clock, Package, Truck, XCircle, ArrowLeft } from 'lucide-react'
import { getOrderByNumber } from '@/lib/orders'
import { formatPrice, formatDate } from '@/lib/utils'
import { STORE_ADDRESS, DELIVERY_DAYS } from '@/data/shipping'
import { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: typeof Clock }> = {
  pendiente:         { label: 'Pendiente de confirmación', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: Clock },
  confirmado:        { label: 'Confirmado', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)', icon: CheckCircle },
  'en-preparacion':  { label: 'En preparación', color: '#D4AF37', bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.3)', icon: Package },
  enviado:           { label: 'En camino', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)', icon: Truck },
  entregado:         { label: 'Entregado ✓', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)', icon: CheckCircle },
  cancelado:         { label: 'Cancelado', color: '#CC2200', bg: 'rgba(204,34,0,0.1)', border: 'rgba(204,34,0,0.3)', icon: XCircle },
}

const SHIFT_LABELS: Record<string, string> = {
  mañana: 'Mañana (10 a 13 hs)',
  tarde: 'Tarde (13 a 16 hs)',
}

interface PageProps {
  params: Promise<{ orderNumber: string }>
  searchParams: Promise<{ nuevo?: string }>
}

export default async function OrderPage({ params, searchParams }: PageProps) {
  const { orderNumber } = await params
  const { nuevo } = await searchParams
  const order = getOrderByNumber(orderNumber)

  if (!order) return notFound()

  const status = STATUS_CONFIG[order.status]
  const StatusIcon = status.icon

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white" style={{ color: '#888' }}>
        <ArrowLeft className="w-4 h-4" /> Volver al inicio
      </Link>

      {/* Success banner */}
      {nuevo === 'true' && (
        <div className="rounded-2xl p-6 mb-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(204,34,0,0.15), rgba(212,175,55,0.1))', border: '1px solid rgba(212,175,55,0.3)' }}>
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="font-extrabold text-white text-xl mb-1">¡Pedido recibido!</h2>
          <p className="text-sm" style={{ color: '#aaa' }}>
            Te contactamos por WhatsApp al <strong className="text-white">{order.customer.phone}</strong> para confirmar tu pedido y coordinar la entrega.
          </p>
        </div>
      )}

      {/* Payment instructions */}
      {order.paymentMethod === 'efectivo' && (
        <div className="rounded-2xl p-4 mb-4 text-sm" style={{ background: 'rgba(204,34,0,0.08)', border: '1px solid rgba(204,34,0,0.25)' }}>
          <p className="font-semibold mb-1 text-white">💵 Pago en efectivo (10% OFF aplicado)</p>
          <p style={{ color: '#aaa' }}>Preparate el monto exacto de <strong className="text-white">{formatPrice(order.total)}</strong>. Lo abonás cuando recibís el pedido.</p>
        </div>
      )}
      {order.paymentMethod === 'transferencia' && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.25)' }}>
          <p className="font-semibold text-white mb-2">🏦 Instrucciones — Transferencia bancaria</p>
          <p className="text-sm mb-1" style={{ color: '#aaa' }}>
            Transferí <strong className="text-white">{formatPrice(order.total)}</strong> al alias:
          </p>
          <p className="font-mono font-bold text-lg mb-2" style={{ color: '#D4AF37' }}>huevos.cosmicos.uala</p>
          <p className="text-xs" style={{ color: '#888' }}>
            Una vez realizada la transferencia, envianos el comprobante por WhatsApp para confirmar tu pedido.
          </p>
        </div>
      )}

      {/* Order header */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: '#0d0d2b', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs mb-1" style={{ color: '#666' }}>Número de pedido</p>
            <p className="font-bold text-xl text-white">{order.orderNumber}</p>
            <p className="text-xs mt-1" style={{ color: '#555' }}>{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold" style={{ background: status.bg, borderColor: status.border, color: status.color }}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs mb-0.5" style={{ color: '#666' }}>Cliente</p>
            <p className="font-medium text-white">{order.customer.name}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: '#666' }}>WhatsApp</p>
            <p className="font-medium text-white">{order.customer.phone}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: '#666' }}>Forma de pago</p>
            <p className="font-medium text-white capitalize">
              {order.paymentMethod === 'efectivo' ? 'Efectivo (10% off)' : 'Transferencia bancaria'}
            </p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: '#666' }}>Estado del pago</p>
            <p className={`font-medium ${order.paymentStatus === 'pagado' ? 'text-green-400' : order.paymentStatus === 'rechazado' ? 'text-red-400' : 'text-yellow-400'}`}>
              {order.paymentStatus === 'pagado' ? 'Pagado' : order.paymentStatus === 'rechazado' ? 'Rechazado' : 'Pendiente'}
            </p>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      {order.shippingAddress && (
        <div className="rounded-2xl p-5 mb-4 text-sm" style={{ background: '#0d0d2b', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="font-bold text-white mb-3">Entrega</h3>
          <div className="space-y-1.5" style={{ color: '#aaa' }}>
            <p>{order.shippingAddress.street} {order.shippingAddress.number}, {order.shippingAddress.locality}</p>
            <p>Turno: <span className="font-medium text-white">{SHIFT_LABELS[order.shippingAddress.shift] ?? order.shippingAddress.shift}</span></p>
            <p className="text-xs" style={{ color: '#666' }}>Días de entrega: {DELIVERY_DAYS}</p>
            {order.shippingAddress.notes && (
              <p className="text-xs" style={{ color: '#666' }}>{order.shippingAddress.notes}</p>
            )}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: '#0d0d2b', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 className="font-bold text-white mb-3">Productos</h3>
        <ul className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {order.items.map((item, i) => (
            <li key={i} className="py-2.5 flex justify-between text-sm">
              <span style={{ color: '#aaa' }}>{item.productName} <span style={{ color: '#555' }}>x{item.quantity}</span></span>
              <span className="font-medium text-white">{formatPrice(item.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-3 mt-1 space-y-1.5 text-sm" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex justify-between" style={{ color: '#888' }}>
            <span>Subtotal</span>
            <span className="text-white">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between" style={{ color: '#888' }}>
            <span>Envío</span>
            <span className="text-white">{order.shippingCost === 0 ? '¡Gratis!' : formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <span className="text-white">Total</span>
            <span style={{ color: '#D4AF37' }}>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <a
          href={`https://wa.me/${STORE_ADDRESS.whatsapp}?text=${encodeURIComponent(`Hola! Te escribo por mi pedido ${order.orderNumber} 🥚`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-red inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm text-white"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  )
}
