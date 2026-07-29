import { NextRequest, NextResponse } from 'next/server'
import { getOrderByNumber, updateOrderStatus, getAllOrders } from '@/lib/orders'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = getOrderByNumber(id) ?? getAllOrders().find((o) => o.id === id)
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ data: order })
  } catch {
    return NextResponse.json({ error: 'Error al obtener el pedido' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, ...extra } = body

    const orders = (await import('@/lib/orders')).getAllOrders()
    const order = orders.find((o) => o.id === id)
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    const updated = updateOrderStatus(id, status, extra)
    return NextResponse.json({ data: updated })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar el pedido' }, { status: 500 })
  }
}
