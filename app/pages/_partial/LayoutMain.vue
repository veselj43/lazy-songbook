<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'

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
  }>(),
  {
    scrollable: false,
    width: 'narrow',
  },
)

const styles = computed(() => tvLayout(props))
</script>

<template>
  <div :class="styles.page()">
    <slot />
  </div>
</template>
