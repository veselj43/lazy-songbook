<script setup lang="ts">
const { afterLoginRedirect, signInUrl, signUpUrl } = useSignInFlow()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <SignIn
      :force-redirect-url="afterLoginRedirect"
      :sign-up-force-redirect-url="afterLoginRedirect"
      :sign-up-url="signUpUrl"
      path="/sign-in"
      routing="path"
    />
  </div>
</template>
