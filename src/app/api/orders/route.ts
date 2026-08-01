import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getAllOrders } from '@/lib/orders'
import { notifyNewOrder } from '@/lib/notifications'
import { z } from 'zod'

const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
  }),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    subtotal: z.number().nonnegative(),
  })).min(1),
  shippingAddress: z.object({
    street: z.string(),
    number: z.string(),
    locality: z.string(),
    zone: z.string(),
    postalCode: z.string().optional(),
    shift: z.enum(['mañana', 'tarde']),
    notes: z.string().optional(),
  }),
  shippingZone: z.string(),
  shippingCost: z.number().nonnegative(),
  subtotal: z.number().nonnegative(),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(['transferencia', 'efectivo']),
  notes: z.string().optional(),
})

export async function GET() {
  try {
    const orders = getAllOrders()
    return NextResponse.json({ data: orders })
  } catch {
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten() }, { status: 400 })
    }

    const order = createOrder({
      ...parsed.data,
      shippingAddress: parsed.data.shippingAddress as any,
      shippingZone: parsed.data.shippingZone as any,
      status: 'pendiente',
      paymentStatus: 'pendiente',
    })

    await notifyNewOrder(order)

    return NextResponse.json({ data: { order } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 })
  }
}
