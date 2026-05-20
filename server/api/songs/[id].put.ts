import { songService } from '../../services/songService'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const body = await readBody(event)
  const song = songService.update(id, {
    author: body.author?.trim(),
    name: body.name?.trim(),
    content: body.content,
  })

  if (!song) throw createError({ statusCode: 404, statusMessage: 'Song not found' })

  return song
})
