<script setup lang="ts">
import { parseContentLine } from '~/lib/chords/chordLine'

const props = defineProps<{
  content: string
}>()

const lines = computed(() => props.content.split('\n').map(parseContentLine))
</script>

<template>
  <pre class="font-mono text-sm leading-relaxed text-nowrap"><template
    v-for="(line, i) in lines"
    :key="i"
  ><SongContentLineChords v-if="line.type === 'chords'" :line="line"></SongContentLineChords
  ><span v-else>{{ line.value }}</span>
</template></pre>
</template>
