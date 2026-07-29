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
    id: 'agroecologicos',
    name: 'Agroecológicos',
    icon: '🌿',
    color: 'text-green-400',
    bgColor: 'bg-green-950/40',
    description: 'Huevos orgánicos, aceite de oliva extra virgen y miel pura',
  },
  {
    id: 'proteina-pura',
    name: 'Proteína Pura',
    icon: '💪',
    color: 'text-red-400',
    bgColor: 'bg-red-950/40',
    description: 'Supremas pastoriles, convencionales, pollo y huevos',
  },
  {
    id: 'aceites',
    name: 'Aceites',
    icon: '🫒',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-950/40',
    description: 'Aceite de oliva extra virgen y aceite de coco',
  },
  {
    id: 'desayuno',
    name: 'Desayuno',
    icon: '🥣',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    description: 'Granola, avena, copos de maíz, miel y frutos secos',
  },
  {
    id: 'linea-fit',
    name: 'Línea Fit',
    icon: '⚡',
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    description: 'Huevos orgánicos, supremas pastoriles, almendras, maní y nueces',
  },
]

export const getLineConfig = (id: ProductLine): LineConfig =>
  LINES.find((l) => l.id === id) ?? LINES[0]
