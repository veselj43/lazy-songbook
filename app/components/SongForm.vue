<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateSongInput } from '~~/shared/types/song'

const props = defineProps<{
  initialValues?: CreateSongInput
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [values: CreateSongInput]
}>()

const state = reactive<CreateSongInput>({
  author: props.initialValues?.author ?? '',
  name: props.initialValues?.name ?? '',
  content: props.initialValues?.content ?? '',
})

function onSubmit(event: FormSubmitEvent<CreateSongInput>) {
  emit('submit', event.data)
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit" class="flex flex-col gap-4">
    <UFormField label="Song name" name="name" required>
      <UInput v-model="state.name" placeholder="e.g. Knockin' on Heaven's Door" class="w-full" />
    </UFormField>

    <UFormField label="Author" name="author" required>
      <UInput v-model="state.author" placeholder="e.g. Bob Dylan" class="w-full" />
    </UFormField>

    <UFormField label="Content (lyrics & chords)" name="content">
      <UTextarea
        v-model="state.content"
        :rows="16"
        placeholder="G  D  Am&#10;Mama, take this badge off of me..."
        class="w-full font-mono"
      />
    </UFormField>

    <div class="flex gap-2">
      <UButton type="submit" :loading="loading"> Save </UButton>
      <UButton variant="ghost" @click="$router.back()"> Cancel </UButton>
    </div>
  </UForm>
</template>
