<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app'

const props = withDefaults(
  defineProps<{
    fetchStatus: AsyncDataRequestStatus
  }>(),
  {},
)
</script>

<template>
  <template v-if="fetchStatus === 'pending'">
    <slot name="loader">
      <div class="grid gap-2">
        <USkeleton class="h-4 w-60" />
        <USkeleton class="h-4 w-50" />
      </div>
    </slot>
  </template>

  <template v-else-if="fetchStatus === 'success'">
    <slot name="default"></slot>
  </template>

  <template v-else-if="fetchStatus === 'error'">
    <slot name="error">
      <UBanner> Something went wrong please try again. </UBanner>
    </slot>
  </template>
</template>
