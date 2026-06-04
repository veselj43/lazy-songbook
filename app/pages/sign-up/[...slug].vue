<script setup lang="ts">
const { afterLoginRedirect } = useSignInFlow()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <SignUp :sign-in-force-redirect-url="afterLoginRedirect" />
  </div>
</template>
