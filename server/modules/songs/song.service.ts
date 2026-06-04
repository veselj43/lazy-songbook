import { eq, and, or, asc, desc, sql, type SQL, SelectedFields } from 'drizzle-orm'
import type { CreateSongInput, SongSort, UpdateSongInput } from '~~/shared/schema/song'

import { db } from '../../db'
import { songs } from './db/schema'

interface UserScope {
  userId: string
}

interface FilterParams extends UserScope {
  page: number
  pageSize: number
  sort?: SongSort
  search?: string
}

interface OwnerScope {
  ownerUserId: string
}

interface FilterForOwnerParams extends OwnerScope {
  page: number
  pageSize: number
  sort?: SongSort
  search?: string
}

interface GetByIdParams extends UserScope {
  id: string
}

interface GetByIdForOwnerParams extends OwnerScope {
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

function buildListQuery({
  ownerCondition,
  sort,
  search,
  page,
  pageSize,
}: {
  ownerCondition: SQL
  sort?: SongSort
  search?: string
  page: number
  pageSize: number
}) {
  const conditions: SQL[] = [ownerCondition]
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

  return query
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .all()
}

export const songService = {
  filter({ userId, page, pageSize, sort, search }: FilterParams) {
    const items = buildListQuery({
      ownerCondition: eq(songs.userId, userId),
      sort,
      search,
      page,
      pageSize,
    })

    return {
      items,
      page,
      pageSize,
    }
  },

  filterForOwner({ ownerUserId, page, pageSize, sort, search }: FilterForOwnerParams) {
    const items = buildListQuery({
      ownerCondition: eq(songs.userId, ownerUserId),
      sort,
      search,
      page,
      pageSize,
    })

    return {
      items: items.map((s) => ({
        id: s.id,
        author: s.author,
        name: s.name,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
      page,
      pageSize,
    }
  },

  getById({ id, userId }: GetByIdParams) {
    const result = db
      .select()
      .from(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .all()

    return result[0]
  },

  getByIdForOwner({ id, ownerUserId }: GetByIdForOwnerParams) {
    const result = db
      .select({
        id: songs.id,
        author: songs.author,
        name: songs.name,
        content: songs.content,
        createdAt: songs.createdAt,
        updatedAt: songs.updatedAt,
      })
      .from(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, ownerUserId)))
      .all()

    return result[0]
  },

  create({ input, userId }: CreateParams) {
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

  update({ id, input, userId }: UpdateParams) {
    const result = db
      .update(songs)
      .set({ ...input, updatedAt: new Date().toISOString() })
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .returning()
      .all()

    return result[0]
  },

  delete({ id, userId }: DeleteParams) {
    const result = db
      .delete(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .returning()
      .all()

    return result[0]
  },
}
