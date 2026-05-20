<script setup lang="ts">
const route = useRoute()
const { fetchSong, deleteSong } = useSongs()

const { data: song, status } = useAsyncData(
  `song-${route.params.id}`,
  () => fetchSong(route.params.id as string),
)

async function handleDelete() {
  if (!song.value) return
  await deleteSong(song.value.id)
  await navigateTo('/')
}
</script>

<template>
  <div class="mx-auto max-w-2xl p-6">
    <div v-if="status === 'pending'" class="py-12 text-center text-gray-500">Loading...</div>
    <div v-else-if="song">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">{{ song.name }}</h1>
          <p class="text-gray-500">{{ song.author }}</p>
        </div>
        <div class="flex gap-2">
          <UButton :to="`/songs/${song.id}/edit`" variant="soft" icon="i-lucide-pencil">
            Edit
          </UButton>
          <UButton variant="soft" color="error" icon="i-lucide-trash-2" @click="handleDelete">
            Delete
          </UButton>
        </div>
      </div>

      <UCard>
        <SongContent :content="song.content" />
      </UCard>

      <div class="mt-4">
        <UButton to="/" variant="ghost" icon="i-lucide-arrow-left">
          Back to songs
        </UButton>
      </div>
    </div>
  </div>
</template>
