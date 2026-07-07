<script setup lang="ts">
import type { PaginationRequestInput } from '~~/shared/schema/api'
import type { ShareLibraryResponse } from '~~/shared/schema/sharing'
import type { SortableSongColumn } from '~~/shared/schema/song'

import { librarySharedApi } from '~/api/libraryShared.api'
import LayoutMain from '~/pages/_partial/LayoutMain.vue'

type SharedLibraryFetchError = Error & { status?: number }

const route = useRoute('shared-token')
const token = computed(() => route.params.token)

const { isLoaded, isSignedIn } = useAuth()
const isLoggedIn = computed(() => isLoaded.value && isSignedIn.value)

const {
  pagination: { defaultMaxPages, defaultPageSize },
} = useAppConfig()

const pageSize = ref(defaultPageSize)
const sortColumn = ref<SortableSongColumn>('updatedAt')
const sortDesc = ref(true)
const search = ref<string | undefined>(undefined)

const listQuery = computed<PaginationRequestInput>(() => ({
  pageSize: pageSize.value,
  sort: [{ column: sortColumn.value, isDesc: sortDesc.value }],
  search: search.value || undefined,
}))

const {
  data,
  hasNextPage,
  loadNextPage,
  status: fetchStatus,
  asyncStatus: fetchAsyncStatus,
  error,
} = useInfiniteQuery<ShareLibraryResponse, SharedLibraryFetchError, number>(() => ({
  key: [sharedDataKey({ token: token.value }), listQuery.value],
  query: ({ pageParam }) =>
    librarySharedApi.songs.filter({
      token: token.value,
      body: {
        ...listQuery.value,
        page: pageParam,
      },
    }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
  placeholderData: (previousData) => previousData,
  refetchOnMount: false,
  maxPages: defaultMaxPages,
}))

const sharedLibraryData = computed(() => data.value?.pages[0] ?? null)
const songs = computed(() => data.value?.pages.flatMap((page) => page.items) ?? [])

async function loadMoreSongs() {
  await loadNextPage({ cancelRefetch: false })
}

useHead({
  title: () =>
    sharedLibraryData.value?.ownerDisplayName
      ? `${sharedLibraryData.value.ownerDisplayName}'s library`
      : 'Shared library',
})
</script>

<template>
  <LayoutMain>
    <AppHeader>
      <template #default>
        <div v-if="sharedLibraryData">
          <h1 class="text-2xl font-bold">
            {{
              sharedLibraryData.ownerDisplayName
                ? `${sharedLibraryData.ownerDisplayName}'s library`
                : 'Shared library'
            }}
          </h1>
          <p class="text-sm text-gray-500">Read-only</p>
        </div>
      </template>
    </AppHeader>

    <AsyncContent :fetchStatus="fetchStatus">
      <UAlert
        v-if="isLoaded && !isSignedIn"
        color="primary"
        variant="subtle"
        icon="i-lucide-user-plus"
        title="Sign in to save this library"
        description="Signed in users can see their Shared libraries section."
        class="mb-4"
      >
        <template #actions>
          <UButton
            variant="solid"
            size="xs"
            :to="{ path: '/sign-in', query: { redirect_url: $route.fullPath } }"
            >Sign in</UButton
          >
        </template>
      </UAlert>

      <UAlert
        v-else-if="isLoggedIn"
        color="success"
        variant="subtle"
        icon="i-lucide-bookmark-check"
        title="Saved to your Shared libraries"
        description="Manage this library in the Shared libraries tab."
        class="mb-4"
      />

      <SongFilters
        v-model:search="search"
        v-model:sort-column="sortColumn"
        v-model:sort-desc="sortDesc"
        class="mb-4"
      />

      <div v-if="!songs.length" class="py-12 text-center text-gray-500">This library is empty.</div>

      <div v-else class="flex flex-col gap-3">
        <SongListItem
          v-for="song in songs"
          :key="song.id"
          :song="song"
          :link="(song) => `/shared/${token}/songs/${song.id}/view`"
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

      <template #error>
        <UAlert variant="subtle" color="error">
          <template #title>
            <template v-if="error?.status == 404"> Invalid share link. </template>
            <template v-else> Something went wrong, please try again. </template>
          </template>
        </UAlert>
      </template>
    </AsyncContent>
  </LayoutMain>
</template>
