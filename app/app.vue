<script setup lang="ts">
useHead({
  titleTemplate: (pageName) => {
    return pageName ? `LazySongbook | ${pageName}` : 'LazySongbook'
  },
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
