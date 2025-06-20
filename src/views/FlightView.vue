<script setup>
import { ref, onMounted,computed } from 'vue'

import { useRoute } from 'vue-router'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseAlert from '../components/base/BaseAlert.vue'

const route = useRoute()
const flight = ref(null)
const isLoading = ref(true)
const error = ref(null)

const fetchFlight = async () => {
  isLoading.value = true
  try {
    // Aquí iría la llamada a la API para obtener los detalles del vuelo
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación temporal
    flight.value = {
      id: route.params.id,
      title: 'Vuelo de prueba',
      date: new Date().toISOString(),
      duration: '5:30',
      maxAltitude: 120,
      maxSpeed: 80,
      distance: 2.5,
      drone: {
        id: 1,
        brand: 'TBS',
        model: 'Source One',
      },
      weather: {
        temperature: 22,
        windSpeed: 15,
        conditions: 'Soleado'
      },
      likes: 5,
      comments: []
    }
  } catch (err) {
    error.value = 'Error al cargar los detalles del vuelo'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLike = async () => {
  try {
    // Aquí iría la llamada a la API para dar like
    flight.value.likes++
  } catch (err) {
    error.value = 'Error al dar like'
    console.error(err)
  }
}

const shareUrl = computed(() => {
  return `${window.location.origin}/flights/${flight.value?.id}`
})

const handleShare = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    alert('Enlace copiado al portapapeles')
  } catch (err) {
    error.value = 'Error al copiar el enlace'
    console.error(err)
  }
}

onMounted(fetchFlight)
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <BaseAlert
      v-if="error"
      type="error"
      :message="error"
    />

    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <template v-else-if="flight">
      <div class="flex flex-col md:flex-row justify-between items-start gap-8">
        <!-- Información principal -->
        <div class="w-full md:w-2/3">
          <BaseCard class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  {{ flight.title }}
                </h1>
                <p class="text-sm text-gray-500 mt-1">
                  {{ formatDate(flight.date) }}
                </p>
              </div>
              <div class="flex space-x-2">
                <BaseButton
                  variant="secondary"
                  @click="handleLike"
                >
                  <template #icon>
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </template>
                  {{ flight.likes }}
                </BaseButton>
                <BaseButton
                  variant="secondary"
                  @click="handleShare"
                >
                  Compartir
                </BaseButton>
              </div>
            </div>

            <!-- Mapa -->
            <div class="mt-6 bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <p class="text-gray-500">Mapa del vuelo (pendiente de implementar)</p>
            </div>

            <!-- Estadísticas del vuelo -->
            <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Duración</h3>
                <p class="mt-1 text-xl font-semibold text-gray-900">{{ flight.duration }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Altitud Máxima</h3>
                <p class="mt-1 text-xl font-semibold text-gray-900">{{ flight.maxAltitude }}m</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Velocidad Máxima</h3>
                <p class="mt-1 text-xl font-semibold text-gray-900">{{ flight.maxSpeed }}km/h</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Distancia</h3>
                <p class="mt-1 text-xl font-semibold text-gray-900">{{ flight.distance }}km</p>
              </div>
            </div>
          </BaseCard>

          <!-- Gráficos -->
          <BaseCard class="mt-8 p-6">
            <h2 class="text-xl font-semibold mb-4">Telemetría</h2>
            <div class="space-y-6">
              <div class="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <p class="text-gray-500">Gráfico de altitud (pendiente de implementar)</p>
              </div>
              <div class="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <p class="text-gray-500">Gráfico de velocidad (pendiente de implementar)</p>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Información lateral -->
        <div class="w-full md:w-1/3 space-y-8">
          <!-- Información del drone -->
          <BaseCard class="p-6">
            <h2 class="text-xl font-semibold mb-4">Drone</h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Modelo</h3>
                <p class="mt-1 text-gray-900">{{ flight.drone.brand }} {{ flight.drone.model }}</p>
              </div>
            </div>
          </BaseCard>

          <!-- Condiciones meteorológicas -->
          <BaseCard class="p-6">
            <h2 class="text-xl font-semibold mb-4">Condiciones Meteorológicas</h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Temperatura</h3>
                <p class="mt-1 text-gray-900">{{ flight.weather.temperature }}°C</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Viento</h3>
                <p class="mt-1 text-gray-900">{{ flight.weather.windSpeed }} km/h</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Condiciones</h3>
                <p class="mt-1 text-gray-900">{{ flight.weather.conditions }}</p>
              </div>
            </div>
          </BaseCard>

          <!-- Comentarios -->
          <BaseCard class="p-6">
            <h2 class="text-xl font-semibold mb-4">Comentarios</h2>
            <div v-if="flight.comments.length === 0" class="text-center py-4 text-gray-500">
              No hay comentarios todavía
            </div>
            <!-- Aquí iría la lista de comentarios cuando se implemente -->
          </BaseCard>
        </div>
      </div>
    </template>

    <div
      v-else
      class="text-center py-12 text-gray-500"
    >
      Vuelo no encontrado
    </div>
  </div>
</template>