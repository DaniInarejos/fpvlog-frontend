<script setup>
import { computed } from 'vue'
import { useUserStore } from '../../stores/user'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'

const DEFAULT_IMAGE = '/images/placeholder.png'
const userStore = useUserStore()
const { t } = useI18n()

const props = defineProps({
  dashboard: {
    type: Object,
    required: true
  }
})

const flights = computed(() => props.dashboard?.flights || [])
const drones = computed(() => props.dashboard?.drones || [])
const spots = computed(() => props.dashboard?.spots || [])

const emit = defineEmits(['like', 'showDroneInfo', 'showSpotInfo', 'showFlightInfo'])

const handleLike = (type, item) => {
  emit('like', { type, item })
}

const handleShowDroneInfo = (drone) => {
  emit('showDroneInfo', drone)
}

const handleShowSpotInfo = (spot) => {
  emit('showSpotInfo', spot)
}

const handleShowFlightInfo = (flight) => {
  emit('showFlightInfo', flight)
}

// Función para formatear fechas
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Función para formatear duración
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="space-y-8">
    <!-- Vuelos Recientes -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-green-500/10">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-foreground">{{ t('dashboard.flights.title') }}</h2>
        </div>
        <span class="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {{ flights.length }} {{ flights.length === 1 ? 'vuelo' : 'vuelos' }}
        </span>
      </div>
      
      <BaseCard v-if="flights.length > 0" class="p-6">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="flight in flights" 
            :key="flight._id" 
            :s
            class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-muted/20 border border-border p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            @click="handleShowFlightInfo(flight)"
          >
            <!-- Imagen de fondo si existe -->
            <div v-if="flight.image" class="absolute inset-0 opacity-10">
              <img :src="flight.image" :alt="flight.title" class="w-full h-full object-cover" />
            </div>
            
            <div class="relative">
              <!-- Header del vuelo -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {{ flight.title }}
                  </h3>
                  <p class="text-sm text-muted-foreground mt-1">
                    {{ formatDate(flight.date) }}
                  </p>
                </div>
                
                <!-- Botón de like -->
                <button 
                  @click.stop="handleLike('flight', flight)"
                  class="p-2 rounded-full hover:bg-muted/50 transition-colors group/like"
                >
                  <svg 
                    class="w-5 h-5 transition-all duration-200 group-hover/like:scale-110" 
                    :class="flight.likes?.some(like => like.userId === userStore.user?._id) ? 'text-red-500 fill-current' : 'text-muted-foreground'"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <!-- Información del vuelo -->
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ formatDuration(flight.duration || 0) }}</span>
                </div>
                
                <div v-if="flight.location" class="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="truncate">{{ flight.location }}</span>
                </div>
              </div>
              
              <!-- Footer con likes -->
              <div class="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <div class="flex items-center gap-1 text-sm text-muted-foreground">
                  <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{{ flight.likes?.length || 0 }}</span>
                </div>
                
                <div class="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                  Ver detalles →
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard v-else class="p-8 text-center">
        <div class="flex flex-col items-center gap-4">
          <div class="p-4 rounded-full bg-muted/50">
            <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-foreground mb-1">{{ t('dashboard.flights.noFlights') }}</h3>
            <p class="text-sm text-muted-foreground">Los vuelos aparecerán aquí cuando se registren</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Drones -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-blue-500/10">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-foreground">{{ t('dashboard.drones.title') }}</h2>
        </div>
        <span class="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {{ drones.length }} {{ drones.length === 1 ? 'drone' : 'drones' }}
        </span>
      </div>
      
      <BaseCard v-if="drones.length > 0" class="p-6">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="drone in drones" 
            :key="drone._id" 
            class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-muted/20 border border-border p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            @click="handleShowDroneInfo(drone)"
          >
            <div class="relative">
              <!-- Imagen del drone -->
              <div class="flex items-center gap-4 mb-4">
                <div class="relative">
                  <img 
                    :src="drone.image || DEFAULT_IMAGE" 
                    :alt="drone.name" 
                    class="w-16 h-16 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow" 
                  />
                  <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                </div>
                
                <div class="flex-1">
                  <h3 class="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {{ drone.name }}
                  </h3>
                  <p class="text-sm text-muted-foreground">{{ drone.model }}</p>
                </div>
                
                <!-- Botón de like -->
                <button 
                  @click.stop="handleLike('drone', drone)"
                  class="p-2 rounded-full hover:bg-muted/50 transition-colors group/like"
                >
                  <svg 
                    class="w-5 h-5 transition-all duration-200 group-hover/like:scale-110" 
                    :class="drone.likes?.some(like => like.userId === userStore.user?._id) ? 'text-red-500 fill-current' : 'text-muted-foreground'"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <!-- Información adicional -->
              <div class="space-y-2">
                <div v-if="drone.weight" class="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span>{{ drone.weight }}g</span>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <div class="flex items-center gap-1 text-sm text-muted-foreground">
                  <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{{ drone.likes?.length || 0 }}</span>
                </div>
                
                <div class="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                  Ver detalles →
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard v-else class="p-8 text-center">
        <div class="flex flex-col items-center gap-4">
          <div class="p-4 rounded-full bg-muted/50">
            <svg class="w-8 h-8 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-foreground mb-1">No hay drones registrados</h3>
            <p class="text-sm text-muted-foreground">Los drones aparecerán aquí cuando se registren</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Spots -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-purple-500/10">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-foreground">{{ t('dashboard.spots.title') }}</h2>
        </div>
        <span class="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {{ spots.length }} {{ spots.length === 1 ? 'spot' : 'spots' }}
        </span>
      </div>
      
      <BaseCard v-if="spots.length > 0" class="p-6">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="spot in spots" 
            :key="spot._id" 
            class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-muted/20 border border-border p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            @click="handleShowSpotInfo(spot)"
          >
            <div class="relative">
              <!-- Header del spot -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {{ spot.name }}
                  </h3>
                  <p class="text-sm text-muted-foreground mt-1">
                    {{ spot.location?.city }}, {{ spot.location?.country }}
                  </p>
                </div>
                
                <!-- Botón de like -->
                <button 
                  @click.stop="handleLike('spot', spot)"
                  class="p-2 rounded-full hover:bg-muted/50 transition-colors group/like"
                >
                  <svg 
                    class="w-5 h-5 transition-all duration-200 group-hover/like:scale-110" 
                    :class="spot.likes?.some(like => like.userId === userStore.user?._id) ? 'text-red-500 fill-current' : 'text-muted-foreground'"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <!-- Información del spot -->
              <div class="space-y-2">
                <div v-if="spot.difficulty" class="flex items-center gap-2 text-sm">
                  <span class="text-muted-foreground">Dificultad:</span>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-500/10 text-green-600': spot.difficulty === 'easy',
                      'bg-yellow-500/10 text-yellow-600': spot.difficulty === 'medium',
                      'bg-red-500/10 text-red-600': spot.difficulty === 'hard'
                    }"
                  >
                    {{ spot.difficulty === 'easy' ? 'Fácil' : spot.difficulty === 'medium' ? 'Medio' : 'Difícil' }}
                  </span>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <div class="flex items-center gap-1 text-sm text-muted-foreground">
                  <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{{ spot.likes?.length || 0 }}</span>
                </div>
                
                <div class="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                  Ver detalles →
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard v-else class="p-8 text-center">
        <div class="flex flex-col items-center gap-4">
          <div class="p-4 rounded-full bg-muted/50">
            <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-foreground mb-1">{{ t('dashboard.spots.noSpots') }}</h3>
            <p class="text-sm text-muted-foreground">Los spots aparecerán aquí cuando se registren</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>