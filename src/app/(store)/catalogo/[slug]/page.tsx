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
    <div className="font-sans-ui" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/catalogo" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors" style={{ color: 'var(--brown-soft)' }}>
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden relative" style={{ background: 'var(--beige)' }}>
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
              <div
                className="nav-label inline-flex items-center px-3 py-1.5 w-fit"
                style={{ background: 'var(--beige)', color: 'var(--brown-soft)', fontSize: '10.5px', letterSpacing: '0.12em' }}
              >
                {badge.name}
              </div>
            </div>

            {product.brand && (
              <p className="text-sm mb-1" style={{ color: 'var(--brown-soft)' }}>
                Marca: <span className="font-medium" style={{ color: 'var(--brown)' }}>{product.brand}</span>
              </p>
            )}

            <h1 className="font-display mb-3" style={{ fontSize: '1.9rem', fontWeight: 600, color: 'var(--brown)' }}>{product.name}</h1>
            <p className="leading-relaxed mb-5" style={{ color: 'var(--brown-soft)' }}>{product.description}</p>

            {/* Variant selector */}
            {hasVariants && (
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--brown)' }}>Elegí el peso:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants!.map((v) => {
                    const active = selectedVariant?.weight === v.weight
                    return (
                      <button
                        key={v.weight}
                        onClick={() => setSelectedVariant(v)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2"
                        style={
                          active
                            ? { borderColor: 'var(--olive-dark)', background: 'var(--beige)', color: 'var(--brown)' }
                            : { borderColor: 'var(--hairline)', background: 'var(--card-white)', color: 'var(--brown-soft)' }
                        }
                      >
                        {v.weight}
                        {v.price > 0 && (
                          <span className="block text-xs mt-0.5" style={{ color: active ? 'var(--olive-dark)' : 'var(--brown-soft)' }}>
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
            <div className="rounded-lg p-4 mb-5 space-y-3" style={{ background: 'var(--card-white)', border: '1px solid var(--hairline)' }}>
              {displayPrice === 0 ? (
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'var(--brown-soft)' }}>Precio{hasVariants && selectedVariant ? ` — ${selectedVariant.weight}` : ''}</p>
                  <span className="text-2xl font-bold" style={{ color: 'var(--olive-dark)' }}>A consultar</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--brown-soft)' }}>
                      Precio efectivo{hasVariants && selectedVariant ? ` — ${selectedVariant.weight}` : ''}
                    </p>
                    <div className="flex items-baseline gap-2">
                      {hasSaleDiscount && (
                        <span className="text-base line-through" style={{ color: 'var(--brown-soft)' }}>{formatPrice(displayOriginalPrice!)}</span>
                      )}
                      <span className="text-2xl font-bold" style={{ color: 'var(--brown)' }}>{formatPrice(displayPrice)}</span>
                    </div>
                    <span className="text-sm ml-1" style={{ color: 'var(--brown-soft)' }}>/ {hasVariants ? selectedVariant?.weight : product.unit}</span>
                    {hasSaleDiscount && (
                      <span className="block w-fit mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--olive-dark)' }}>
                        Ahorrás {formatPrice(saleSavings)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <div className="text-right">
                      <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--gold)' }}>Transferencia</p>
                      <span className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>{formatPrice(displayTransferPrice!)}</span>
                    </div>
                  )}
                </div>
              )}
              {hasDiscount && (
                <p className="text-xs rounded-lg px-3 py-2" style={{ color: 'var(--olive-dark)', background: 'var(--beige)' }}>
                  Alias: <span className="font-mono font-bold">huevos.cosmicos.uala</span> — ahorrás {formatPrice(displayPrice - displayTransferPrice!)}
                </p>
              )}
            </div>

            {/* Quantity + Add */}
            {canAdd && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center rounded-lg" style={{ border: '1px solid var(--hairline)', background: 'var(--card-white)' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 rounded-l-lg" style={{ color: 'var(--brown)' }}>
                    <Minus className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <span className="px-4 font-semibold text-lg min-w-[3rem] text-center" style={{ color: 'var(--brown)' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 rounded-r-lg" style={{ color: 'var(--brown)' }}>
                    <Plus className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
                <span className="text-sm" style={{ color: 'var(--brown-soft)' }}>
                  Total: <span className="font-bold" style={{ color: 'var(--brown)' }}>{formatPrice(displayPrice * quantity)}</span>
                </span>
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-lg font-bold text-base transition-all mb-3"
              style={
                !canAdd
                  ? { background: 'var(--beige)', color: 'var(--brown-soft)', cursor: 'not-allowed' }
                  : added
                  ? { background: 'var(--gold)', color: 'var(--brown)' }
                  : { background: 'var(--olive-dark)', color: 'white' }
              }
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
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
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium text-sm transition-colors"
              style={{ border: '1px solid var(--hairline)', color: 'var(--olive-dark)' }}
            >
              Consultar por WhatsApp
            </a>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--beige)', color: 'var(--brown-soft)' }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
