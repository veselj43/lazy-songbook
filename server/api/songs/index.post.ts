import { createSongSchema } from '~~/shared/types/song'

import { songService } from '../../modules/songs/song.service'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = createSongSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message })
  }

  return songService.create(parsed.data)
})
