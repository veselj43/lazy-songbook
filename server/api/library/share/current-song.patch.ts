import { setCurrentSongSchema } from '~~/shared/schema/sharing'

import { sharingService } from '#server/modules/sharing/sharing.service'
import { songService } from '#server/modules/songs/song.service'
import { requireUserId } from '#server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = requireUserId(event)
  const body = await readBody(event)
  const parsed = setCurrentSongSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message,
    })
  }

  if (parsed.data.songId !== null) {
    const owned = await songService.getById({ id: parsed.data.songId, userId })
    if (!owned) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Song not found',
      })
    }
  }

  return await sharingService.setCurrentSong({
    ownerUserId: userId,
    songId: parsed.data.songId,
  })
})
