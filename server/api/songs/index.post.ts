import { songService } from '../../services/songService'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name?.trim() || !body.author?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Name and author are required' })
  }

  return songService.create({
    author: body.author.trim(),
    name: body.name.trim(),
    content: body.content ?? '',
  })
})
