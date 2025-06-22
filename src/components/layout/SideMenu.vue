<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'
import UserAvatar from '../base/UserAvatar.vue'

const route = useRoute()
const userStore = useUserStore()
const menuItems = computed(() => [
  {
    name: 'Feed',
    path: '/',
    icon: 'home',
    exact: true
  },
  {
    name: 'Mis Vuelos',
    path: '/flights',
    icon: 'flight',
    count: userStore.flightCount
  },
  {
    name: 'Mis Drones',
    path: '/drones',
    icon: 'drone',
    count: userStore.droneCount
  },
  {
    name: 'Seguidores',
    path: '/followers',
    icon: 'users',
    count: userStore.followerCount
  },
  {
    name: 'Siguiendo',
    path: '/following',
    icon: 'users-plus',
    count: userStore.followingCount
  }
])

const getIcon = (icon) => {
  // Mapa de iconos a caracteres o componentes
  const icons = {
    home: '🏠',
    flight: '✈️',
    drone: '🚁',
    users: '👥',
    'users-plus': '👥+'
  }
  return icons[icon] || ''
}

const isActive = (path, exact = false) => {
  if (exact) return route.path === path
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="bg-white shadow-md overflow-y-auto border-b sm:border-b-0">
    <!-- Perfil del usuario -->
    <div class="p-3 sm:p-4 border-b">
      <div class="flex items-center space-x-3">
        <UserAvatar 
          :src="userStore.user?.profilePicture"
          :alt="userStore.user?.name || 'Usuario'" 
          size="md" 
          status="online"
        />
        <div>
          <h3 class="font-medium text-gray-800 text-sm sm:text-base">{{ userStore.user?.name }}</h3>
          <p class="text-xs sm:text-sm text-gray-500">{{ userStore.user?.username }}</p>
        </div>
      </div>
    </div>
    
    <!-- Navegación -->
    <nav class="mt-2 sm:mt-4 px-2">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path" 
        :to="item.path"
        :class="[
          'flex items-center px-3 sm:px-4 py-2 sm:py-3 text-gray-600 rounded-lg mb-1 transition-colors text-sm sm:text-base',
          isActive(item.path) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
        ]"
      >
        <span class="mr-3 text-base sm:text-lg">{{ getIcon(item.icon) }}</span>
        <span>{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>