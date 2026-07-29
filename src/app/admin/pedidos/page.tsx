import Link from 'next/link'
import { getAllOrders } from '@/lib/orders'
import { formatPrice, formatDate } from '@/lib/utils'
import { Order, OrderStatus } from '@/types'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  'en-preparacion': 'En preparación',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  confirmado: 'bg-blue-100 text-blue-700',
  'en-preparacion': 'bg-purple-100 text-purple-700',
  enviado: 'bg-indigo-100 text-indigo-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
  const orders = getAllOrders().reverse()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} pedidos en total</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium text-gray-500">No hay pedidos todavía</p>
            <p className="text-sm mt-1">Los pedidos de la tienda aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Pedido</th>
                  <th className="text-left px-5 py-3">Cliente</th>
                  <th className="text-left px-5 py-3">Items</th>
                  <th className="text-left px-5 py-3">Total</th>
                  <th className="text-left px-5 py-3">Pago</th>
                  <th className="text-left px-5 py-3">Estado</th>
                  <th className="text-left px-5 py-3">Fecha</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-medium text-gray-900 text-xs">{order.orderNumber}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{order.customer.name}</p>
                      <p className="text-gray-400 text-xs">{order.customer.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{order.items.length}</td>
                    <td className="px-5 py-3.5 font-semibold">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium ${
                        order.paymentStatus === 'pagado' ? 'text-green-600' :
                        order.paymentStatus === 'rechazado' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {order.paymentStatus === 'pagado' ? 'Pagado' :
                         order.paymentStatus === 'rechazado' ? 'Rechazado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/pedidos/${order.id}`} className="text-green-600 hover:text-green-700 font-medium text-xs">
                        Gestionar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
