<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const open = defineModel<boolean>('open', { default: false })

const { data: share, status, refresh } = useFetchOwnerShare()

const { copy, copied } = useClipboard()

const runtimeConfig = useRuntimeConfig()

const shareUrl = computed(() => {
  if (!share.value) return ''
  const base = runtimeConfig.public.appUrl || (import.meta.client ? window.location.origin : '')
  return `${base}/shared/${share.value.token}`
})

const qrData = useQRCode(shareUrl)

const { execute: handleCreate, status: createStatus } = useAsyncAction(async () => {
  await createOwnerShareHandler()
  await refresh()
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
  await refresh()
})

const handleCopy = () => {
  if (!shareUrl.value) return
  copy(shareUrl.value)
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Share your library"
    description="Anyone with this link can view your songs. They don't need an account."
  >
    <template #body>
      <AsyncContent :fetchStatus="status">
        <template v-if="share">
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

            <img :src="qrData" alt=" " />

            <p class="text-sm text-gray-500">
              Created {{ new Date(share.createdAt).toLocaleString() }}.
            </p>
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
          v-if="share"
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
        <UButton variant="ghost" color="neutral" @click="open = false">Close</UButton>
      </div>
    </template>
  </UModal>
</template>
