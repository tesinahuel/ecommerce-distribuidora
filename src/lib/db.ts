import { Pool } from 'pg'

// Vercel + Neon cargan DATABASE_URL (y variantes POSTGRES_URL). Usamos la primera que exista.
export function findConnectionString(env: NodeJS.ProcessEnv = process.env): string | undefined {
  const direct = env.DATABASE_URL || env.POSTGRES_URL || env.POSTGRES_PRISMA_URL
  if (direct) return direct

  // Al conectar la base, Vercel permite agregarle un prefijo a las variables
  // (por ejemplo STORAGE_DATABASE_URL). Buscamos cualquiera que sirva, salvo las "sin pool".
  const key = Object.keys(env).find(
    (k) =>
      /(DATABASE_URL|POSTGRES_URL)$/.test(k) &&
      !/(UNPOOLED|NON_POOLING)/.test(k) &&
      (env[k] ?? '').startsWith('postgres')
  )
  return key ? env[key] : undefined
}

function getConnectionString(): string {
  const url = findConnectionString()
  if (!url) {
    throw new Error(
      'Falta la base de datos: definí DATABASE_URL (Vercel → Storage → conectar la base al proyecto).'
    )
  }
  return url
}

const globalForDb = globalThis as unknown as {
  __hcPool?: Pool
  __hcSchemaReady?: Promise<void>
}

export function getPool(): Pool {
  if (!globalForDb.__hcPool) {
    globalForDb.__hcPool = new Pool({
      connectionString: getConnectionString(),
      // En serverless conviene pocas conexiones por instancia.
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    })
  }
  return globalForDb.__hcPool
}

// Crea la tabla la primera vez que se usa (no hace falta correr migraciones a mano).
export function ensureSchema(): Promise<void> {
  if (!globalForDb.__hcSchemaReady) {
    globalForDb.__hcSchemaReady = getPool()
      .query(
        `CREATE TABLE IF NOT EXISTS orders (
           id             uuid PRIMARY KEY,
           order_number   text NOT NULL UNIQUE,
           status         text NOT NULL,
           payment_status text NOT NULL,
           total          double precision NOT NULL,
           created_at     timestamptz NOT NULL,
           updated_at     timestamptz NOT NULL,
           data           jsonb NOT NULL
         );
         CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at);`
      )
      .then(() => undefined)
      .catch((err) => {
        // Si falla, permitimos reintentar en el próximo request.
        globalForDb.__hcSchemaReady = undefined
        throw err
      })
  }
  return globalForDb.__hcSchemaReady
}
