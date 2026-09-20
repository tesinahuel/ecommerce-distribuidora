import { Leaf, FlaskConical, ShieldCheck, type LucideIcon } from 'lucide-react'

const CERTS: { abbr: string; name: string; description: string; icon: LucideIcon }[] = [
  {
    abbr: 'OIA',
    name: 'Organismo Internacional Agropecuario',
    description: 'Certificación de producción orgánica y agroecológica bajo normas nacionales e internacionales.',
    icon: Leaf,
  },
  {
    abbr: 'INTA',
    name: 'Instituto Nacional de Tecnología Agropecuaria',
    description: 'Respaldo técnico y científico del organismo nacional de referencia en agrotecnología argentina.',
    icon: FlaskConical,
  },
  {
    abbr: 'SENASA',
    name: 'Servicio Nacional de Sanidad y Calidad Agroalimentaria',
    description: 'Habilitación y control sanitario de todos nuestros productos alimenticios.',
    icon: ShieldCheck,
  },
]

export default function CertificationsSection() {
  return (
    <section className="font-sans-ui" style={{ background: 'var(--beige)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">Calidad garantizada</p>
          <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Avalado por</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {CERTS.map((cert) => (
            <div key={cert.abbr} className="flex flex-col items-center text-center">
              <cert.icon className="w-8 h-8 mb-4" strokeWidth={1.4} style={{ color: 'var(--gold)' }} />
              <p className="font-display mb-1" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {cert.abbr}
              </p>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{cert.name}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
