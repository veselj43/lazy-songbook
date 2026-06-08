import type { SharedLibraryListResponse } from '~~/shared/schema/sharing'
import { sharedLibrariesFilterSchema } from '~~/shared/schema/sharing'

import { sharingService } from '#server/modules/sharing/sharing.service'
import { requireUserId } from '#server/utils/auth'

export default defineEventHandler(async (event): Promise<SharedLibraryListResponse> => {
  const userId = requireUserId(event)
  const body = await readBody(event)
  const parsed = sharedLibrariesFilterSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message,
    })
  }

  const items = sharingService.listMembershipsForViewer({
    viewerUserId: userId,
    includeDismissed: parsed.data.includeDismissed,
  })

  return {
    items,
  }
})
