<script setup lang="ts">
const { afterLoginRedirect, signInUrl, signUpUrl } = useSignInFlow()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <SignUp
      :force-redirect-url="afterLoginRedirect"
      :sign-in-force-redirect-url="afterLoginRedirect"
      :sign-in-url="signInUrl"
      path="/sign-up"
      routing="path"
    />
  </div>
</template>
