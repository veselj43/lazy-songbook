import type { LibraryShare } from '~~/shared/schema/sharing'

import { sharingService } from '#server/modules/sharing/sharing.service'
import { requireUserId } from '#server/utils/auth'

export default defineEventHandler((event): LibraryShare | null => {
  const userId = requireUserId(event)
  const share = sharingService.getOwnerShare({ ownerUserId: userId })
  if (!share) return null

  return {
    id: share.id,
    token: share.token,
    createdAt: share.createdAt,
    updatedAt: share.updatedAt,
  }
})
