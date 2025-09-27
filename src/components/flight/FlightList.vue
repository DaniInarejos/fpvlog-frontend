<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CardGlassBase from '../base/CardGlassBase.vue'
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
  activeFilter: {
    type: String,
    default: 'ALL'
  },
  showCreateButton: {
    type: Boolean,
    default: true
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete', 'showDroneInfo', 'showFlightInfo', 'showSpotInfo', 'create', 'view'])

// Vuelos filtrados basados en el filtro activo recibido como prop
const filteredFlights = computed(() => {
  if (props.activeFilter === 'ALL') {
    return props.flights
  }
  
  return props.flights.filter(flight => {
    switch (props.activeFilter) {
      case 'PUBLIC':
        return flight.visibility === 'PUBLIC' || flight.visibility === 'public'
      case 'FOLLOWERS':
        return flight.visibility === 'FOLLOWERS' || flight.visibility === 'followers'
      case 'PRIVATE':
        return flight.visibility === 'PRIVATE' || flight.visibility === 'private'
      case 'WITH_VIDEO':
        return flight.videoUrl && flight.videoUrl.trim() !== ''
      case 'FAVORITES':
        return flight.favorite
      default:
        return true
    }
  })
})

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

// Función para obtener el spot de un vuelo
const getSpot = (flight) => {
  return props.spots.find(s => s._id === flight.spotId)
}

// Función para obtener thumbnail de YouTube
const getYouTubeThumbnail = (url) => {
  if (!url) return null
  const videoId = url.match(/(?:youtube\.com\/(?:shorts\/|(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))|youtu\.be\/)([^"&?\/ ]{11})/)?.[1]
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
}

// Función para extraer el valor de visibility (maneja tanto string como objeto)
const getVisibilityValue = (visibility) => {
  if (!visibility) return null
  
  // Si es un string, lo devolvemos directamente
  if (typeof visibility === 'string') {
    return visibility
  }
  
  // Si es un objeto, extraemos el valor basado en las propiedades
  if (typeof visibility === 'object') {
    if (visibility.isPublic || visibility.public) {
      return 'public'
    } else if (visibility.isVisibleToFollowers || visibility.visibleToFollowersOnly) {
      return 'followers'
    } else {
      return 'private'
    }
  }
  
  return null
}

// Función para obtener el icono de visibilidad
const getVisibilityIcon = (visibility) => {
  const value = getVisibilityValue(visibility)
  switch (value) {
    case 'public':
      return '🌍'
    case 'followers':
      return '👥'
    case 'private':
      return '🔒'
    default:
      return '👁️'
  }
}

// Función para obtener la imagen del vuelo
const getFlightImage = (flight) => {
  // Prioridad 1: Imagen subida (posterUrl)
  if (flight.posterUrl) {
    return flight.posterUrl
  }
  
  // Prioridad 2: Video thumbnail de YouTube
  if (flight.videoUrl && getYouTubeThumbnail(flight.videoUrl)) {
    return getYouTubeThumbnail(flight.videoUrl)
  }
  
  return null
}

const handleCreate = () => {
  emit('create')
}
</script>

<template>
  <div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardGlassBase 
        v-for="flight in filteredFlights" 
        :key="flight._id"
        :title="flight.title || t('flights.untitled')"
        :subtitle="formatDate(flight.date)"
        :image="getFlightImage(flight)"
        fallback-icon="✈️"
        :is-authenticated="isAuthenticated"
        edit-icon="✏️"
        delete-icon="🗑️"
        edit-button-color="green"
        delete-button-color="red"
        @edit="emit('edit', flight)"
        @delete="emit('delete', flight)"
        @view="emit('view', flight)"
      >
        <template #info-icons>
          <!-- Icono de visibilidad -->
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <span class="text-lg">{{ getVisibilityIcon(flight.visibility) }}</span>
          </div>

          <!-- Icono de spot -->
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <span class="text-lg" :class="getSpot(flight) ? 'opacity-100' : 'opacity-40'">📍</span>
          </div>

          <!-- Icono de destacado -->
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <span class="text-lg" :class="flight.featured ? 'text-yellow-400' : 'opacity-40'">⭐</span>
          </div>

          <!-- Icono de video si tiene YouTube -->
          <div v-if="flight.videoUrl && getYouTubeThumbnail(flight.videoUrl)" class="flex items-center justify-center w-8 h-8 rounded-full bg-red-600/80 backdrop-blur-sm border border-white/30 shadow-lg">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </template>
      </CardGlassBase>
    </div>
  </div>
</template>