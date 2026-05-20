import { songService } from '../../services/songService'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!

  const song = songService.delete(id)
  if (!song) throw createError({ statusCode: 404, statusMessage: 'Song not found' })

  return song
})
