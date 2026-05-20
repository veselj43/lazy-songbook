<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'

import AppSidebar from '~/components/AppSidebar.vue'

const tvLayout = tv({
  slots: {
    pageWrapper: 'h-full w-full px-5 pt-3 pb-8',
    page: 'h-full',
  },
  variants: {
    scrollable: {
      true: {
        pageWrapper: 'overflow-y-auto',
      },
    },
    width: {
      narrow: {
        page: 'm-auto w-full xl:max-w-6xl',
      },
      wide: {
        page: 'w-full',
      },
    },
  },
})

type TvProps = VariantProps<typeof tvLayout>

const props = withDefaults(
  defineProps<{
    scrollable?: TvProps['scrollable']
    width?: TvProps['width']
  }>(),
  {
    scrollable: false,
    width: 'narrow',
  },
)

const styles = computed(() => tvLayout(props))
</script>

<template>
  <div class="flex h-screen flex-col">
    <div class="flex min-h-0 grow">
      <div class="relative h-full w-48 shrink-0">
        <AppSidebar class="w-full overflow-y-auto" />
      </div>

      <div :class="styles.pageWrapper()">
        <div :class="styles.page()">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
