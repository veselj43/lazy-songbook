<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

import LayoutMain from '~/pages/_partial/LayoutMain.vue'

const route = useRoute()

const currentId = computed(() => route.params.id as string)

const { data: song, status } = useFetchSong({ id: currentId.value })

useHead({
  title: () => (song.value ? `${song.value.name} by ${song.value.author}` : 'song'),
})

const { confirm } = useConfirm()

const handleDelete = async () => {
  if (!song.value) return

  const result = await deleteSongHandler({
    confirm,
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
    <div v-if="status === 'pending'" class="py-12 text-center text-gray-500">Loading...</div>
    <div v-else-if="song">
      <AppHeader>
        <template #leftPrepend>
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide:chevron-left"
            to="/songs"
          ></UButton>
        </template>
        <template #header>
          <div>
            <h1 class="text-2xl font-bold">{{ song.name }}</h1>
            <p class="text-gray-500">{{ song.author }}</p>
          </div>
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

      <div class="border-y border-y-neutral-200 py-4 overflow-x-auto">
        <SongContent :content="song.content" />
      </div>
    </div>
  </LayoutMain>
</template>
