import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

// Importar archivos de idiomas
import es from './locales/es.js'
import en from './locales/en.js'

// Crear instancia de i18n
const i18n = createI18n({
  legacy: false, // Usar la API de Composition
  locale: 'es', // Idioma por defecto
  fallbackLocale: 'en', // Idioma de respaldo
  messages: {
    es,
    en
  }
})

// Add this before app creation
window.initMap = function() {
  // Empty function to satisfy the callback requirement
  console.log('Google Maps API loaded')
}

const app = createApp(App)
const pinia = createPinia()

// Configuración global
app.config.globalProperties.$api = import.meta.env.VITE_API_URL || 'http://localhost:3000'

app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
