import { Handshake } from 'lucide-react'

const BRANDS = [
  { name: 'Soychu', desc: 'Supremas pastoriles', icon: '🍗' },
  { name: 'Agros', desc: 'Pechugas premium', icon: '🏆' },
  { name: 'Ginosa', desc: 'Aceites y conservas', icon: '🫒' },
  { name: 'Productores agroecológicos', desc: 'Certificados OIA', icon: '🌿' },
]

export default function ProveedoresSection() {
  return (
    <section style={{ background: '#050510', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="cosmic-sep-gold" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(5,5,16,0) 60%)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div
              className="p-3 rounded-xl shrink-0"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}
            >
              <Handshake className="w-7 h-7" style={{ color: '#D4AF37' }} />
            </div>
            <div>
              <h2 className="brand-title text-xl sm:text-2xl mb-1">
                Proveedores de las primeras marcas
              </h2>
              <p className="text-sm leading-relaxed max-w-2xl" style={{ color: '#aaa' }}>
                Somos distribuidores directos de las principales marcas del mercado. Trabajamos con Soychu, Agros, Ginosa
                y productores agroecológicos certificados para garantizar la mejor calidad en cada entrega.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-xl shrink-0">{brand.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white leading-tight truncate">{brand.name}</p>
                  <p className="text-xs" style={{ color: '#666' }}>{brand.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
