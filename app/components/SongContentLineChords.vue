<script setup lang="ts">
import { type ContentLineChords } from '~/lib/chords/chord.interface'

const props = defineProps<{
  line: ContentLineChords
  transpose?: number
  hideChords?: boolean
}>()
</script>

<template>
  <template v-if="!hideChords">
    <template v-for="(token, i) in line.tokens" :key="i">
      <span v-if="token.type === 'chord'" class="font-bold text-primary">{{ token.value }}</span>
      <template v-else>{{ token.value }}</template>
    </template>
    {{ '\n' }}
  </template>
</template>
