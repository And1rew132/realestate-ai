// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  
  // App configuration with base URL support
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    buildAssetsDir: process.env.NUXT_APP_BUILD_ASSETS_DIR || '/_nuxt/',
    head: {
      title: 'Real Estate Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern SaaS application for managing property rentals and sales' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Router configuration
  router: {
    options: {
      strict: false,
      sensitive: false
    }
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      stripePublishableKey: process.env.PUBLIC_STRIPE_PUBLISHABLE_KEY,
      appUrl: process.env.PUBLIC_APP_URL || 'http://localhost:3000',
      baseUrl: process.env.NUXT_APP_BASE_URL || '/'
    }
  },
  
  typescript: {
    strict: true,
    typeCheck: false
  },

  // Build configuration
  build: {
    transpile: ['@headlessui/vue']
  },

  // Nitro configuration for deployment
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true
  }
})