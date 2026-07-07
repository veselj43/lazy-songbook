<script setup lang="ts">
import { uiEventHandler } from '~/lib/eventHandler'
import { tcf } from '~/lib/tailwind'

const model = defineModel()

const transposeInput = ref('0')
const transposeNumber = computed({
  get() {
    const value = Number.parseInt(transposeInput.value)
    return Number.isSafeInteger(value) ? value : 0
  },
  set(value) {
    transposeInput.value = '' + value
  },
})

watch(transposeNumber, (value) => {
  model.value = value
})
</script>

<template>
  <UFieldGroup>
    <UButton variant="outline" color="neutral" @click="uiEventHandler(() => transposeNumber--)"
      >-1</UButton
    >
    <UInput
      class="w-16"
      v-model="transposeInput"
      :ui="{
        base: tcf('pr-6'),
        trailing: tcf('pe-0'),
      }"
    >
      <template #trailing v-if="transposeNumber !== 0">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide:x"
          aria-label="Reset transpose"
          @click="uiEventHandler(() => (transposeNumber = 0))"
        />
      </template>
    </UInput>
    <UButton variant="outline" color="neutral" @click="uiEventHandler(() => transposeNumber++)"
      >+1</UButton
    >
  </UFieldGroup>
</template>
