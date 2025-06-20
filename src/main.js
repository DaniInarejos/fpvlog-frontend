import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

// Configuración global
app.config.globalProperties.$api = import.meta.env.VITE_API_URL || 'http://localhost:3000'

app.use(pinia)
app.use(router)

app.mount('#app')
