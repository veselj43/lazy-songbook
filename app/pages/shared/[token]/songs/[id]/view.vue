<script setup lang="ts">
import LayoutMain from '~/pages/_partial/LayoutMain.vue'

const route = useRoute('shared-token-songs-id-view')
const token = computed(() => route.params.token)
const id = computed(() => route.params.id)

const { data: song, status: fetchStatus } = useFetchSharedSong({
  token: token.value,
  id: id.value,
})

useHead({
  title: () => (song.value ? `${song.value.name} by ${song.value.author}` : 'song'),
})
</script>

<template>
  <LayoutMain>
    <AppHeader>
      <template #leftPrepend>
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide:chevron-left"
          :to="`/shared/${token}`"
        />
      </template>

      <template #header>
        <AsyncContent :fetchStatus="fetchStatus">
          <SongTitle v-if="song" :song="song" />
        </AsyncContent>
      </template>
    </AppHeader>

    <AsyncContent :fetchStatus="fetchStatus">
      <div v-if="song" class="overflow-x-auto border-y border-y-neutral-200 py-4">
        <SongContent :content="song.content" />
      </div>
    </AsyncContent>
  </LayoutMain>
</template>
