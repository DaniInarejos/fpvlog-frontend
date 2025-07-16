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
  console.log("GHOLAA")
  emit('showSpotInfo', spot)
}

const handleShowFlightInfo = (flight) => {
  emit('showFlightInfo', flight)
}
</script>

<template>
  <!-- Vuelos Recientes -->
  <BaseCard v-if="flights.length > 0" class="p-4">
    <h2 class="text-lg font-bold mb-3">{{ t('dashboard.flights.title') }}</h2>
    <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="flight in flights" :key="flight._id" class="bg-gray-50 p-3 rounded">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <h3 
              class="font-medium hover:text-primary-600 cursor-pointer"
              @click="handleShowFlightInfo(flight)"
            >
              {{ flight.title }}
            </h3>
            <svg 
              v-if="flight.urlVideo"
              xmlns="http://www.w3.org/2000/svg" 
              class="h-4 w-4 text-red-500" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
          <span class="text-xs text-gray-500">{{ new Date(flight.date).toLocaleDateString() }}</span>
        </div>
        <p class="text-gray-600 text-xs mb-2">{{ flight.description }}</p>
        <div class="flex justify-between text-xs text-gray-500">
          <div class="flex items-center gap-2">
            <span>🕒 {{ flight.duration }}{{ t('dashboard.flights.duration') }}</span>
            <span>📍 {{ flight.location }}</span>
          </div>
          <div class="flex items-center gap-1">
            <button 
              @click="handleLike('flight', flight)"
              :class="{ 'text-red-500': flight.likes?.some(like => like.userId === userStore.user?._id) }"
            > 
              <svg xmlns="http://www.w3.org/2000/svg" 
                   :class="[`h-4 w-4`, flight.likes?.some(like => like.userId === userStore.user?._id) ? 'text-red-500' : 'text-gray-400']" 
                   viewBox="0 0 20 20" 
                   fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </button>
            <span>{{ flight.likes?.length || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
  <BaseCard v-else class="p-4 text-center text-gray-500 text-sm">
    <p>{{ t('dashboard.flights.noFlights') }}</p>
  </BaseCard>

  <!-- Drones -->
  <BaseCard v-if="drones.length > 0" class="p-4">
    <h2 class="text-lg font-bold mb-3">{{ t('dashboard.drones.title') }}</h2>
    <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">  
      <div v-for="drone in drones" :key="drone._id" class="bg-gray-50 p-3 rounded">
        <div class="flex items-center space-x-3">
          <img 
            :src="drone.image || DEFAULT_IMAGE" 
            :alt="drone.name" 
            class="w-12 h-12 object-cover rounded" 
          />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div>
                <h3 
                  class="font-medium hover:text-primary-600 cursor-pointer"
                  @click="handleShowDroneInfo(drone)"
                >
                  {{ drone.name }}
                </h3>
                <p class="text-xs text-gray-500">{{ drone.model }}</p>
              </div>
              <div class="flex items-center gap-1">
                <button @click="handleLike('drone', drone)"> 
                  <svg xmlns="http://www.w3.org/2000/svg" 
                       :class="[`h-4 w-4`, drone.likes?.some(like => like.userId === userStore.user?._id) ? 'text-red-500' : 'text-gray-400']" 
                       viewBox="0 0 20 20" 
                       fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
                <span class="text-xs text-gray-500">{{ drone.likes?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>

  <!-- Spots -->
  <BaseCard v-if="spots.length > 0" class="p-4">
    <h2 class="text-lg font-bold mb-3">{{ t('dashboard.spots.title') }}</h2>
    <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="spot in spots" :key="spot._id" class="bg-gray-50 p-3 rounded">
        <div class="flex items-center space-x-3">
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div>
                <h3 
                  class="font-medium hover:text-primary-600 cursor-pointer"
                  @click="handleShowSpotInfo(spot)"
                >
                  {{ spot.name }}
                </h3>
                <p class="text-xs text-gray-500">{{ spot.location?.city }}, {{ spot.location?.country }}</p>
              </div>
              <div class="flex items-center gap-1">
                <button @click="handleLike('spot', spot)">
                  <svg xmlns="http://www.w3.org/2000/svg" 
                       :class="[`h-4 w-4`, spot.likes?.some(like => like.userId === userStore.user?._id) ? 'text-red-500' : 'text-gray-400']" 
                       viewBox="0 0 20 20" 
                       fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
                <span class="text-xs text-gray-500">{{ spot.likes?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
  <BaseCard v-else class="p-4 text-center text-gray-500 text-sm">
    <p>{{ t('dashboard.spots.noSpots') }}</p>
  </BaseCard>
</template>