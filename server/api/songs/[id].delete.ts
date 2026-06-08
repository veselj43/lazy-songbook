import { songService } from '#server/modules/songs/song.service'
import { requireUserId } from '#server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = requireUserId(event)
  const id = getRouterParam(event, 'id')!

  const song = await songService.delete({ id, userId })
  if (!song) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Song not found',
    })
  }

  return song
})
