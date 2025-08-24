import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import './assets/styles/main.css'
import i18nConfig from './locales/index.js'

const i18n = createI18n({
  ...i18nConfig,
  legacy: false,
  globalInjection: true
})

function loadGoogleMaps(callbackName = 'initMap') {
  const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker,geometry&callback=${callbackName}&loading=async`;
  script.async = true;
  script.defer = true;

  document.head.appendChild(script);
} 

window.initMap = function() {
  console.log('Google Maps API loaded')
}

const app = createApp(App)
const pinia = createPinia()


app.config.globalProperties.$api = import.meta.env.VITE_API_URL || 'http://localhost:3000'

loadGoogleMaps();
app.component('QuillEditor', QuillEditor)
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
