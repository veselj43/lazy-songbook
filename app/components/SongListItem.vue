<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { ShareSongListItem } from '~~/shared/schema/sharing'
import type { SongListItem } from '~~/shared/schema/song'

const props = defineProps<{
  song: SongListItem | ShareSongListItem
  link: (song: SongListItem | ShareSongListItem) => RouteLocationRaw
}>()
</script>

<template>
  <NuxtLink :key="song.id" :to="link(song)" class="min-w-0 flex-1">
    <UCard>
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div class="min-w-0">
          <p>
            <span class="">{{ song.author }}</span>
            <span class="text-gray-500"> - </span>
            <span class="">{{ song.name }}</span>
          </p>
        </div>

        <SongMetadata :song="song" />
      </div>
    </UCard>
  </NuxtLink>
</template>
