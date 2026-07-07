import { shareSongListRequestBodySchema, type ShareLibraryResponse } from '~~/shared/schema/sharing'

import { sharingService } from '#server/modules/sharing/sharing.service'
import { songService } from '#server/modules/songs/song.service'
import { optionalUserId } from '#server/utils/auth'
import { resolveOwnerDisplayName } from '#server/utils/ownerDisplayName'
import { rateLimit } from '#server/utils/rateLimit'

export default defineEventHandler(async (event): Promise<ShareLibraryResponse> => {
  rateLimit(event, { key: 'share-by-token', limit: 30, windowMs: 60_000 })

  const token = getRouterParam(event, 'token')!
  const share = await sharingService.resolveShareByToken({ token })
  if (!share) {
    throw createError({ statusCode: 404, statusMessage: 'Share not found' })
  }

  const body = await readBody(event)
  const parsed = shareSongListRequestBodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message })
  }

  const ownerDisplayName = await resolveOwnerDisplayName(event, share.ownerUserId)

  const viewerUserId = optionalUserId(event)
  if (viewerUserId && viewerUserId !== share.ownerUserId) {
    await sharingService.upsertMembership({
      viewerUserId,
      libraryShareId: share.id,
      ownerDisplayName,
    })
  }

  const { items, pagination } = await songService.filterForOwner({
    ownerUserId: share.ownerUserId,
    ...parsed.data,
  })

  return {
    ownerDisplayName,
    items,
    pagination,
  }
})
