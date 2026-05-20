<script setup lang="ts">
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
</script>

<template>
  <LayoutMain>
    <div v-if="status === 'pending'" class="py-12 text-center text-gray-500">Loading...</div>
    <div v-else-if="song">
      <AppHeader>
        <template #header>
          <div>
            <h1 class="text-2xl font-bold">{{ song.name }}</h1>
            <p class="text-gray-500">{{ song.author }}</p>
          </div>
        </template>

        <template #right>
          <div class="flex gap-2">
            <UButton :to="`/songs/${song.id}/edit`" variant="soft" icon="i-lucide-pencil">
              Edit
            </UButton>
            <UButton variant="soft" color="error" icon="i-lucide-trash-2" @click="handleDelete">
              Delete
            </UButton>
          </div>
        </template>
      </AppHeader>

      <UCard>
        <SongContent :content="song.content" />
      </UCard>
    </div>
  </LayoutMain>
</template>
