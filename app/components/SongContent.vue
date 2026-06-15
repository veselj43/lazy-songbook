<script setup lang="ts">
import { chordContentParse } from '~/lib/chords/chordParse.service'
import { chordContentTranspose } from '~/lib/chords/chordTranspose.service'

const props = defineProps<{
  content: string
  transpose?: number
}>()

const contentParsed = computed(() => chordContentParse(props.content))
const contentTransposed = computed(() =>
  chordContentTranspose(contentParsed.value, { transpose: props.transpose }),
)
</script>

<template>
  <pre class="font-mono text-sm leading-relaxed text-nowrap"><template
    v-for="(line, i) in contentTransposed"
    :key="i"
  ><SongContentLineChords v-if="line.type === 'chords'" :line="line"></SongContentLineChords
  ><span v-else>{{ line.value }}</span>
</template></pre>
</template>
