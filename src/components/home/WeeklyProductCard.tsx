'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { getCategoryConfig } from '@/data/categories'

interface WeeklyProductCardProps {
  product: Product
}

export default function WeeklyProductCard({ product }: WeeklyProductCardProps) {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState(false)

  const category = getCategoryConfig(product.category)
  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price
  const badge = hasDiscount ? 'Oferta' : product.featured ? 'Más vendido' : null

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-col">
      <Link
        href={`/catalogo/${product.slug}`}
        className="relative block"
        style={{ height: '250px', background: 'var(--beige)' }}
      >
        {product.images[0] && (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
        )}
        {badge && (
          <span
            className="absolute top-0 left-0 nav-label px-2.5 py-1.5"
            style={{ background: 'var(--olive-dark)', color: 'var(--cream)', fontSize: '10px', letterSpacing: '0.14em' }}
          >
            {badge}
          </span>
        )}
      </Link>

      <div className="pt-3">
        <p className="nav-label" style={{ fontSize: '10.5px', letterSpacing: '0.1em', color: 'var(--text-tertiary)' }}>
          {category.name}
        </p>
        <Link href={`/catalogo/${product.slug}`}>
          <h3 className="font-display mt-1" style={{ fontSize: '21px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {product.name}
          </h3>
        </Link>
        <p className="font-sans-ui mt-0.5" style={{ fontSize: '13px', fontWeight: 300, color: 'var(--text-secondary)' }}>
          {product.unit}
        </p>

        <div className="flex items-baseline gap-2 mt-2">
          {hasDiscount && (
            <span className="text-sm line-through" style={{ color: '#A39878' }}>{formatPrice(product.originalPrice!)}</span>
          )}
          <span className="font-sans-ui" style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={product.price === 0}
          className="btn-label w-full mt-3 py-2.5 transition-colors"
          style={
            product.price === 0
              ? { border: '1px solid var(--hairline)', color: 'var(--text-tertiary)', cursor: 'not-allowed' }
              : added
              ? { border: '1px solid var(--olive-dark)', background: 'var(--olive-dark)', color: '#fff' }
              : { border: '1px solid var(--olive-dark)', background: 'transparent', color: 'var(--olive-dark)' }
          }
        >
          {product.price === 0 ? 'Consultar' : added ? 'Agregado' : 'Agregar'}
        </button>
      </div>
    </div>
  )
}
