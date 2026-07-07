<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { SortableSongColumn } from '~~/shared/schema/song'

import { uiEventHandler } from '~/lib/eventHandler'
import { tcf, tvCn } from '~/lib/tailwind'

const search = defineModel<string | undefined>('search', { default: undefined })
const sortColumn = defineModel<SortableSongColumn>('sortColumn', { default: 'updatedAt' })
const sortDesc = defineModel<boolean>('sortDesc', { default: true })

const sortOptions: { label: string; value: SortableSongColumn }[] = [
  { label: 'Name', value: 'name' },
  { label: 'Author', value: 'author' },
  { label: 'Created', value: 'createdAt' },
  { label: 'Updated', value: 'updatedAt' },
]

const searchInput = ref(search.value ?? '')
const searchInputCustomized = computed(() =>
  searchInput.value.length >= 2 ? searchInput.value : undefined,
)
const searchInputDebounced = refDebounced(searchInputCustomized, 250)

watch(searchInputDebounced, (value) => {
  search.value = value
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <UInput
      v-model="searchInput"
      class="max-w-100 min-w-64 grow lg:grow-0"
      name="search"
      placeholder="Search by name or author"
      icon="i-lucide-search"
      :ui="{
        base: tvCn(searchInput && !search ? 'ring-red-500' : '', 'pr-6'),
        trailing: tcf('pe-0'),
      }"
    >
      <template #trailing v-if="searchInput">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide:x"
          aria-label="Reset search"
          @click="uiEventHandler(() => (searchInput = ''))"
        />
      </template>
    </UInput>

    <UFieldGroup class="flex min-w-48 grow items-center lg:grow-0">
      <USelect v-model="sortColumn" :items="sortOptions" value-key="value" class="grow" />

      <UButton
        :icon="sortDesc ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'"
        color="neutral"
        variant="outline"
        :aria-label="sortDesc ? 'Sort descending' : 'Sort ascending'"
        @click="uiEventHandler(() => (sortDesc = !sortDesc))"
      />
    </UFieldGroup>
  </div>
</template>
