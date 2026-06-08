import { createError, getRequestIP, type H3Event } from 'h3'

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export function rateLimit(
  event: H3Event,
  { key, limit, windowMs }: { key: string; limit: number; windowMs: number },
) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const bucketKey = `${key}:${ip}`
  const now = Date.now()

  const bucket = buckets.get(bucketKey)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs })
    return
  }

  bucket.count += 1
  if (bucket.count > limit) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests',
    })
  }
}
