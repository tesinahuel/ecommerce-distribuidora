import { Order } from '@/types'
import { generateOrderNumber } from './utils'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')
const ORDERS_FILE = join(DATA_DIR, 'orders.json')

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function getAllOrders(): Order[] {
  ensureDataDir()
  if (!existsSync(ORDERS_FILE)) return []
  try {
    return JSON.parse(readFileSync(ORDERS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return getAllOrders().find((o) => o.orderNumber === orderNumber)
}

export function createOrder(data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
  const orders = getAllOrders()
  const now = new Date().toISOString()
  const order: Order = {
    ...data,
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(),
    createdAt: now,
    updatedAt: now,
  }
  orders.push(order)
  ensureDataDir()
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2))
  return order
}

export function updateOrderStatus(id: string, status: Order['status'], extra?: Partial<Order>): Order | null {
  const orders = getAllOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return null
  orders[idx] = { ...orders[idx], ...extra, status, updatedAt: new Date().toISOString() }
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2))
  return orders[idx]
}

export function getAdminStats() {
  const orders = getAllOrders()
  const today = new Date().toISOString().split('T')[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pendiente').length,
    totalRevenue: orders.filter((o) => o.paymentStatus === 'pagado').reduce((s, o) => s + o.total, 0),
    todayOrders: orders.filter((o) => o.createdAt.startsWith(today)).length,
    weeklyRevenue: orders
      .filter((o) => o.createdAt >= weekAgo && o.paymentStatus === 'pagado')
      .reduce((s, o) => s + o.total, 0),
  }
}
