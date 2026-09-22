import { ShippingZoneConfig } from '@/types'

export const MIN_ORDER_AMOUNT = 5000
export const FREE_SHIPPING_FROM = 50000

export const DELIVERY_DAYS = 'Martes, Miércoles y Jueves'
export const DELIVERY_SHIFTS = {
  mañana: 'Mañana — 10:00 a 13:00 hs',
  tarde: 'Tarde — 13:00 a 16:00 hs',
}

export const SHIPPING_ZONES: ShippingZoneConfig[] = [
  {
    id: 'caba',
    name: 'CABA',
    price: 5000,
    minOrderForFree: FREE_SHIPPING_FROM,
    estimatedDays: '48 hs hábiles (Mar / Mié / Jue)',
    localities: [
      'Palermo', 'Belgrano', 'Recoleta', 'Núñez', 'Colegiales',
      'Almagro', 'Boedo', 'San Telmo', 'La Boca', 'Barracas',
      'Flores', 'Caballito', 'Villa Urquiza', 'Villa Devoto',
    ],
  },
  {
    id: 'norte-cordon-1',
    name: 'Norte Cordón 1',
    price: 5000,
    minOrderForFree: FREE_SHIPPING_FROM,
    estimatedDays: '48 hs hábiles (Mar / Mié / Jue)',
    localities: ['San Isidro', 'Vicente López', 'Olivos', 'Martínez', 'Florida'],
  },
  {
    id: 'oeste-cordon-1',
    name: 'Oeste Cordón 1',
    price: 3500,
    minOrderForFree: FREE_SHIPPING_FROM,
    estimatedDays: '48 hs hábiles (Mar / Mié / Jue)',
    localities: ['Ramos Mejía', 'Haedo', 'Castelar', 'Morón', 'Ituzaingó', 'San Justo', 'Ciudadela'],
  },
  {
    id: 'sur-cordon-1',
    name: 'Sur Cordón 1',
    price: 5000,
    minOrderForFree: FREE_SHIPPING_FROM,
    estimatedDays: '48 hs hábiles (Mar / Mié / Jue)',
    localities: ['Avellaneda', 'Lanús', 'Lomas de Zamora', 'Banfield'],
  },
  {
    id: 'norte-cordon-2',
    name: 'Norte Cordón 2',
    price: 8000,
    minOrderForFree: FREE_SHIPPING_FROM,
    estimatedDays: '48 hs hábiles (Mar / Mié / Jue)',
    localities: ['San Martín', 'Tres de Febrero', 'Tigre', 'San Fernando', 'Escobar'],
  },
  {
    id: 'oeste-cordon-2',
    name: 'Oeste Cordón 2',
    price: 7000,
    minOrderForFree: FREE_SHIPPING_FROM,
    estimatedDays: '48 hs hábiles (Mar / Mié / Jue)',
    localities: ['Merlo', 'Moreno', 'General Rodríguez', 'Luján', 'Hurlingham'],
  },
  {
    id: 'sur-cordon-2',
    name: 'Sur Cordón 2',
    price: 9000,
    minOrderForFree: FREE_SHIPPING_FROM,
    estimatedDays: '48 hs hábiles (Mar / Mié / Jue)',
    localities: ['Quilmes', 'Berazategui', 'Florencio Varela', 'Almirante Brown', 'Esteban Echeverría', 'Ezeiza'],
  },
]

export const getShippingZoneByLocality = (locality: string): ShippingZoneConfig | undefined =>
  SHIPPING_ZONES.find((zone) =>
    zone.localities.some((l) => l.toLowerCase().includes(locality.toLowerCase()))
  )

export const STORE_ADDRESS = {
  locality: 'Ramos Mejía',
  province: 'Buenos Aires',
  phone: '+54 11 2454-5608',
  whatsapp: '5491124545608',
  email: 'huevoscosmicosventas@gmail.com',
  instagram: '@HUEVOSCOSMICOS',
  hours: 'Delivery: Mar / Mié / Jue · Mañana 10-13 hs · Tarde 13-16 hs',
}
