import Link from 'next/link'
import Image from 'next/image'
import {
  Leaf, Star, Truck, ShieldCheck, Handshake, Banknote, HeartHandshake,
  ArrowRight, Coffee, Dumbbell, Gift, Users,
} from 'lucide-react'
import { getFeaturedProducts } from '@/data/products'
import { STORE_ADDRESS, DELIVERY_DAYS } from '@/data/shipping'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedCarousel from '@/components/home/FeaturedCarousel'
import WeekendPromoBanner from '@/components/shared/WeekendPromoBanner'

const BENEFITS = [
  { icon: Leaf, title: '100% NATURALES', desc: 'Sin conservantes ni aditivos' },
  { icon: Star, title: 'SELECCIONADOS', desc: 'Productos de calidad premium' },
  { icon: Truck, title: 'ENVÍOS A GBA', desc: DELIVERY_DAYS },
  { icon: ShieldCheck, title: 'COMPRA SEGURA', desc: 'Efectivo y transferencia' },
]

const COMBO_PACKS = [
  { icon: Coffee, label: 'Pack Desayuno' },
  { icon: Dumbbell, label: 'Pack Fit' },
  { icon: Gift, label: 'Pack Premium' },
  { icon: Users, label: 'Pack Familiar' },
]

const GUARANTEES = [
  { icon: Handshake, title: 'ATENCIÓN PERSONALIZADA', desc: 'Estamos para asesorarte en lo que necesites' },
  { icon: Banknote, title: 'PAGOS SEGUROS', desc: 'Efectivo con 10% off y transferencia' },
  { icon: ShieldCheck, title: 'CALIDAD GARANTIZADA', desc: 'Certificación OIA e INTA' },
  { icon: HeartHandshake, title: 'SATISFACCIÓN ASEGURADA', desc: 'Tu bienestar es nuestra prioridad' },
]

export default function HomePage() {
  const featured = getFeaturedProducts()

  return (
    <div className="font-sans-ui" style={{ background: 'var(--cream)' }}>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: '480px' }}>
        <Image
          src="/images/products/packaging.jpg"
          alt="Huevos Cósmicos — packaging premium"
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(45,35,28,0.88) 0%, rgba(45,35,28,0.55) 45%, rgba(45,35,28,0.1) 75%)' }}
        />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div style={{ maxWidth: '45%' }} className="w-full">
            <h1
              className="font-display leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 600, color: '#fff' }}
            >
              Elegí alimentos reales, elegí bienestar.
            </h1>
            <p className="mb-8 leading-relaxed" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}>
              Productos naturales y seleccionados para una vida más saludable.
            </p>
            <Link
              href="/catalogo"
              className="btn-olive inline-flex items-center gap-2 text-xs font-bold uppercase px-7 py-3.5 rounded"
              style={{ letterSpacing: '0.08em' }}
            >
              Comprar ahora <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Barra de beneficios ──────────────────────────── */}
      <section style={{ background: 'var(--beige)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon className="w-6 h-6 leaf-ornament shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-xs font-bold uppercase" style={{ letterSpacing: '0.05em', color: 'var(--brown)' }}>{title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--brown-soft)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Promos de fin de semana ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <WeekendPromoBanner />
      </section>

      {/* ─── Categorías ───────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-10">
            <Leaf className="w-5 h-5 leaf-ornament" strokeWidth={1.5} />
            <h2 className="font-display text-center" style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--brown)' }}>
              Explorá nuestras categorías
            </h2>
            <Leaf className="w-5 h-5 leaf-ornament -scale-x-100" strokeWidth={1.5} />
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* ─── Banner de combos ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-lg overflow-hidden flex flex-col md:flex-row" style={{ background: 'var(--beige)' }}>
          <div className="relative md:w-[40%] h-64 md:h-auto">
            <Image src="/images/products/estuches.jpg" alt="Combos Huevos Cósmicos" fill className="object-cover" />
          </div>
          <div className="md:w-[60%] p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center gap-8">
            <div className="flex-1">
              <h3 className="font-display mb-3" style={{ fontSize: '2.1rem', fontWeight: 600, color: 'var(--brown)' }}>
                Combos pensados para vos
              </h3>
              <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--brown-soft)' }}>
                Ahorrá tiempo y elegí tu combo ideal para cada momento del día.
              </p>
              <Link
                href="/catalogo#packs"
                className="btn-olive inline-flex items-center gap-2 text-xs font-bold uppercase px-6 py-3 rounded"
                style={{ letterSpacing: '0.08em' }}
              >
                Ver combos
              </Link>
            </div>
            <div className="flex gap-5 sm:gap-4 shrink-0">
              {COMBO_PACKS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center" style={{ width: '64px' }}>
                  <Icon className="w-6 h-6 leaf-ornament" strokeWidth={1.5} />
                  <span className="text-[10px] font-semibold uppercase leading-tight" style={{ letterSpacing: '0.03em', color: 'var(--brown)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Productos destacados ──────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--brown)' }}>
                Productos destacados
              </h2>
              <Link
                href="/catalogo"
                className="text-xs font-semibold uppercase flex items-center gap-1 shrink-0"
                style={{ letterSpacing: '0.06em', color: 'var(--olive-dark)' }}
              >
                Ver todos los productos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <FeaturedCarousel products={featured} />
          </div>
        </section>
      )}

      {/* ─── Banda editorial ──────────────────────────────── */}
      <section id="nosotros" className="relative overflow-hidden" style={{ height: '360px' }}>
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, #5a4632 0%, #3D3228 55%, #241d16 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(20,15,10,0.7) 0%, transparent 65%)' }}
        />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div style={{ maxWidth: '520px' }}>
            <h2 className="font-display leading-tight mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 600, color: '#fff' }}>
              Pequeñas elecciones, grandes cambios.
            </h2>
            <p className="mb-7 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
              Incorporá alimentos reales a tu rutina y sentí la diferencia todos los días.
            </p>
            <a
              href={`https://wa.me/${STORE_ADDRESS.whatsapp}?text=${encodeURIComponent('Hola, quiero conocer más sobre Huevos Cósmicos')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase px-6 py-3 rounded"
              style={{ letterSpacing: '0.08em', background: 'var(--gold-warm)', color: 'var(--brown)' }}
            >
              Conocé más
            </a>
          </div>
        </div>
      </section>

      {/* ─── Barra de garantías ───────────────────────────── */}
      <section style={{ background: 'var(--olive-dark)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {GUARANTEES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`flex flex-col items-center text-center px-4 py-4 sm:py-0 ${i > 0 ? 'sm:border-l' : ''}`}
                style={{ borderColor: 'rgba(255,255,255,0.15)' }}
              >
                <Icon className="w-7 h-7 mb-3" strokeWidth={1.5} style={{ color: 'var(--gold-warm)' }} />
                <p className="text-xs font-bold uppercase mb-1.5 text-white" style={{ letterSpacing: '0.05em' }}>{title}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
