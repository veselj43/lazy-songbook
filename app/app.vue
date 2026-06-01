<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

import { tcf } from './lib/tailwind'

useHead({
  titleTemplate: (pageName) => {
    return pageName ? `Lazy songbook | ${pageName}` : 'Lazy songbook'
  },
})

const itemsSection = [
  [
    {
      label: 'My songs',
      icon: 'i-lucide:file-music',
      to: '/songs',
    },
  ],
] as const satisfies NavigationMenuItem[][]

const itemsGlobal = [
  [
    {
      label: 'Settings',
      icon: 'i-lucide:cog',
      to: '/settings',
      disabled: true,
    },
  ],
] as const satisfies NavigationMenuItem[][]

const itemsLeft = ref<NavigationMenuItem[][]>(itemsSection)

const itemsRight = ref<NavigationMenuItem[][]>(itemsGlobal)

const itemsAll = ref<NavigationMenuItem[][]>([
  //
  itemsSection[0],
  itemsGlobal[0],
])
</script>

<template>
  <UApp>
    <UHeader
      :ui="{
        left: tcf('lg:grow-0'),
      }"
    >
      <template #title>
        <Logo class="h-6 w-auto" />
      </template>

      <template #default>
        <div class="flex grow justify-between">
          <UNavigationMenu :items="itemsLeft" />
          <UNavigationMenu :items="itemsRight" />
        </div>
      </template>

      <template #body>
        <UNavigationMenu :items="itemsAll" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #default>
        <p class="text-sm text-muted">LazySongbook</p>
      </template>
    </UFooter>
  </UApp>
</template>
