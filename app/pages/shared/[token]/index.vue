<script setup lang="ts">
import type { SortableSongColumn } from '~~/shared/schema/song'

import LayoutMain from '~/pages/_partial/LayoutMain.vue'

const route = useRoute()
const token = computed(() => route.params.token as string)

const { isLoaded, isSignedIn } = useAuth()
const isLoggedIn = computed(() => isLoaded.value && isSignedIn.value)

const sortColumn = ref<SortableSongColumn>('updatedAt')
const sortDesc = ref(true)
const search = ref<string | undefined>(undefined)

const {
  data,
  status: fetchStatus,
  error,
} = useFetchShareLibrary({
  token: token.value,
  body: () => ({
    sort: [{ column: sortColumn.value, isDesc: sortDesc.value }],
    search: search.value,
  }),
})

useHead({
  title: () => (data.value?.ownerName ? `${data.value.ownerName}'s library` : 'Shared library'),
})
</script>

<template>
  <LayoutMain>
    <AppHeader>
      <template #default>
        <div v-if="data">
          <h1 class="text-2xl font-bold">
            {{ data.ownerName ? `${data.ownerName}'s library` : 'Shared library' }}
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

      <div v-if="!data?.items.length" class="py-12 text-center text-gray-500">
        This library is empty.
      </div>

      <div v-else class="flex flex-col gap-3">
        <SongListItem
          v-for="song in data.items"
          :song="song"
          :link="(song) => `/shared/${token}/songs/${song.id}/view`"
        />
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
