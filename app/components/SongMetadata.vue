<script setup lang="ts">
import type { ShareSongListItem } from '~~/shared/schema/sharing'
import type { SongListItem } from '~~/shared/schema/song'

const props = defineProps<{
  song: SongListItem | ShareSongListItem
}>()

const metadataItems = computed(() =>
  [
    { title: 'Key', value: props.song.metadata.key },
    { title: 'Capo', value: props.song.metadata.capo },
  ].filter((item) => item.value),
)
</script>

<template>
  <div v-if="metadataItems.length" class="flex shrink-0 flex-wrap justify-end gap-2">
    <UBadge v-for="item in metadataItems" :key="item.title" color="neutral" variant="soft">
      {{ item.title }} {{ item.value }}
    </UBadge>
  </div>
</template>
