export type ProductCategory =
  | 'huevos'
  | 'pollo'
  | 'miel'
  | 'aceites'
  | 'conservas'
  | 'frutos-secos'
  | 'granola'
  | 'packs'

export type ProductLine =
  | 'agroecologicos'
  | 'proteina-pura'
  | 'aceites'
  | 'desayuno'
  | 'linea-fit'

export interface ProductVariant {
  weight: string
  price: number
  originalPrice?: number
  transferPrice?: number
}

export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'en-preparacion'
  | 'enviado'
  | 'entregado'
  | 'cancelado'

export type ShippingZone =
  | 'caba'
  | 'norte-cordon-1'
  | 'oeste-cordon-1'
  | 'sur-cordon-1'
  | 'norte-cordon-2'
  | 'oeste-cordon-2'
  | 'sur-cordon-2'

export type DeliveryShift = 'mañana' | 'tarde'

export interface Product {
  id: string
  name: string
  slug: string
  category: ProductCategory
  lines: ProductLine[]
  description: string
  price: number
  originalPrice?: number
  transferPrice?: number
  unit: string
  stock: number
  minOrder: number
  images: string[]
  variants?: ProductVariant[]
  packItems?: string[]
  featured: boolean
  active: boolean
  brand?: string
  weight?: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ShippingZoneConfig {
  id: ShippingZone
  name: string
  price: number
  minOrderForFree: number
  estimatedDays: string
  localities: string[]
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
}

export interface ShippingAddress {
  street: string
  number: string
  locality: string
  zone: ShippingZone
  postalCode?: string
  shift: DeliveryShift
  notes?: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  customer: CustomerInfo
  items: OrderItem[]
  shippingAddress: ShippingAddress
  shippingZone: ShippingZone
  shippingCost: number
  subtotal: number
  total: number
  status: OrderStatus
  paymentMethod: 'transferencia' | 'efectivo'
  paymentStatus: 'pendiente' | 'pagado' | 'rechazado'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface AdminStats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  todayOrders: number
  weeklyRevenue: number
}
