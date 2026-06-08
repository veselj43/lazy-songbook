import { z } from 'zod'
import { paginationSchema } from '~~/shared/schema/api'
import type { ShareLibraryResponse } from '~~/shared/schema/sharing'
import { songSortSchema } from '~~/shared/schema/song'

import { sharingService } from '#server/modules/sharing/sharing.service'
import { songService } from '#server/modules/songs/song.service'
import { optionalUserId } from '#server/utils/auth'
import { resolveOwnerDisplayName } from '#server/utils/ownerDisplayName'
import { rateLimit } from '#server/utils/rateLimit'

// TODO move to shared
const shareSongListBodySchema = paginationSchema.extend({
  sort: songSortSchema.optional(),
  search: z.string().min(2).max(100).optional(),
})

export default defineEventHandler(async (event): Promise<ShareLibraryResponse> => {
  rateLimit(event, { key: 'share-by-token', limit: 30, windowMs: 60_000 })

  const token = getRouterParam(event, 'token')!
  const share = sharingService.resolveShareByToken({ token })
  if (!share) {
    throw createError({ statusCode: 404, statusMessage: 'Share not found' })
  }

  const body = await readBody(event)
  const parsed = shareSongListBodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message })
  }

  const ownerDisplayName = await resolveOwnerDisplayName(event, share.ownerUserId)

  const viewerUserId = optionalUserId(event)
  if (viewerUserId && viewerUserId !== share.ownerUserId) {
    sharingService.upsertMembership({
      viewerUserId,
      libraryShareId: share.id,
      ownerDisplayName,
    })
  }

  const { items, page, pageSize } = songService.filterForOwner({
    ownerUserId: share.ownerUserId,
    ...parsed.data,
  })

  return {
    ownerDisplayName: ownerDisplayName,
    items,
    page,
    pageSize,
  }
})
