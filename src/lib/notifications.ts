import { Order } from '@/types'
import { formatPrice } from './utils'

function buildOrderSummary(order: Order): string {
  const itemsText = order.items
    .map((i) => `• ${i.productName} x${i.quantity} — ${formatPrice(i.subtotal)}`)
    .join('\n')

  return [
    `🥚 Pedido nuevo — ${order.orderNumber}`,
    ``,
    `Cliente: ${order.customer.name}`,
    `Tel/WhatsApp: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    ``,
    itemsText,
    ``,
    `Envío: ${order.shippingAddress.street} ${order.shippingAddress.number}, ${order.shippingAddress.locality} (turno ${order.shippingAddress.shift})`,
    `Pago: ${order.paymentMethod === 'efectivo' ? 'Efectivo (10% off)' : 'Transferencia bancaria'}`,
    `Total: ${formatPrice(order.total)}`,
  ].join('\n')
}

async function sendOwnerWhatsapp(order: Order) {
  const phone = process.env.OWNER_WHATSAPP_NUMBER
  const instanceId = process.env.GREEN_API_INSTANCE_ID
  const apiToken = process.env.GREEN_API_TOKEN
  if (!phone || !instanceId || !apiToken) {
    console.warn('[notifications] WhatsApp al dueño no configurado (falta OWNER_WHATSAPP_NUMBER, GREEN_API_INSTANCE_ID o GREEN_API_TOKEN en .env.local)')
    return
  }

  const url = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${apiToken}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: `${phone}@c.us`,
        message: buildOrderSummary(order),
      }),
    })
    if (!res.ok) console.error('[notifications] Green API respondió', res.status, await res.text())
  } catch (err) {
    console.error('[notifications] Error enviando WhatsApp al dueño', err)
  }
}

async function sendOwnerEmail(order: Order) {
  const apiKey = process.env.RESEND_API_KEY
  const ownerEmail = process.env.OWNER_EMAIL
  if (!apiKey || !ownerEmail) {
    console.warn('[notifications] Email al dueño no configurado (falta RESEND_API_KEY o OWNER_EMAIL en .env.local)')
    return
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    const itemsHtml = order.items
      .map((i) => `<li>${i.productName} x${i.quantity} — ${formatPrice(i.subtotal)}</li>`)
      .join('')

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'Huevos Cósmicos <onboarding@resend.dev>',
      to: ownerEmail,
      subject: `🥚 Pedido nuevo — ${order.orderNumber}`,
      html: `
        <h2>Pedido ${order.orderNumber}</h2>
        <p><strong>Cliente:</strong> ${order.customer.name}<br/>
        <strong>Tel/WhatsApp:</strong> ${order.customer.phone}<br/>
        <strong>Email:</strong> ${order.customer.email}</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Envío:</strong> ${order.shippingAddress.street} ${order.shippingAddress.number}, ${order.shippingAddress.locality} (turno ${order.shippingAddress.shift})<br/>
        <strong>Pago:</strong> ${order.paymentMethod === 'efectivo' ? 'Efectivo (10% off)' : 'Transferencia bancaria'}<br/>
        <strong>Total:</strong> ${formatPrice(order.total)}</p>
      `,
    })
  } catch (err) {
    console.error('[notifications] Error enviando email al dueño', err)
  }
}

export async function notifyNewOrder(order: Order) {
  await Promise.allSettled([sendOwnerWhatsapp(order), sendOwnerEmail(order)])
}
