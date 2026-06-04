<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { createReusableTemplate } from '@vueuse/core'

import { tcf } from './lib/tailwind'

useHead({
  titleTemplate: (pageName) => {
    return pageName ? `LazySongbook | ${pageName}` : 'LazySongbook'
  },
})

const route = useRoute('index')

const itemsSection = [
  [
    {
      label: 'My library',
      icon: 'i-lucide:file-music',
      to: '/songs',
    },
    {
      label: 'Shared libraries',
      icon: 'i-lucide:share-2',
      to: '/shared',
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

const signInRedirectUrl = computed(() => {
  if (route.query.redirect_url) {
    return route.query.redirect_url
  }

  return route.fullPath
})

const [DefineAuthButtonsTemplate, ReuseAuthButtonsTemplate] = createReusableTemplate()
</script>

<template>
  <DefineAuthButtonsTemplate>
    <UButton
      color="neutral"
      variant="ghost"
      size="sm"
      :to="{
        path: '/sign-in',
        query: {
          redirect_url: signInRedirectUrl,
        },
      }"
      >Sign in</UButton
    >

    <UButton
      size="sm"
      :to="{
        path: '/sign-up',
        query: {
          redirect_url: signInRedirectUrl,
        },
      }"
      >Sign up</UButton
    >
  </DefineAuthButtonsTemplate>

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
        <Show when="signed-out">
          <div class="flex grow items-center justify-end gap-2">
            <ReuseAuthButtonsTemplate />
          </div>
        </Show>

        <Show when="signed-in">
          <div class="flex grow items-center justify-between gap-4">
            <UNavigationMenu :items="itemsLeft" />

            <UNavigationMenu :items="itemsRight" />
          </div>
        </Show>
      </template>

      <template #right>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </template>

      <template #body>
        <div class="flex flex-col gap-4">
          <Show when="signed-out">
            <div class="flex gap-2 self-end">
              <ReuseAuthButtonsTemplate />
            </div>
          </Show>

          <UNavigationMenu :items="itemsAll" orientation="vertical" class="-mx-2.5" />
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
