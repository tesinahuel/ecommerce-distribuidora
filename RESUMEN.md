# Resumen del proyecto — Distribuidora Natural E-commerce

## Stack
- **Next.js 16** App Router + TypeScript
- **Tailwind CSS** (mobile-first)
- **Zustand** (carrito, persistido en localStorage)
- **Zod + React Hook Form** (validación de checkout)
- **Pedidos** guardados en `data/orders.json` (archivo local JSON, sin base de datos)

---

## 1. Lo que ya está construido

### Páginas de la tienda (`/`)
| Ruta | Descripción |
|---|---|
| `/` | Home con hero, grilla de categorías y productos destacados |
| `/catalogo` | Catálogo completo con filtro por categoría y búsqueda |
| `/catalogo/[slug]` | Detalle de producto con selector de cantidad |
| `/carrito` | Carrito con edición de cantidades y resumen |
| `/checkout` | Formulario completo: datos, envío, pago |
| `/pedidos/[orderNumber]` | Confirmación y seguimiento del pedido para el cliente |

### Panel de administración (`/admin`)
| Ruta | Descripción |
|---|---|
| `/admin` | Dashboard con stats: pedidos totales, pendientes, ingresos |
| `/admin/pedidos` | Listado de todos los pedidos con estado y pago |
| `/admin/pedidos/[id]` | Detalle del pedido + cambio de estado desde un select |
| `/admin/productos` | Vista del catálogo agrupado por categoría |

### API Routes (`/api`)
| Endpoint | Método | Descripción |
|---|---|---|
| `/api/products` | GET | Lista productos (filtros: `categoria`, `buscar`, `destacados`) |
| `/api/orders` | GET | Lista todos los pedidos |
| `/api/orders` | POST | Crea un nuevo pedido |
| `/api/orders/[id]` | GET | Obtiene pedido por ID o número de orden |
| `/api/orders/[id]` | PATCH | Actualiza estado del pedido |

### Funcionalidades implementadas
- **Catálogo** con 24 productos en 7 líneas, filtro por categoría y búsqueda de texto
- **Carrito** con drawer deslizante, persistido entre sesiones (localStorage)
- **Checkout** con 3 métodos de pago: Transferencia bancaria / Efectivo / Coordinar por WhatsApp
- **Zonas de envío GBA**: CABA, Norte, Sur, Oeste, Este + Retiro en local
- **Envío gratis** automático al superar el monto mínimo por zona
- **Página de confirmación** con banner contextual según método de pago elegido
- **Panel admin** con gestión de estados: pendiente → confirmado → en preparación → enviado → entregado
- **Botón WhatsApp** flotante en toda la tienda
- **Footer** con datos de contacto, horarios y links al catálogo

---

## 2. Lo que falta completar

### Urgente / antes de salir a producción
- [ ] **Datos reales** del negocio en `src/data/shipping.ts` → `STORE_ADDRESS`: dirección, teléfono, WhatsApp, email, horario
- [ ] **CBU/Alias** para transferencia: agregar en `src/app/(store)/checkout/page.tsx` en la descripción del método `transferencia` y en `src/app/(store)/pedidos/[orderNumber]/page.tsx` en el banner de instrucciones
- [ ] **Imágenes de productos**: reemplazar los emojis por fotos reales. Ver sección de archivos clave más abajo.
- [ ] **Precios actualizados**: editar `src/data/products.ts` con los precios reales
- [ ] **Número de WhatsApp** real: buscar y reemplazar `5491112345678` en todos los archivos (hay ocurrencias en `src/data/shipping.ts`, `src/components/shared/WhatsAppButton.tsx`, `src/components/catalog/ProductCard.tsx` y varias páginas)

### Mejoras importantes
- [ ] **Autenticación del panel admin**: actualmente `/admin` es público. Agregar middleware con contraseña o NextAuth
- [ ] **Notificaciones al vender**: enviar email o WhatsApp automático al dueño cuando llega un pedido nuevo
- [ ] **Notificación al cliente**: email de confirmación al crear un pedido (Resend, Nodemailer o similar)
- [ ] **Base de datos real**: reemplazar `data/orders.json` por Prisma + SQLite o PostgreSQL para no perder datos al deployar
- [ ] **Imágenes con Next/Image**: una vez que tengas fotos reales, usar el componente `<Image>` de Next.js para optimización automática

### Mejoras opcionales / futuras
- [ ] Paginación en el catálogo (actualmente muestra todos los productos)
- [ ] Panel de edición de productos desde el admin (actualmente solo se ven, hay que editar el archivo)
- [ ] Historial de pedidos por cliente (buscar por email o teléfono)
- [ ] Descuentos y precios mayoristas diferenciados por usuario
- [ ] Integración con sistema de stock real

---

## 3. Archivos clave y para qué modificarlos

### Datos del negocio
```
src/data/shipping.ts        → STORE_ADDRESS: dirección, tel, WhatsApp, email, horario
                            → SHIPPING_ZONES: zonas GBA, precios de envío, monto para envío gratis
```

### Catálogo de productos
```
src/data/products.ts        → Todos los productos: nombre, precio, stock, descripción, tags
                            → Agregar productos: copiar la estructura de cualquier objeto existente
                            → featured: true/false controla los destacados del home
                            → active: false oculta el producto sin borrarlo
```

### Categorías
```
src/data/categories.ts      → Nombres, íconos (emoji) y colores de cada línea
```

### Imágenes de productos
```
public/images/products/     → Carpeta donde van las fotos (crearla)
src/components/catalog/ProductCard.tsx  → Línea ~22: reemplazar el emoji por <Image src={product.images[0]} ... />
src/app/(store)/catalogo/[slug]/page.tsx → Línea ~43: ídem para el detalle
```

### Datos bancarios (transferencia)
```
src/app/(store)/checkout/page.tsx           → Línea ~185: texto del banner de transferencia (agregar CBU/alias)
src/app/(store)/pedidos/[orderNumber]/page.tsx → Línea ~47: instrucciones post-compra (agregar CBU/alias)
```

### WhatsApp
```
src/data/shipping.ts                        → STORE_ADDRESS.whatsapp: número sin + ni espacios
src/components/shared/WhatsAppButton.tsx    → Usa STORE_ADDRESS.whatsapp automáticamente
src/components/catalog/ProductCard.tsx      → Línea ~58: número hardcodeado (migrar a STORE_ADDRESS)
src/app/(store)/catalogo/[slug]/page.tsx    → Línea ~74: ídem
```

### Layout y diseño
```
src/components/layout/Header.tsx    → Logo, nombre del negocio, links de navegación
src/components/layout/Footer.tsx    → Info de contacto (usa STORE_ADDRESS automáticamente)
src/app/layout.tsx                  → Título y descripción SEO del sitio (metadata)
```

### Pedidos (almacenamiento)
```
src/lib/orders.ts           → Lógica de lectura/escritura en data/orders.json
data/orders.json            → Archivo generado automáticamente con todos los pedidos
                            → OJO: si cambiás de hosting o redesployás, este archivo se pierde
                            → Para producción real: migrar a base de datos
```

### Estilos globales
```
src/app/globals.css         → Variables CSS y utilidades globales
tailwind.config.ts          → Configuración de Tailwind (colores, fuentes, etc.)
```

---

## Cómo retomar en una nueva sesión

1. Abrir el proyecto en `C:\Users\nahue\ecommerce-distribuidora`
2. `npm run dev` → http://localhost:3000
3. El servidor de dev arranca en ~400ms (Turbopack)
4. Los pedidos de prueba están en `data/orders.json` (se crea al hacer el primer pedido)

## Deploy recomendado
- **Vercel** (gratis para proyectos personales, soporte nativo para Next.js)
- Conectar el repo de GitHub y deployar con un click
- Antes del deploy: reemplazar `data/orders.json` por una base de datos (Vercel tiene Postgres integrado)
