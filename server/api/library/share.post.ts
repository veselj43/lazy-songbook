import type { LibraryShare } from '~~/shared/schema/sharing'

import { sharingService } from '#server/modules/sharing/sharing.service'
import { requireUserId } from '#server/utils/auth'

export default defineEventHandler(async (event): Promise<LibraryShare> => {
  const userId = requireUserId(event)
  const share = await sharingService.getOrCreateOwnerShare({ ownerUserId: userId })

  return {
    id: share.id,
    token: share.token,
    currentSongId: share.currentSongId,
    createdAt: share.createdAt,
    updatedAt: share.updatedAt,
  }
})
