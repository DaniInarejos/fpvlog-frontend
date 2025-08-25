import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'

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
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})