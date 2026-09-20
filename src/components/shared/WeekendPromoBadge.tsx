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
      className={`nav-label px-2 py-1 ${className ?? ''}`}
      style={{ background: 'var(--olive-dark)', color: '#fff', fontSize: '9.5px' }}
    >
      Solo hoy
    </span>
  )
}
