<script setup lang="ts">
import type { CreateSongInput } from '~~/shared/types/song'

definePageMeta({ title: 'Edit Song' })

const route = useRoute()
const { fetchSong, updateSong } = useSongs()

const { data: song, status: fetchStatus } = useAsyncData(
  `song-${route.params.id}`,
  () => fetchSong(route.params.id as string),
)

const { execute, status: submitStatus } = useAsyncAction(async (values: CreateSongInput) => {
  await updateSong(route.params.id as string, values)
  await navigateTo(`/songs/${route.params.id}`)
})
</script>

<template>
  <div class="mx-auto max-w-2xl p-6">
    <h1 class="mb-6 text-2xl font-bold">Edit song</h1>
    <div v-if="fetchStatus === 'pending'" class="py-12 text-center text-gray-500">Loading...</div>
    <SongForm
      v-else-if="song"
      :initial-values="{ author: song.author, name: song.name, content: song.content }"
      :loading="submitStatus === 'pending'"
      @submit="execute"
    />
  </div>
</template>
