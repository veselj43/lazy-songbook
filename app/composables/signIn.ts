const isLocalRedirectUrl = (value: string) => {
  return value.startsWith('/') && !value.startsWith('//')
}

const normalizeRedirectUrl = (value: unknown) => {
  const redirectUrl = Array.isArray(value) ? value[0] : value

  if (typeof redirectUrl !== 'string' || !isLocalRedirectUrl(redirectUrl)) {
    return undefined
  }

  return redirectUrl
}

export const useSignInRedirect = () => {
  const route = useRoute()

  const afterLoginRedirect = computed(() => normalizeRedirectUrl(route.query.redirect_url))

  return {
    afterLoginRedirect,
  }
}

export const useSignInFlow = () => {
  const router = useRouter()
  const { afterLoginRedirect } = useSignInRedirect()
  const { isLoaded, isSignedIn } = useAuth()

  /**
   * workaround:
   * clerk redirect after sign-in takes long
   * state when redirect is "stuck": { isLoaded: false, isSignedIn: undefined }
   */
  const stop = watch([isLoaded, isSignedIn], ([loaded, signedIn]) => {
    if (loaded || signedIn === false) return

    stop()
    router.push(afterLoginRedirect.value ?? '/')
  })

  return {
    afterLoginRedirect,
  }
}
