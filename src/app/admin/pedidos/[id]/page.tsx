'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { Order, OrderStatus } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'en-preparacion', label: 'En preparación' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
]

const STATUS_COLORS: Record<OrderStatus, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  confirmado: 'bg-blue-100 text-blue-700',
  'en-preparacion': 'bg-purple-100 text-purple-700',
  enviado: 'bg-indigo-100 text-indigo-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newStatus, setNewStatus] = useState<OrderStatus>('pendiente')

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setOrder(d.data)
          setNewStatus(d.data.status)
        }
      })
      .catch(() => undefined)
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdateStatus = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok || !data.data) throw new Error(data.error ?? 'Error al actualizar')
      setOrder(data.data)
      alert('Estado actualizado correctamente')
    } catch {
      alert('Error al actualizar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="animate-pulse bg-gray-100 rounded-2xl h-96" />
  if (!order) return <div className="text-center py-16 text-gray-400">Pedido no encontrado</div>

  return (
    <div className="max-w-3xl">
      <Link href="/admin/pedidos" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a pedidos
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
          {STATUS_OPTIONS.find((s) => s.value === order.status)?.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Customer */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-3">Cliente</h2>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-gray-900 text-base">{order.customer.name}</p>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={`tel:${order.customer.phone}`} className="hover:text-green-600">{order.customer.phone}</a>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${order.customer.email}`} className="hover:text-green-600 truncate">{order.customer.email}</a>
            </div>
            <a
              href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.customer.name}, te contactamos por tu pedido ${order.orderNumber}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors mt-1"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Contactar por WhatsApp
            </a>
          </div>
        </div>

        {/* Payment & Shipping */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-3">Pago y envío</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Método de pago</span>
              <span className="font-medium capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estado del pago</span>
              <span className={`font-medium ${order.paymentStatus === 'pagado' ? 'text-green-600' : order.paymentStatus === 'rechazado' ? 'text-red-600' : 'text-yellow-600'}`}>
                {order.paymentStatus === 'pagado' ? 'Pagado' : order.paymentStatus === 'rechazado' ? 'Rechazado' : 'Pendiente'}
              </span>
            </div>
            {order.shippingAddress && (
              <div className="flex gap-2 pt-1 border-t">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  {order.shippingAddress.street} {order.shippingAddress.number}, {order.shippingAddress.locality}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <h2 className="font-bold text-gray-900 mb-3">Productos</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b">
              <th className="text-left pb-2">Producto</th>
              <th className="text-right pb-2">Cantidad</th>
              <th className="text-right pb-2">P. unitario</th>
              <th className="text-right pb-2">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {order.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2.5 text-gray-900">{item.productName}</td>
                <td className="py-2.5 text-right text-gray-600">{item.quantity}</td>
                <td className="py-2.5 text-right text-gray-600">{formatPrice(item.unitPrice)}</td>
                <td className="py-2.5 text-right font-medium">{formatPrice(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t">
              <td colSpan={3} className="pt-3 text-gray-500 text-right">Subtotal</td>
              <td className="pt-3 text-right font-medium">{formatPrice(order.subtotal)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="py-1 text-gray-500 text-right">Envío</td>
              <td className="py-1 text-right font-medium">{order.shippingCost === 0 ? 'Gratis' : formatPrice(order.shippingCost)}</td>
            </tr>
            <tr className="border-t">
              <td colSpan={3} className="pt-3 font-bold text-gray-900 text-right">Total</td>
              <td className="pt-3 text-right font-bold text-green-700 text-lg">{formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-3">Actualizar estado</h2>
        <div className="flex gap-3">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            onClick={handleUpdateStatus}
            disabled={saving || newStatus === order.status}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            {saving ? 'Guardando...' : 'Actualizar'}
          </button>
        </div>
      </div>
    </div>
  )
}
