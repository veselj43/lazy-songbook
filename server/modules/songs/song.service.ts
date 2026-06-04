import { eq, and, or, asc, desc, sql, type SQL } from 'drizzle-orm'
import type { CreateSongInput, SongSort, UpdateSongInput } from '~~/shared/schema/song'

import { db } from '../../db'
import { songs } from './db/schema'

const DEFAULT_USER_ID = 'default-user'

interface UserScope {
  userId?: string
}

interface FilterParams extends UserScope {
  page: number
  pageSize: number
  sort?: SongSort
  search?: string
}

interface GetByIdParams extends UserScope {
  id: string
}

interface CreateParams extends UserScope {
  input: CreateSongInput
}

interface UpdateParams extends UserScope {
  id: string
  input: UpdateSongInput
}

interface DeleteParams extends UserScope {
  id: string
}

export const songService = {
  filter({ userId = DEFAULT_USER_ID, page, pageSize, sort, search }: FilterParams) {
    const conditions: SQL[] = [eq(songs.userId, userId)]
    const trimmedSearch = search?.trim()
    if (trimmedSearch) {
      const term = `%${trimmedSearch.replace(/[\\%_]/g, '\\$&').toLowerCase()}%`
      conditions.push(
        or(
          sql`lower(${songs.name}) LIKE ${term} ESCAPE '\\'`,
          sql`lower(${songs.author}) LIKE ${term} ESCAPE '\\'`,
        )!,
      )
    }

    let query = db
      .select({
        id: songs.id,
        userId: songs.userId,
        author: songs.author,
        name: songs.name,
        createdAt: songs.createdAt,
        updatedAt: songs.updatedAt,
      })
      .from(songs)
      .where(and(...conditions))
      .$dynamic()

    if (sort && sort.length > 0) {
      const orderBy: SQL[] = sort.map((s) => {
        const expr = sql`${songs[s.column]} COLLATE NOCASE`
        return s.isDesc ? desc(expr) : asc(expr)
      })
      query = query.orderBy(...orderBy)
    }

    const items = query
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .all()

    return {
      items,
      page,
      pageSize,
    }
  },

  getById({ id, userId = DEFAULT_USER_ID }: GetByIdParams) {
    const result = db
      .select()
      .from(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .all()
    return result[0]
  },

  create({ input, userId = DEFAULT_USER_ID }: CreateParams) {
    const now = new Date().toISOString()
    const result = db
      .insert(songs)
      .values({
        ...input,
        userId,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .all()
    return result[0]!
  },

  update({ id, input, userId = DEFAULT_USER_ID }: UpdateParams) {
    const result = db
      .update(songs)
      .set({ ...input, updatedAt: new Date().toISOString() })
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .returning()
      .all()
    return result[0]
  },

  delete({ id, userId = DEFAULT_USER_ID }: DeleteParams) {
    const result = db
      .delete(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .returning()
      .all()
    return result[0]
  },
}
