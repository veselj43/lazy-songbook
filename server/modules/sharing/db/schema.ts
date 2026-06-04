import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

import { timestamps } from '#server/db/timestamp.helper'
import { MEMBERSHIP_STATUS } from '#shared/schema/sharing'

export const libraryShares = sqliteTable('library_shares', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  ownerUserId: text('owner_user_id').notNull().unique(),
  token: text('token').notNull().unique(),
  ...timestamps,
})

export const libraryMemberships = sqliteTable(
  'library_memberships',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    viewerUserId: text('viewer_user_id').notNull(),
    libraryShareId: text('library_share_id')
      .notNull()
      .references(() => libraryShares.id, { onDelete: 'cascade' }),
    ownerDisplayName: text('owner_display_name'),
    status: text('status', { enum: MEMBERSHIP_STATUS }).notNull().default('default'),
    ...timestamps,
  },
  (t) => [unique('library_memberships_viewer_share_unique').on(t.viewerUserId, t.libraryShareId)],
)
