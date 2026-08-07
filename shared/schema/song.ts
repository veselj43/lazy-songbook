import { z } from 'zod'

import { paginationRequestSchema, type PaginationResponse } from './api'

const emptyStringToUndefined = (value?: string) => {
  if (typeof value === 'string' && value.trim() === '') return undefined
  return value
}

const optionalMetadataStringSchema = (maxLength: number) =>
  z.string().trim().max(maxLength).optional().transform(emptyStringToUndefined)

const songMetadataObjectSchema = z.object({
  capo: optionalMetadataStringSchema(15),
  key: optionalMetadataStringSchema(5),
  // tags: z.array(z.string().trim().min(1).max(50)).max(50).default([]),
})

export const songMetadataSchema = songMetadataObjectSchema.nullish().transform(
  (v) =>
    v ?? {
      capo: undefined,
      key: undefined,
      // tags: [],
    },
)

export const songSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  author: z.string(),
  name: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  metadata: songMetadataSchema,
})

export const createSongSchema = z.object({
  author: z.string().trim().min(1),
  name: z.string().trim().min(1),
  content: z.string().default(''),
  metadata: songMetadataSchema,
})

export const updateSongSchema = z.object({
  author: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  content: z.string().optional(),
  metadata: songMetadataSchema,
})

export type Song = z.output<typeof songSchema>
export type SongListItem = Omit<Song, 'content'>

export type SongMetadataInput = z.input<typeof songMetadataSchema>
export type SongMetadata = z.output<typeof songMetadataSchema>

export type CreateSongInput = z.input<typeof createSongSchema>
export type CreateSongData = z.output<typeof createSongSchema>

export type UpdateSongInput = z.input<typeof updateSongSchema>
export type UpdateSongData = z.output<typeof updateSongSchema>

export const SORTABLE_SONG_COLUMNS = [
  'author',
  'name',
  'createdAt',
  'updatedAt',
] as const satisfies (keyof Song)[]
export type SortableSongColumn = (typeof SORTABLE_SONG_COLUMNS)[number]

export const songSortItemSchema = z.object({
  column: z.enum(SORTABLE_SONG_COLUMNS),
  isDesc: z.boolean(),
})
export const songSortSchema = z.array(songSortItemSchema)

export type SongSortItem = z.infer<typeof songSortItemSchema>
export type SongSort = z.infer<typeof songSortSchema>

export const songListRequestBodySchema = paginationRequestSchema.extend({
  sort: songSortSchema.optional(),
  search: z.string().min(2).max(100).optional(),
})

export type SongListRequestBody = z.input<typeof songListRequestBodySchema>

export interface SongListResponse {
  items: SongListItem[]
  pagination: PaginationResponse
}
