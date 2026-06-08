import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'

import { timestamps } from '../../../db/timestamp.helper'

export const songs = pgTable('songs', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 32 }).notNull(),
  author: varchar('author', { length: 50 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  content: varchar('content', { length: 10_000 }).notNull().default(''),
  ...timestamps,
})
