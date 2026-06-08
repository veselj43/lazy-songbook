import { createSongSchema } from '~~/shared/schema/song'

import { songService } from '#server/modules/songs/song.service'
import { requireUserId } from '#server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = requireUserId(event)
  const body = await readBody(event)

  const parsed = createSongSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message })
  }

  return await songService.create({ input: parsed.data, userId })
})
