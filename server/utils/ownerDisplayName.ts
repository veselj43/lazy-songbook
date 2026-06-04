import { clerkClient } from '@clerk/nuxt/server'
import type { H3Event } from 'h3'

export async function resolveOwnerDisplayName(
  event: H3Event,
  ownerUserId: string,
): Promise<string | null> {
  try {
    const user = await clerkClient(event).users.getUser(ownerUserId)

    if (user.username) return user.username

    const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
    if (full) return full

    return null
  } catch {
    return null
  }
}
