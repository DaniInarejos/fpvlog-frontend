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
  <aside class="w-64 bg-white shadow-md h-screen sticky top-0 overflow-y-auto">
    <!-- Perfil del usuario -->
    <div class="p-4 border-b">
      <div class="flex items-center space-x-3">
        <UserAvatar 
          :src="userStore.user?.profilePicture"
          :alt="userStore.user?.name || 'Usuario'" 
          size="md" 
          status="online"
        />
        <div>
          <h3 class="font-medium text-gray-800">{{ userStore.user?.name }}</h3>
          <p class="text-sm text-gray-500">{{ userStore.user?.username }}</p>
        </div>
      </div>
    </div>
    
    <!-- Navegación -->
    <nav class="mt-4 px-2">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path" 
        :to="item.path"
        :class="[
          'flex items-center px-4 py-3 text-gray-600 rounded-lg mb-1 transition-colors',
          isActive(item.path) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
        ]"
      >
        <span class="mr-3 text-lg">{{ getIcon(item.icon) }}</span>
        <span>{{ item.name }}</span>
      </router-link>
    </nav>
    
    <!-- Sección de tendencias -->
    <div class="mt-8 px-4">
      <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Tendencias</h4>
      <div class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-gray-50 p-3 rounded-lg">
          <p class="text-sm font-medium text-gray-800">#Tendencia{{ i }}</p>
          <p class="text-xs text-gray-500">{{ 1000 * i }}+ publicaciones</p>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="mt-8 px-4 py-4 text-xs text-gray-500">
      <p>© 2025 FPV Log - Daniel Inarejos Aroca</p>
      <div class="mt-2 space-x-2">
        <a href="#" class="hover:text-blue-600">Términos</a>
        <span>·</span>
        <a href="#" class="hover:text-blue-600">Privacidad</a>
        <span>·</span>
        <a href="#" class="hover:text-blue-600">Ayuda</a>
      </div>
    </div>
  </aside>
</template>