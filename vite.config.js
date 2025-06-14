import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true, // Escuchar en todas las interfaces de red
    port: 5173, // Puerto por defecto de Vite
    strictPort: true, // No intentar otro puerto si está ocupado
    hmr: {
      // Opcional: configuración para HMR (Hot Module Replacement) a través de ngrok
      clientPort: 443 // Puerto para conexiones de cliente
    },
    // Permitir el host de ngrok
    allowedHosts: ['d383-93-176-152-140.ngrok-free.app']
  }
})
