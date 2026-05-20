<script setup lang="ts">
import LayoutMain from '../_partial/LayoutMain.vue'

useHead({
  title: 'Songs',
})

const { data, status, refresh } = useAsyncData('songs', () => fetchSongs())

const { confirm } = useConfirm()

const handleDelete = async ({ song }: { song: Song }) => {
  if (!song) return

  const result = await deleteSongHandler({
    confirm,
    song,
  })
  if (!result) return

  await refresh()
}
</script>

<template>
  <LayoutMain>
    <AppHeader>
      <template #default>My songs</template>
      <template #right>
        <UButton to="/songs/new" icon="i-lucide-plus"> Add song </UButton>
      </template>
    </AppHeader>

    <div v-if="!data?.items?.length" class="py-12 text-center text-gray-500">
      No songs yet. Add your first one!
    </div>

    <div v-else class="flex flex-col gap-3">
      <UCard v-for="song in data.items" :key="song.id">
        <div class="flex items-center justify-between">
          <NuxtLink :to="`/songs/${song.id}/view`" class="min-w-0 flex-1">
            <h2 class="text-lg font-semibold">{{ song.name }}</h2>
            <p class="text-sm text-gray-500">{{ song.author }}</p>
          </NuxtLink>

          <div class="ml-4 flex gap-1">
            <UButton
              :to="`/songs/${song.id}/edit`"
              variant="ghost"
              icon="i-lucide-pencil"
              size="sm"
            />
            <UButton
              variant="ghost"
              color="error"
              icon="i-lucide-trash-2"
              size="sm"
              @click="handleDelete({ song })"
            />
          </div>
        </div>
      </UCard>
    </div>
  </LayoutMain>
</template>
