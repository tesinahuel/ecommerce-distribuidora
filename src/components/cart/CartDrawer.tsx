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

  const cashSubtotal = items.reduce(
    (sum, i) => sum + (i.product.transferPrice ?? i.product.price) * i.quantity,
    0
  )

  return (
    <>
      <div
        className={cn('fixed inset-0 z-40 transition-opacity duration-300', isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}
        style={{ background: 'rgba(35,41,28,0.55)' }}
        onClick={closeCart}
      />

      <div
        className={cn('fixed top-0 right-0 h-full w-full sm:w-96 z-50 flex flex-col transition-transform duration-300 ease-in-out font-sans-ui', isOpen ? 'translate-x-0' : 'translate-x-full')}
        style={{ background: 'var(--cream)', borderLeft: '1px solid var(--hairline)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <h2 className="font-display flex items-center gap-2" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Carrito
            {items.length > 0 && <span className="text-sm font-sans-ui" style={{ fontWeight: 300, color: 'var(--text-secondary)' }}>({items.length})</span>}
          </h2>
          <button onClick={closeCart} className="p-2 transition-opacity hover:opacity-60" style={{ color: 'var(--text-secondary)' }}>
            <X className="w-5 h-5" strokeWidth={1.6} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <ShoppingCart className="w-14 h-14" strokeWidth={1.2} style={{ color: 'var(--hairline)' }} />
              <div className="text-center">
                <p className="font-sans-ui" style={{ color: 'var(--text-primary)' }}>Tu carrito está vacío</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Agregá productos desde el catálogo</p>
              </div>
              <Link href="/catalogo" onClick={closeCart} className="btn-label mt-2 px-6 py-2.5" style={{ background: 'var(--olive-dark)', color: '#fff' }}>
                Ver catálogo
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3 pb-4" style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans-ui truncate" style={{ color: 'var(--text-primary)' }}>{item.product.name}</p>
                    <div className="flex gap-3 mt-0.5">
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Transf: {formatPrice(item.product.price)}</p>
                      {item.product.transferPrice && item.product.transferPrice < item.product.price && (
                        <p className="text-xs font-medium" style={{ color: 'var(--olive-dark)' }}>Efect: {formatPrice(item.product.transferPrice)}</p>
                      )}
                    </div>
                    <p className="text-sm font-medium mt-1" style={{ color: 'var(--gold)' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => removeItem(item.product.id)} className="transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                      <Trash2 className="w-4 h-4" strokeWidth={1.6} />
                    </button>
                    <div className="flex items-center" style={{ border: '1px solid var(--hairline)' }}>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5" style={{ color: 'var(--text-primary)' }}><Minus className="w-3.5 h-3.5" strokeWidth={1.6} /></button>
                      <span className="px-2 text-sm min-w-[2rem] text-center" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5" style={{ color: 'var(--text-primary)' }}><Plus className="w-3.5 h-3.5" strokeWidth={1.6} /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5" style={{ background: 'var(--beige)', borderTop: '1px solid var(--hairline)' }}>
            {belowMinimum && (
              <div className="p-2.5 mb-3 text-xs text-center" style={{ background: 'var(--cream)', border: '1px solid var(--hairline)', color: 'var(--text-secondary)' }}>
                Mínimo de compra: {formatPrice(MIN_ORDER_AMOUNT)} · Faltan {formatPrice(MIN_ORDER_AMOUNT - subtotal)}
              </div>
            )}
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total transferencia</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{formatPrice(subtotal)}</span>
            </div>
            {cashSubtotal < subtotal && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium" style={{ color: 'var(--olive-dark)' }}>Total efectivo (10% off)</span>
                <span className="font-medium" style={{ color: 'var(--olive-dark)' }}>{formatPrice(cashSubtotal)}</span>
              </div>
            )}
            <p className="text-xs mb-3 text-center" style={{ color: 'var(--text-tertiary)' }}>Envío se calcula al finalizar</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className={cn('btn-label block w-full text-center py-3.5', belowMinimum ? 'pointer-events-none' : '')}
              style={belowMinimum
                ? { background: 'var(--hairline)', color: 'var(--text-tertiary)' }
                : { background: 'var(--olive-dark)', color: '#fff' }}
            >
              Finalizar compra
            </Link>
            <Link href="/carrito" onClick={closeCart} className="block w-full text-center text-sm mt-2 py-1.5 transition-opacity hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
              Ver carrito completo
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
