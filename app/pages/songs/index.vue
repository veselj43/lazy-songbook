<script setup lang="ts">
import type { PaginationRequestInput } from '~~/shared/schema/api.js'
import type { SongListResponse, SortableSongColumn } from '~~/shared/schema/song'

import { songsApi } from '~/api/songs.api.js'

import LayoutMain from '../_partial/LayoutMain.vue'

definePageMeta({
  middleware: 'auth-required',
})

useHead({
  title: 'My library',
})

const {
  pagination: { defaultMaxPages, defaultPageSize },
} = useAppConfig()

const pageSize = ref(defaultPageSize)
const sortColumn = ref<SortableSongColumn>('updatedAt')
const sortDesc = ref(true)
const search = ref<string | undefined>(undefined)

const listQuery = computed<PaginationRequestInput>(() => ({
  pageSize: pageSize.value,
  search: search.value || undefined,
  sort: [{ column: sortColumn.value, isDesc: sortDesc.value }],
}))

const {
  data,
  hasNextPage,
  loadNextPage,
  status: fetchStatus,
  asyncStatus: fetchAsyncStatus,
} = useInfiniteQuery<SongListResponse, Error, number>(() => ({
  key: [songsDataKey, listQuery.value],
  query: ({ pageParam }) =>
    songsApi.filter({
      ...listQuery.value,
      page: pageParam,
    }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
  placeholderData: (previousData) => previousData,
  refetchOnMount: false,
  maxPages: defaultMaxPages,
}))

const songs = computed(() => data.value?.pages.flatMap((page) => page.items) ?? [])

async function loadMoreSongs() {
  await loadNextPage({ cancelRefetch: false })
}

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
      <div v-if="!songs.length" class="py-12 text-center text-gray-500">
        No songs yet. Add your first one!
      </div>

      <div v-else class="flex flex-col gap-3">
        <SongListItem
          v-for="song in songs"
          :key="song.id"
          :song="song"
          :link="(song) => `/songs/${song.id}/view`"
        />

        <div v-if="hasNextPage" class="flex justify-center pt-2">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-plus"
            :loading="fetchAsyncStatus === 'loading'"
            @click="loadMoreSongs"
          >
            Load more
          </UButton>
        </div>
      </div>
    </AsyncContent>
  </LayoutMain>
</template>
