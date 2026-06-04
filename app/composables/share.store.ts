export const useShareStore = defineStore('shareStore', () => {
  const runtimeConfig = useRuntimeConfig()
  const {
    data: shareData,
    error: shareError,
    status: shareStatus,
    refresh: shareRefresh,
  } = useFetchOwnerShare()

  const shareUrl = computed(() => {
    const share = shareData.value

    if (!share) return

    const base = runtimeConfig.public.appUrl || (import.meta.client ? window.location.origin : '')
    return `${base}/shared/${share.token}`
  })

  return {
    shareData,
    shareError,
    shareStatus,
    shareRefresh,
    shareUrl,
  }
})
