<script setup lang="ts">
import { tcf } from '~/lib/tailwind'
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

const transpose = ref(0)
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

    <div class="mb-2 flex justify-end gap-2">
      <SongTransposeControl v-model="transpose" />
    </div>

    <AsyncContent :fetchStatus="fetchStatus">
      <div v-if="song" class="overflow-x-auto border-y border-y-neutral-200 py-4">
        <SongContent :content="song.content" :transpose="transpose" />
      </div>
    </AsyncContent>
  </LayoutMain>
</template>
