import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users } from './drizzle/schema'

const connectionString = process.env.DATABASE_URL || ''

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

export const allUsers = connectionString && !connectionString.includes('[YOUR-PASSWORD]')
  ? await db.select().from(users).catch((err) => {
      console.warn('[Drizzle] Could not query users table:', err.message)
      return []
    })
  : []

export { db, client, users }
