<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { ShareSongListItem } from '~~/shared/schema/sharing'
import type { SongListItem } from '~~/shared/schema/song'

defineProps<{
  song: SongListItem | ShareSongListItem
  link: (song: SongListItem | ShareSongListItem) => RouteLocationRaw
}>()
</script>

<template>
  <NuxtLink :key="song.id" :to="link(song)" class="min-w-0 flex-1">
    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <p>
            <span class="">{{ song.author }}</span>
            <span class="text-gray-500"> - </span>
            <span class="">{{ song.name }}</span>
          </p>
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>
