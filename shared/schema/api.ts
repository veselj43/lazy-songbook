import z from 'zod'

export const paginationSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().max(100).optional().default(50),
})

export type Pagination = z.infer<typeof paginationSchema>
