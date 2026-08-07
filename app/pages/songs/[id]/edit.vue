<script setup lang="ts">
import type { UpdateSongInput } from '~~/shared/schema/song'

import LayoutMain from '~/pages/_partial/LayoutMain.vue'

definePageMeta({
  middleware: 'auth-required',
})

useHead({
  title: 'Edit song',
})

const route = useRoute('songs-id-edit')

const currentId = computed(() => route.params.id)

const { data: song, status: fetchStatus } = useFetchSong({ id: currentId.value })

const { execute, status: submitStatus } = useAsyncAction(async (data: UpdateSongInput) => {
  await updateSongHandler({ id: currentId.value, data })
  await navigateTo(`/songs/${route.params.id}/view`)
})
</script>

<template>
  <LayoutMain>
    <AppHeader>
      <template #default> Edit song </template>

      <template #right>
        <div v-if="song" class="flex flex-col items-end">
          <p class="text-xs text-muted tabular-nums">
            Created: <DateTime :value="song.createdAt" />
          </p>
          <p class="text-xs text-muted tabular-nums">
            Updated: <DateTime :value="song.updatedAt" />
          </p>
        </div>
      </template>
    </AppHeader>

    <AsyncContent :fetchStatus="fetchStatus">
      <SongForm
        v-if="song"
        :initialValues="song"
        :loading="submitStatus === 'pending'"
        @submit="execute"
      />
    </AsyncContent>
  </LayoutMain>
</template>
