import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import { songs } from '../modules/songs/db/schema'

const sqlite = new Database('songbook.db')
sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite, {
  schema: {
    songs,
  },
})
