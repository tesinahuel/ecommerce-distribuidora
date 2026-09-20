import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getAllOrders } from '@/lib/orders'
import { notifyNewOrder } from '@/lib/notifications'
import { isAdminRequest } from '@/lib/adminAuth'
import { OrderValidationError, priceOrder } from '@/lib/pricing'
import { z } from 'zod'

// El navegador solo manda QUÉ se pidió y los datos del cliente.
// Los precios, el envío y el total se calculan acá en el servidor.
const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().min(6).max(40),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(100),
        quantity: z.number().int().positive().max(200),
      })
    )
    .min(1)
    .max(60),
  shippingAddress: z.object({
    street: z.string().trim().min(1).max(150),
    number: z.string().trim().min(1).max(20),
    locality: z.string().trim().min(1).max(100),
    zone: z.string().min(1).max(50),
    postalCode: z.string().max(20).optional(),
    shift: z.enum(['mañana', 'tarde']),
    notes: z.string().max(500).optional(),
  }),
  paymentMethod: z.enum(['transferencia', 'efectivo']),
  notes: z.string().max(1000).optional(),
})

// Solo el dueño (con sesión iniciada en el panel) puede ver la lista completa de pedidos.
export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const orders = await getAllOrders()
    return NextResponse.json({ data: orders })
  } catch (err) {
    console.error('[orders] GET', err)
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const parsed = createOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const { customer, items, shippingAddress, paymentMethod, notes } = parsed.data
    const priced = priceOrder({ items, zone: shippingAddress.zone, paymentMethod })

    const order = await createOrder({
      customer,
      items: priced.items,
      shippingAddress: { ...shippingAddress, zone: priced.zone },
      shippingZone: priced.zone,
      shippingCost: priced.shippingCost,
      subtotal: priced.subtotal,
      total: priced.total,
      paymentMethod,
      notes,
      status: 'pendiente',
      paymentStatus: 'pendiente',
    })

    // Si el aviso falla (WhatsApp/email), el pedido igual queda guardado y visible en el panel.
    await notifyNewOrder(order)

    return NextResponse.json({ data: { order } }, { status: 201 })
  } catch (err) {
    if (err instanceof OrderValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    console.error('[orders] POST', err)
    return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 })
  }
}
