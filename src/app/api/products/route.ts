import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/data/products'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('categoria')
  const search = searchParams.get('buscar')?.toLowerCase()
  const featured = searchParams.get('destacados')

  let products = PRODUCTS.filter((p) => p.active)

  if (category) products = products.filter((p) => p.category === category)
  if (search) products = products.filter((p) =>
    p.name.toLowerCase().includes(search) ||
    p.description.toLowerCase().includes(search) ||
    p.tags.some((t) => t.toLowerCase().includes(search))
  )
  if (featured === 'true') products = products.filter((p) => p.featured)

  return NextResponse.json({ data: products, total: products.length })
}
