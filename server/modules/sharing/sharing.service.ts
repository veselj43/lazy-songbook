import { randomBytes } from 'node:crypto'

import { and, desc, eq } from 'drizzle-orm'
import type { MembershipStatus, SharedLibraryListItem } from '~~/shared/schema/sharing'

import { db } from '#server/db'
import { songs } from '#server/modules/songs/db/schema'

import { libraryMemberships, libraryShares } from './db/schema'

const TOKEN_BYTES = 9 // → 12 chars base64url, ~72 bits of entropy

function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url')
}

export const sharingService = {
  getOwnerShare({ ownerUserId }: { ownerUserId: string }) {
    const rows = db
      .select()
      .from(libraryShares)
      .where(eq(libraryShares.ownerUserId, ownerUserId))
      .all()

    return rows[0] ?? null
  },

  getOrCreateOwnerShare({ ownerUserId }: { ownerUserId: string }) {
    return db.transaction((tx) => {
      const existing = tx
        .select()
        .from(libraryShares)
        .where(eq(libraryShares.ownerUserId, ownerUserId))
        .all()

      if (existing[0]) return existing[0]

      const inserted = tx
        .insert(libraryShares)
        .values({
          ownerUserId,
          token: generateToken(),
        })
        .returning()
        .all()

      return inserted[0]!
    })
  },

  revokeOwnerShare({ ownerUserId }: { ownerUserId: string }) {
    const result = db
      .delete(libraryShares)
      .where(eq(libraryShares.ownerUserId, ownerUserId))
      .returning()
      .all()

    return result[0] ?? null
  },

  resolveShareByToken({ token }: { token: string }) {
    const rows = db.select().from(libraryShares).where(eq(libraryShares.token, token)).all()

    return rows[0] ?? null
  },

  resolveShareStatusByToken({ token }: { token: string }) {
    const rows = db
      .select({
        id: libraryShares.id,
        createdAt: libraryShares.createdAt,
        currentSongId: libraryShares.currentSongId,
        currentSongAuthor: songs.author,
        currentSongName: songs.name,
        ownerUserId: libraryShares.ownerUserId,
        token: libraryShares.token,
        updatedAt: libraryShares.updatedAt,

      })
      .from(libraryShares)
      .where(eq(libraryShares.token, token))
      .rightJoin(songs, eq(libraryShares.currentSongId, songs.id))
      .all()

    return rows[0] ?? null
  },

  setCurrentSong({ ownerUserId, songId }: { ownerUserId: string; songId: string | null }) {
    return db.transaction((tx) => {
      if (songId === null) {
        const updated = tx
          .update(libraryShares)
          .set({ currentSongId: null, updatedAt: new Date().toISOString() })
          .where(eq(libraryShares.ownerUserId, ownerUserId))
          .returning()
          .all()

        return updated[0] ?? null
      }

      const existing = tx
        .select()
        .from(libraryShares)
        .where(eq(libraryShares.ownerUserId, ownerUserId))
        .all()

      if (!existing[0]) {
        const inserted = tx
          .insert(libraryShares)
          .values({
            ownerUserId,
            token: generateToken(),
            currentSongId: songId,
          })
          .returning()
          .all()

        return inserted[0]!
      }

      const updated = tx
        .update(libraryShares)
        .set({ currentSongId: songId, updatedAt: new Date().toISOString() })
        .where(eq(libraryShares.id, existing[0].id))
        .returning()
        .all()

      return updated[0]!
    })
  },

  upsertMembership({
    viewerUserId,
    libraryShareId,
    ownerDisplayName,
  }: {
    viewerUserId: string
    libraryShareId: string
    ownerDisplayName: string | null
  }) {
    return db.transaction((tx) => {
      const existing = tx
        .select()
        .from(libraryMemberships)
        .where(
          and(
            eq(libraryMemberships.viewerUserId, viewerUserId),
            eq(libraryMemberships.libraryShareId, libraryShareId),
          ),
        )
        .all()

      if (existing[0]) {
        const nextStatus: MembershipStatus =
          existing[0].status === 'dismissed' ? 'default' : existing[0].status
        const updated = tx
          .update(libraryMemberships)
          .set({
            ownerDisplayName,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(libraryMemberships.id, existing[0].id))
          .returning()
          .all()

        return updated[0]!
      }

      const inserted = tx
        .insert(libraryMemberships)
        .values({
          viewerUserId,
          libraryShareId,
          ownerDisplayName,
        })
        .returning()
        .all()

      return inserted[0]!
    })
  },

  listMembershipsForViewer({
    viewerUserId,
    includeDismissed,
  }: {
    viewerUserId: string
    includeDismissed: boolean
  }): SharedLibraryListItem[] {
    const conditions = [eq(libraryMemberships.viewerUserId, viewerUserId)]
    if (!includeDismissed) {
      conditions.push(eq(libraryMemberships.status, 'default'))
    }

    return db
      .select({
        id: libraryMemberships.id,
        token: libraryShares.token,
        ownerDisplayName: libraryMemberships.ownerDisplayName, // TODO move to library shares and join from there
        status: libraryMemberships.status,
        createdAt: libraryMemberships.createdAt,
        updatedAt: libraryMemberships.updatedAt,
      })
      .from(libraryMemberships)
      .innerJoin(libraryShares, eq(libraryMemberships.libraryShareId, libraryShares.id))
      .where(and(...conditions))
      .orderBy(desc(libraryMemberships.updatedAt))
      .all()
  },

  updateMembership({
    id,
    viewerUserId,
    status,
  }: {
    id: string
    viewerUserId: string
    status: MembershipStatus
  }) {
    const result = db
      .update(libraryMemberships)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(and(eq(libraryMemberships.id, id), eq(libraryMemberships.viewerUserId, viewerUserId)))
      .returning()
      .all()

    return result[0] ?? null
  },

  deleteMembership({ id, viewerUserId }: { id: string; viewerUserId: string }) {
    const result = db
      .delete(libraryMemberships)
      .where(and(eq(libraryMemberships.id, id), eq(libraryMemberships.viewerUserId, viewerUserId)))
      .returning()
      .all()

    return result[0] ?? null
  },
}
