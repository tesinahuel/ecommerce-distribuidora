import { ProductLine } from '@/types'

export interface LineConfig {
  id: ProductLine
  name: string
  icon: string
  color: string
  bgColor: string
  description: string
}

export const LINES: LineConfig[] = [
  {
    id: 'organicos',
    name: 'Orgánicos',
    icon: '🌿',
    color: 'text-green-400',
    bgColor: 'bg-green-950/40',
    description: 'Huevos orgánicos certificados y productos de granjas libres de químicos',
  },
  {
    id: 'naturales',
    name: 'Naturales',
    icon: '🍯',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    description: 'Miel, aceites y granola, sin aditivos ni conservantes',
  },
  {
    id: 'frutos-secos',
    name: 'Frutos Secos',
    icon: '🥜',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-950/40',
    description: 'Nueces, almendras y maní seleccionados',
  },
  {
    id: 'convencionales',
    name: 'Convencionales',
    icon: '🥚',
    color: 'text-red-400',
    bgColor: 'bg-red-950/40',
    description: 'Huevos blancos y supremas de nuestra línea convencional',
  },
]

export const getLineConfig = (id: ProductLine): LineConfig =>
  LINES.find((l) => l.id === id) ?? LINES[0]
