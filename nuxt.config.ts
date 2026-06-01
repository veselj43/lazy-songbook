import type { NuxtPage } from 'nuxt/schema'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
  },

  modules: [
    //
    '@nuxt/ui',
    '@clerk/nuxt',
    '@compodium/nuxt',
  ],

  ssr: false,

  css: ['~/assets/css/main.css'],

  hooks: {
    'pages:extend'(pages) {
      function removePartialPages(pages: NuxtPage[]) {
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i]!

          if (page.path.includes('/_partial/')) {
            pages.splice(i, 1)
            i--
          } else if (page.children) {
            removePartialPages(page.children)
          }
        }
      }

      removePartialPages(pages)
    },
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/favicon-64.png' },
      ],
    },
  },

  nitro: {
    rollupConfig: {
      external: ['better-sqlite3'],
    },
  },

  ui: {
    colorMode: false,
  },

  runtimeConfig: {
    public: {},
  },
})
