import { updateSongSchema } from '~~/shared/types/song'

import { songService } from '../../modules/songs/song.service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const body = await readBody(event)
  const parsed = updateSongSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message })
  }

  const song = songService.update(id, parsed.data)
  if (!song) {
    throw createError({ statusCode: 404, statusMessage: 'Song not found' })
  }

  return song
})
