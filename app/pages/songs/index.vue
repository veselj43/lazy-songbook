<script setup lang="ts">
import LayoutMain from '../_partial/LayoutMain.vue'

useHead({
  title: 'Songs',
})

const { data, status: fetchStatus } = useFetchSongs()
</script>

<template>
  <LayoutMain>
    <AppHeader>
      <template #default>My songs</template>
      <template #right>
        <UButton to="/songs/new" icon="i-lucide-plus"> Add song </UButton>
      </template>
    </AppHeader>

    <AsyncContent :fetchStatus="fetchStatus">
      <div v-if="!data?.items?.length" class="py-12 text-center text-gray-500">
        No songs yet. Add your first one!
      </div>

      <div v-else class="flex flex-col gap-3">
        <NuxtLink
          v-for="song in data.items"
          :key="song.id"
          :to="`/songs/${song.id}/view`"
          class="min-w-0 flex-1"
        >
          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold">{{ song.name }}</h2>
                <p class="text-sm text-gray-500">{{ song.author }}</p>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </AsyncContent>
  </LayoutMain>
</template>
