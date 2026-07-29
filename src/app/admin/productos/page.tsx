import { PRODUCTS } from '@/data/products'
import { CATEGORIES } from '@/data/categories'
import { formatPrice } from '@/lib/utils'

export default function AdminProductsPage() {
  const categories = CATEGORIES

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 text-sm mt-1">{PRODUCTS.length} productos en el catálogo</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <strong>Nota:</strong> Los productos están definidos en <code className="bg-amber-100 px-1 rounded">src/data/products.ts</code>.
        Para editar precios, stock o agregar nuevos productos, modificá ese archivo.
        En una versión futura podés conectar una base de datos con panel de edición completo.
      </div>

      {categories.map((cat) => {
        const catProducts = PRODUCTS.filter((p) => p.category === cat.id)
        return (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
            <div className={`flex items-center gap-2 px-5 py-3 border-b border-gray-50 ${cat.bgColor}`}>
              <span className="text-xl">{cat.icon}</span>
              <h2 className={`font-bold ${cat.color}`}>{cat.name}</h2>
              <span className="text-xs text-gray-400 ml-1">({catProducts.length} productos)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    <th className="text-left px-5 py-3">Producto</th>
                    <th className="text-left px-5 py-3">Precio</th>
                    <th className="text-left px-5 py-3">Unidad</th>
                    <th className="text-left px-5 py-3">Stock</th>
                    <th className="text-left px-5 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {catProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{p.name}</p>
                        {p.brand && <p className="text-xs text-gray-400">{p.brand}</p>}
                      </td>
                      <td className="px-5 py-3 font-medium">{formatPrice(p.price)}</td>
                      <td className="px-5 py-3 text-gray-500">{p.unit}</td>
                      <td className="px-5 py-3">
                        <span className={`font-medium ${p.stock > 50 ? 'text-green-600' : p.stock > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5">
                          {p.active && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Activo</span>}
                          {p.featured && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">Destacado</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
