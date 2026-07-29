'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'
import UtilityBar from './UtilityBar'
import HomeHeader from './HomeHeader'

const NAV_LINKS = [
  { href: '/catalogo', label: 'Todo' },
  { href: '/catalogo?linea=agroecologicos', label: '🌿 Agroecológicos' },
  { href: '/catalogo?linea=proteina-pura', label: '💪 Proteína Pura' },
  { href: '/catalogo?linea=aceites', label: '🫒 Aceites' },
  { href: '/catalogo?linea=desayuno', label: '🥣 Desayuno' },
  { href: '/catalogo?linea=linea-fit', label: '⚡ Línea Fit' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { getTotalItems, toggleCart } = useCartStore()
  const totalItems = getTotalItems()
  const pathname = usePathname()

  if (pathname === '/') {
    return (
      <>
        <UtilityBar />
        <HomeHeader />
      </>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'rgba(5,5,16,0.95)', borderColor: 'rgba(204,34,0,0.25)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 transition-all duration-300 group-hover:scale-105"
              style={{ border: '1.5px solid rgba(212,175,55,0.5)', boxShadow: '0 0 10px rgba(212,175,55,0.2)' }}
            >
              <Image src="/images/logo.png" alt="Huevos Cósmicos" fill className="object-cover" />
            </div>
            <div className="leading-none">
              <span className="brand-title block" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                Huevos Cósmicos
              </span>
              <span className="brand-subtitle block mt-0.5" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                Despensa Saludable
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white font-medium px-3 py-2 rounded-lg transition-all duration-150"
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(204,34,0,0.12)'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg"
              aria-label="Carrito"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center badge-discount"
                  style={{ background: '#CC2200', fontSize: '0.65rem' }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn('lg:hidden overflow-hidden transition-all duration-300 border-t', mobileOpen ? 'max-h-96' : 'max-h-0')}
        style={{ background: '#08081e', borderColor: 'rgba(204,34,0,0.15)' }}
      >
        <nav className="px-4 py-3 flex flex-col gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2.5 px-2 text-sm text-gray-300 hover:text-white font-medium border-b last:border-0 transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { toggleCart(); setMobileOpen(false) }}
            className="mt-1 py-2.5 px-2 text-sm font-semibold text-left transition-colors"
            style={{ color: '#D4AF37' }}
          >
            🛒 Ver carrito ({totalItems})
          </button>
        </nav>
      </div>
    </header>
  )
}
