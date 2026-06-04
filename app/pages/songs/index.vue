<script setup lang="ts">
import type { SortableSongColumn } from '~~/shared/schema/song'

import LayoutMain from '../_partial/LayoutMain.vue'

useHead({
  title: 'Songs',
})

const sortOptions: { label: string; value: SortableSongColumn }[] = [
  { label: 'Name', value: 'name' },
  { label: 'Author', value: 'author' },
  { label: 'Created', value: 'createdAt' },
  { label: 'Updated', value: 'updatedAt' },
]

const sortColumn = ref<SortableSongColumn>('updatedAt')
const sortDesc = ref(true)

const searchInput = ref('')
const search = ref<string | undefined>(undefined)

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(searchInput, (value) => {
  if (searchTimer) clearTimeout(searchTimer)

  if (value.length < 2) {
    search.value = undefined
    return
  }

  searchTimer = setTimeout(() => {
    search.value = value
  }, 250)
})

const { data, status: fetchStatus } = useFetchSongs(() => ({
  sort: [{ column: sortColumn.value, isDesc: sortDesc.value }],
  search: search.value || undefined,
}))
</script>

<template>
  <LayoutMain>
    <AppHeader>
      <template #default>My songs</template>

      <template #right>
        <UButton to="/songs/new" icon="i-lucide-plus"> Add song </UButton>
      </template>
    </AppHeader>

    <div class="mb-4 flex flex-wrap items-center gap-2">
      <UInput
        class="max-w-100 min-w-64 grow lg:grow-0"
        name="search"
        v-model="searchInput"
        placeholder="Search by name or author"
        icon="i-lucide-search"
        :ui="{
          base: searchInput && !search ? 'ring-red-500' : '',
        }"
      />

      <UFieldGroup class="flex min-w-48 grow items-center lg:grow-0">
        <USelect v-model="sortColumn" :items="sortOptions" value-key="value" class="grow" />

        <UButton
          :icon="sortDesc ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'"
          color="neutral"
          variant="outline"
          :aria-label="sortDesc ? 'Sort descending' : 'Sort ascending'"
          @click="sortDesc = !sortDesc"
        />
      </UFieldGroup>
    </div>

    <AsyncContent :fetchStatus="fetchStatus">
      <div v-if="!data?.items.length" class="py-12 text-center text-gray-500">
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
                <p>
                  <span class="">{{ song.author }}</span>
                  <span class="text-gray-500"> - </span>
                  <span class="">{{ song.name }}</span>
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </AsyncContent>
  </LayoutMain>
</template>
