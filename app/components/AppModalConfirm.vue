<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

import { tcf } from '~/lib/tailwind'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    confirmColor?: ButtonProps['color']
  }>(),
  {
    title: undefined,
    description: undefined,
    confirmColor: 'error',
  },
)

const emit = defineEmits<{
  close: [boolean]
}>()

const isOpen = ref(false)
const resultHandlers = ref<{ resolve(value: boolean): void }>()

const open = () => {
  isOpen.value = true

  return new Promise<boolean>((resolve) => {
    resultHandlers.value = { resolve }
  })
}

const close = (value: boolean) => {
  isOpen.value = false

  const result = value ?? false

  emit('close', result)
  resultHandlers.value?.resolve(result)
  resultHandlers.value = undefined
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <UModal
    :open="isOpen"
    :close="{ onClick: () => close(false) }"
    :title="title"
    :description="description"
    :ui="{
      footer: tcf('justify-end'),
    }"
  >
    <template v-if="$slots.body" #body>
      <slot name="body" />
    </template>

    <template #footer>
      <UButton variant="ghost" color="neutral" @click="close(false)">Cancel</UButton>

      <UButton variant="soft" :color="confirmColor" @click="close(true)">OK</UButton>
    </template>
  </UModal>
</template>
