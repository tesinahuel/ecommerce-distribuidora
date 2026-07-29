'use client'

import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { getProductBySlug } from '@/data/products'
import { getLineConfig } from '@/data/lines'
import { getCategoryConfig } from '@/data/categories'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { STORE_ADDRESS } from '@/data/shipping'
import { Product, ProductVariant } from '@/types'
import { getPromosForProduct } from '@/data/weekendPromos'
import WeekendPromoBadge from '@/components/shared/WeekendPromoBadge'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const product = getProductBySlug(slug)

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants?.[0] ?? null
  )
  const { addItem } = useCartStore()

  if (!product) return notFound()

  const lineConfig = product.lines[0] ? getLineConfig(product.lines[0]) : null
  const categoryConfig = getCategoryConfig(product.category)
  const badge = lineConfig ?? categoryConfig

  const hasVariants = !!(product.variants && product.variants.length > 0)
  const displayPrice = hasVariants
    ? (selectedVariant?.price ?? 0)
    : product.price
  const displayTransferPrice = hasVariants
    ? selectedVariant?.transferPrice
    : product.transferPrice
  const hasDiscount = displayTransferPrice && displayTransferPrice < displayPrice
  const displayOriginalPrice = hasVariants
    ? selectedVariant?.originalPrice
    : product.originalPrice
  const hasSaleDiscount = !!displayOriginalPrice && displayOriginalPrice > displayPrice
  const saleSavings = hasSaleDiscount ? displayOriginalPrice! - displayPrice : 0
  const weekendPromos = getPromosForProduct(product.id)

  const mainImage = product.images[0]

  const handleAdd = () => {
    const productToAdd: Product = hasVariants && selectedVariant
      ? {
          ...product,
          price: selectedVariant.price,
          transferPrice: selectedVariant.transferPrice,
          name: `${product.name} — ${selectedVariant.weight}`,
          id: `${product.id}-${selectedVariant.weight.replace(/\s+/g, '-').toLowerCase()}`,
        }
      : product

    addItem(productToAdd, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const whatsappMsg = hasVariants && selectedVariant
    ? `Hola! Quiero consultar sobre *${product.name} — ${selectedVariant.weight}* 🥚`
    : `Hola! Quiero consultar sobre *${product.name}* 🥚`

  const canAdd = hasVariants ? (selectedVariant?.price ?? 0) > 0 : product.price > 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/catalogo" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white" style={{ color: '#888' }}>
        <ArrowLeft className="w-4 h-4" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden relative" style={{ background: '#070720', border: '1px solid rgba(212,175,55,0.2)' }}>
          {mainImage ? (
            <Image src={mainImage} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-8xl">
              {badge.icon}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-fit ${badge.bgColor} ${badge.color}`}>
              {badge.icon} {badge.name}
            </div>
            <WeekendPromoBadge productId={product.id} />
          </div>

          {product.brand && (
            <p className="text-sm mb-1" style={{ color: '#888' }}>Marca: <span className="font-medium text-white">{product.brand}</span></p>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{product.name}</h1>
          <p className="leading-relaxed mb-5" style={{ color: '#aaa' }}>{product.description}</p>

          {/* Variant selector */}
          {hasVariants && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-white mb-2">Elegí el peso:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants!.map((v) => {
                  const active = selectedVariant?.weight === v.weight
                  return (
                    <button
                      key={v.weight}
                      onClick={() => setSelectedVariant(v)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2"
                      style={
                        active
                          ? { borderColor: '#CC2200', background: 'rgba(204,34,0,0.15)', color: 'white' }
                          : { borderColor: 'rgba(255,255,255,0.1)', background: 'transparent', color: '#aaa' }
                      }
                    >
                      {v.weight}
                      {v.price > 0 && (
                        <span className="block text-xs mt-0.5" style={{ color: active ? '#D4AF37' : '#666' }}>
                          {formatPrice(v.price)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Pricing block */}
          <div className="rounded-2xl p-4 mb-5 space-y-3" style={{ background: '#0a0a1f', border: '1px solid rgba(212,175,55,0.2)' }}>
            {displayPrice === 0 ? (
              <div>
                <p className="text-xs mb-0.5" style={{ color: '#888' }}>Precio{hasVariants && selectedVariant ? ` — ${selectedVariant.weight}` : ''}</p>
                <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>A consultar</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: '#888' }}>
                    Precio efectivo{hasVariants && selectedVariant ? ` — ${selectedVariant.weight}` : ''}
                  </p>
                  <div className="flex items-baseline gap-2">
                    {hasSaleDiscount && (
                      <span className="text-base line-through" style={{ color: '#666' }}>{formatPrice(displayOriginalPrice!)}</span>
                    )}
                    <span className="text-2xl font-bold text-white">{formatPrice(displayPrice)}</span>
                  </div>
                  <span className="text-sm ml-1" style={{ color: '#666' }}>/ {hasVariants ? selectedVariant?.weight : product.unit}</span>
                  {hasSaleDiscount && (
                    <span className="block w-fit mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#16A34A' }}>
                      Ahorrás {formatPrice(saleSavings)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <div className="text-right">
                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#D4AF37' }}>Transferencia 💸</p>
                    <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{formatPrice(displayTransferPrice!)}</span>
                  </div>
                )}
              </div>
            )}
            {weekendPromos.length > 0 && (
              <div className="pt-3 border-t space-y-1.5" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
                <p className="text-xs font-bold" style={{ color: '#CC2200' }}>🎉 Promos de fin de semana (sáb. y dom.)</p>
                {weekendPromos.map((promo, i) => (
                  <p key={i} className="text-xs" style={{ color: '#aaa' }}>
                    <span className="font-semibold" style={{ color: '#D4AF37' }}>{promo.label}</span> — {promo.description}: <span className="font-bold text-white">{formatPrice(promo.dealPrice)}</span>
                  </p>
                ))}
              </div>
            )}
            {hasDiscount && (
              <p className="text-xs rounded-lg px-3 py-2" style={{ color: '#D4AF37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                Alias: <span className="font-mono font-bold">huevos.cosmicos.uala</span> — ahorrás {formatPrice(displayPrice - displayTransferPrice!)}
              </p>
            )}
          </div>

          {/* Quantity + Add */}
          {canAdd && (
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#0a0a1f' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 rounded-l-xl text-white">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-semibold text-lg min-w-[3rem] text-center text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 rounded-r-xl text-white">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm" style={{ color: '#888' }}>
                Total: <span className="font-bold text-white">{formatPrice(displayPrice * quantity)}</span>
              </span>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-base transition-all mb-3 ${canAdd && !added ? 'btn-red' : ''}`}
            style={
              !canAdd
                ? { background: '#333', color: '#666', cursor: 'not-allowed' }
                : added
                ? { background: '#D4AF37', color: '#050510' }
                : undefined
            }
          >
            <ShoppingCart className="w-5 h-5" />
            {!canAdd
              ? 'Precio a consultar'
              : added
              ? '¡Agregado al carrito!'
              : 'Agregar al carrito'}
          </button>

          <a
            href={`https://wa.me/${STORE_ADDRESS.whatsapp}?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm transition-colors hover:text-white"
            style={{ border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
          >
            Consultar por WhatsApp
          </a>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#888' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
