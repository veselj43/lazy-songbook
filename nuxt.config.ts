import type { NuxtPage } from 'nuxt/schema'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/favicon-64.png' },
      ],
    },
  },

  appConfig: {
    pagination: {
      defaultMaxPages: 10,
      defaultPageSize: 50,
    },
  },

  clerk: {
    allowedRedirectOrigins: ['https://songbook.lazytools.win'],
    // routerDebug: true,
  },

  compatibilityDate: '2026-07-15',

  css: ['~/assets/css/main.css'],

  devtools: {
    enabled: true,
  },

  experimental: {
    typedPages: true,
  },

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

  modules: [
    //
    '@nuxt/ui',
    '@nuxt/icon',
    '@clerk/nuxt',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
  ],

  runtimeConfig: {
    dbConnectionString: '',
    public: {
      appUrl: '',
    },
  },

  ssr: false,

  ui: {
    colorMode: false,
  },

  vite: {
    optimizeDeps: {
      include: [
        //
        '@vueuse/core',
        '@vueuse/integrations',
        '@vueuse/integrations/useQRCode',
        'tailwind-variants',
      ],
    },
  },
})
