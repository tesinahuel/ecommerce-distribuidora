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
    <div className="card-dark group rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:shadow-black/40">
      {/* Image */}
      <Link href={`/catalogo/${product.slug}`} className="block relative aspect-square overflow-hidden" style={{ background: '#070720' }}>
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {badge.icon}
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,5,16,0.6) 0%, transparent 50%)' }} />
        {product.featured && (
          <span className="absolute top-2 left-2 text-white text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#CC2200' }}>
            Destacado
          </span>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {hasVariants && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.9)', color: '#050510' }}>
              {product.variants!.length} presentaciones
            </span>
          )}
          <WeekendPromoBadge productId={product.id} />
        </div>
      </Link>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-2 w-fit ${badge.bgColor} ${badge.color}`}>
          <span>{badge.icon}</span>
          <span>{badge.name}</span>
        </div>

        <Link href={`/catalogo/${product.slug}`} className="flex-1">
          <h3 className="font-semibold text-white text-sm leading-tight hover:text-amber-200 transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.packItems && product.packItems.length > 0 ? (
            <ul className="mt-1.5 space-y-0.5">
              {product.packItems.map((item) => (
                <li key={item} className="text-xs flex items-center gap-1" style={{ color: '#999' }}>
                  <span style={{ color: '#D4AF37' }}>✓</span> {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed" style={{ color: '#888' }}>
              {product.description}
            </p>
          )}
        </Link>

        {/* Price */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {displayPrice === 0 ? (
            <div className="mb-2">
              {hasVariants ? (
                <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>Precio a consultar · elegí peso</span>
              ) : (
                <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>Precio a consultar</span>
              )}
            </div>
          ) : (
            <div className="mb-2">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: '#666' }}>{hasVariants ? 'Desde (efectivo)' : 'Efectivo'}</p>
                  <div className="flex items-baseline gap-1.5">
                    {hasDiscount && (
                      <span className="text-xs line-through" style={{ color: '#666' }}>{formatPrice(displayOriginalPrice!)}</span>
                    )}
                    <span className="text-base font-bold text-white">{formatPrice(displayPrice)}</span>
                  </div>
                  {!hasVariants && <span className="text-xs ml-1" style={{ color: '#666' }}>/ {product.unit}</span>}
                </div>
                {!hasVariants && hasTransferDiscount && (
                  <div className="text-right">
                    <p className="text-xs mb-0.5 font-medium" style={{ color: '#D4AF37' }}>Transf. 💸</p>
                    <span className="text-base font-bold" style={{ color: '#D4AF37' }}>{formatPrice(product.transferPrice!)}</span>
                  </div>
                )}
              </div>
              {hasDiscount && (
                <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#16A34A' }}>
                  Ahorrás {formatPrice(savings)}
                </span>
              )}
            </div>
          )}

          {hasVariants ? (
            <Link
              href={`/catalogo/${product.slug}`}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 text-white"
              style={{ background: '#CC2200' }}
            >
              Elegir presentación →
            </Link>
          ) : (
            <button
              onClick={handleAdd}
              disabled={product.price === 0}
              className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                product.price === 0 ? 'cursor-not-allowed opacity-50' : added ? 'scale-95' : ''
              }`}
              style={
                product.price === 0
                  ? { background: '#333', color: '#888' }
                  : added
                  ? { background: '#D4AF37', color: '#050510' }
                  : { background: '#CC2200', color: 'white' }
              }
            >
              {product.price === 0
                ? 'Consultar precio'
                : added
                ? <>✓ Agregado</>
                : <><Plus className="w-3.5 h-3.5" /> Agregar</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
