<script setup lang="ts">
const { fetchSongs, deleteSong } = useSongs()
const { data, status, refresh } = useAsyncData('songs', () => fetchSongs())

async function handleDelete(id: number) {
  await deleteSong(id)
  await refresh()
}
</script>

<template>
  <div class="mx-auto max-w-2xl p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold">Lazy Songbook</h1>
      <UButton to="/songs/new" icon="i-lucide-plus">
        Add song
      </UButton>
    </div>

    <div v-if="!data?.items?.length" class="py-12 text-center text-gray-500">
      No songs yet. Add your first one!
    </div>

    <div v-else class="flex flex-col gap-3">
      <UCard v-for="song in data.items" :key="song.id">
        <div class="flex items-center justify-between">
          <NuxtLink :to="`/songs/${song.id}`" class="min-w-0 flex-1">
            <h2 class="text-lg font-semibold">{{ song.name }}</h2>
            <p class="text-sm text-gray-500">{{ song.author }}</p>
          </NuxtLink>
          <div class="ml-4 flex gap-1">
            <UButton :to="`/songs/${song.id}/edit`" variant="ghost" icon="i-lucide-pencil" size="sm" />
            <UButton variant="ghost" color="error" icon="i-lucide-trash-2" size="sm" @click="handleDelete(song.id)" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
