import { and, asc, count, desc, eq, or, sql, type SQL } from 'drizzle-orm'
import type { PaginationResponse } from '~~/shared/schema/api'
import {
  songMetadataSchema,
  type CreateSongData,
  type SongMetadata,
  type SongMetadataInput,
  type SongSort,
  type UpdateSongData,
} from '~~/shared/schema/song'

import { getDb } from '#server/db'

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
  input: CreateSongData
}

interface UpdateParams extends UserScope {
  id: string
  input: UpdateSongData
}

interface DeleteParams extends UserScope {
  id: string
}

function parseSongMetadata(metadata: unknown): SongMetadata {
  return songMetadataSchema.parse(metadata)
}

function withParsedMetadata<T extends { metadata: SongMetadataInput }>(
  song: T,
): Omit<T, 'metadata'> & { metadata: SongMetadata } {
  return {
    ...song,
    metadata: parseSongMetadata(song.metadata),
  }
}

async function buildListQuery({
  conditions,
  sort,
  page,
  pageSize,
}: {
  conditions: SQL[]
  sort?: SongSort
  page: number
  pageSize: number
}) {
  const db = getDb()
  let query = db
    .select({
      id: songs.id,
      userId: songs.userId,
      author: songs.author,
      name: songs.name,
      createdAt: songs.createdAt,
      updatedAt: songs.updatedAt,
      metadata: songs.metadata,
    })
    .from(songs)
    .where(and(...conditions))
    .$dynamic()

  if (sort && sort.length > 0) {
    const orderBy: SQL[] = sort.map((s) => {
      const expr =
        s.column === 'author' || s.column === 'name'
          ? sql`lower(${songs[s.column]})`
          : sql`${songs[s.column]}`
      return s.isDesc ? desc(expr) : asc(expr)
    })
    query = query.orderBy(...orderBy)
  }

  const result = await query.limit(pageSize).offset((page - 1) * pageSize)
  return result.map(withParsedMetadata)
}

function buildListConditions({ ownerCondition, search }: { ownerCondition: SQL; search?: string }) {
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

  return conditions
}

async function countListItems({ conditions }: { conditions: SQL[] }) {
  const result = await getDb()
    .select({ totalCount: count() })
    .from(songs)
    .where(and(...conditions))

  return result[0]?.totalCount ?? 0
}

function buildPagination({
  page,
  pageSize,
  totalCount,
}: {
  page: number
  pageSize: number
  totalCount: number
}): PaginationResponse {
  const hasNextPage = totalCount > page * pageSize

  return {
    page,
    pageSize,
    totalCount,
    nextPage: hasNextPage ? page + 1 : null,
  }
}

export const songService = {
  async filter({ userId, page, pageSize, sort, search }: FilterParams) {
    const conditions = buildListConditions({
      ownerCondition: eq(songs.userId, userId),
      search,
    })
    const [items, totalCount] = await Promise.all([
      buildListQuery({
        conditions,
        sort,
        page,
        pageSize,
      }),
      countListItems({ conditions }),
    ])

    return {
      items,
      pagination: buildPagination({ page, pageSize, totalCount }),
    }
  },

  async filterForOwner({ ownerUserId, page, pageSize, sort, search }: FilterForOwnerParams) {
    const conditions = buildListConditions({
      ownerCondition: eq(songs.userId, ownerUserId),
      search,
    })
    const [items, totalCount] = await Promise.all([
      buildListQuery({
        conditions,
        sort,
        page,
        pageSize,
      }),
      countListItems({ conditions }),
    ])

    return {
      items: items.map((s) => ({
        id: s.id,
        author: s.author,
        name: s.name,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        metadata: s.metadata,
      })),
      pagination: buildPagination({ page, pageSize, totalCount }),
    }
  },

  async getById({ id, userId }: GetByIdParams) {
    const result = await getDb()
      .select()
      .from(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))

    const song = result[0]
    return song ? withParsedMetadata(song) : undefined
  },

  async getByIdForOwner({ id, ownerUserId }: GetByIdForOwnerParams) {
    const result = await getDb()
      .select({
        id: songs.id,
        author: songs.author,
        name: songs.name,
        content: songs.content,
        createdAt: songs.createdAt,
        updatedAt: songs.updatedAt,
        metadata: songs.metadata,
      })
      .from(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, ownerUserId)))

    const song = result[0]
    return song ? withParsedMetadata(song) : undefined
  },

  async create({ input, userId }: CreateParams) {
    const now = new Date().toISOString()
    const result = await getDb()
      .insert(songs)
      .values({
        ...input,
        userId,
        createdAt: now,
        updatedAt: now,
        metadata: parseSongMetadata(input.metadata),
      })
      .returning()

    return withParsedMetadata(result[0]!)
  },

  async update({ id, input, userId }: UpdateParams) {
    const values = {
      ...input,
      ...(input.metadata === undefined ? {} : { metadata: parseSongMetadata(input.metadata) }),
      updatedAt: new Date().toISOString(),
    }
    const result = await getDb()
      .update(songs)
      .set(values)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .returning()

    const song = result[0]
    return song ? withParsedMetadata(song) : undefined
  },

  async delete({ id, userId }: DeleteParams) {
    const result = await getDb()
      .delete(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .returning()

    const song = result[0]
    return song ? withParsedMetadata(song) : undefined
  },
}
