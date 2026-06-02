<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'

import { tvCn } from '~/lib/tailwind'

const tvLayout = tv({
  slots: {
    page: 'px-2',
  },
  variants: {
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
    width?: TvProps['width']
    ui?: {
      page?: string
    }
  }>(),
  {
    scrollable: false,
    width: 'narrow',
  },
)

const styles = computed(() => tvLayout({ width: props.width }))
</script>

<template>
  <div :class="tvCn(styles.page(), props.ui?.page)">
    <slot />
  </div>
</template>
