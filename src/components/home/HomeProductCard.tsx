'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Check } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

interface HomeProductCardProps {
  product: Product
}

export default function HomeProductCard({ product }: HomeProductCardProps) {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState(false)

  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price
  const badge = hasDiscount ? 'OFERTA' : product.featured ? 'MÁS VENDIDO' : null

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="gourmet-card rounded-lg overflow-hidden flex flex-col shrink-0" style={{ width: '220px' }}>
      <Link href={`/catalogo/${product.slug}`} className="relative aspect-square block" style={{ background: 'var(--beige)' }}>
        {product.images[0] && (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="220px" />
        )}
        {badge && (
          <span
            className="absolute top-2 left-2 text-white text-[10px] font-bold uppercase px-2 py-1 rounded"
            style={{ background: badge === 'OFERTA' ? 'var(--red-brand)' : 'var(--olive-dark)', letterSpacing: '0.04em' }}
          >
            {badge}
          </span>
        )}
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <Link href={`/catalogo/${product.slug}`}>
          <p className="text-sm leading-snug line-clamp-2 mb-2" style={{ color: 'var(--brown)' }}>{product.name}</p>
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            {hasDiscount && (
              <span className="block text-xs line-through" style={{ color: 'var(--brown-soft)' }}>
                {formatPrice(product.originalPrice!)}
              </span>
            )}
            <span className="text-base font-bold" style={{ color: 'var(--brown)' }}>{formatPrice(product.price)}</span>
          </div>
          <button
            onClick={handleAdd}
            aria-label="Agregar al carrito"
            className="w-9 h-9 rounded-full flex items-center justify-center border shrink-0 transition-colors"
            style={
              added
                ? { background: 'var(--olive-dark)', borderColor: 'var(--olive-dark)', color: '#fff' }
                : { borderColor: 'var(--hairline)', color: 'var(--olive-dark)' }
            }
          >
            {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </div>
  )
}
