<script setup>
import { defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseButton from '../base/BaseButton.vue'

const { t } = useI18n()

const props = defineProps({
  flights: {
    type: Array,
    required: true
  },
  drones: {
    type: Array,
    required: true
  },
  spots: {
    type: Array,
    required: true
  },
  showCreateButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['edit', 'delete', 'showDroneInfo', 'showFlightInfo', 'showSpotInfo', 'create'])

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDuration = (duration) => {
  if (!duration) return ''
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const getYouTubeThumbnail = (url) => {
  if (!url) return null
  // Soporte para videos normales y shorts
  const videoId = url.match(/(?:youtube\.com\/(?:shorts\/|(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))|youtu\.be\/)([^"&?\/ ]{11})/)?.[1]
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
}

const getSpotName = (spotId) => {
  if (!spotId) return t('message.flights.details.notSpecified')
  const spot = props.spots.find(s => s._id === spotId)
  return spot ? spot.name : t('message.flights.details.notSpecified')
}

const handleCreate = () => {
  emit('create')
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('message.flights.title') }}</h1>
      
      <BaseButton
        v-if="showCreateButton"
        @click="handleCreate"
      >
        {{ $t('message.flights.addFlight') }}
      </BaseButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard v-for="flight in flights" :key="flight._id" class="overflow-hidden">
        <!-- Resto del contenido de la tarjeta sin cambios -->
        <div class="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <template v-if="flight.urlVideo">
            <img
              :src="getYouTubeThumbnail(flight.urlVideo)"
              :alt="flight.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
              </svg>
            </div>
          </template>
          <img
            v-else
            :src="flight.image || '/images/placeholder.png'"
            :alt="flight.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 
                class="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer"
                @click="emit('showFlightInfo', flight)"
              >
                {{ flight.title }}
              </h3>
              <p class="text-sm text-gray-600">{{ formatDate(flight.date) }}</p>
            </div>
          </div>

          <div class="text-sm text-gray-600 mb-4">
            <p class="mb-1 flex items-center justify-between">
              <span>
                <span class="font-medium">{{ t('message.flights.details.drone') }}:</span>
                <span 
                  v-if="flight.droneId"
                  class="hover:text-primary-600 cursor-pointer"
                  @click="emit('showDroneInfo', flight.droneId)"
                >
                  {{ drones.find(d => d._id === flight.droneId)?.name }}
                </span>
                <span v-else>{{ t('message.flights.details.notSpecified') }}</span>
              </span>
            </p>
            <p class="mb-1">
              <span class="font-medium">{{ t('message.flights.details.location') }}:</span>
              <span 
                v-if="flight.spotId"
                class="hover:text-primary-600 cursor-pointer"
                @click="emit('showSpotInfo', flight.spotId)"
              >
                {{ getSpotName(flight.spotId) }}
              </span>
              <span v-else>{{ t('message.flights.details.notSpecified') }}</span>
            </p>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <span class="font-medium">{{ formatDuration(flight.duration) }}</span>
                <span class="text-gray-400">{{ t('message.flights.details.duration') }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="font-medium">{{ flight.batteryUsed }}</span>
                <span class="text-gray-400">{{ t('message.flights.details.batteries') }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1 text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {{flight.likesCount || 0 }}
          </div>
          <div class="flex justify-end space-x-2">
            <BaseButton
              size="sm"
              variant="secondary"
              @click="emit('edit', flight)"
            >
              {{ t('message.common.edit') }}
            </BaseButton>
            <BaseButton
              size="sm"
              variant="danger"
              @click="emit('delete', flight)"
            >
              {{ t('message.common.delete') }}
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>