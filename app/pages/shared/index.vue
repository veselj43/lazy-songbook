<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { SharedLibraryListItem } from '~~/shared/schema/sharing'

import LayoutMain from '../_partial/LayoutMain.vue'

definePageMeta({
  middleware: 'auth-required',
})

useHead({
  title: 'Shared libraries',
})

const includeDismissed = ref(false)

const { data, status: fetchStatus } = useFetchSharedLibraries(() => ({
  includeDismissed: includeDismissed.value,
}))

const { confirm } = useConfirm()

const handleDismiss = async (item: SharedLibraryListItem) => {
  await updateMembershipHandler({ id: item.id, status: 'dismissed' })
}

const handleRestore = async (item: SharedLibraryListItem) => {
  await updateMembershipHandler({ id: item.id, status: 'default' })
}

const handleRemove = async (item: SharedLibraryListItem) => {
  const confirmed = await confirm({
    title: 'Remove shared library?',
    description: `${item.ownerDisplayName ?? 'This library'} will no longer appear in your list.`,
  })
  if (!confirmed) return
  await deleteMembershipHandler({ id: item.id })
}

const menuItems = (item: SharedLibraryListItem): DropdownMenuItem[][] => {
  const actions: DropdownMenuItem[] =
    item.status === 'dismissed'
      ? [
          {
            label: 'Restore',
            icon: 'i-lucide-undo-2',
            onSelect: () => handleRestore(item),
          },
        ]
      : [
          {
            label: 'Dismiss',
            icon: 'i-lucide-eye-off',
            onSelect: () => handleDismiss(item),
          },
        ]

  actions.push({
    label: 'Remove',
    icon: 'i-lucide-trash-2',
    color: 'error',
    onSelect: () => handleRemove(item),
  })
  return [actions]
}
</script>

<template>
  <LayoutMain>
    <AppHeader>
      <template #default>Shared libraries</template>

      <template #right>
        <UCheckbox v-model="includeDismissed" label="Show dismissed" />
      </template>
    </AppHeader>

    <AsyncContent :fetchStatus="fetchStatus">
      <div v-if="!data?.items.length" class="py-12 text-center text-gray-500">
        No shared libraries yet. Open a share link to add one.
      </div>

      <div v-else class="flex flex-col gap-3">
        <UCard
          v-for="item in data.items"
          :key="item.id"
          :class="item.status === 'dismissed' ? 'opacity-60' : ''"
        >
          <div class="flex items-center justify-between gap-4">
            <NuxtLink :to="`/shared/${item.token}`" class="min-w-0 flex-1">
              <div>
                <p class="font-medium">
                  {{ item.ownerDisplayName ?? 'Shared library' }}
                </p>
                <p class="text-sm text-gray-500">
                  Saved {{ new Date(item.createdAt).toLocaleDateString() }}
                  <span v-if="item.status === 'dismissed'"> · dismissed</span>
                </p>
              </div>
            </NuxtLink>

            <UDropdownMenu :items="menuItems(item)" :content="{ align: 'end', side: 'bottom' }">
              <UButton
                variant="ghost"
                color="neutral"
                icon="i-lucide:more-vertical"
                aria-label="Actions"
              />
            </UDropdownMenu>
          </div>
        </UCard>
      </div>
    </AsyncContent>
  </LayoutMain>
</template>
