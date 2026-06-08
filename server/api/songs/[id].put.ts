import { updateSongSchema } from '~~/shared/schema/song'

import { songService } from '#server/modules/songs/song.service'
import { requireUserId } from '#server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = requireUserId(event)
  const id = getRouterParam(event, 'id')!

  const body = await readBody(event)
  const bodyResult = updateSongSchema.safeParse(body)
  if (!bodyResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: bodyResult.error.issues[0]?.message,
    })
  }

  const song = await songService.update({
    id,
    input: bodyResult.data,
    userId,
  })

  if (!song) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Song not found',
    })
  }

  return song
})
