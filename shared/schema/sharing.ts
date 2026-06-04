import { z } from 'zod'

export const MEMBERSHIP_STATUS = ['default', 'dismissed'] as const
export type MembershipStatus = (typeof MEMBERSHIP_STATUS)[number]

export const membershipStatusSchema = z.enum(MEMBERSHIP_STATUS)

export const libraryShareSchema = z.object({
  id: z.string(),
  token: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type LibraryShare = z.infer<typeof libraryShareSchema>

export const updateMembershipSchema = z.object({
  status: membershipStatusSchema,
})
export type UpdateMembershipInput = z.infer<typeof updateMembershipSchema>

export const sharedLibrariesFilterSchema = z.object({
  includeDismissed: z.boolean().optional().default(false),
})
export type SharedLibrariesFilter = z.infer<typeof sharedLibrariesFilterSchema>

export interface SharedLibraryListItem {
  id: string
  token: string
  ownerDisplayName: string | null
  status: MembershipStatus
  createdAt: string
  updatedAt: string
}

export interface SharedLibraryListResponse {
  items: SharedLibraryListItem[]
}

export interface ShareSongListItem {
  id: string
  author: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface ShareLibraryResponse {
  ownerName: string | null
  items: ShareSongListItem[]
  page: number
  pageSize: number
}

export interface ShareSongResponse {
  id: string
  author: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
}
