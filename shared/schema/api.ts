import z from 'zod'

export const paginationRequestSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(50),
})

export type PaginationRequest = z.infer<typeof paginationRequestSchema>
export type PaginationRequestInput = z.input<typeof paginationRequestSchema>

export interface PaginationResponse extends PaginationRequest {
  totalCount: number
  nextPage: number | null
}
