import { sharingService } from '#server/modules/sharing/sharing.service'
import { requireUserId } from '#server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = requireUserId(event)
  await sharingService.revokeOwnerShare({ ownerUserId: userId })

  return {
    revoked: true,
  }
})
