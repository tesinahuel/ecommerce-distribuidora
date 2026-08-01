import { Suspense } from 'react'
import { PRODUCTS, getPacks } from '@/data/products'
import { ProductCategory, ProductLine } from '@/types'
import ProductCard from '@/components/catalog/ProductCard'
import LineFilter from '@/components/catalog/CategoryFilter'
import WeekendPromoBanner from '@/components/shared/WeekendPromoBanner'
import { Search } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ linea?: string; categoria?: string; buscar?: string }>
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams
  const activeLine = params.linea as ProductLine | undefined
  const activeCategory = params.categoria as ProductCategory | undefined
  const searchQuery = params.buscar?.toLowerCase()

  const packs = getPacks()

  const products = PRODUCTS.filter((p) => {
    if (!p.active) return false
    if (p.category === 'packs') return false
    if (activeLine && !p.lines.includes(activeLine)) return false
    if (activeCategory && p.category !== activeCategory) return false
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
    <div className="font-sans-ui" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-display" style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--brown)' }}>Catálogo</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--brown-soft)' }}>
            {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mb-8">
          <WeekendPromoBanner />
        </div>

        {packs.length > 0 && (
          <div id="packs" className="mb-12 scroll-mt-24">
            <h2 className="font-display mb-5" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--brown)' }}>
              Packs con descuento
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {packs.map((pack) => (
                <ProductCard key={pack.id} product={pack} />
              ))}
            </div>
          </div>
        )}

        <form className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--brown-soft)' }} />
          <input
            type="search"
            name="buscar"
            defaultValue={params.buscar}
            placeholder="Buscar productos..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm focus:outline-none"
            style={{ background: 'var(--card-white)', border: '1px solid var(--hairline)', color: 'var(--brown)' }}
          />
        </form>

        <div className="mb-8">
          <Suspense fallback={<div className="h-10 rounded-full animate-pulse" style={{ background: 'var(--beige)' }} />}>
            <LineFilter />
          </Suspense>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium" style={{ color: 'var(--brown)' }}>No encontramos productos</p>
            <p className="text-sm mt-1" style={{ color: 'var(--brown-soft)' }}>Probá con otro filtro o término de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
