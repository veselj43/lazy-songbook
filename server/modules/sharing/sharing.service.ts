import { randomBytes } from 'node:crypto'

import { and, desc, eq } from 'drizzle-orm'
import type { MembershipStatus, SharedLibraryListItem } from '~~/shared/schema/sharing'

import { getDb } from '#server/db'
import { songs } from '#server/modules/songs/db/schema'

import { libraryMemberships, libraryShares } from './db/schema'

const TOKEN_BYTES = 9 // → 12 chars base64url, ~72 bits of entropy

function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url')
}

export const sharingService = {
  async getOwnerShare({ ownerUserId }: { ownerUserId: string }) {
    const rows = await getDb()
      .select()
      .from(libraryShares)
      .where(eq(libraryShares.ownerUserId, ownerUserId))

    return rows[0] ?? null
  },

  async getOrCreateOwnerShare({ ownerUserId }: { ownerUserId: string }) {
    return await getDb().transaction(async (tx) => {
      const existing = await tx
        .select()
        .from(libraryShares)
        .where(eq(libraryShares.ownerUserId, ownerUserId))

      if (existing[0]) return existing[0]

      const inserted = await tx
        .insert(libraryShares)
        .values({
          ownerUserId,
          token: generateToken(),
        })
        .returning()

      return inserted[0]!
    })
  },

  async revokeOwnerShare({ ownerUserId }: { ownerUserId: string }) {
    const result = await getDb()
      .delete(libraryShares)
      .where(eq(libraryShares.ownerUserId, ownerUserId))
      .returning()

    return result[0] ?? null
  },

  async resolveShareByToken({ token }: { token: string }) {
    const rows = await getDb().select().from(libraryShares).where(eq(libraryShares.token, token))

    return rows[0] ?? null
  },

  async resolveShareStatusByToken({ token }: { token: string }) {
    const rows = await getDb()
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
      .leftJoin(songs, eq(libraryShares.currentSongId, songs.id))
      .where(eq(libraryShares.token, token))

    return rows[0] ?? null
  },

  async setCurrentSong({ ownerUserId, songId }: { ownerUserId: string; songId: string | null }) {
    return await getDb().transaction(async (tx) => {
      if (songId === null) {
        const updated = await tx
          .update(libraryShares)
          .set({ currentSongId: null, updatedAt: new Date().toISOString() })
          .where(eq(libraryShares.ownerUserId, ownerUserId))
          .returning()

        return updated[0] ?? null
      }

      const existing = await tx
        .select()
        .from(libraryShares)
        .where(eq(libraryShares.ownerUserId, ownerUserId))

      if (!existing[0]) {
        const inserted = await tx
          .insert(libraryShares)
          .values({
            ownerUserId,
            token: generateToken(),
            currentSongId: songId,
          })
          .returning()

        return inserted[0]!
      }

      const updated = await tx
        .update(libraryShares)
        .set({ currentSongId: songId, updatedAt: new Date().toISOString() })
        .where(eq(libraryShares.id, existing[0].id))
        .returning()

      return updated[0]!
    })
  },

  async upsertMembership({
    viewerUserId,
    libraryShareId,
    ownerDisplayName,
  }: {
    viewerUserId: string
    libraryShareId: string
    ownerDisplayName: string | null
  }) {
    return await getDb().transaction(async (tx) => {
      const existing = await tx
        .select()
        .from(libraryMemberships)
        .where(
          and(
            eq(libraryMemberships.viewerUserId, viewerUserId),
            eq(libraryMemberships.libraryShareId, libraryShareId),
          ),
        )

      if (existing[0]) {
        const nextStatus: MembershipStatus =
          existing[0].status === 'dismissed' ? 'default' : existing[0].status
        const updated = await tx
          .update(libraryMemberships)
          .set({
            ownerDisplayName,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(libraryMemberships.id, existing[0].id))
          .returning()

        return updated[0]!
      }

      const inserted = await tx
        .insert(libraryMemberships)
        .values({
          viewerUserId,
          libraryShareId,
          ownerDisplayName,
        })
        .returning()

      return inserted[0]!
    })
  },

  async listMembershipsForViewer({
    viewerUserId,
    includeDismissed,
  }: {
    viewerUserId: string
    includeDismissed: boolean
  }): Promise<SharedLibraryListItem[]> {
    const conditions = [eq(libraryMemberships.viewerUserId, viewerUserId)]
    if (!includeDismissed) {
      conditions.push(eq(libraryMemberships.status, 'default'))
    }

    return await getDb()
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
  },

  async updateMembership({
    id,
    viewerUserId,
    status,
  }: {
    id: string
    viewerUserId: string
    status: MembershipStatus
  }) {
    const result = await getDb()
      .update(libraryMemberships)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(and(eq(libraryMemberships.id, id), eq(libraryMemberships.viewerUserId, viewerUserId)))
      .returning()

    return result[0] ?? null
  },

  async deleteMembership({ id, viewerUserId }: { id: string; viewerUserId: string }) {
    const result = await getDb()
      .delete(libraryMemberships)
      .where(and(eq(libraryMemberships.id, id), eq(libraryMemberships.viewerUserId, viewerUserId)))
      .returning()

    return result[0] ?? null
  },
}
