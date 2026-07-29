'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/types'
import HomeProductCard from './HomeProductCard'
import { cn } from '@/lib/utils'

interface FeaturedCarouselProps {
  products: Product[]
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const cardWidth = 220 + 20
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' })
  }

  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const cardWidth = 220 + 20
    const index = Math.round(el.scrollLeft / cardWidth)
    setActiveIndex(Math.min(index, products.length - 1))
  }

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current
    if (!el) return
    const cardWidth = 220 + 20
    el.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <button
        onClick={() => scrollByCard(-1)}
        aria-label="Anterior"
        className="hidden sm:flex absolute -left-4 top-[35%] -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center"
        style={{ background: 'var(--card-white)', boxShadow: '0 4px 14px rgba(61,50,40,0.18)', color: 'var(--olive-dark)' }}
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
      </button>
      <button
        onClick={() => scrollByCard(1)}
        aria-label="Siguiente"
        className="hidden sm:flex absolute -right-4 top-[35%] -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center"
        style={{ background: 'var(--card-white)', boxShadow: '0 4px 14px rgba(61,50,40,0.18)', color: 'var(--olive-dark)' }}
      >
        <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
      </button>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product) => (
          <div key={product.id} style={{ scrollSnapAlign: 'start' }}>
            <HomeProductCard product={product} />
          </div>
        ))}
      </div>

      {products.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {products.map((product, i) => (
            <button
              key={product.id}
              onClick={() => scrollToIndex(i)}
              aria-label={`Ir al producto ${i + 1}`}
              className={cn('rounded-full transition-all', i === activeIndex ? 'w-5 h-1.5' : 'w-1.5 h-1.5')}
              style={{ background: i === activeIndex ? 'var(--olive-dark)' : 'var(--hairline)' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
