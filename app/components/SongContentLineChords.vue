<script setup lang="ts">
import { type ContentLineChords } from '~/lib/chords/chordLine'

const props = defineProps<{
  line: ContentLineChords
}>()
</script>

<template>
  <template v-for="(token, i) in line.tokens" :key="i"
    ><span v-if="token.type === 'chord'" class="font-bold text-primary">{{ token.value }}</span
    ><template v-else>{{ token.value }}</template></template
  >
</template>
