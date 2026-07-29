'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { MIN_ORDER_AMOUNT } from '@/data/shipping'

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore()
  const subtotal = getSubtotal()
  const belowMinimum = subtotal > 0 && subtotal < MIN_ORDER_AMOUNT

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h1>
        <p className="mb-8" style={{ color: '#888' }}>Explorá nuestro catálogo y agregá productos</p>
        <Link
          href="/catalogo"
          className="btn-red inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl"
        >
          Ver catálogo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          Tu carrito <span className="font-normal text-lg" style={{ color: '#888' }}>({items.length} productos)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm font-medium transition-colors hover:text-red-400"
          style={{ color: '#CC2200' }}
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="rounded-2xl p-4 flex gap-4" style={{ background: '#0d0d2b', border: '1px solid rgba(204,34,0,0.2)' }}>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0" style={{ background: 'rgba(204,34,0,0.1)' }}>
                {item.product.category === 'huevos' ? '🥚' :
                 item.product.category === 'pollo' ? '🍗' :
                 item.product.category === 'miel' ? '🍯' :
                 item.product.category === 'aceites' ? '🫒' : '🥫'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm leading-tight">{item.product.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: '#888' }}>{formatPrice(item.product.price)} / {item.product.unit}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.1)', background: '#050510' }}>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 rounded-l-lg transition-colors text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-semibold text-sm text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 rounded-r-lg transition-colors text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold" style={{ color: '#D4AF37' }}>{formatPrice(item.product.price * item.quantity)}</span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1 transition-colors"
                      style={{ color: '#666' }}
                    >
                      <Trash2 className="w-4 h-4 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl p-5 sticky top-24" style={{ background: '#0d0d2b', border: '1px solid rgba(212,175,55,0.2)' }}>
            <h2 className="font-bold text-white mb-4">Resumen del pedido</h2>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between" style={{ color: '#888' }}>
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between" style={{ color: '#888' }}>
                <span>Con efectivo (10% off) 💵</span>
                <span style={{ color: '#CC2200' }}>
                  {formatPrice(items.reduce((s, i) => s + (i.product.transferPrice ?? i.product.price) * i.quantity, 0))}
                </span>
              </div>
              <div className="flex justify-between" style={{ color: '#888' }}>
                <span>Envío</span>
                <span className="font-medium" style={{ color: '#aaa' }}>Se calcula al finalizar</span>
              </div>
            </div>

            {belowMinimum && (
              <div className="rounded-xl p-3 mb-4 text-xs text-center" style={{ background: 'rgba(204,34,0,0.15)', border: '1px solid rgba(204,34,0,0.3)', color: '#ff6b6b' }}>
                Mínimo de compra: {formatPrice(MIN_ORDER_AMOUNT)}<br />
                Faltan {formatPrice(MIN_ORDER_AMOUNT - subtotal)}
              </div>
            )}

            <div className="border-t pt-3 mb-5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex justify-between font-bold text-lg">
                <span className="text-white">Total estimado</span>
                <span style={{ color: '#D4AF37' }}>{formatPrice(subtotal)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className={`block w-full text-center font-bold py-4 rounded-xl transition-colors text-white ${belowMinimum ? 'pointer-events-none' : 'btn-red'}`}
              style={belowMinimum ? { background: '#333', color: '#666' } : undefined}
            >
              Finalizar compra
            </Link>
            <Link
              href="/catalogo"
              className="block w-full text-center text-sm mt-3 py-2 transition-colors hover:text-white"
              style={{ color: '#888' }}
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
