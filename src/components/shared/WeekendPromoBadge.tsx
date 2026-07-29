'use client'

import { useEffect, useState } from 'react'
import { isWeekend } from '@/lib/promos'
import { hasWeekendPromo } from '@/data/weekendPromos'

interface WeekendPromoBadgeProps {
  productId: string
  className?: string
}

export default function WeekendPromoBadge({ productId, className }: WeekendPromoBadgeProps) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(isWeekend() && hasWeekendPromo(productId))
  }, [productId])

  if (!active) return null

  return (
    <span
      className={`animate-pulse text-white text-[10px] font-bold px-2 py-1 rounded-full ${className ?? ''}`}
      style={{ background: '#CC2200', boxShadow: '0 0 8px rgba(204,34,0,0.7)' }}
    >
      🔥 SOLO HOY
    </span>
  )
}
