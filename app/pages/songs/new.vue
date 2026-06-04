<script setup lang="ts">
import type { CreateSongInput } from '~~/shared/schema/song'

import LayoutMain from '../_partial/LayoutMain.vue'

definePageMeta({
  middleware: 'auth-required',
})

useHead({ title: 'New song' })

const { execute, status } = useAsyncAction(async (data: CreateSongInput) => {
  const song = await createSongHandler({ data })
  await navigateTo(`/songs/${song.id}/view`)
})
</script>

<template>
  <LayoutMain>
    <AppHeader>Add new song</AppHeader>

    <SongForm :loading="status === 'pending'" @submit="execute" />
  </LayoutMain>
</template>
