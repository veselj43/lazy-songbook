import { updateSongSchema } from '~~/shared/schema/song'

import { songService } from '../../modules/songs/song.service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const body = await readBody(event)
  const bodyResult = updateSongSchema.safeParse(body)
  if (!bodyResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: bodyResult.error.issues[0]?.message,
    })
  }

  const song = songService.update({
    id,
    input: bodyResult.data,
  })

  if (!song) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Song not found',
    })
  }

  return song
})
