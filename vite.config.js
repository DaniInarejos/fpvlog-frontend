import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(),
    Sitemap({
      hostname: 'https://skysphere.app',
      dynamicRoutes: [
        '/spots',
        '/flights',
        '/drones',
        '/components',
        '/dashboard',
        '/feed',
        '/profile',
        '/login',
        '/groups',
        '/feedSpots',
        '/about',
        '/followers'
      ],
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})