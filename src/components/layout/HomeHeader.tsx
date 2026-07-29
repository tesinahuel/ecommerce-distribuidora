'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Heart, ShoppingCart, Menu, X, ChevronDown, Leaf } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { CATEGORIES } from '@/data/categories'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Productos', dropdown: true },
  { href: '/catalogo#packs', label: 'Combos' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#contacto', label: 'Contacto' },
]

export default function HomeHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const { getTotalItems, toggleCart } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <header
      className="sticky top-0 z-50 border-b font-sans-ui"
      style={{ background: 'var(--cream)', borderColor: 'var(--hairline)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center gap-0.5 shrink-0">
            <Leaf className="w-3.5 h-3.5 leaf-ornament" strokeWidth={1.5} />
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                <Image src="/images/logo.png" alt="Huevos Cósmicos" fill className="object-cover" />
              </div>
              <span className="font-display leading-none" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--brown)' }}>
                Huevos Cósmicos
              </span>
            </div>
            <span className="gourmet-eyebrow" style={{ fontSize: '0.6rem', color: 'var(--brown-soft)' }}>
              Despensa Saludable
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.dropdown && setProductsOpen(true)}
                onMouseLeave={() => link.dropdown && setProductsOpen(false)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 text-xs font-medium uppercase px-3 py-2 rounded transition-colors"
                  style={{ letterSpacing: '0.08em', color: 'var(--brown)' }}
                >
                  {link.label}
                  {link.dropdown && <ChevronDown className="w-3 h-3" strokeWidth={1.5} />}
                </Link>
                {link.dropdown && (
                  <div
                    className={cn(
                      'absolute left-0 top-full w-64 rounded-lg overflow-hidden transition-all duration-150',
                      productsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                    )}
                    style={{ background: 'var(--card-white)', boxShadow: '0 12px 30px rgba(61,50,40,0.15)' }}
                  >
                    {CATEGORIES.filter((c) => c.id !== 'packs').map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/catalogo?categoria=${cat.id}`}
                        className="block px-4 py-2.5 text-xs font-medium uppercase hover:bg-[var(--beige)] transition-colors"
                        style={{ letterSpacing: '0.06em', color: 'var(--brown)' }}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button aria-label="Buscar" className="p-2 rounded-lg transition-colors hover:bg-[var(--beige)]" style={{ color: 'var(--brown)' }}>
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button aria-label="Favoritos" className="hidden sm:inline-flex p-2 rounded-lg transition-colors hover:bg-[var(--beige)]" style={{ color: 'var(--brown)' }}>
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={toggleCart}
              aria-label="Carrito"
              className="relative p-2 rounded-lg transition-colors hover:bg-[var(--beige)]"
              style={{ color: 'var(--brown)' }}
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  style={{ background: 'var(--olive-dark)' }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--brown)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              className="py-2.5 px-2 text-xs font-medium uppercase border-b last:border-0"
              style={{ letterSpacing: '0.08em', color: 'var(--brown)', borderColor: 'var(--hairline)' }}
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
