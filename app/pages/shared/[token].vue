<script setup lang="ts">
import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useTimeoutPoll } from '@vueuse/core'

const router = useRouter()
const route = useRoute('shared-token')
const token = computed(() => route.params.token)

const CURRENT_SONG_TOAST_ID = 'currentSong'

const viewedSongId = computed(() => {
  const currentRoute = router.currentRoute.value

  if (currentRoute.name !== 'shared-token-songs-id-view') return
  return currentRoute.params.id
})

const { data: sharedStatusData, refresh: refetchSharedStatus } = useFetchSharedLibraryStatus({
  token: token.value,
})
const toast = useToast()

useTimeoutPoll(refetchSharedStatus, 5_000)

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
