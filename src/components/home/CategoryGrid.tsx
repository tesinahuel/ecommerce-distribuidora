import Link from 'next/link'
import Image from 'next/image'
import { Egg, Drumstick, Droplet, Flower2, Package, Wheat, type LucideIcon } from 'lucide-react'

interface HomeCategory {
  id: string
  name: string
  description: string
  icon: LucideIcon
  image?: string
}

const HOME_CATEGORIES: HomeCategory[] = [
  { id: 'huevos', name: 'Huevos', description: 'Frescos, nutritivos y de calidad', icon: Egg, image: '/images/products/huevos-organicos.jpg' },
  { id: 'pollo', name: 'Supremas de Pollo', description: 'Prácticas, magras y versátiles', icon: Drumstick, image: '/images/products/pechuga-premium.png' },
  { id: 'aceites', name: 'Aceites', description: 'Extra virgen y de coco', icon: Droplet, image: '/images/products/aceite-oliva.jpg' },
  { id: 'miel', name: 'Miel y Endulzantes', description: 'Naturales y saludables', icon: Flower2, image: '/images/products/miel.jpg' },
  { id: 'conservas', name: 'Conservas y Encurtidos', description: 'Sabor y calidad en cada bocado', icon: Package, image: '/images/products/tomate.png' },
  { id: 'frutos-secos', name: 'Secos y Semillas', description: 'Energía natural para tu día', icon: Wheat },
]

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
      {HOME_CATEGORIES.map((cat) => {
        const Icon = cat.icon
        return (
          <Link
            key={cat.id}
            href={`/catalogo?categoria=${cat.id}`}
            className="gourmet-card rounded-lg overflow-hidden flex flex-col text-center"
          >
            <div className="relative h-[180px] rounded-t-lg overflow-hidden" style={{ background: 'var(--beige)' }}>
              {cat.image ? (
                <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="w-14 h-14" strokeWidth={1.2} style={{ color: 'var(--gold-warm)', opacity: 0.5 }} />
                </div>
              )}
            </div>
            <div
              className="relative mx-auto -mt-6 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--card-white)', boxShadow: '0 2px 10px rgba(61,50,40,0.15)' }}
            >
              <Icon className="w-5 h-5 leaf-ornament" strokeWidth={1.5} />
            </div>
            <div className="px-3 pt-2 pb-5 flex-1 flex flex-col">
              <h3
                className="text-[13px] font-bold uppercase leading-tight mb-1"
                style={{ letterSpacing: '0.06em', color: 'var(--brown)', fontFamily: 'var(--font-sans), sans-serif' }}
              >
                {cat.name}
              </h3>
              <p className="text-xs" style={{ color: 'var(--brown-soft)' }}>{cat.description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
