export interface WeekendPromo {
  productId: string
  label: string
  description: string
  dealPrice: number
}

export const WEEKEND_PROMOS: WeekendPromo[] = [
  {
    productId: 'huevo-blanco-n1',
    label: '3x2',
    description: 'Llevá 3 maples y pagá 2',
    dealPrice: 14000,
  },
  {
    productId: 'huevo-blanco-n1',
    label: 'Pack x4',
    description: 'Llevá 4 maples a precio especial',
    dealPrice: 20000,
  },
  {
    productId: 'huevo-blanco-n2',
    label: '3x2',
    description: 'Llevá 3 maples y pagá 2',
    dealPrice: 11000,
  },
  {
    productId: 'huevo-organico-grande',
    label: '4x2',
    description: 'Llevá 4 maples y pagá 2',
    dealPrice: 24000,
  },
  {
    productId: 'granola-250',
    label: '3x2',
    description: 'Llevá 3 unidades y pagá 2',
    dealPrice: 8400,
  },
  {
    productId: 'miel-500',
    label: '2x1',
    description: 'Llevá 2 y pagá 1',
    dealPrice: 3500,
  },
]

export const getPromosForProduct = (productId: string) =>
  WEEKEND_PROMOS.filter((p) => p.productId === productId)

export const hasWeekendPromo = (productId: string) =>
  WEEKEND_PROMOS.some((p) => p.productId === productId)
