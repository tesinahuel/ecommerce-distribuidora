'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/catalogo', label: 'Tienda' },
  { href: '/catalogo?linea=agroecologicos', label: 'Agroecológicos' },
  { href: '/catalogo#packs', label: 'Combos' },
  { href: '/empresas', label: 'Empresas' },
  { href: '/#nosotros', label: 'Nosotros' },
]

export default function HomeHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { getTotalItems, toggleCart } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <header
      className="sticky top-0 z-50 border-b font-sans-ui"
      style={{ background: 'var(--cream)', borderColor: 'var(--hairline)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: '96px' }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
              <Image src="/images/logo.png" alt="Huevos Cósmicos" fill className="object-cover" />
            </div>
            <span
              className="nav-label"
              style={{ fontSize: '10.5px', letterSpacing: '0.22em', color: 'var(--text-primary)' }}
            >
              Despensa<br />Saludable
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-label transition-colors"
                style={{ fontSize: '12.5px', letterSpacing: '0.15em', color: 'var(--text-primary)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button aria-label="Buscar" className="p-2 transition-opacity hover:opacity-60" style={{ color: 'var(--olive-dark)' }}>
              <Search className="w-[19px] h-[19px]" strokeWidth={1.4} />
            </button>
            <button aria-label="Mi cuenta" className="hidden sm:inline-flex p-2 transition-opacity hover:opacity-60" style={{ color: 'var(--olive-dark)' }}>
              <User className="w-[19px] h-[19px]" strokeWidth={1.4} />
            </button>
            <button
              onClick={toggleCart}
              aria-label="Carrito"
              className="relative p-2 transition-opacity hover:opacity-60"
              style={{ color: 'var(--olive-dark)' }}
            >
              <ShoppingCart className="w-[19px] h-[19px]" strokeWidth={1.4} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center"
                  style={{ background: 'var(--gold)', color: 'var(--olive-darker)' }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
            <button
              className="lg:hidden p-2 transition-opacity"
              style={{ color: 'var(--olive-dark)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" strokeWidth={1.4} /> : <Menu className="w-5 h-5" strokeWidth={1.4} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn('lg:hidden overflow-hidden transition-all duration-300 border-t', mobileOpen ? 'max-h-96' : 'max-h-0')}
        style={{ background: 'var(--cream)', borderColor: 'var(--hairline)' }}
      >
        <nav className="px-4 py-3 flex flex-col gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-label py-2.5 px-2 border-b last:border-0"
              style={{ fontSize: '12px', letterSpacing: '0.15em', color: 'var(--text-primary)', borderColor: 'var(--hairline)' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
