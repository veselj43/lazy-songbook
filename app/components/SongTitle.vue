<script setup lang="ts">
import type { ShareSongListItem } from '~~/shared/schema/sharing'
import type { SongListItem } from '~~/shared/schema/song'

defineProps<{
  song: SongListItem | ShareSongListItem
}>()
</script>

<template>
  <div>
    <h1 class="text-xl font-bold">{{ song.name }}</h1>
    <p class="text-gray-500">{{ song.author }}</p>
  </div>
</template>
