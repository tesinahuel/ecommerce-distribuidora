'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { getLineConfig } from '@/data/lines'
import { getCategoryConfig } from '@/data/categories'
import { useState } from 'react'
import WeekendPromoBadge from '@/components/shared/WeekendPromoBadge'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState(false)

  const lineConfig = product.lines[0] ? getLineConfig(product.lines[0]) : null
  const categoryConfig = getCategoryConfig(product.category)
  const badge = lineConfig ?? categoryConfig

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const hasTransferDiscount = product.transferPrice && product.transferPrice < product.price
  const mainImage = product.images[0]
  const hasVariants = product.variants && product.variants.length > 0
  const activeVariant = hasVariants ? product.variants!.find((v) => v.price > 0) : undefined
  const minVariantPrice = activeVariant?.price ?? 0

  const displayPrice = hasVariants ? minVariantPrice : product.price
  const displayOriginalPrice = hasVariants ? activeVariant?.originalPrice : product.originalPrice
  const hasDiscount = !!displayOriginalPrice && displayOriginalPrice > displayPrice
  const savings = hasDiscount ? displayOriginalPrice! - displayPrice : 0

  return (
    <div className="gourmet-card font-sans-ui rounded-lg overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/catalogo/${product.slug}`} className="block relative aspect-square overflow-hidden" style={{ background: 'var(--beige)' }}>
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {badge.icon}
          </div>
        )}
        {product.featured && (
          <span
            className="absolute top-2 left-2 text-white text-[10px] font-bold uppercase px-2 py-1 rounded"
            style={{ background: 'var(--olive-dark)', letterSpacing: '0.04em' }}
          >
            Destacado
          </span>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {hasVariants && (
            <span className="text-[10px] font-bold px-2 py-1 rounded" style={{ background: 'var(--card-white)', color: 'var(--brown)' }}>
              {product.variants!.length} presentaciones
            </span>
          )}
          <WeekendPromoBadge productId={product.id} />
        </div>
      </Link>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase mb-2 w-fit"
          style={{ background: 'var(--beige)', color: 'var(--brown-soft)', letterSpacing: '0.04em' }}
        >
          <span>{badge.icon}</span>
          <span>{badge.name}</span>
        </div>

        <Link href={`/catalogo/${product.slug}`} className="flex-1">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2" style={{ color: 'var(--brown)' }}>
            {product.name}
          </h3>
          {product.packItems && product.packItems.length > 0 ? (
            <ul className="mt-1.5 space-y-0.5">
              {product.packItems.map((item) => (
                <li key={item} className="text-xs flex items-center gap-1" style={{ color: 'var(--brown-soft)' }}>
                  <span style={{ color: 'var(--gold-warm)' }}>✓</span> {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--brown-soft)' }}>
              {product.description}
            </p>
          )}
        </Link>

        {/* Price */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--hairline)' }}>
          {displayPrice === 0 ? (
            <div className="mb-2">
              {hasVariants ? (
                <span className="text-xs font-bold" style={{ color: 'var(--olive-dark)' }}>Precio a consultar · elegí peso</span>
              ) : (
                <span className="text-sm font-bold" style={{ color: 'var(--olive-dark)' }}>Precio a consultar</span>
              )}
            </div>
          ) : (
            <div className="mb-2">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'var(--brown-soft)' }}>{hasVariants ? 'Desde (efectivo)' : 'Efectivo'}</p>
                  <div className="flex items-baseline gap-1.5">
                    {hasDiscount && (
                      <span className="text-xs line-through" style={{ color: 'var(--brown-soft)' }}>{formatPrice(displayOriginalPrice!)}</span>
                    )}
                    <span className="text-base font-bold" style={{ color: 'var(--brown)' }}>{formatPrice(displayPrice)}</span>
                  </div>
                  {!hasVariants && <span className="text-xs ml-1" style={{ color: 'var(--brown-soft)' }}>/ {product.unit}</span>}
                </div>
                {!hasVariants && hasTransferDiscount && (
                  <div className="text-right">
                    <p className="text-xs mb-0.5 font-medium" style={{ color: 'var(--gold-warm)' }}>Transf. 💸</p>
                    <span className="text-base font-bold" style={{ color: 'var(--gold-warm)' }}>{formatPrice(product.transferPrice!)}</span>
                  </div>
                )}
              </div>
              {hasDiscount && (
                <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--olive-dark)' }}>
                  Ahorrás {formatPrice(savings)}
                </span>
              )}
            </div>
          )}

          {hasVariants ? (
            <Link
              href={`/catalogo/${product.slug}`}
              className="btn-olive w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded"
            >
              Elegir presentación →
            </Link>
          ) : (
            <button
              onClick={handleAdd}
              disabled={product.price === 0}
              className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded transition-colors duration-200 ${
                product.price === 0 ? 'cursor-not-allowed' : ''
              }`}
              style={
                product.price === 0
                  ? { background: 'var(--beige)', color: 'var(--brown-soft)' }
                  : added
                  ? { background: 'var(--gold-warm)', color: 'var(--brown)' }
                  : { background: 'var(--olive-mid)', color: 'white' }
              }
            >
              {product.price === 0
                ? 'Consultar precio'
                : added
                ? <>✓ Agregado</>
                : <><Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Agregar</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
