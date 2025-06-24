<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

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
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
    <div >
      <div class="flex justify-between h-14 sm:h-16">
        <!-- Logo y navegación principal agrupados -->
        <div class="flex items-center space-x-4 sm:space-x-8">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <img src="/src/assets/images/logoSkySphere.png" alt="SkySphere Logo" class="h-14 w-14" />
              <span class="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400">SkySphere</span>
            </router-link>
          </div>
          
          <!-- Enlaces de navegación siempre visibles -->
          <div class="flex space-x-4">
            <router-link
              v-for="item in [
                { name: 'Mi Perfil', path: '/' },
                { name: 'Vuelos', path: '/flights' },
                { name: 'Drones', path: '/drones' },
              ]"
              :key="item.path"
              :to="item.path"
              class="px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- Menú de usuario a la derecha -->
        <div class="flex items-center" v-if="userStore.isAuthenticated" ref="menuRef">
          <button
            @click="toggleUserMenu"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none group"
          >
            <svg
              :class="[
                'w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-all duration-500 hover:text-primary-600 group-hover:animate-wiggle',
                { 'rotate-360': isRotating }
              ]"
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
            class="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 text-sm top-full"
          >
            <router-link
              to="/profile"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Mis Datos
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Marcas Drones
            </button>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Tipos de Drones
            </button>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
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

/* Asegurarse de que la animación solo se ejecute una vez al hacer hover */
.group:hover .group-hover\:animate-wiggle {
  animation: wiggle 0.3s ease-in-out;
}

/* Reiniciar la animación cuando el mouse sale del elemento */
.group:not(:hover) .group-hover\:animate-wiggle {
  animation: none;
}
</style>