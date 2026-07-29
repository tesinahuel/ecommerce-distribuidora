import { Suspense } from 'react'
import { PRODUCTS, getPacks } from '@/data/products'
import { ProductLine } from '@/types'
import ProductCard from '@/components/catalog/ProductCard'
import LineFilter from '@/components/catalog/CategoryFilter'
import WeekendPromoBanner from '@/components/shared/WeekendPromoBanner'
import { Search } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ linea?: string; buscar?: string }>
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams
  const activeLine = params.linea as ProductLine | undefined
  const searchQuery = params.buscar?.toLowerCase()

  const packs = getPacks()

  const products = PRODUCTS.filter((p) => {
    if (!p.active) return false
    if (p.category === 'packs') return false
    if (activeLine && !p.lines.includes(activeLine)) return false
    if (searchQuery) {
      return (
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery))
      )
    }
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Catálogo</h1>
        <p className="text-sm" style={{ color: '#888' }}>
          {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-8">
        <WeekendPromoBanner />
      </div>

      {packs.length > 0 && (
        <div id="packs" className="mb-10 scroll-mt-24">
          <h2 className="text-xl font-bold text-white mb-4">📦 Packs con descuento</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {packs.map((pack) => (
              <ProductCard key={pack.id} product={pack} />
            ))}
          </div>
        </div>
      )}

      <form className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#666' }} />
        <input
          type="search"
          name="buscar"
          defaultValue={params.buscar}
          placeholder="Buscar productos..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 text-white placeholder-gray-600"
          style={{ background: '#0d0d2b', border: '1px solid rgba(255,255,255,0.1)', ['--tw-ring-color' as string]: '#CC2200' }}
        />
      </form>

      <div className="mb-6">
        <Suspense fallback={<div className="h-10 rounded-full animate-pulse" style={{ background: '#0d0d2b' }} />}>
          <LineFilter />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-medium text-white">No encontramos productos</p>
          <p className="text-sm mt-1" style={{ color: '#888' }}>Probá con otro filtro o término de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
