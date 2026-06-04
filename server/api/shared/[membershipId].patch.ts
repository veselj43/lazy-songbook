import { updateMembershipSchema } from '~~/shared/schema/sharing'

import { sharingService } from '../../modules/sharing/sharing.service'
import { requireUserId } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const userId = requireUserId(event)
  const id = getRouterParam(event, 'membershipId')!
  const body = await readBody(event)

  const parsed = updateMembershipSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message,
    })
  }

  const result = sharingService.updateMembership({
    id,
    viewerUserId: userId,
    status: parsed.data.status,
  })
  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Shared library not found',
    })
  }

  return result
})
