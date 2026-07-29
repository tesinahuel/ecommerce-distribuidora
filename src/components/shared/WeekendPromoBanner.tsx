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
      <div className="rounded-2xl p-4 text-center border" style={{ background: '#0d0d2b', borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-sm" style={{ color: '#888' }}>
          🎉 Volvé el sábado para ver nuestras promos de fin de semana
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-5 sm:p-6 border"
      style={{ background: 'linear-gradient(135deg, rgba(204,34,0,0.2) 0%, rgba(212,175,55,0.1) 100%)', borderColor: 'rgba(204,34,0,0.4)' }}
    >
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">🎉 Promos del fin de semana</h2>
      <p className="text-sm mb-5" style={{ color: '#ccc' }}>Válidas solo sábados y domingos</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {WEEKEND_PROMOS.map((promo, i) => {
          const product = PRODUCTS.find((p) => p.id === promo.productId)
          if (!product) return null
          return (
            <Link
              key={`${promo.productId}-${i}`}
              href={`/catalogo/${product.slug}`}
              className="rounded-xl p-4 flex flex-col gap-1 transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(5,5,16,0.5)', border: '1px solid rgba(212,175,55,0.25)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-white font-semibold text-sm">{product.name}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white animate-pulse shrink-0"
                  style={{ background: '#CC2200' }}
                >
                  {promo.label}
                </span>
              </div>
              <p className="text-xs" style={{ color: '#aaa' }}>{promo.description}</p>
              <p className="text-base font-bold" style={{ color: '#D4AF37' }}>{formatPrice(promo.dealPrice)}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
