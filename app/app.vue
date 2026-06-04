<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

import { tcf } from './lib/tailwind'

useHead({
  titleTemplate: (pageName) => {
    return pageName ? `LazySongbook | ${pageName}` : 'LazySongbook'
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
    // {
    //   label: 'Settings',
    //   icon: 'i-lucide:cog',
    //   to: '/settings',
    //   disabled: true,
    // },
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
        center: tcf('grow'),
        right: tcf('lg:grow-0'),
      }"
    >
      <template #title>
        <Logo class="h-6 w-auto" />
      </template>

      <template #default>
        <div class="flex grow items-center justify-between gap-4">
          <UNavigationMenu :items="itemsLeft" />
          <div class="flex items-center gap-3">
            <UNavigationMenu :items="itemsRight" />

            <Show when="signed-out">
              <div class="flex items-center gap-2">
                <SignInButton mode="modal">
                  <UButton label="Sign in" color="neutral" variant="ghost" size="sm" />
                </SignInButton>
                <SignUpButton mode="modal">
                  <UButton label="Sign up" size="sm" />
                </SignUpButton>
              </div>
            </Show>
          </div>
        </div>
      </template>

      <template #right>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </template>

      <template #body>
        <div class="flex flex-col gap-4">
          <UNavigationMenu :items="itemsAll" orientation="vertical" class="-mx-2.5" />

          <Show when="signed-out">
            <div class="flex gap-2">
              <SignInButton mode="modal">
                <UButton
                  label="Sign in"
                  color="neutral"
                  variant="ghost"
                  class="flex-1 justify-center"
                />
              </SignInButton>
              <SignUpButton mode="modal">
                <UButton label="Sign up" class="flex-1 justify-center" />
              </SignUpButton>
            </div>
          </Show>
        </div>
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
