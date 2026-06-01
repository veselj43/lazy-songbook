import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      //
      'app',
      'server',
      'shared',
    ],
  },
})
