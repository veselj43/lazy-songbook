<script setup lang="ts">
import type { SortableSongColumn } from '~~/shared/schema/song'

import LayoutMain from '../_partial/LayoutMain.vue'

definePageMeta({
  middleware: 'auth-required',
})

useHead({
  title: 'My library',
})

const sortColumn = ref<SortableSongColumn>('updatedAt')
const sortDesc = ref(true)
const search = ref<string | undefined>(undefined)

const { data, status: fetchStatus } = useFetchSongs(() => ({
  sort: [{ column: sortColumn.value, isDesc: sortDesc.value }],
  search: search.value,
}))

const shareStore = useShareStore()
const { shareData } = storeToRefs(shareStore)

const shareModal = useTemplateRef('share-modal')
</script>

<template>
  <LayoutMain>
    <AppHeader>
      <template #default>My library</template>

      <template #right>
        <UButton
          :color="shareData ? 'primary' : 'neutral'"
          :variant="shareData ? 'subtle' : 'outline'"
          icon="i-lucide-share-2"
          @click="shareModal?.open()"
        >
          Share
        </UButton>

        <UButton to="/songs/new" icon="i-lucide-plus"> Add song </UButton>
      </template>
    </AppHeader>

    <ShareLibraryModal ref="share-modal" />

    <SongFilters
      v-model:search="search"
      v-model:sort-column="sortColumn"
      v-model:sort-desc="sortDesc"
      class="mb-4"
    />

    <AsyncContent :fetchStatus="fetchStatus">
      <div v-if="!data?.items.length" class="py-12 text-center text-gray-500">
        No songs yet. Add your first one!
      </div>

      <div v-else class="flex flex-col gap-3">
        <SongListItem
          v-for="song in data.items"
          :song="song"
          :link="(song) => `/songs/${song.id}/view`"
        />
      </div>
    </AsyncContent>
  </LayoutMain>
</template>
