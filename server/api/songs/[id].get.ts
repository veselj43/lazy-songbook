import { songService } from '../../modules/songs/song.service'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!

  const song = songService.getById(id)
  if (!song) {
    throw createError({ statusCode: 404, statusMessage: 'Song not found' })
  }

  return song
})
