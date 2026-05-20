<script setup lang="ts">
defineProps<{
  content: string
}>()

const chordPattern = /^[A-G][#b]?(m|maj|min|dim|aug|sus|add|7|9|11|13|6)*[0-9]?$/

function isChordLine(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false
  const tokens = trimmed.split(/\s+/)
  return tokens.length > 0 && tokens.every(t => chordPattern.test(t))
}
</script>

<template>
  <pre class="whitespace-pre-wrap font-mono text-sm leading-relaxed"><template
    v-for="(line, i) in content.split('\n')"
    :key="i"
  ><span :class="isChordLine(line) ? 'font-bold text-primary' : ''">{{ line }}
</span></template></pre>
</template>
