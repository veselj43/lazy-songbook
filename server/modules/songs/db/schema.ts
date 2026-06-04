import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { timestamps } from '#server/db/timestamp.helper'

export const songs = sqliteTable('songs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(),
  author: text('author', { length: 50 }).notNull(),
  name: text('name', { length: 100 }).notNull(),
  content: text('content', { length: 10_000 }).notNull().default(''),
  ...timestamps,
})
