'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { LINES } from '@/data/lines'
import { cn } from '@/lib/utils'

export default function LineFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeLine = searchParams.get('linea')

  const handleSelect = (lineId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (lineId) {
      params.set('linea', lineId)
    } else {
      params.delete('linea')
    }
    params.delete('pagina')
    router.push(`/catalogo?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => handleSelect(null)}
        className={cn('flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all')}
        style={
          !activeLine
            ? { background: '#CC2200', color: 'white' }
            : { background: 'rgba(255,255,255,0.07)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' }
        }
      >
        Todos
      </button>
      {LINES.map((line) => {
        const active = activeLine === line.id
        return (
          <button
            key={line.id}
            onClick={() => handleSelect(line.id)}
            className={cn('flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all')}
            style={
              active
                ? { background: '#CC2200', color: 'white' }
                : { background: 'rgba(255,255,255,0.07)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' }
            }
          >
            <span>{line.icon}</span>
            <span>{line.name}</span>
          </button>
        )
      })}
    </div>
  )
}
