<script setup lang="ts">
import type { CreateSongInput } from '~~/shared/schema/song'

import LayoutMain from '~/pages/_partial/LayoutMain.vue'

definePageMeta({
  middleware: 'auth-required',
})

useHead({
  title: 'Edit song',
})

const route = useRoute()

const currentId = computed(() => route.params.id as string)

const { data: song, status: fetchStatus } = useFetchSong({ id: currentId.value })

const { execute, status: submitStatus } = useAsyncAction(async (data: CreateSongInput) => {
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
        :initialValues="{ author: song.author, name: song.name, content: song.content }"
        :loading="submitStatus === 'pending'"
        @submit="execute"
      />
    </AsyncContent>
  </LayoutMain>
</template>
