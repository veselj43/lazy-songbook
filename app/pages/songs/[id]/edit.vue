<script setup lang="ts">
import type { CreateSongInput } from '~~/shared/types/song'

import LayoutMain from '~/pages/_partial/LayoutMain.vue'

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
    <AppHeader>Edit song</AppHeader>

    <AsyncContent :fetchStatus="fetchStatus">
      <SongForm
        v-if="song"
        :initial-values="{ author: song.author, name: song.name, content: song.content }"
        :loading="submitStatus === 'pending'"
        @submit="execute"
      />
    </AsyncContent>
  </LayoutMain>
</template>
