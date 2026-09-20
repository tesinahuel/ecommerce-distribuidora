'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { isWeekend } from '@/lib/promos'
import { WEEKEND_PROMOS } from '@/data/weekendPromos'
import { PRODUCTS } from '@/data/products'
import { formatPrice } from '@/lib/utils'

export default function WeekendPromoBanner() {
  const [weekend, setWeekend] = useState<boolean | null>(null)

  useEffect(() => {
    setWeekend(isWeekend())
  }, [])

  if (weekend === null) return null

  if (!weekend) {
    return (
      <div className="p-4 text-center font-sans-ui" style={{ background: 'var(--beige)', border: '1px solid var(--hairline)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Volvé el sábado para ver nuestras promos de fin de semana
        </p>
      </div>
    )
  }

  return (
    <div className="p-5 sm:p-6 font-sans-ui" style={{ background: 'var(--beige)', border: '1px solid var(--hairline)' }}>
      <h2 className="font-display mb-1" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)' }}>Promos del fin de semana</h2>
      <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Válidas solo sábados y domingos</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {WEEKEND_PROMOS.map((promo, i) => {
          const product = PRODUCTS.find((p) => p.id === promo.productId)
          if (!product) return null
          return (
            <Link
              key={`${promo.productId}-${i}`}
              href={`/catalogo/${product.slug}`}
              className="p-4 flex flex-col gap-1 transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--card-white)', border: '1px solid var(--hairline)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                <span
                  className="nav-label shrink-0 px-2 py-0.5"
                  style={{ background: 'var(--olive-dark)', color: '#fff', fontSize: '9px' }}
                >
                  {promo.label}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{promo.description}</p>
              <p className="text-base font-medium" style={{ color: 'var(--gold)' }}>{formatPrice(promo.dealPrice)}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
