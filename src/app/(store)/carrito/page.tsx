'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { MIN_ORDER_AMOUNT } from '@/data/shipping'

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore()
  const subtotal = getSubtotal()
  const belowMinimum = subtotal > 0 && subtotal < MIN_ORDER_AMOUNT

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center" style={{ background: 'var(--cream)' }}>
        <h1 className="font-display mb-3" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Tu carrito está vacío
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Explorá nuestro catálogo y agregá productos</p>
        <Link
          href="/catalogo"
          className="btn-label inline-flex items-center gap-2 px-8 py-3.5"
          style={{ background: 'var(--olive-dark)', color: '#fff' }}
        >
          Ver catálogo <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Tu carrito <span className="font-sans-ui text-lg" style={{ fontWeight: 300, color: 'var(--text-secondary)' }}>({items.length} productos)</span>
        </h1>
        <button
          onClick={clearCart}
          className="nav-label transition-opacity hover:opacity-70"
          style={{ fontSize: '11px', color: 'var(--text-secondary)' }}
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 py-4" style={{ borderBottom: '1px solid var(--hairline)' }}>
              <div className="w-20 h-20 shrink-0" style={{ background: 'var(--beige)' }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-sans-ui text-sm" style={{ color: 'var(--text-primary)' }}>{item.product.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{formatPrice(item.product.price)} / {item.product.unit}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center" style={{ border: '1px solid var(--hairline)' }}>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Minus className="w-3.5 h-3.5" strokeWidth={1.6} />
                    </button>
                    <span className="px-3 font-sans-ui text-sm" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={1.6} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-sans-ui font-medium" style={{ color: 'var(--text-primary)' }}>{formatPrice(item.product.price * item.quantity)}</span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1 transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.6} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 sticky top-32" style={{ background: 'var(--beige)' }}>
            <h2 className="font-display mb-4" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)' }}>Resumen del pedido</h2>
            <div className="space-y-2 mb-4 text-sm font-sans-ui">
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span style={{ color: 'var(--text-primary)' }}>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Con efectivo (10% off)</span>
                <span style={{ color: 'var(--olive-dark)', fontWeight: 500 }}>
                  {formatPrice(items.reduce((s, i) => s + (i.product.transferPrice ?? i.product.price) * i.quantity, 0))}
                </span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Envío</span>
                <span style={{ color: 'var(--text-secondary)' }}>Se calcula al finalizar</span>
              </div>
            </div>

            {belowMinimum && (
              <div className="p-3 mb-4 text-xs text-center" style={{ background: '#FAF7F1', border: '1px solid var(--hairline)', color: 'var(--text-secondary)' }}>
                Mínimo de compra: {formatPrice(MIN_ORDER_AMOUNT)}<br />
                Faltan {formatPrice(MIN_ORDER_AMOUNT - subtotal)}
              </div>
            )}

            <div className="pt-3 mb-5" style={{ borderTop: '1px solid var(--hairline)' }}>
              <div className="flex justify-between items-baseline font-display" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-primary)' }}>Total estimado</span>
                <span style={{ color: 'var(--olive-dark)' }}>{formatPrice(subtotal)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className={`btn-label block w-full text-center py-4 transition-colors ${belowMinimum ? 'pointer-events-none' : ''}`}
              style={belowMinimum
                ? { background: 'var(--hairline)', color: 'var(--text-tertiary)' }
                : { background: 'var(--olive-dark)', color: '#fff' }}
            >
              Finalizar compra
            </Link>
            <Link
              href="/catalogo"
              className="block w-full text-center text-sm mt-3 py-2 transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-secondary)' }}
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
