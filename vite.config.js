import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    historyApiFallback: true
  },
  build: {
    outDir: 'dist'
  }
})

// Necesitarás configurar tu servidor para manejar correctamente las rutas. Cuando uses `createWebHistory`, todas las URLs deben redirigir a tu `index.html` para que Vue Router pueda manejarlas correctamente.

// Si estás usando Vite (que parece ser el caso por la URL que proporcionaste), necesitarás actualizar la configuración de Vite para manejar el enrutamiento del lado del servidor. Añade esto a tu `vite.config.js`:
