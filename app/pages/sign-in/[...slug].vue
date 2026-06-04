<script setup lang="ts">
const { afterLoginRedirect } = useSignInFlow()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <SignIn :force-redirect-url="afterLoginRedirect" />
  </div>
</template>
