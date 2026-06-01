<script setup lang="ts">
import { isChordLine } from '~/lib/chords/chordLine'

defineProps<{
  content: string
}>()
</script>

<template>
  <pre class="font-mono text-sm leading-relaxed text-nowrap"><template
    v-for="(line, i) in content.split('\n')"
    :key="i"
  ><span :class="isChordLine(line) ? 'font-bold text-primary' : ''">{{ line }}
</span></template></pre>
</template>
