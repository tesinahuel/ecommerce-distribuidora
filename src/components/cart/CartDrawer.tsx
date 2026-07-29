'use client'

import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { MIN_ORDER_AMOUNT } from '@/data/shipping'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore()
  const subtotal = getSubtotal()
  const belowMinimum = subtotal > 0 && subtotal < MIN_ORDER_AMOUNT

  // efectivo discounted total
  const cashSubtotal = items.reduce(
    (sum, i) => sum + (i.product.transferPrice ?? i.product.price) * i.quantity,
    0
  )

  return (
    <>
      <div
        className={cn('fixed inset-0 z-40 transition-opacity duration-300', isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}
        style={{ background: 'rgba(0,0,0,0.7)' }}
        onClick={closeCart}
      />

      <div
        className={cn('fixed top-0 right-0 h-full w-full sm:w-96 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out', isOpen ? 'translate-x-0' : 'translate-x-full')}
        style={{ background: '#0d0d2b', borderLeft: '1px solid rgba(204,34,0,0.3)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="font-bold text-lg flex items-center gap-2 text-white">
            <ShoppingCart className="w-5 h-5" style={{ color: '#CC2200' }} />
            Carrito
            {items.length > 0 && <span className="text-sm font-normal" style={{ color: '#888' }}>({items.length} productos)</span>}
          </h2>
          <button onClick={closeCart} className="p-2 rounded-lg transition-colors hover:text-white" style={{ color: '#888' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <ShoppingCart className="w-16 h-16 opacity-20 text-white" />
              <div className="text-center">
                <p className="font-medium text-white">Tu carrito está vacío</p>
                <p className="text-sm mt-1" style={{ color: '#888' }}>Agregá productos desde el catálogo</p>
              </div>
              <Link href="/catalogo" onClick={closeCart} className="mt-2 btn-red px-6 py-2.5 rounded-lg text-sm font-medium text-white">
                Ver catálogo
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3 p-3 rounded-xl transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.product.name}</p>
                    <div className="flex gap-3 mt-0.5">
                      <p className="text-xs" style={{ color: '#888' }}>Transf: {formatPrice(item.product.price)}</p>
                      {item.product.transferPrice && item.product.transferPrice < item.product.price && (
                        <p className="text-xs font-semibold" style={{ color: '#CC2200' }}>Efect: {formatPrice(item.product.transferPrice)} 💵</p>
                      )}
                    </div>
                    <p className="text-sm font-semibold mt-1" style={{ color: '#D4AF37' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => removeItem(item.product.id)} className="transition-colors" style={{ color: '#555' }}>
                      <Trash2 className="w-4 h-4 hover:text-red-500" />
                    </button>
                    <div className="flex items-center gap-1 rounded-lg border" style={{ background: '#050510', borderColor: 'rgba(255,255,255,0.1)' }}>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 rounded-l-lg text-white"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="px-2 text-sm font-semibold min-w-[2rem] text-center text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 rounded-r-lg text-white"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t" style={{ background: '#08081e', borderColor: 'rgba(255,255,255,0.08)' }}>
            {belowMinimum && (
              <div className="rounded-xl p-2.5 mb-3 text-xs text-center" style={{ background: 'rgba(204,34,0,0.15)', border: '1px solid rgba(204,34,0,0.3)', color: '#ff6b6b' }}>
                Mínimo de compra: {formatPrice(MIN_ORDER_AMOUNT)} · Faltan {formatPrice(MIN_ORDER_AMOUNT - subtotal)}
              </div>
            )}
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm" style={{ color: '#888' }}>Total transferencia</span>
              <span className="font-bold text-lg text-white">{formatPrice(subtotal)}</span>
            </div>
            {cashSubtotal < subtotal && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold" style={{ color: '#CC2200' }}>Total efectivo (10% off) 💵</span>
                <span className="font-bold text-base" style={{ color: '#CC2200' }}>{formatPrice(cashSubtotal)}</span>
              </div>
            )}
            <p className="text-xs mb-3 text-center" style={{ color: '#555' }}>Envío se calcula al finalizar</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className={cn('block w-full text-center font-semibold py-3.5 rounded-xl transition-colors text-white', belowMinimum ? 'pointer-events-none cursor-not-allowed' : 'btn-red')}
              style={belowMinimum ? { background: '#333', color: '#666' } : undefined}
            >
              Finalizar compra
            </Link>
            <Link href="/carrito" onClick={closeCart} className="block w-full text-center text-sm mt-2 py-1.5 transition-colors hover:text-white" style={{ color: '#888' }}>
              Ver carrito completo
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
