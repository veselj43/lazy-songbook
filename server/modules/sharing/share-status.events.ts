import type { ShareLibraryStatusResponse } from '~~/shared/schema/sharing'

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

type ShareStatusListener = (event: ShareStatusEvent) => void

class ShareStatusEventBus {
  private readonly listenersByToken = new Map<string, Set<ShareStatusListener>>()

  subscribe({ token, listener }: { token: string; listener: ShareStatusListener }) {
    let listeners = this.listenersByToken.get(token)
    if (!listeners) {
      listeners = new Set()
      this.listenersByToken.set(token, listeners)
    }

    listeners.add(listener)

    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) {
        this.listenersByToken.delete(token)
      }
    }
  }

  publishStatus({ token, status }: { token: string; status: ShareLibraryStatusResponse }) {
    this.publish(token, {
      type: 'status',
      status,
    })
  }

  publishRevoked({ token }: { token: string }) {
    this.publish(token, {
      type: 'revoked',
      error: {
        statusCode: 404,
        statusMessage: 'Share not found',
      },
    })
    this.listenersByToken.delete(token)
  }

  private publish(token: string, event: ShareStatusEvent) {
    const listeners = this.listenersByToken.get(token)
    if (!listeners) return

    Promise.allSettled(Array.from(listeners).map((listener) => listener(event))).then((results) => {
      const errors = results.filter((result) => result.status === 'rejected')
      if (errors.length) {
        console.log(`Some listeners for token '${token}' failed.`, errors)
      }
    })
  }
}

export const shareStatusEvents = new ShareStatusEventBus()
