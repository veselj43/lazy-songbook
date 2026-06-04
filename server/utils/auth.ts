import { createError, type H3Event } from 'h3'

interface ClerkAuthResult {
  userId?: string | null
}

type ClerkAuth = () => ClerkAuthResult

export function requireUserId(event: H3Event) {
  const auth = event.context.auth as ClerkAuth | undefined
  const userId = auth?.().userId

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return userId
}
