'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Banknote, HandCoins, Sun, Sunset } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { SHIPPING_ZONES, STORE_ADDRESS, DELIVERY_DAYS, MIN_ORDER_AMOUNT, FREE_SHIPPING_FROM } from '@/data/shipping'

const schema = z.object({
  name: z.string().min(3, 'Nombre requerido (mínimo 3 caracteres)'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono / WhatsApp requerido'),
  street: z.string().min(1, 'Calle requerida'),
  streetNumber: z.string().min(1, 'Número requerido'),
  locality: z.string().min(1, 'Localidad requerida'),
  zone: z.string().min(1, 'Seleccioná una zona de envío'),
  postalCode: z.string().optional(),
  shippingNotes: z.string().optional(),
  shift: z.enum(['mañana', 'tarde']),
  paymentMethod: z.enum(['efectivo', 'transferencia']),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

// efectivo = 10% off (uses transferPrice field)
// transferencia = full price (uses price field)
const PAYMENT_METHODS = [
  {
    value: 'efectivo' as const,
    label: 'Efectivo contra entrega',
    badge: '10% OFF',
    desc: 'Recibís un 10% de descuento abonando en efectivo al momento de la entrega',
    icon: HandCoins,
  },
  {
    value: 'transferencia' as const,
    label: 'Transferencia bancaria',
    desc: 'Alias: huevos.cosmicos.uala (Uala) · Sin descuento adicional',
    icon: Banknote,
  },
]

const inputClass = 'w-full px-3 py-2.5 text-sm font-sans-ui focus:outline-none transition-all'
const inputStyle = { background: 'var(--cream)', border: '1px solid var(--hairline)', color: 'var(--text-primary)' }
const labelClass = 'block text-sm font-medium mb-1 font-sans-ui'
const labelStyle = { color: 'var(--text-secondary)' }

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [selectedZone, setSelectedZone] = useState('')

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { shift: 'mañana', paymentMethod: 'efectivo' },
  })

  const paymentMethod = watch('paymentMethod')
  const subtotal = getSubtotal()

  // efectivo gets the discount (transferPrice field has the discounted price)
  const effectiveSubtotal = paymentMethod === 'efectivo'
    ? items.reduce((sum, i) => sum + (i.product.transferPrice ?? i.product.price) * i.quantity, 0)
    : subtotal

  const shippingZoneData = SHIPPING_ZONES.find((z) => z.id === selectedZone)
  const freeShipping = shippingZoneData && subtotal >= FREE_SHIPPING_FROM
  const shippingCost = freeShipping ? 0 : (shippingZoneData?.price ?? 0)
  const total = effectiveSubtotal + shippingCost
  const belowMinimum = subtotal < MIN_ORDER_AMOUNT

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center" style={{ background: 'var(--cream)' }}>
        <h1 className="font-display mb-4" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Tu carrito está vacío</h1>
        <Link href="/catalogo" className="nav-label transition-opacity hover:opacity-70" style={{ fontSize: '12px', color: 'var(--olive-dark)' }}>Ver catálogo</Link>
      </div>
    )
  }

  if (belowMinimum) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center" style={{ background: 'var(--cream)' }}>
        <h1 className="font-display mb-3" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Monto mínimo no alcanzado</h1>
        <p className="mb-8 font-sans-ui" style={{ color: 'var(--text-secondary)' }}>
          El pedido mínimo es de <strong style={{ color: 'var(--text-primary)' }}>{formatPrice(MIN_ORDER_AMOUNT)}</strong>.<br />
          Tu carrito tiene <strong style={{ color: 'var(--text-primary)' }}>{formatPrice(subtotal)}</strong> — faltan <strong style={{ color: 'var(--text-primary)' }}>{formatPrice(MIN_ORDER_AMOUNT - subtotal)}</strong>.
        </p>
        <Link href="/catalogo" className="btn-label inline-flex items-center gap-2 px-6 py-3" style={{ background: 'var(--olive-dark)', color: '#fff' }}>
          Seguir comprando
        </Link>
      </div>
    )
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const orderItems = items.map((i) => {
        // efectivo gets transferPrice (discounted), transferencia gets full price
        const unitPrice = data.paymentMethod === 'efectivo' && i.product.transferPrice
          ? i.product.transferPrice
          : i.product.price
        return {
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice,
          subtotal: unitPrice * i.quantity,
        }
      })

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: data.name, email: data.email, phone: data.phone },
          items: orderItems,
          shippingAddress: {
            street: data.street,
            number: data.streetNumber,
            locality: data.locality,
            zone: data.zone,
            postalCode: data.postalCode,
            shift: data.shift,
            notes: data.shippingNotes,
          },
          shippingZone: data.zone,
          shippingCost,
          subtotal: effectiveSubtotal,
          total,
          paymentMethod: data.paymentMethod,
          notes: data.notes,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      clearCart()
      router.push(`/pedidos/${result.data.order.orderNumber}?nuevo=true`)
    } catch {
      alert('Hubo un error al procesar tu pedido. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const sectionStyle = { background: 'var(--card-white)', border: '1px solid var(--hairline)' }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ background: 'var(--cream)' }}>
      <Link href="/carrito" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft className="w-4 h-4" strokeWidth={1.6} /> Volver al carrito
      </Link>
      <h1 className="font-display mb-8" style={{ fontSize: '2.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        Finalizar compra
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Contacto */}
          <section className="p-5" style={sectionStyle}>
            <h2 className="font-display mb-4" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Datos de contacto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass} style={labelStyle}>Nombre completo *</label>
                <input {...register('name')} className={inputClass} style={inputStyle} placeholder="Juan García" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Email *</label>
                <input {...register('email')} type="email" className={inputClass} style={inputStyle} placeholder="juan@email.com" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>WhatsApp / Teléfono *</label>
                <input {...register('phone')} type="tel" className={inputClass} style={inputStyle} placeholder="11 2454-5608" />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>
          </section>

          {/* Dirección */}
          <section className="p-5" style={sectionStyle}>
            <h2 className="font-display mb-1" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Dirección de entrega</h2>
            <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Delivery {DELIVERY_DAYS.toLowerCase()} · Cobertura en GBA</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Calle *</label>
                <input {...register('street')} className={inputClass} style={inputStyle} />
                {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street.message}</p>}
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Número *</label>
                <input {...register('streetNumber')} className={inputClass} style={inputStyle} />
                {errors.streetNumber && <p className="text-red-400 text-xs mt-1">{errors.streetNumber.message}</p>}
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Localidad *</label>
                <input {...register('locality')} className={inputClass} style={inputStyle} placeholder="Ej: Morón" />
                {errors.locality && <p className="text-red-400 text-xs mt-1">{errors.locality.message}</p>}
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Zona de envío *</label>
                <select
                  {...register('zone')}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">Seleccioná tu zona</option>
                  {SHIPPING_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — {subtotal >= FREE_SHIPPING_FROM ? 'Envío gratis' : formatPrice(z.price)}
                    </option>
                  ))}
                </select>
                {errors.zone && <p className="text-red-400 text-xs mt-1">{errors.zone.message}</p>}
                {shippingZoneData && (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{shippingZoneData.localities.slice(0, 4).join(', ')}…</p>
                )}
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Código postal</label>
                <input {...register('postalCode')} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Piso / Depto / Referencia</label>
                <input {...register('shippingNotes')} className={inputClass} style={inputStyle} placeholder="Piso 3 B, timbre García..." />
              </div>
            </div>
          </section>

          {/* Turno */}
          <section className="p-5" style={sectionStyle}>
            <h2 className="font-display mb-4" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Turno de entrega</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'mañana', label: 'Mañana', desc: '10:00 — 13:00 hs', icon: Sun },
                { value: 'tarde', label: 'Tarde', desc: '13:00 — 16:00 hs', icon: Sunset },
              ].map(({ value, label, desc, icon: Icon }) => {
                const selected = watch('shift') === value
                return (
                  <label
                    key={value}
                    className="flex items-center gap-3 p-4 border cursor-pointer transition-all"
                    style={selected
                      ? { borderColor: 'var(--olive-dark)', background: 'var(--beige)' }
                      : { borderColor: 'var(--hairline)', background: 'transparent' }}
                  >
                    <input {...register('shift')} type="radio" value={value} className="sr-only" />
                    <Icon className="w-5 h-5 shrink-0" strokeWidth={1.4} style={{ color: selected ? 'var(--olive-dark)' : 'var(--text-tertiary)' }} />
                    <div>
                      <p className="text-sm font-medium font-sans-ui" style={{ color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
                    </div>
                  </label>
                )
              })}
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>Días de entrega: {DELIVERY_DAYS}</p>
          </section>

          {/* Pago */}
          <section className="p-5" style={sectionStyle}>
            <h2 className="font-display mb-4" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Forma de pago</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(({ value, label, badge, desc, icon: Icon }) => {
                const selected = paymentMethod === value
                return (
                  <label
                    key={value}
                    className="flex items-start gap-3.5 p-4 border cursor-pointer transition-all"
                    style={selected
                      ? { borderColor: 'var(--olive-dark)', background: 'var(--beige)' }
                      : { borderColor: 'var(--hairline)', background: 'transparent' }}
                  >
                    <input {...register('paymentMethod')} type="radio" value={value} className="sr-only" />
                    <div className="mt-0.5 p-2 shrink-0" style={{ background: selected ? 'var(--card-white)' : 'transparent' }}>
                      <Icon className="w-4 h-4" strokeWidth={1.4} style={{ color: selected ? 'var(--olive-dark)' : 'var(--text-tertiary)' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium font-sans-ui" style={{ color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</p>
                        {badge && (
                          <span className="nav-label px-2 py-0.5" style={{ background: 'var(--olive-dark)', color: '#fff', fontSize: '9.5px' }}>{badge}</span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
                    </div>
                    {selected && (
                      <div className="shrink-0 w-4 h-4 flex items-center justify-center mt-1" style={{ background: 'var(--olive-dark)' }}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </label>
                )
              })}
            </div>
            {paymentMethod === 'efectivo' && (
              <div className="mt-3 p-3.5 text-sm" style={{ background: 'var(--beige)', border: '1px solid var(--hairline)' }}>
                <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>10% de descuento en efectivo aplicado</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Abonás en el momento de recibir el pedido.</p>
              </div>
            )}
            {paymentMethod === 'transferencia' && (
              <div className="mt-3 p-3.5 text-sm" style={{ background: 'var(--beige)', border: '1px solid var(--hairline)' }}>
                <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Transferencia bancaria</p>
                <p style={{ color: 'var(--gold)' }}>Alias: <span className="font-mono font-bold">huevos.cosmicos.uala</span> (Uala)</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Envianos el comprobante por WhatsApp para confirmar el pedido.</p>
              </div>
            )}
          </section>

          {/* Notas */}
          <div>
            <label className={labelClass} style={labelStyle}>Notas adicionales</label>
            <textarea {...register('notes')} rows={2} className={inputClass} style={inputStyle} placeholder="Alguna indicación extra para tu pedido..." />
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="p-5 sticky top-32" style={{ background: 'var(--beige)' }}>
            <h2 className="font-display mb-4" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Tu pedido</h2>
            <ul className="space-y-2 mb-4 text-sm font-sans-ui">
              {items.map((item) => {
                const unitPrice = paymentMethod === 'efectivo' && item.product.transferPrice
                  ? item.product.transferPrice
                  : item.product.price
                return (
                  <li key={item.product.id} className="flex justify-between gap-2">
                    <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{item.product.name} <span style={{ color: 'var(--text-tertiary)' }}>x{item.quantity}</span></span>
                    <span className="font-medium shrink-0" style={{ color: 'var(--text-primary)' }}>{formatPrice(unitPrice * item.quantity)}</span>
                  </li>
                )
              })}
            </ul>
            <div className="pt-3 space-y-2 text-sm font-sans-ui" style={{ borderTop: '1px solid var(--hairline)' }}>
              {paymentMethod === 'efectivo' && effectiveSubtotal < subtotal && (
                <div className="flex justify-between font-medium" style={{ color: 'var(--olive-dark)' }}>
                  <span>Descuento efectivo</span>
                  <span>- {formatPrice(subtotal - effectiveSubtotal)}</span>
                </div>
              )}
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--text-primary)' }}>{formatPrice(effectiveSubtotal)}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Envío</span>
                <span style={{ color: 'var(--text-primary)' }}>{freeShipping ? '¡Gratis!' : shippingZoneData ? formatPrice(shippingCost) : 'A calcular'}</span>
              </div>
              {shippingZoneData && !freeShipping && (
                <p className="text-xs p-2" style={{ color: 'var(--olive-dark)', background: 'var(--cream)' }}>
                  Agregá {formatPrice(FREE_SHIPPING_FROM - subtotal)} más para envío gratis
                </p>
              )}
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
              <div className="flex justify-between items-baseline font-display mb-5" style={{ fontSize: '1.4rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-primary)' }}>Total</span>
                <span style={{ color: 'var(--olive-dark)' }}>{formatPrice(total)}</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-label w-full py-4 transition-colors disabled:cursor-not-allowed"
                style={loading ? { background: 'var(--hairline)', color: 'var(--text-tertiary)' } : { background: 'var(--olive-dark)', color: '#fff' }}
              >
                {loading ? 'Procesando...' : 'Confirmar pedido'}
              </button>
              <p className="text-xs text-center mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                Te contactamos por WhatsApp para coordinar la entrega.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
