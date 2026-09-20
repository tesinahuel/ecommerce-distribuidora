import { Handshake } from 'lucide-react'

const BRANDS = [
  { name: 'Eggs Hons', desc: 'Supremas pastoriles' },
  { name: 'Agros', desc: 'Pechugas premium' },
  { name: 'Hausbrot', desc: 'Aceites y conservas' },
  { name: 'Indie Café', desc: 'Desayuno y granola' },
  { name: 'Productores agroecológicos', desc: 'Certificados OIA' },
]

export default function ProveedoresSection() {
  return (
    <section className="font-sans-ui" style={{ background: 'var(--cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="pt-10" style={{ borderTop: '1px solid var(--hairline)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <Handshake className="w-7 h-7 shrink-0" strokeWidth={1.4} style={{ color: 'var(--gold)' }} />
            <div>
              <h2 className="font-display mb-1" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Proveedores de las primeras marcas
              </h2>
              <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                Somos distribuidores directos de las principales marcas del mercado. Trabajamos con Eggs Hons, Agros,
                Hausbrot, Indie Café y productores agroecológicos certificados para garantizar la mejor calidad en cada entrega.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {BRANDS.map((brand) => (
              <div key={brand.name} className="pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
                <p className="text-sm font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>{brand.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{brand.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
