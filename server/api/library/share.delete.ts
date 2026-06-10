import { shareStatusEvents } from '#server/modules/sharing/share-status.events'
import { sharingService } from '#server/modules/sharing/sharing.service'
import { requireUserId } from '#server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = requireUserId(event)
  const revokedShare = await sharingService.revokeOwnerShare({ ownerUserId: userId })

  if (revokedShare?.token) {
    shareStatusEvents.publishRevoked({ token: revokedShare.token })
  }

  return {
    revoked: !!revokedShare,
  }
})
