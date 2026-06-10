import {
  shareStatusEvents,
  type ShareStatusEvent,
} from '#server/modules/sharing/share-status.events'
import { toShareLibraryStatusResponse } from '#server/modules/sharing/share-status.response'
import { sharingService } from '#server/modules/sharing/sharing.service'

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

  const unsubscribe = shareStatusEvents.subscribe({
    token,
    listener: async (event) => {
      await eventStream.push(createSseEvent(event))

      if (event.type === 'revoked') {
        await eventStream.close()
      }
    },
  })
  eventStream.onClosed(unsubscribe)

  // don't wait, it resolves after it's sent
  eventStream.push(
    createSseEvent({
      type: 'status',
      status: toShareLibraryStatusResponse(share),
    }),
  )

  return eventStream.send()
})
