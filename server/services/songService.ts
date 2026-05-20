import { eq, and } from 'drizzle-orm'
import { db } from '../db'
import { songs } from '../db/schema'
import type { CreateSongInput, UpdateSongInput } from '~~/shared/types/song'

const DEFAULT_USER_ID = 'default-user'

export const songService = {
  getAll(userId: string = DEFAULT_USER_ID) {
    const items = db.select().from(songs).where(eq(songs.userId, userId)).all()
    return { items }
  },

  getById(id: string, userId: string = DEFAULT_USER_ID) {
    const result = db.select().from(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .all()
    return result[0] ?? null
  },

  create(input: CreateSongInput, userId: string = DEFAULT_USER_ID) {
    const now = new Date().toISOString()
    const result = db.insert(songs).values({
      ...input,
      userId,
      createdAt: now,
      updatedAt: now,
    }).returning().all()
    return result[0]!
  },

  update(id: string, input: UpdateSongInput, userId: string = DEFAULT_USER_ID) {
    const result = db.update(songs)
      .set({ ...input, updatedAt: new Date().toISOString() })
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .returning()
      .all()
    return result[0] ?? null
  },

  delete(id: string, userId: string = DEFAULT_USER_ID) {
    const result = db.delete(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .returning()
      .all()
    return result[0] ?? null
  },
}
