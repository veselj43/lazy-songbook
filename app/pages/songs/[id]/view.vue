<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

import { fieldGroup } from '#build/ui'
import { tcf } from '~/lib/tailwind'
import LayoutMain from '~/pages/_partial/LayoutMain.vue'

definePageMeta({
  middleware: 'auth-required',
})

const route = useRoute('songs-id-view')

const currentId = computed(() => route.params.id)

const { data: song, status: fetchStatus } = useFetchSong({ id: currentId.value })
const { data: share, status: shareStatus, refresh: refreshShare } = useFetchOwnerShare()

useHead({
  title: () => (song.value ? `${song.value.name} by ${song.value.author}` : 'song'),
})

const playTogetherActive = computed(() => share.value?.currentSongId === currentId.value)

const { execute: handlePlayTogetherToggle, status: playTogetherStatus } = useAsyncAction(
  async () => {
    if (!song.value) return

    await setCurrentSongHandler({
      songId: playTogetherActive.value ? null : song.value.id,
    })
    await refreshShare()
  },
)

const { confirm } = useConfirm()

const handleDelete = async () => {
  if (!song.value) return

  const { name, author } = song.value

  const result = await deleteSongHandler({
    confirmHandler: () =>
      confirm({
        title: 'Delete song?',
        description: `${name} by ${author}`,
      }),
    song: song.value,
  })
  if (!result) return

  await navigateTo('/')
}

const menuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Edit',
      icon: 'i-lucide-pencil',
      to: `/songs/${currentId.value}/edit`,
    },
    {
      label: 'Delete',
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect: handleDelete,
    },
  ],
])

const transpose = ref(0)
</script>

<template>
  <LayoutMain>
    <AppHeader>
      <template #leftPrepend>
        <UButton
          class="print:hidden"
          variant="ghost"
          color="neutral"
          icon="i-lucide:chevron-left"
          to="/songs"
        ></UButton>
      </template>

      <template #header>
        <AsyncContent :fetchStatus="fetchStatus">
          <SongTitle v-if="song" :song="song" />
        </AsyncContent>
      </template>

      <template #right>
        <UDropdownMenu
          :items="menuItems"
          :content="{
            align: 'end',
            side: 'bottom',
          }"
        >
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide:more-vertical"
            aria-label="Actions"
          />
        </UDropdownMenu>
      </template>
    </AppHeader>

    <div class="mb-2 flex justify-end gap-2">
      <SongTransposeControl v-model="transpose" />

      <UButton
        v-if="song"
        class="shrink-0 print:hidden"
        :icon="playTogetherActive ? 'i-lucide:square' : 'i-lucide:play'"
        :variant="playTogetherActive ? 'solid' : 'outline'"
        :color="playTogetherActive ? 'secondary' : 'neutral'"
        :loading="shareStatus === 'pending' || playTogetherStatus === 'pending'"
        @click="handlePlayTogetherToggle()"
      >
        Play together
      </UButton>
    </div>

    <AsyncContent :fetchStatus="fetchStatus">
      <div v-if="song" class="overflow-x-auto border-y border-y-neutral-200 py-4">
        <SongContent :content="song.content" :transpose="transpose" />
      </div>
    </AsyncContent>
  </LayoutMain>
</template>
