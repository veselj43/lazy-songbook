export const useSignInFlow = () => {
  const route = useRoute()

  const afterLoginRedirect = computed(() => {
    const redirectUrl = route.query.redirect_url

    if (typeof redirectUrl !== 'string') return '/'
    return redirectUrl
  })

  const signInUrl = computed(() => {
    return `/sign-in?redirect_url=${afterLoginRedirect.value}`
  })

  const signUpUrl = computed(() => {
    return `/sign-up?redirect_url=${afterLoginRedirect.value}`
  })

  return {
    afterLoginRedirect,
    signInUrl,
    signUpUrl,
  }
}
