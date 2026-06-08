import type { ShareLibraryStatusResponse } from '~~/shared/schema/sharing'

import { sharingService } from '#server/modules/sharing/sharing.service'

// for some reason route /api/shared/[token]/status.get.ts does not work
export default defineEventHandler(async (event): Promise<ShareLibraryStatusResponse> => {
  rateLimit(event, { key: 'share-status', limit: 30, windowMs: 60_000 })

  const token = getRouterParam(event, 'token')!
  const share = sharingService.resolveShareStatusByToken({ token })
  if (!share) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Share not found',
    })
  }

  return {
    id: share.id!,
    createdAt: share.createdAt!,
    currentSongId: share.currentSongId,
    currentSongAuthor: share.currentSongAuthor,
    currentSongName: share.currentSongName,
    ownerUserId: share.ownerUserId!,
    token: share.token!,
    updatedAt: share.updatedAt!,
  }
})
