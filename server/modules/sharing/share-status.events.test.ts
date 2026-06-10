import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ShareLibraryStatusResponse } from '~~/shared/schema/sharing'

import {
  parseShareStatusNotification,
  SHARE_STATUS_CHANNEL,
  ShareStatusEventBus,
} from './share-status.events'

function createStatus(
  overrides: Partial<ShareLibraryStatusResponse> = {},
): ShareLibraryStatusResponse {
  return {
    id: 'share-id',
    createdAt: '2026-06-10T18:00:00.000Z',
    currentSongId: 'song-id',
    currentSongAuthor: 'Song Author',
    currentSongName: 'Song Name',
    ownerUserId: 'owner-id',
    token: 'abc',
    updatedAt: '2026-06-10T18:01:00.000Z',
    ...overrides,
  }
}

function createFakeSql() {
  let onPayload: ((payload: string) => void) | null = null

  const listen = vi.fn(async (_channel: string, callback: (payload: string) => void) => {
    onPayload = callback
    return { state: {} }
  })

  const notify = vi.fn(async () => [])

  return {
    sql: { listen, notify },
    emit(payload: unknown) {
      if (!onPayload) throw new Error('No listener registered')
      onPayload(typeof payload === 'string' ? payload : JSON.stringify(payload))
    },
  }
}

async function waitForDispatch() {
  await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('share status events', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('dispatches status notifications only to listeners subscribed to the token', async () => {
    const fake = createFakeSql()
    const bus = new ShareStatusEventBus(() => fake.sql)
    const abcListener = vi.fn()
    const defListener = vi.fn()
    const status = createStatus()

    await bus.subscribe({ token: 'abc', listener: abcListener })
    await bus.subscribe({ token: 'def', listener: defListener })

    fake.emit({
      token: 'abc',
      type: 'status',
      status,
    })
    await waitForDispatch()

    expect(fake.sql.listen).toHaveBeenCalledTimes(1)
    expect(fake.sql.listen).toHaveBeenCalledWith(SHARE_STATUS_CHANNEL, expect.any(Function))
    expect(abcListener).toHaveBeenCalledWith({
      type: 'status',
      status,
    })
    expect(defListener).not.toHaveBeenCalled()
  })

  it('maps revoked notifications to the existing SSE error payload', async () => {
    const fake = createFakeSql()
    const bus = new ShareStatusEventBus(() => fake.sql)
    const listener = vi.fn()

    await bus.subscribe({ token: 'abc', listener })

    fake.emit({
      token: 'abc',
      type: 'revoked',
    })
    await waitForDispatch()

    expect(listener).toHaveBeenCalledWith({
      type: 'revoked',
      error: {
        statusCode: 404,
        statusMessage: 'Share not found',
      },
    })
  })

  it('clears token listeners after a revoked notification', async () => {
    const fake = createFakeSql()
    const bus = new ShareStatusEventBus(() => fake.sql)
    const listener = vi.fn()

    await bus.subscribe({ token: 'abc', listener })

    fake.emit({
      token: 'abc',
      type: 'revoked',
    })
    await waitForDispatch()

    fake.emit({
      token: 'abc',
      type: 'status',
      status: createStatus(),
    })
    await waitForDispatch()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('unsubscribes individual listeners', async () => {
    const fake = createFakeSql()
    const bus = new ShareStatusEventBus(() => fake.sql)
    const firstListener = vi.fn()
    const secondListener = vi.fn()
    const unsubscribe = await bus.subscribe({ token: 'abc', listener: firstListener })
    await bus.subscribe({ token: 'abc', listener: secondListener })

    unsubscribe()

    fake.emit({
      token: 'abc',
      type: 'status',
      status: createStatus(),
    })
    await waitForDispatch()

    expect(firstListener).not.toHaveBeenCalled()
    expect(secondListener).toHaveBeenCalledTimes(1)
  })

  it('ignores malformed notification payloads', () => {
    expect(parseShareStatusNotification('{')).toBeNull()

    expect(consoleWarnSpy).toHaveBeenCalledOnce()
  })

  it('ignores unknown notification payloads', () => {
    expect(
      parseShareStatusNotification(
        JSON.stringify({
          token: 'abc',
          type: 'unknown',
        }),
      ),
    ).toBeNull()

    expect(consoleWarnSpy).toHaveBeenCalledOnce()
  })

  it('publishes status notifications through Postgres', () => {
    const fake = createFakeSql()
    const bus = new ShareStatusEventBus(() => fake.sql)
    const status = createStatus()

    bus.publishStatus({
      token: 'abc',
      status,
    })

    expect(fake.sql.notify).toHaveBeenCalledWith(
      SHARE_STATUS_CHANNEL,
      JSON.stringify({
        token: 'abc',
        type: 'status',
        status,
      }),
    )
  })

  it('publishes revoked notifications through Postgres', () => {
    const fake = createFakeSql()
    const bus = new ShareStatusEventBus(() => fake.sql)

    bus.publishRevoked({ token: 'abc' })

    expect(fake.sql.notify).toHaveBeenCalledWith(
      SHARE_STATUS_CHANNEL,
      JSON.stringify({
        token: 'abc',
        type: 'revoked',
      }),
    )
  })
})
