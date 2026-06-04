import { sharingService } from '../../modules/sharing/sharing.service'
import { requireUserId } from '../../utils/auth'

export default defineEventHandler((event) => {
  const userId = requireUserId(event)
  const id = getRouterParam(event, 'membershipId')!

  const result = sharingService.deleteMembership({ id, viewerUserId: userId })
  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Shared library not found',
    })
  }

  return result
})
