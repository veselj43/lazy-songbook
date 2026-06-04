<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { useQRCode } from '@vueuse/integrations/useQRCode'

import { useShareStore } from '~/composables/share.store'

const shareStore = useShareStore()
const { shareUrl, shareData, shareStatus } = storeToRefs(shareStore)

const { copy, copied } = useClipboard()

const qrData = computed(() => {
  return shareUrl.value ? useQRCode(shareUrl.value) : undefined
})

const { execute: handleCreate, status: createStatus } = useAsyncAction(async () => {
  await createOwnerShareHandler()
  await shareStore.shareRefresh()
})

const { confirm } = useConfirm()

const { execute: handleRevoke, status: revokeStatus } = useAsyncAction(async () => {
  const confirmed = await confirm({
    title: 'Revoke share link?',
    description:
      'Anyone using the current link will lose access immediately. Existing followers will also be removed.',
  })
  if (!confirmed) return

  await revokeOwnerShareHandler()
  await shareStore.shareRefresh()
})

const handleCopy = () => {
  if (!shareUrl.value) return
  copy(shareUrl.value)
}

const isOpen = ref(false)

const emit = defineEmits<{
  close: []
}>()

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  emit('close')
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Share your library"
    description="Anyone with this link can view your songs. They don't need an account."
  >
    <template #body>
      <AsyncContent :fetchStatus="shareStatus">
        <template v-if="shareData">
          <div class="flex flex-col gap-3">
            <UFieldGroup>
              <UInput :model-value="shareUrl" readonly class="w-full font-mono" />

              <UButton
                :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                color="neutral"
                variant="outline"
                aria-label="Copy link"
                @click="handleCopy"
              />
            </UFieldGroup>

            <img v-if="qrData" :src="qrData.value" alt=" " />

            <p class="text-sm text-gray-500">Created <DateTime :value="shareData.createdAt" /></p>
          </div>
        </template>

        <template v-else>
          <p class="text-sm text-gray-600">
            You don't have an active share link. Create one to let others view your songs.
          </p>
        </template>
      </AsyncContent>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          v-if="shareData"
          color="error"
          variant="soft"
          icon="i-lucide-link-2-off"
          :loading="revokeStatus === 'pending'"
          @click="handleRevoke"
          >Revoke link</UButton
        >

        <UButton
          v-else
          icon="i-lucide-link"
          :loading="createStatus === 'pending'"
          @click="handleCreate"
          >Create share link</UButton
        >
      </div>
    </template>
  </UModal>
</template>
