<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

import LayoutMain from '~/pages/_partial/LayoutMain.vue'

definePageMeta({
  middleware: 'auth-required',
})

const route = useRoute()

const currentId = computed(() => route.params.id as string)

const { data: song, status: fetchStatus } = useFetchSong({ id: currentId.value })

useHead({
  title: () => (song.value ? `${song.value.name} by ${song.value.author}` : 'song'),
})

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
</script>

<template>
  <LayoutMain>
    <AppHeader>
      <template #leftPrepend>
        <UButton variant="ghost" color="neutral" icon="i-lucide:chevron-left" to="/songs"></UButton>
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

    <AsyncContent :fetchStatus="fetchStatus">
      <div v-if="song" class="overflow-x-auto border-y border-y-neutral-200 py-4">
        <SongContent :content="song.content" />
      </div>
    </AsyncContent>
  </LayoutMain>
</template>
