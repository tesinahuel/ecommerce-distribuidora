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
    <div className="gourmet-card font-sans-ui flex flex-col">
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
            className="absolute top-0 left-0 nav-label px-2.5 py-1.5"
            style={{ background: 'var(--olive-dark)', color: 'var(--cream)', fontSize: '10px', letterSpacing: '0.14em' }}
          >
            Destacado
          </span>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {hasVariants && (
            <span className="text-[10px] font-medium px-2 py-1" style={{ background: 'var(--card-white)', color: 'var(--text-primary)' }}>
              {product.variants!.length} presentaciones
            </span>
          )}
          <WeekendPromoBadge productId={product.id} />
        </div>
      </Link>

      {/* Content */}
      <div className="pt-3 flex flex-col flex-1">
        <p
          className="nav-label mb-1.5"
          style={{ fontSize: '10.5px', letterSpacing: '0.1em', color: 'var(--text-tertiary)' }}
        >
          {badge.name}
        </p>

        <Link href={`/catalogo/${product.slug}`} className="flex-1">
          <h3 className="font-display leading-snug line-clamp-2" style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {product.name}
          </h3>
          {product.packItems && product.packItems.length > 0 ? (
            <ul className="mt-1.5 space-y-0.5">
              {product.packItems.map((item) => (
                <li key={item} className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--gold)' }}>—</span> {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs mt-1 line-clamp-2 leading-relaxed font-sans-ui" style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>
              {product.description}
            </p>
          )}
        </Link>

        {/* Price */}
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
          {displayPrice === 0 ? (
            <div className="mb-2">
              {hasVariants ? (
                <span className="text-xs font-medium" style={{ color: 'var(--olive-dark)' }}>Precio a consultar · elegí peso</span>
              ) : (
                <span className="text-sm font-medium" style={{ color: 'var(--olive-dark)' }}>Precio a consultar</span>
              )}
            </div>
          ) : (
            <div className="mb-2">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>{hasVariants ? 'Desde (efectivo)' : 'Efectivo'}</p>
                  <div className="flex items-baseline gap-1.5">
                    {hasDiscount && (
                      <span className="text-xs line-through" style={{ color: 'var(--text-tertiary)' }}>{formatPrice(displayOriginalPrice!)}</span>
                    )}
                    <span className="font-sans-ui" style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)' }}>{formatPrice(displayPrice)}</span>
                  </div>
                  {!hasVariants && <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>/ {product.unit}</span>}
                </div>
                {!hasVariants && hasTransferDiscount && (
                  <div className="text-right">
                    <p className="text-xs mb-0.5 font-medium" style={{ color: 'var(--gold)' }}>Transferencia</p>
                    <span className="text-base font-medium" style={{ color: 'var(--gold)' }}>{formatPrice(product.transferPrice!)}</span>
                  </div>
                )}
              </div>
              {hasDiscount && (
                <span className="inline-block mt-1.5 nav-label px-2 py-0.5" style={{ background: 'var(--olive-dark)', color: '#fff', fontSize: '9.5px' }}>
                  Ahorrás {formatPrice(savings)}
                </span>
              )}
            </div>
          )}

          {hasVariants ? (
            <Link
              href={`/catalogo/${product.slug}`}
              className="btn-label w-full flex items-center justify-center gap-1.5 py-2.5"
              style={{ border: '1px solid var(--olive-dark)', color: 'var(--olive-dark)' }}
            >
              Elegir presentación
            </Link>
          ) : (
            <button
              onClick={handleAdd}
              disabled={product.price === 0}
              className="btn-label w-full flex items-center justify-center gap-1.5 py-2.5 transition-colors duration-200"
              style={
                product.price === 0
                  ? { border: '1px solid var(--hairline)', color: 'var(--text-tertiary)', cursor: 'not-allowed' }
                  : added
                  ? { border: '1px solid var(--olive-dark)', background: 'var(--olive-dark)', color: '#fff' }
                  : { border: '1px solid var(--olive-dark)', background: 'transparent', color: 'var(--olive-dark)' }
              }
            >
              {product.price === 0
                ? 'Consultar precio'
                : added
                ? 'Agregado'
                : <><Plus className="w-3.5 h-3.5" strokeWidth={1.4} /> Agregar</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
