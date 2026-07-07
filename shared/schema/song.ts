import { z } from 'zod'

import { paginationRequestSchema, type PaginationResponse } from './api'

export const songSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  author: z.string(),
  name: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const createSongSchema = z.object({
  author: z.string().trim().min(1),
  name: z.string().trim().min(1),
  content: z.string().default(''),
})

export const updateSongSchema = z.object({
  author: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  content: z.string().optional(),
})

export type Song = z.infer<typeof songSchema>
export type SongListItem = Omit<Song, 'content'>
export type CreateSongInput = z.infer<typeof createSongSchema>
export type UpdateSongInput = z.infer<typeof updateSongSchema>

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
