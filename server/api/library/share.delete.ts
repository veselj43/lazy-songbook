import { sharingService } from '#server/modules/sharing/sharing.service'
import { requireUserId } from '#server/utils/auth'

export default defineEventHandler((event) => {
  const userId = requireUserId(event)
  sharingService.revokeOwnerShare({ ownerUserId: userId })

  return {
    revoked: true,
  }
})
