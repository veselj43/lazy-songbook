import { index, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import type { Song } from '~~/shared/schema/song'

import { timestamps } from '../../../db/timestamp.helper'

export const songs = pgTable(
  'songs',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar('user_id', { length: 32 }).notNull(),
    author: varchar('author', { length: 50 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    content: varchar('content', { length: 10_000 }).notNull().default(''),
    metadata: jsonb().$type<Song['metadata']>(),
    ...timestamps,
  },
  (t) => [
    index('userId_idx').on(t.userId),
    index('author_idx').on(t.author),
    index('name_idx').on(t.name),
  ],
)
