import { Order, OrderStatus } from '@/types'
import { generateOrderNumber } from './utils'
import { ensureSchema, getPool } from './db'

export const ORDER_STATUSES: OrderStatus[] = [
  'pendiente',
  'confirmado',
  'en-preparacion',
  'enviado',
  'entregado',
  'cancelado',
]
export const PAYMENT_STATUSES: Order['paymentStatus'][] = ['pendiente', 'pagado', 'rechazado']

type OrderRow = {
  id: string
  order_number: string
  status: OrderStatus
  payment_status: Order['paymentStatus']
  total: number
  created_at: Date
  updated_at: Date
  data: Order
}

// La fila guarda el pedido completo en `data`, y las columnas sueltas sirven para consultar rápido.
function rowToOrder(row: OrderRow): Order {
  return {
    ...row.data,
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    paymentStatus: row.payment_status,
    total: row.total,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

// Orden ascendente (el más viejo primero), igual que antes con el archivo JSON.
export async function getAllOrders(): Promise<Order[]> {
  await ensureSchema()
  const { rows } = await getPool().query<OrderRow>('SELECT * FROM orders ORDER BY created_at ASC')
  return rows.map(rowToOrder)
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  await ensureSchema()
  const { rows } = await getPool().query<OrderRow>('SELECT * FROM orders WHERE order_number = $1', [orderNumber])
  return rows[0] ? rowToOrder(rows[0]) : undefined
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getOrderById(id: string): Promise<Order | undefined> {
  if (!UUID_RE.test(id)) return undefined
  await ensureSchema()
  const { rows } = await getPool().query<OrderRow>('SELECT * FROM orders WHERE id = $1', [id])
  return rows[0] ? rowToOrder(rows[0]) : undefined
}

export async function createOrder(
  data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
): Promise<Order> {
  await ensureSchema()
  const now = new Date().toISOString()
  const id = crypto.randomUUID()

  // El número de pedido es único; si por casualidad choca, reintentamos con otro.
  for (let attempt = 0; attempt < 5; attempt++) {
    const orderNumber = generateOrderNumber()
    const order: Order = { ...data, id, orderNumber, createdAt: now, updatedAt: now }
    try {
      await getPool().query(
        `INSERT INTO orders (id, order_number, status, payment_status, total, created_at, updated_at, data)
         VALUES ($1, $2, $3, $4, $5, $6, $6, $7)`,
        [id, orderNumber, order.status, order.paymentStatus, order.total, now, JSON.stringify(order)]
      )
      return order
    } catch (err) {
      const code = (err as { code?: string }).code
      if (code === '23505' && attempt < 4) continue // unique_violation
      throw err
    }
  }
  throw new Error('No se pudo generar un número de pedido único')
}

// Solo se puede cambiar el estado del pedido y el estado de pago (nada más).
export async function updateOrder(
  id: string,
  changes: { status?: OrderStatus; paymentStatus?: Order['paymentStatus'] }
): Promise<Order | null> {
  const current = await getOrderById(id)
  if (!current) return null

  const status = changes.status ?? current.status
  const paymentStatus = changes.paymentStatus ?? current.paymentStatus
  const updatedAt = new Date().toISOString()
  const next: Order = { ...current, status, paymentStatus, updatedAt }

  await getPool().query(
    `UPDATE orders SET status = $2, payment_status = $3, updated_at = $4, data = $5 WHERE id = $1`,
    [id, status, paymentStatus, updatedAt, JSON.stringify(next)]
  )
  return next
}

// "Hoy" según la hora de Argentina (no UTC), para que las estadísticas cuadren de noche.
const AR_TZ = 'America/Argentina/Buenos_Aires'
const arDay = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: AR_TZ })

export async function getAdminStats() {
  const orders = await getAllOrders()
  const today = arDay(new Date())
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pendiente').length,
    totalRevenue: orders.filter((o) => o.paymentStatus === 'pagado').reduce((s, o) => s + o.total, 0),
    todayOrders: orders.filter((o) => arDay(new Date(o.createdAt)) === today).length,
    weeklyRevenue: orders
      .filter((o) => new Date(o.createdAt).getTime() >= weekAgo && o.paymentStatus === 'pagado')
      .reduce((s, o) => s + o.total, 0),
  }
}
