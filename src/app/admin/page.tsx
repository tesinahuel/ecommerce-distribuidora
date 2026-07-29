import { ShoppingBag, TrendingUp, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { getAdminStats, getAllOrders } from '@/lib/orders'
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

export default function AdminDashboard() {
  const stats = getAdminStats()
  const recentOrders = getAllOrders().slice(-10).reverse()

  const STAT_CARDS = [
    { label: 'Pedidos totales', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pedidos pendientes', value: stats.pendingOrders, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Ingresos totales', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Ingresos esta semana', value: formatPrice(stats.weeklyRevenue), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Bienvenido al panel de administración</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`inline-flex p-2.5 rounded-xl mb-3 ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Pedidos recientes</h2>
          <Link href="/admin/pedidos" className="text-green-600 text-sm font-medium hover:text-green-700">
            Ver todos
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No hay pedidos aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Pedido</th>
                  <th className="text-left px-5 py-3">Cliente</th>
                  <th className="text-left px-5 py-3">Total</th>
                  <th className="text-left px-5 py-3">Estado</th>
                  <th className="text-left px-5 py-3">Fecha</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-5 py-3.5 text-gray-700">{order.customer.name}</td>
                    <td className="px-5 py-3.5 font-semibold">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/pedidos/${order.id}`} className="text-green-600 hover:text-green-700 font-medium text-xs">
                        Ver
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
