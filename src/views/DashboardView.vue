<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import userService from '../services/userService'
import BaseCard from '../components/base/BaseCard.vue'
import UserAvatar from '../components/base/UserAvatar.vue'

const route = useRoute()
const userStore = useUserStore()

const dashboard = ref(null)
const loading = ref(true)
const error = ref('')

const loadDashboard = async () => {
  try {
    loading.value = true
    const username = route.params.username || userStore.user?.username
    
    if (!username) {
      error.value = 'Usuario no encontrado'
      return
    }

    const response = await userService.getDashboard(username)
    dashboard.value = response
  } catch (err) {
    error.value = 'Error cargando el dashboard'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-4">
      {{ error }}
    </div>

    <div v-else-if="dashboard" class="space-y-8">
      <!-- Perfil del Usuario -->
      <BaseCard>
        <div class="flex items-center space-x-6">
          <UserAvatar 
            :src="dashboard.user.profilePicture" 
            :alt="dashboard.user.username"
            :size="24" 
          />
          <div>
            <h1 class="text-2xl font-bold">{{ dashboard.user.name }} {{ dashboard.user.lastName }}</h1>
            <p class="text-gray-600">@{{ dashboard.user.username }}</p>
            <p class="text-primary font-semibold mt-2">{{ dashboard.user.points }} puntos</p>
          </div>
        </div>
      </BaseCard>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseCard>
          <div class="text-center">
            <h3 class="text-lg font-semibold">Drones</h3>
            <p class="text-3xl font-bold text-primary">{{ dashboard.stats.dronesCount }}</p>
          </div>
        </BaseCard>
        <BaseCard>
          <div class="text-center">
            <h3 class="text-lg font-semibold">Vuelos</h3>
            <p class="text-3xl font-bold text-primary">{{ dashboard.stats.flightsCount }}</p>
          </div>
        </BaseCard>
        <BaseCard>
          <div class="text-center">
            <h3 class="text-lg font-semibold">Seguidores</h3>
            <p class="text-3xl font-bold text-primary">{{ dashboard.stats.followersCount }}</p>
          </div>
        </BaseCard>
        <BaseCard>
          <div class="text-center">
            <h3 class="text-lg font-semibold">Siguiendo</h3>
            <p class="text-3xl font-bold text-primary">{{ dashboard.stats.followingCount }}</p>
          </div>
        </BaseCard>
      </div>

      <!-- Vuelos Recientes -->
      <BaseCard v-if="dashboard.recentFlights.length > 0">
        <template #header>
          <h2 class="text-xl font-bold">Vuelos Recientes</h2>
        </template>
        <div class="space-y-4">
          <div v-for="flight in dashboard.recentFlights" :key="flight._id"
               class="p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <!-- Aquí puedes reutilizar tu componente de vuelo o crear una versión simplificada -->
            <h3 class="font-semibold">{{ flight.title }}</h3>
            <p class="text-gray-600">{{ flight.description }}</p>
          </div>
        </div>
      </BaseCard>

      <!-- Drones -->
      <BaseCard v-if="dashboard.drones.length > 0">
        <template #header>
          <h2 class="text-xl font-bold">Mis Drones</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="drone in dashboard.drones" :key="drone._id"
               class="p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <!-- Aquí puedes reutilizar tu componente de drone o crear una versión simplificada -->
            <h3 class="font-semibold">{{ drone.name }}</h3>
            <p class="text-gray-600">{{ drone.description }}</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>