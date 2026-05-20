<script setup lang="ts">
useHead({
  titleTemplate: (pageName) => {
    return pageName ? `Lazy songbook | ${pageName}` : 'Lazy songbook'
  },
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
