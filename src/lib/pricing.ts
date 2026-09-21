import { PRODUCTS } from '@/data/products'
import { SHIPPING_ZONES, MIN_ORDER_AMOUNT, FREE_SHIPPING_FROM } from '@/data/shipping'
import { OrderItem, ShippingZone } from '@/types'

export class OrderValidationError extends Error {}

interface PriceOrderInput {
  items: { productId: string; quantity: number }[]
  zone: string
  paymentMethod: 'efectivo' | 'transferencia'
}

export interface PricedOrder {
  items: OrderItem[]
  zone: ShippingZone
  subtotal: number
  shippingCost: number
  total: number
}

const MAX_QUANTITY_PER_ITEM = 200

interface ResolvedProduct {
  id: string
  name: string
  price: number
  transferPrice?: number
}

/**
 * Busca el producto por id. Los productos con presentaciones (frutos secos por peso, etc.)
 * entran al carrito con un id compuesto "<id>-<peso>", por ejemplo "almendras-non-pareil-500g".
 * Esa regla es la misma que usa la ficha de producto al agregar al carrito.
 */
function resolveProduct(productId: string): ResolvedProduct | undefined {
  const direct = PRODUCTS.find((p) => p.id === productId && p.active)
  if (direct) return { id: direct.id, name: direct.name, price: direct.price, transferPrice: direct.transferPrice }

  for (const product of PRODUCTS) {
    if (!product.active || !product.variants) continue
    for (const variant of product.variants) {
      const variantId = `${product.id}-${variant.weight.replace(/\s+/g, '-').toLowerCase()}`
      if (variantId === productId) {
        return {
          id: variantId,
          name: `${product.name} — ${variant.weight}`,
          price: variant.price,
          transferPrice: variant.transferPrice,
        }
      }
    }
  }
  return undefined
}

/**
 * Calcula los precios del pedido en el servidor, con los datos del catálogo.
 * Nunca se usan los precios que manda el navegador: solo sirven productId y quantity.
 * Las reglas son las mismas que usa la pantalla de checkout:
 *  - Efectivo: usa transferPrice (10% off) si el producto lo tiene.
 *  - Mínimo de pedido y envío gratis se evalúan sobre el subtotal a precio completo.
 */
export function priceOrder({ items, zone, paymentMethod }: PriceOrderInput): PricedOrder {
  const zoneConfig = SHIPPING_ZONES.find((z) => z.id === zone)
  if (!zoneConfig) throw new OrderValidationError('Zona de envío inválida')
  if (items.length === 0) throw new OrderValidationError('El pedido no tiene productos')

  let fullSubtotal = 0
  const orderItems: OrderItem[] = items.map((item) => {
    const product = resolveProduct(item.productId)
    if (!product) throw new OrderValidationError(`Producto no disponible: ${item.productId}`)
    if (!(product.price > 0)) throw new OrderValidationError(`Producto sin precio: ${product.name}`)
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY_PER_ITEM) {
      throw new OrderValidationError(`Cantidad inválida para ${product.name}`)
    }

    fullSubtotal += product.price * item.quantity
    const unitPrice = paymentMethod === 'efectivo' && product.transferPrice ? product.transferPrice : product.price
    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity,
    }
  })

  if (fullSubtotal < MIN_ORDER_AMOUNT) {
    throw new OrderValidationError(`El pedido mínimo es de $${MIN_ORDER_AMOUNT}`)
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0)
  const shippingCost = fullSubtotal >= FREE_SHIPPING_FROM ? 0 : zoneConfig.price

  return { items: orderItems, zone: zoneConfig.id, subtotal, shippingCost, total: subtotal + shippingCost }
}
