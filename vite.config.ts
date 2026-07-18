import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      devOptions: {
        enabled: true,
      },

      manifest: {
        id: '/',
        name: 'رواد المستقبل',
        short_name: 'رواد المستقبل',
        description:
          'أفضل خدمات الشبكات، أنظمة المراقبة، الصيانة، والبرمجة.',

        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',

        background_color: '#0F172A',
        theme_color: '#F59E0B',

        lang: 'ar',
        dir: 'rtl',

        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})