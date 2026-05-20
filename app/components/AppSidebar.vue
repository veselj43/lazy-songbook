<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

import { UNavigationMenu } from '#components'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'My songs',
      icon: 'i-lucide:file-music',
      to: '/songs',
    },
  ],
  [
    {
      label: 'Settings',
      icon: 'i-lucide:cog',
      to: '/settings',
      disabled: true,
    },
  ],
])
</script>

<template>
  <div class="flex flex-col p-2">
    <div class="p-2 text-secondary-300">Lazy songbook</div>

    <UNavigationMenu orientation="vertical" :items="items" />
  </div>
</template>
