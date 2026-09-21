import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, Package, Leaf, LogOut } from 'lucide-react'
import AdminLogoutButton from '@/components/layout/AdminLogoutButton'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/productos', label: 'Productos', icon: Package },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-gray-900 text-gray-300 min-h-screen fixed top-0 left-0">
        <div className="p-5 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-white">
            <div className="bg-green-700 p-1.5 rounded-lg">
              <Leaf className="w-4 h-4 text-green-200" />
            </div>
            Panel Admin
          </Link>
        </div>
        <nav className="flex-1 p-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 hover:text-white transition-colors mb-0.5"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-300">
            <LogOut className="w-4 h-4" />
            Ver tienda
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-60">
        {/* Mobile nav */}
        <div className="md:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="font-bold flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-400" /> Panel Admin
          </Link>
          <div className="flex gap-4 text-sm">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="text-gray-400 hover:text-white">{label}</Link>
            ))}
          </div>
        </div>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
