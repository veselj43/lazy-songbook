import { z } from 'zod'

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
export type CreateSongInput = z.infer<typeof createSongSchema>
export type UpdateSongInput = z.infer<typeof updateSongSchema>

export interface SongListResponse {
  items: Song[]
}
