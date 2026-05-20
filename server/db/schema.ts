import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const songs = sqliteTable('songs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().default('default-user'),
  author: text('author').notNull(),
  name: text('name').notNull(),
  content: text('content').notNull().default(''),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})
