<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const showMobileMenu = ref(false)
const showUserMenu = ref(false)
const isRotating = ref(false)
const menuRef = ref(null)

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}

const handleAboutOf = async () => {
  router.push('/about')
}

const toggleUserMenu = () => {
  isRotating.value = true
  showUserMenu.value = !showUserMenu.value
  // Resetear la animación después de que termine
  setTimeout(() => {
    isRotating.value = false
  }, 500) // 500ms es la duración de la animación
}

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const showToast = ref(false)
const handleDroneOptions = (item) => {
  if (item === 'Marcas Drones' || item === 'Tipos de Drones') {
    showToast.value = true
    showUserMenu.value = false
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  } else if (item === 'Acerca de') {
    handleAboutOf()
  } else {
    handleLogout()
  }
}

const { locale } = useI18n()
const currentLanguage = computed(() => locale.value)

const toggleLanguage = () => {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  // Opcional: guardar la preferencia en localStorage
  localStorage.setItem('language', locale.value)
}

// Cargar el idioma preferido al iniciar
onMounted(() => {
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }
})
</script>

<template>
  <nav class="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 sticky top-0 z-50 transition-all duration-300">
    <div class="px-4">
      <div class="flex justify-between h-16">
        <!-- Logo y navegación principal -->
        <div class="flex items-center space-x-8">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center space-x-3 group">
              <img src="/src/assets/images/logoSkySphere.png" alt="SkySphere Logo" class="h-12 w-12 transform transition-transform duration-300 group-hover:scale-110" />
              <span class="text-xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">SkySphere</span>
            </router-link>
          </div>
          
          <!-- Enlaces de navegación -->
          <div class="flex space-x-6">
            <router-link
              v-for="item in [
                { name: $t('message.nav.profile'), path: '/' },
                { name: $t('message.nav.flights'), path: '/flights' },
                { name: $t('message.nav.drones'), path: '/drones' },
              ]"
              :key="item.path"
              :to="item.path"
              class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- Menú de usuario -->
        <div class="flex items-center" v-if="userStore.isAuthenticated" ref="menuRef">
          <!-- Botón de idioma -->
          <button
            @click="toggleLanguage"
            class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300"
            :title="currentLanguage === 'es' ? 'Switch to English' : 'Cambiar a Español'"
          >
            {{ currentLanguage === 'es' ? 'ES' : 'EN' }}
          </button>
          
          <!-- Botón de menú existente -->
          <button
            @click="toggleUserMenu"
            class="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50 focus:outline-none group transition-all duration-300"
          >
            <svg
              class="w-6 h-6 text-gray-600 dark:text-gray-300 transition-all duration-500 hover:text-sky-500 dark:hover:text-sky-400 group-hover:animate-wiggle"
              :class="{ 'rotate-360': isRotating }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          <!-- Dropdown menú -->
          <div
            v-show="showUserMenu"
            class="absolute right-4 top-14 mt-1 w-48 rounded-xl shadow-lg py-1 bg-white/80 dark:bg-gray-700/80 backdrop-blur-md ring-1 ring-black/5 transform transition-all duration-300 origin-top-right animate-fade-in"
          >
            <router-link
              to="/profile"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-300"
            >
              {{ $t('message.nav.profile') }}
            </router-link>
            <button
              v-for="(item, index) in [
                { name: $t('message.nav.droneBrands'), action: 'Marcas Drones' },
                { name: $t('message.nav.droneTypes'), action: 'Tipos de Drones' },
                { name: $t('message.nav.about'), action: 'Acerca de' },
                { name: $t('message.nav.logout'), action: 'Cerrar Sesión' }
              ]"
              :key="index"
              @click="handleDroneOptions(item.action)"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-300"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Toast de Work in Progress -->
  <div
    v-if="showToast"
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg z-50 min-w-[300px] text-center border border-sky-500/20 animate-fade-in"
  >
    <div class="flex items-center justify-center space-x-3 text-lg font-medium text-gray-900 dark:text-white">
      <svg class="w-6 h-6 text-sky-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>🚧 Work in Progress</span>
    </div>
    <p class="mt-2 text-gray-600 dark:text-gray-300">Esta funcionalidad estará disponible próximamente</p>
  </div>
</template>

<style>
.rotate-360 {
  transform: rotate(360deg);
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

.animate-wiggle {
  animation: wiggle 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

/* Asegurarse de que la animación solo se ejecute una vez al hover */
.group:hover .group-hover\:animate-wiggle {
  animation: wiggle 0.3s ease-in-out;
}

/* Reiniciar la animación cuando el mouse sale del elemento */
.group:not(:hover) .group-hover\:animate-wiggle {
  animation: none;
}
</style>
