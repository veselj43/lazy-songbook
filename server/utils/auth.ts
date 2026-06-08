import { createError, type H3Event } from 'h3'

interface ClerkAuthResult {
  userId?: string | null
}

type ClerkAuth = () => ClerkAuthResult

export function optionalUserId(event: H3Event): string | null {
  const auth = event.context.auth as ClerkAuth | undefined
  return auth?.().userId ?? null
}

export function requireUserId(event: H3Event) {
  const userId = optionalUserId(event)

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return userId
}
