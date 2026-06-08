import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { libraryMemberships, libraryShares } from '#server/modules/sharing/db/schema'
import { songs } from '#server/modules/songs/db/schema'

const schema = {
  songs,
  libraryShares,
  libraryMemberships,
}

function createDb() {
  const { dbConnectionString } = useRuntimeConfig()

  if (!dbConnectionString) {
    throw new Error('DB: DATABASE_URL is required')
  }

  const client = postgres(dbConnectionString, {
    prepare: false,
  })

  return drizzle(client, { schema })
}

let db: ReturnType<typeof createDb> | null = null

export function getDb() {
  db ??= createDb()
  return db
}
