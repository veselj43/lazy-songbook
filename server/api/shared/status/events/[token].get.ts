import {
  shareStatusEvents,
  type ShareStatusEvent,
} from '#server/modules/sharing/share-status.events'
import { toShareLibraryStatusResponse } from '#server/modules/sharing/share-status.response'
import { sharingService } from '#server/modules/sharing/sharing.service'
import { tryCatch } from '#shared/lib/tryCatch'

// from h3, not exported
interface EventStreamMessage {
  id?: string
  event?: string
  retry?: number
  data: string
}

function createSseEvent(event: ShareStatusEvent): EventStreamMessage {
  return {
    event: event.type,
    data: JSON.stringify(event.type === 'status' ? event.status : event.error),
  }
}

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')!
  const share = await sharingService.resolveShareStatusByToken({ token })

  if (!share) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Share not found',
    })
  }

  const eventStream = createEventStream(event)

  const { data: unsubscribe, error: subscribeError } = await tryCatch(
    shareStatusEvents.subscribe({
      token,
      listener: async (event) => {
        await eventStream.push(createSseEvent(event))

        if (event.type === 'revoked') {
          await eventStream.close()
        }
      },
    }),
  )

  if (subscribeError) {
    console.log('Failed to subscribe to share status events.', subscribeError)
    throw createError({
      statusCode: 503,
      statusMessage: 'Share status events are unavailable',
    })
  }

  eventStream.onClosed(unsubscribe)

  const currentShare = await sharingService.resolveShareStatusByToken({ token })

  // don't wait for push, it resolves after it's sent
  if (!currentShare) {
    eventStream.push(
      createSseEvent({
        type: 'revoked',
        error: {
          statusCode: 404,
          statusMessage: 'Share not found',
        },
      }),
    )
    eventStream.close()
  } else {
    eventStream.push(
      createSseEvent({
        type: 'status',
        status: toShareLibraryStatusResponse(currentShare),
      }),
    )
  }

  return eventStream.send()
})
