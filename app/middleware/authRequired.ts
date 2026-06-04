export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(
        isLoaded,
        (loaded) => {
          if (!loaded) return

          stop()
          resolve()
        },
        { immediate: true },
      )
    })
  }

  if (!isSignedIn.value) {
    return navigateTo({
      path: '/sign-in',
      query: {
        redirect_url: to.fullPath,
      },
    })
  }
})
