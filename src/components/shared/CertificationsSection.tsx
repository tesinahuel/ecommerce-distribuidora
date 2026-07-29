const CERTS = [
  {
    abbr: 'OIA',
    name: 'Organismo Internacional Agropecuario',
    description: 'Certificación de producción orgánica y agroecológica bajo normas nacionales e internacionales.',
    icon: '🌱',
    color: '#4ade80',
    borderColor: 'rgba(74,222,128,0.3)',
    bgColor: 'rgba(74,222,128,0.06)',
  },
  {
    abbr: 'INTA',
    name: 'Instituto Nacional de Tecnología Agropecuaria',
    description: 'Respaldo técnico y científico del organismo nacional de referencia en agrotecnología argentina.',
    icon: '🔬',
    color: '#60a5fa',
    borderColor: 'rgba(96,165,250,0.3)',
    bgColor: 'rgba(96,165,250,0.06)',
  },
  {
    abbr: 'SENASA',
    name: 'Servicio Nacional de Sanidad y Calidad Agroalimentaria',
    description: 'Habilitación y control sanitario de todos nuestros productos alimenticios.',
    icon: '✅',
    color: '#D4AF37',
    borderColor: 'rgba(212,175,55,0.3)',
    bgColor: 'rgba(212,175,55,0.06)',
  },
]

export default function CertificationsSection() {
  return (
    <section style={{ background: '#03030f', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="cosmic-sep" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#D4AF37', letterSpacing: '0.2em' }}>
            Calidad garantizada
          </p>
          <h2 className="brand-title text-3xl sm:text-4xl">Avalado por</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {CERTS.map((cert) => (
            <div
              key={cert.abbr}
              className="rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
              style={{ background: cert.bgColor, border: `1px solid ${cert.borderColor}` }}
            >
              <div
                className="text-3xl mb-3 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${cert.borderColor}` }}
              >
                {cert.icon}
              </div>
              <p
                className="text-2xl font-bold mb-1 tracking-wider"
                style={{ color: cert.color, fontFamily: 'var(--font-brand), sans-serif' }}
              >
                {cert.abbr}
              </p>
              <p className="text-xs font-medium mb-2 text-white">{cert.name}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#777' }}>
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
