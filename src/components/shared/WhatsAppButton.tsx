'use client'

import { MessageCircle } from 'lucide-react'
import { STORE_ADDRESS } from '@/data/shipping'

export default function WhatsAppButton() {
  const url = `https://wa.me/${STORE_ADDRESS.whatsapp}?text=${encodeURIComponent('Hola! Quiero hacer un pedido')}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 rounded-full p-4 transition-all duration-200 hover:scale-105 flex items-center gap-2 group font-sans-ui"
      style={{ background: 'var(--olive-dark)', color: '#fff', boxShadow: '0 4px 14px rgba(35,41,28,0.25)' }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" strokeWidth={1.6} />
      <span className="hidden group-hover:block text-sm pr-1 whitespace-nowrap">
        Pedir por WhatsApp
      </span>
    </a>
  )
}
