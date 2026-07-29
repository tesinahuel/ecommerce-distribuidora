'use client'

import { MessageCircle } from 'lucide-react'
import { STORE_ADDRESS } from '@/data/shipping'

export default function WhatsAppButton() {
  const url = `https://wa.me/${STORE_ADDRESS.whatsapp}?text=${encodeURIComponent('Hola! Quiero hacer un pedido 🥚')}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center gap-2 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden group-hover:block text-sm font-semibold pr-1 whitespace-nowrap">
        Pedir por WhatsApp
      </span>
    </a>
  )
}
