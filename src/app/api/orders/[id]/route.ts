import { NextRequest, NextResponse } from 'next/server'
import {
  getOrderById,
  getOrderByNumber,
  updateOrder,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from '@/lib/orders'
import { isAdminRequest } from '@/lib/adminAuth'
import { z } from 'zod'

// Estas rutas devuelven datos personales de clientes: solo para el panel admin.
// (La página pública de seguimiento /pedidos/[numero] lee la base directamente.)
const unauthorized = () => NextResponse.json({ error: 'No autorizado' }, { status: 401 })

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const { id } = await params
    const order = (await getOrderByNumber(id)) ?? (await getOrderById(id))
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ data: order })
  } catch (err) {
    console.error('[orders/:id] GET', err)
    return NextResponse.json({ error: 'Error al obtener el pedido' }, { status: 500 })
  }
}

const patchSchema = z
  .object({
    status: z.enum(ORDER_STATUSES as [string, ...string[]]).optional(),
    paymentStatus: z.enum(PAYMENT_STATUSES as [string, ...string[]]).optional(),
  })
  .refine((v) => v.status || v.paymentStatus, { message: 'Nada para actualizar' })

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const { id } = await params
    const parsed = patchSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const updated = await updateOrder(id, parsed.data as Parameters<typeof updateOrder>[1])
    if (!updated) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ data: updated })
  } catch (err) {
    console.error('[orders/:id] PATCH', err)
    return NextResponse.json({ error: 'Error al actualizar el pedido' }, { status: 500 })
  }
}
