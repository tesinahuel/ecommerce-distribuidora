import Image from 'next/image'
import { Gift, Truck, Handshake } from 'lucide-react'
import StarField from '@/components/shared/StarField'
import { STORE_ADDRESS } from '@/data/shipping'

const BENEFITS = [
  { icon: Gift, title: 'Packaging con tu marca', desc: 'Canastas y cajas personalizadas para regalos empresariales y eventos.' },
  { icon: Truck, title: 'Entregas coordinadas', desc: 'Volúmenes grandes con fecha y horario de entrega acordados con tu empresa.' },
  { icon: Handshake, title: 'Atención dedicada', desc: 'Un solo contacto para cotizar, coordinar y hacer seguimiento de tu pedido.' },
]

export default function EmpresasPage() {
  const whatsappMsg = encodeURIComponent('Hola! Quiero cotizar canastas / regalos corporativos con Huevos Cósmicos')

  return (
    <div>
      {/* ─── Hero cósmico (única página que conserva el fondo galaxia) ── */}
      <section className="relative overflow-hidden galaxy-bg" style={{ minHeight: '520px' }}>
        <div className="absolute inset-0" aria-hidden>
          <StarField />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="nav-label mb-5" style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'var(--gold)' }}>
            Línea corporativa
          </p>
          <h1 className="font-display leading-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 600, color: '#fff' }}>
            Canastas y regalos con tu marca
          </h1>
          <p className="font-sans-ui mx-auto leading-relaxed mb-9" style={{ fontSize: '16px', fontWeight: 300, color: '#D6D0C0', maxWidth: '560px' }}>
            Diseñamos experiencias de regalo a medida para empresas: fin de año, eventos, onboarding de equipos
            y agradecimientos a clientes, con productos naturales y packaging personalizado.
          </p>
          <a
            href={`https://wa.me/${STORE_ADDRESS.whatsapp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-label inline-flex items-center px-8 py-4"
            style={{ background: 'var(--gold)', color: '#1a1608' }}
          >
            Cotizar mi pedido
          </a>
        </div>
      </section>

      {/* ─── Beneficios ─────────────────────────────────────── */}
      <section style={{ background: 'var(--cream)', padding: '64px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-4" strokeWidth={1.4} style={{ color: 'var(--gold)' }} />
                <h3 className="font-display mb-2" style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed font-sans-ui" style={{ fontWeight: 300, color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Packaging ──────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '420px' }}>
        <div className="relative min-h-[280px] md:min-h-0">
          <Image src="/images/products/estuches.jpg" alt="Packaging personalizado para empresas" fill className="object-cover" />
        </div>
        <div className="flex items-center" style={{ background: 'var(--beige)' }}>
          <div className="px-6 sm:px-10 lg:px-16 py-14 max-w-lg">
            <p className="eyebrow mb-4">Cómo funciona</p>
            <h2 className="font-display mb-4 leading-tight" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              De la cotización a la entrega
            </h2>
            <ol className="space-y-4 font-sans-ui" style={{ color: 'var(--text-secondary)' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>1. Contanos tu evento</strong> — cantidad de canastas, presupuesto y fecha.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>2. Elegimos productos y packaging</strong> juntos, con tu marca si querés incluirla.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>3. Coordinamos la entrega</strong> en la fecha y dirección que necesites.</li>
            </ol>
            <a
              href={`https://wa.me/${STORE_ADDRESS.whatsapp}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-label inline-flex items-center px-7 py-3.5 mt-8"
              style={{ background: 'var(--olive-dark)', color: '#fff' }}
            >
              Hablar con nosotros
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
