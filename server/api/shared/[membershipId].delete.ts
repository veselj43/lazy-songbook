import { sharingService } from '#server/modules/sharing/sharing.service'
import { requireUserId } from '#server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = requireUserId(event)
  const id = getRouterParam(event, 'membershipId')!

  const result = await sharingService.deleteMembership({ id, viewerUserId: userId })
  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Shared library not found',
    })
  }

  return result
})
