<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateSongData, Song } from '~~/shared/schema/song'

type SongFormState = CreateSongData

const props = defineProps<{
  initialValues?: Song
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [values: SongFormState]
}>()

const state = reactive<SongFormState>({
  author: props.initialValues?.author ?? '',
  name: props.initialValues?.name ?? '',
  content: props.initialValues?.content ?? '',
  metadata: {
    capo: props.initialValues?.metadata?.capo ?? '',
    key: props.initialValues?.metadata?.key ?? '',
  },
})

function onSubmit(event: FormSubmitEvent<SongFormState>) {
  emit('submit', event.data)
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit" class="flex flex-col gap-4">
    <div class="grid max-w-xl gap-4">
      <div class="grid gap-4">
        <UFormField label="Song name" name="name" required>
          <UInput
            v-model="state.name"
            placeholder="e.g. Knockin' on heaven's door"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Author" name="author" required>
          <UInput v-model="state.author" placeholder="e.g. Bob Dylan" class="w-full" />
        </UFormField>
      </div>

      <div class="grid gap-4">
        <h2 class="text-xl">Metadata</h2>

        <UFormField label="Key" name="metadata.key">
          <UInput v-model="state.metadata.key" placeholder="e.g. G" class="w-full" />
        </UFormField>

        <UFormField label="Capo" name="metadata.capo">
          <UInput v-model="state.metadata.capo" placeholder="e.g. 2" class="w-full" />
        </UFormField>
      </div>
    </div>

    <UFormField label="Content (lyrics & chords)" name="content" required>
      <UTextarea
        class="w-full font-mono"
        v-model="state.content"
        :rows="16"
        placeholder="G  D  Am&#10;Mama, take this badge off of me..."
      />
    </UFormField>

    <div class="flex gap-2">
      <UButton type="submit" :loading="loading"> Save </UButton>
      <UButton variant="ghost" @click="$router.back()"> Cancel </UButton>
    </div>
  </UForm>
</template>
