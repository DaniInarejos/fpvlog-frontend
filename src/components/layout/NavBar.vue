<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import BaseButton from '../base/BaseButton.vue'
import UserAvatar from '../base/UserAvatar.vue'

const router = useRouter()
const userStore = useUserStore()
const showMobileMenu = ref(false)
const showUserMenu = ref(false)

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo y navegación principal -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-xl font-bold text-primary-600 dark:text-primary-400">
              FPV Log
            </router-link>
          </div>
          <!-- Enlaces de navegación desktop -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="item in [
                { name: 'Inicio', path: '/' },
                { name: 'Vuelos', path: '/flights' },
                { name: 'Drones', path: '/drones' },
              ]"
              :key="item.path"
              :to="item.path"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
          <BaseButton
            v-if="userStore.isAuthenticated"
            variant="primary"
            size="sm"
            @click="router.push('/flights/new')"
          >
            Nuevo Vuelo
          </BaseButton>

          <!-- Menú de usuario -->
          <div class="relative" v-if="userStore.isAuthenticated">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 focus:outline-none"
            >
              <UserAvatar
                :src="userStore.user?.profilePicture"
                :alt="userStore.user?.name || 'Usuario'"
                size="sm"
              />
            </button>

            <!-- Dropdown menú -->
            <div
              v-show="showUserMenu"
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Mi Perfil
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <template v-else>
            <BaseButton
              variant="secondary"
              size="sm"
              @click="router.push('/login')"
            >
              Iniciar Sesión
            </BaseButton>
            <BaseButton
              variant="primary"
              size="sm"
              @click="router.push('/register')"
            >
              Registrarse
            </BaseButton>
          </template>
        </div>

        <!-- Botón menú móvil -->
        <div class="-mr-2 flex items-center sm:hidden">
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            <span class="sr-only">Abrir menú principal</span>
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!showMobileMenu"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menú móvil -->
    <div v-show="showMobileMenu" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          v-for="item in [
            { name: 'Inicio', path: '/' },
            { name: 'Vuelos', path: '/flights' },
            { name: 'Drones', path: '/drones' },
          ]"
          :key="item.path"
          :to="item.path"
          class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="showMobileMenu = false"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- Acciones móvil -->
      <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-600">
        <div v-if="userStore.isAuthenticated" class="space-y-1">
          <router-link
            to="/profile"
            class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="showMobileMenu = false"
          >
            Mi Perfil
          </router-link>
          <button
            @click="handleLogout"
            class="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cerrar Sesión
          </button>
        </div>
        <div v-else class="space-y-1">
          <router-link
            to="/login"
            class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="showMobileMenu = false"
          >
            Iniciar Sesión
          </router-link>
          <router-link
            to="/register"
            class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="showMobileMenu = false"
          >
            Registrarse
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>