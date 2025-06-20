<script setup>
import { ref, onMounted } from 'vue'
import { useFlightStore } from '../stores/flight'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import UserAvatar from '../components/base/UserAvatar.vue'

const flightStore = useFlightStore()
const flights = ref([])
const loading = ref(true)
const page = ref(1)
const hasMore = ref(true)

const loadFlights = async () => {
  try {
    loading.value = true
    const response = await flightStore.getVisibleFlights(page.value)
    flights.value = [...flights.value, ...response.flights]
    hasMore.value = response.hasMore
    page.value++
  } catch (error) {
    console.error('Error cargando vuelos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFlights()
})
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Feed de Vuelos</h1>

    <!-- Lista de vuelos -->
    <div class="space-y-6">
      <BaseCard
        v-for="flight in flights"
        :key="flight._id"
        hover
        class="overflow-hidden"
      >
        <!-- Cabecera del vuelo -->
        <div class="flex items-center mb-4">
          <UserAvatar
            :src="flight.user.profilePicture"
            :alt="flight.user.name"
            size="md"
          />
          <div class="ml-3">
            <h3 class="font-medium text-gray-900 dark:text-gray-100">
              {{ flight.user.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ new Date(flight.createdAt).toLocaleDateString() }}
            </p>
          </div>
        </div>

        <!-- Contenido del vuelo -->
        <div class="mb-4">
          <h2 class="text-xl font-semibold mb-2">{{ flight.title }}</h2>
          <p class="text-gray-600 dark:text-gray-300">{{ flight.description }}</p>
        </div>

        <!-- Detalles del vuelo -->
        <div class="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div class="text-center">
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ flight.duration }}min</p>
            <p class="text-gray-500 dark:text-gray-400">Duración</p>
          </div>
          <div class="text-center">
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ flight.distance }}km</p>
            <p class="text-gray-500 dark:text-gray-400">Distancia</p>
          </div>
          <div class="text-center">
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ flight.maxAltitude }}m</p>
            <p class="text-gray-500 dark:text-gray-400">Altitud Máx</p>
          </div>
        </div>

        <!-- Drone usado -->
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span class="font-medium">Drone:</span> {{ flight.drone.name }}
        </div>

        <!-- Acciones -->
        <div class="flex justify-end space-x-2">
          <BaseButton variant="secondary" size="sm">
            Ver Detalles
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- Cargador de más vuelos -->
    <div class="mt-6 text-center">
      <BaseButton
        v-if="hasMore && !loading"
        variant="secondary"
        @click="loadFlights"
      >
        Cargar Más
      </BaseButton>
      <p v-if="loading" class="text-gray-500 dark:text-gray-400">
        Cargando...
      </p>
    </div>
  </div>
</template>