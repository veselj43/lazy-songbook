import { songService } from '../../modules/songs/song.service'
import { requireUserId } from '../../utils/auth'

export default defineEventHandler((event) => {
  const userId = requireUserId(event)
  const id = getRouterParam(event, 'id')!

  const song = songService.getById({ id, userId })
  if (!song) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Song not found',
    })
  }

  return song
})
