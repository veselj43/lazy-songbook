import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import { libraryMemberships, libraryShares } from '../modules/sharing/db/schema'
import { songs } from '../modules/songs/db/schema'

const sqlite = new Database('songbook.db')
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, {
  schema: {
    songs,
    libraryShares,
    libraryMemberships,
  },
})
