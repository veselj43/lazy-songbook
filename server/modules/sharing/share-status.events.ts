import { z } from 'zod'
import type { ShareLibraryStatusResponse } from '~~/shared/schema/sharing'

import { getDbSql } from '#server/db'

export const SHARE_STATUS_CHANNEL = 'lazy_songbook_share_status'

export type ShareStatusEvent =
  | {
      type: 'status'
      status: ShareLibraryStatusResponse
    }
  | {
      type: 'revoked'
      error: {
        statusCode: 404
        statusMessage: 'Share not found'
      }
    }

type ShareStatusListener = (event: ShareStatusEvent) => void | Promise<void>

interface ShareStatusSql {
  listen(channel: string, onnotify: (payload: string) => void): Promise<unknown>
  notify(channel: string, payload: string): Promise<unknown>
}

const shareLibraryStatusResponseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  currentSongId: z.string().nullable(),
  currentSongAuthor: z.string().nullable(),
  currentSongName: z.string().nullable(),
  ownerUserId: z.string(),
  token: z.string(),
  updatedAt: z.string(),
})

const shareStatusNotificationSchema = z.discriminatedUnion('type', [
  z.object({
    token: z.string(),
    type: z.literal('status'),
    status: shareLibraryStatusResponseSchema,
  }),
  z.object({
    token: z.string(),
    type: z.literal('revoked'),
  }),
])

export type ShareStatusNotification = z.infer<typeof shareStatusNotificationSchema>

export function parseShareStatusNotification(payload: string): ShareStatusNotification | null {
  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(payload)
  } catch (error) {
    console.warn('Invalid share status notification JSON.', error)
    return null
  }

  const parsed = shareStatusNotificationSchema.safeParse(parsedJson)
  if (!parsed.success) {
    console.warn('Invalid share status notification payload.', parsed.error)
    return null
  }

  return parsed.data
}

export function toShareStatusEvent(notification: ShareStatusNotification): ShareStatusEvent {
  if (notification.type === 'status') {
    return {
      type: 'status',
      status: notification.status,
    }
  }

  return {
    type: 'revoked',
    error: {
      statusCode: 404,
      statusMessage: 'Share not found',
    },
  }
}

export class ShareStatusEventBus {
  private readonly listenersByToken = new Map<string, Set<ShareStatusListener>>()
  private listenPromise: Promise<void> | null = null

  constructor(private readonly getSql: () => ShareStatusSql = getDbSql) {}

  async subscribe({
    token,
    listener,
  }: {
    token: string
    listener: ShareStatusListener
  }): Promise<() => void> {
    let listeners = this.listenersByToken.get(token)
    if (!listeners) {
      listeners = new Set()
      this.listenersByToken.set(token, listeners)
    }

    listeners.add(listener)

    try {
      await this.ensureListening()
    } catch (error) {
      listeners.delete(listener)
      if (listeners.size === 0) {
        this.listenersByToken.delete(token)
      }

      throw error
    }

    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) {
        this.listenersByToken.delete(token)
      }
    }
  }

  publishStatus({ token, status }: { token: string; status: ShareLibraryStatusResponse }) {
    this.publish({
      token,
      type: 'status',
      status,
    })
  }

  publishRevoked({ token }: { token: string }) {
    this.publish({
      token,
      type: 'revoked',
    })
  }

  handlePayload(payload: string) {
    const notification = parseShareStatusNotification(payload)
    if (!notification) return

    this.dispatch(notification.token, toShareStatusEvent(notification))
  }

  private ensureListening() {
    this.listenPromise ??= this.getSql()
      .listen(SHARE_STATUS_CHANNEL, (payload) => {
        this.handlePayload(payload)
      })
      .then(() => undefined)

    return this.listenPromise
  }

  private publish(notification: ShareStatusNotification) {
    void this.getSql()
      .notify(SHARE_STATUS_CHANNEL, JSON.stringify(notification))
      .catch((error) => {
        console.log('Failed to publish share status notification.', error)
      })
  }

  private dispatch(token: string, event: ShareStatusEvent) {
    const listeners = this.listenersByToken.get(token)
    if (!listeners) return

    Promise.allSettled(Array.from(listeners).map((listener) => listener(event))).then((results) => {
      const errors = results.filter((result) => result.status === 'rejected')
      if (errors.length) {
        console.log(`Some listeners for token '${token}' failed.`, errors)
      }

      if (event.type === 'revoked') {
        this.listenersByToken.delete(token)
      }
    })
  }
}

export const shareStatusEvents = new ShareStatusEventBus()
