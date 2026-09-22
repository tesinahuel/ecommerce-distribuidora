import { ProductCategory } from '@/types'

export interface CategoryConfig {
  id: ProductCategory
  name: string
  description: string
  icon: string
  color: string
  bgColor: string
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'huevos',
    name: 'Huevos',
    description: 'Blancos, orgánicos, estuches y packaging',
    icon: '🥚',
    color: 'text-red-400',
    bgColor: 'bg-red-950/40',
  },
  {
    id: 'pollo',
    name: 'Supremas y Pollo',
    description: 'Supremas pastoriles, frescas y pollo entero',
    icon: '🍗',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
  },
  {
    id: 'miel',
    name: 'Miel',
    description: 'Miel pura x 1 kg',
    icon: '🍯',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-950/40',
  },
  {
    id: 'aceites',
    name: 'Aceites',
    description: 'Aceite de oliva y coco',
    icon: '🫒',
    color: 'text-green-400',
    bgColor: 'bg-green-950/40',
  },
  {
    id: 'conservas',
    name: 'Conservas',
    description: 'Ajíes y morrón en vinagre, tomate triturado',
    icon: '🥫',
    color: 'text-orange-400',
    bgColor: 'bg-orange-950/40',
  },
  {
    id: 'frutos-secos',
    name: 'Frutos Secos',
    description: 'Nueces, almendras y maní',
    icon: '🥜',
    color: 'text-yellow-300',
    bgColor: 'bg-yellow-950/40',
  },
  {
    id: 'granola',
    name: 'Granola',
    description: 'Granola casera, avena instantánea y copos de maíz',
    icon: '🥣',
    color: 'text-amber-300',
    bgColor: 'bg-amber-950/40',
  },
  {
    id: 'packs',
    name: 'Packs',
    description: 'Combos con descuento especial',
    icon: '📦',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
  },
]

export const getCategoryConfig = (id: ProductCategory): CategoryConfig =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]
