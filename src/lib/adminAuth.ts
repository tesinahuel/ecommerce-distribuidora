// Autenticación simple del panel admin: una contraseña (ADMIN_PASSWORD) y una cookie firmada.
// Usa Web Crypto para que funcione igual en el proxy y en las rutas del servidor.

export const ADMIN_COOKIE = 'hc_admin'
export const ADMIN_SESSION_SECONDS = 60 * 60 * 24 * 7 // 7 días

const encoder = new TextEncoder()

function getSecret(): string | null {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null // sin contraseña configurada, el panel queda cerrado para todos
  return (process.env.ADMIN_SESSION_SECRET ?? password) + '|hc-admin-session'
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('')
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function passwordMatches(input: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  // Comparamos hashes del mismo largo para no filtrar información por tiempos de respuesta.
  const [a, b] = await Promise.all([hmacHex('cmp', input), hmacHex('cmp', password)])
  return safeEqual(a, b)
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret()
  if (!secret) throw new Error('Falta ADMIN_PASSWORD')
  const expires = Date.now() + ADMIN_SESSION_SECONDS * 1000
  return `${expires}.${await hmacHex(secret, String(expires))}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  const secret = getSecret()
  if (!secret || !token) return false
  const [expires, signature] = token.split('.')
  if (!expires || !signature || !/^\d+$/.test(expires)) return false
  if (Number(expires) < Date.now()) return false
  return safeEqual(signature, await hmacHex(secret, expires))
}

/** Para rutas de la API: lee la cookie del pedido entrante. */
export async function isAdminRequest(request: Request): Promise<boolean> {
  const header = request.headers.get('cookie') ?? ''
  const match = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${ADMIN_COOKIE}=`))
  return verifySessionToken(match ? decodeURIComponent(match.slice(ADMIN_COOKIE.length + 1)) : null)
}
