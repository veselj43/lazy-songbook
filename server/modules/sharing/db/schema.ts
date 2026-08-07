import { index, pgEnum, pgTable, text, unique, uuid, varchar } from 'drizzle-orm/pg-core'

import { MEMBERSHIP_STATUS } from '../../../../shared/schema/sharing'
import { timestamps } from '../../../db/timestamp.helper'
import { songs } from '../../songs/db/schema'

export const membershipStatus = pgEnum('membership_status', MEMBERSHIP_STATUS)

export const libraryShares = pgTable(
  'library_shares',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    ownerUserId: text('owner_user_id').notNull().unique(),
    token: text('token').notNull().unique(),
    currentSongId: uuid('current_song_id').references(() => songs.id, { onDelete: 'set null' }),
    ...timestamps,
  },
  (t) => [
    //
    index('ownerUserId_idx').on(t.ownerUserId),
    index('token_idx').on(t.token),
  ],
)

export const libraryMemberships = pgTable(
  'library_memberships',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    viewerUserId: varchar('viewer_user_id', { length: 32 }).notNull(),
    libraryShareId: uuid('library_share_id')
      .notNull()
      .references(() => libraryShares.id, { onDelete: 'cascade' }),
    ownerDisplayName: text('owner_display_name'),
    status: membershipStatus('status').notNull().default('default'),
    ...timestamps,
  },
  (t) => [
    //
    unique('library_memberships_viewer_share_unique').on(t.viewerUserId, t.libraryShareId),
  ],
)
