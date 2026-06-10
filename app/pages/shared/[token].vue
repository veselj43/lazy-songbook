<script setup lang="ts">
import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js'
import type { ShareLibraryStatusResponse } from '~~/shared/schema/sharing'

const router = useRouter()
const route = useRoute('shared-token')
const token = computed(() => route.params.token)

const CURRENT_SONG_TOAST_ID = 'currentSong'

const viewedSongId = computed(() => {
  const currentRoute = router.currentRoute.value

  if (currentRoute.name !== 'shared-token-songs-id-view') return
  return currentRoute.params.id
})

const sharedStatusData = ref<ShareLibraryStatusResponse | null>(null)
const toast = useToast()

let statusEvents: EventSource | undefined

function closeStatusEvents() {
  statusEvents?.close()
  statusEvents = undefined
}

function parseEventData<T>(event: MessageEvent) {
  try {
    return JSON.parse(event.data) as T
  } catch {
    return null
  }
}

watch(
  token,
  (token) => {
    if (!import.meta.client) return

    closeStatusEvents()
    sharedStatusData.value = null

    const events = new EventSource(`/api/shared/status/events/${token}`)
    statusEvents = events

    events.addEventListener('status', (event) => {
      if (statusEvents !== events) return

      const status = parseEventData<ShareLibraryStatusResponse>(event)
      if (status) {
        sharedStatusData.value = status
      }
    })

    events.addEventListener('revoked', () => {
      if (statusEvents !== events) return

      closeStatusEvents()
      toast.remove(CURRENT_SONG_TOAST_ID)
      toast.add({
        title: 'Shared library not found',
        color: 'error',
      })
    })
  },
  { immediate: true },
)

onUnmounted(closeStatusEvents)

watch(
  [() => sharedStatusData.value?.currentSongId, viewedSongId],
  ([currentSongId, viewedSongId]) => {
    if (!currentSongId || currentSongId === viewedSongId) {
      toast.remove(CURRENT_SONG_TOAST_ID)
      return
    }

    const toastExists = !!toast.toasts.value.find((toast) => toast.id === CURRENT_SONG_TOAST_ID)

    const songTitle = sharedStatusData.value
      ? [sharedStatusData.value.currentSongAuthor, sharedStatusData.value.currentSongName]
          .filter(Boolean)
          .join(' - ')
      : currentSongId

    const toastData: Partial<Toast> = {
      title: songTitle,
      duration: 0,
      actions: [
        {
          icon: 'i-lucide:play',
          label: 'Currently playing',
          color: 'neutral',
          variant: 'subtle',
          to: `/shared/${token.value}/songs/${currentSongId}/view`,
        },
      ],
    }

    if (toastExists) {
      toast.update(CURRENT_SONG_TOAST_ID, toastData)
    } else {
      toast.add({
        id: CURRENT_SONG_TOAST_ID,
        ...toastData,
      })
    }
  },
)
</script>

<template>
  <NuxtPage />
</template>
