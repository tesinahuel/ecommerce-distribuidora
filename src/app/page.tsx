import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProducts } from '@/data/products'
import WeeklyProductCard from '@/components/home/WeeklyProductCard'

const LINES = [
  {
    id: 'agroecologicos',
    name: 'Agroecológicos',
    description: 'Huevos orgánicos, aceite de oliva extra virgen y miel pura, certificados OIA.',
    image: '/images/products/huevos-organicos.jpg',
    href: '/catalogo?linea=agroecologicos',
  },
  {
    id: 'proteina-pura',
    name: 'Proteína pura',
    description: 'Supremas pastoriles, convencionales, pollo y huevos de primera calidad.',
    image: '/images/products/pechuga-premium.png',
    href: '/catalogo?linea=proteina-pura',
  },
  {
    id: 'desayuno',
    name: 'Desayuno',
    description: 'Granola, avena, copos de maíz, miel y frutos secos para arrancar bien el día.',
    image: '/images/products/miel.jpg',
    href: '/catalogo?linea=desayuno',
  },
]

export default function HomePage() {
  const featured = getFeaturedProducts()

  return (
    <div style={{ background: 'var(--cream)' }}>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: '560px' }}>
        <Image
          src="/images/products/packaging.jpg"
          alt="Huevos Cósmicos — canasta gourmet"
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(28,30,20,0.92) 0%, rgba(28,30,20,0.78) 38%, rgba(28,30,20,0.05) 72%)' }}
        />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div style={{ maxWidth: '610px' }} className="w-full">
            <p className="nav-label mb-5" style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'var(--gold)' }}>
              Directo del productor · Ramos Mejía
            </p>
            <h1
              className="font-display leading-[1.08] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 68px)', fontWeight: 600, color: '#fff' }}
            >
              Alimentos reales,<br />
              <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>elegidos con cuidado.</em>
            </h1>
            <p className="font-sans-ui mb-9 leading-relaxed" style={{ fontSize: '16px', fontWeight: 300, color: '#D6D0C0', maxWidth: '480px' }}>
              Productos naturales y seleccionados, entregados directo de la granja a tu mesa en GBA y CABA.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/catalogo"
                className="btn-label inline-flex items-center gap-2 px-8 py-4"
                style={{ background: '#FCFAF5', color: 'var(--olive-dark)' }}
              >
                Ver la tienda <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </Link>
              <Link
                href="/catalogo#packs"
                className="btn-label inline-flex items-center gap-2 px-8 py-4"
                style={{ border: '1px solid rgba(255,255,255,0.6)', color: '#fff' }}
              >
                Nuestros combos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Banda manifiesto ──────────────────────────────── */}
      <section id="nosotros" className="flex items-center justify-center" style={{ minHeight: '176px', background: 'var(--beige)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p
            className="font-display text-center mx-auto leading-relaxed"
            style={{ fontSize: '28px', fontWeight: 400, color: 'var(--text-primary)', maxWidth: '760px' }}
          >
            Trabajamos con productores certificados por <em style={{ fontStyle: 'italic' }}>OIA</em> e <em style={{ fontStyle: 'italic' }}>INTA</em>.
            Cada maple sale de la granja y llega a tu casa sin pasar por ningún depósito.
          </p>
        </div>
      </section>

      {/* ─── Líneas de producto ────────────────────────────── */}
      <section style={{ padding: '64px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Nuestras líneas</p>
            <h2 className="font-display" style={{ fontSize: '40px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Elegí por lo que buscás
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {LINES.map((line) => (
              <Link key={line.id} href={line.href} className="group block">
                <div className="relative overflow-hidden" style={{ height: '232px', background: 'var(--beige)' }}>
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <h3 className="font-display mt-5" style={{ fontSize: '25px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {line.name}
                </h3>
                <p className="font-sans-ui mt-1.5" style={{ fontSize: '13.5px', fontWeight: 300, color: 'var(--text-secondary)' }}>
                  {line.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Selección de la semana ────────────────────────── */}
      {featured.length > 0 && (
        <section style={{ padding: '64px 0', background: 'var(--beige)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between pb-5 mb-10" style={{ borderBottom: '1px solid var(--hairline)' }}>
              <h2 className="font-display" style={{ fontSize: '36px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Selección de la semana
              </h2>
              <Link
                href="/catalogo"
                className="nav-label flex items-center gap-1.5 shrink-0"
                style={{ fontSize: '11.5px', letterSpacing: '0.14em', color: 'var(--olive-dark)' }}
              >
                Ver todo <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {featured.slice(0, 4).map((product) => (
                <WeeklyProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Banda corporativa ─────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '300px' }}>
        <div className="flex items-center" style={{ background: 'var(--olive-dark)' }}>
          <div className="px-6 sm:px-10 lg:px-16 py-14 max-w-lg">
            <p className="nav-label mb-4" style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'var(--gold)' }}>
              Para empresas
            </p>
            <h2 className="font-display mb-4 leading-tight" style={{ fontSize: '40px', fontWeight: 600, color: '#fff' }}>
              Canastas y regalos con tu marca
            </h2>
            <p className="font-sans-ui mb-7 leading-relaxed" style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}>
              Packaging personalizado para regalos empresariales, eventos y fin de año.
            </p>
            <Link
              href="/empresas"
              className="btn-label inline-flex items-center px-7 py-3.5"
              style={{ background: 'var(--gold)', color: 'var(--olive-darker)' }}
            >
              Conocé más
            </Link>
          </div>
        </div>
        <div className="relative min-h-[260px] md:min-h-0">
          <Image src="/images/products/estuches.jpg" alt="Packaging personalizado para empresas" fill className="object-cover" />
        </div>
      </section>
    </div>
  )
}
