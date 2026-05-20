<script setup lang="ts">
defineProps<{
  content: string
}>()

const chordPattern = /^[A-G][#b]?(m|maj|min|dim|aug|sus|add|7|9|11|13|6|(\/[A-G]))*[0-9]?$/

const isChord = (text: string): boolean => chordPattern.test(text)

const isChordLine = (line: string): boolean => {
  const trimmed = line.trim()
  if (!trimmed) return false

  const tokens = trimmed.split(/\s+/)
  return tokens.length > 0 && tokens.every(isChord)
}
</script>

<template>
  <pre class="font-mono text-sm leading-relaxed whitespace-pre-wrap"><template
    v-for="(line, i) in content.split('\n')"
    :key="i"
  ><span :class="isChordLine(line) ? 'font-bold text-primary' : ''">{{ line }}
</span></template></pre>
</template>
