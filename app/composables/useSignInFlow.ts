export const useSignInFlow = () => {
  const route = useRoute()

  const afterLoginRedirect = computed(() => {
    const redirectUrl = route.query.redirect_url

    if (redirectUrl !== 'string') return '/'
    return redirectUrl
  })

  return {
    afterLoginRedirect,
  }
}
