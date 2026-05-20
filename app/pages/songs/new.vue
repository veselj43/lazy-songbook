<script setup lang="ts">
import type { CreateSongInput } from '~~/shared/types/song'

definePageMeta({ title: 'New Song' })

const { createSong } = useSongs()
const { execute, status } = useAsyncAction(async (values: CreateSongInput) => {
  const song = await createSong(values)
  await navigateTo(`/songs/${song.id}`)
})
</script>

<template>
  <div class="mx-auto max-w-2xl p-6">
    <h1 class="mb-6 text-2xl font-bold">Add new song</h1>
    <SongForm :loading="status === 'pending'" @submit="execute" />
  </div>
</template>
