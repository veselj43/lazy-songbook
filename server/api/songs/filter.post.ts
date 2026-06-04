import { z } from 'zod'
import { paginationSchema } from '~~/shared/schema/api'
import { songSortSchema } from '~~/shared/schema/song'

import { songService } from '../../modules/songs/song.service'
import { requireUserId } from '../../utils/auth'

const songListBodySchema = paginationSchema.extend({
  sort: songSortSchema.optional(),
  search: z.string().min(2).max(100).optional(),
})

export default defineEventHandler(async (event) => {
  const userId = requireUserId(event)
  const body = await readBody(event)
  const parsed = songListBodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message,
    })
  }

  return songService.filter({ ...parsed.data, userId })
})
