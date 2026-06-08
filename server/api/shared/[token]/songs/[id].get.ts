import type { ShareSongResponse } from '~~/shared/schema/sharing'

import { sharingService } from '#server/modules/sharing/sharing.service'
import { songService } from '#server/modules/songs/song.service'
import { rateLimit } from '#server/utils/rateLimit'

export default defineEventHandler(async (event): Promise<ShareSongResponse> => {
  rateLimit(event, { key: 'share-by-token', limit: 30, windowMs: 60_000 })

  const token = getRouterParam(event, 'token')!
  const id = getRouterParam(event, 'id')!

  const share = await sharingService.resolveShareByToken({ token })
  if (!share) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Share not found',
    })
  }

  const song = await songService.getByIdForOwner({ id, ownerUserId: share.ownerUserId })
  if (!song) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Song not found',
    })
  }

  return {
    id: song.id,
    author: song.author,
    name: song.name,
    content: song.content,
    createdAt: song.createdAt,
    updatedAt: song.updatedAt,
  }
})
