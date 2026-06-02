<script setup lang="ts">
import { dateTimeFormat } from '~/lib/date/format'

const props = withDefaults(
  defineProps<{
    format?: keyof typeof dateTimeFormat
    value: string
  }>(),
  {
    format: 'dateTimeShort',
  },
)

const formattedValue = computed(() =>
  new Date(props.value).toLocaleString(undefined, dateTimeFormat[props.format]),
)
</script>

<template>
  {{ formattedValue }}
</template>
