<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  flight: {
    type: Object,
    required: true
  },
  drones: {
    type: Array,
    default: () => []
  },
  spots: {
    type: Array,
    default: () => []
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'blue'
  }
})

const emit = defineEmits(['edit', 'delete', 'view', 'showDroneInfo', 'showSpotInfo'])

const { t } = useI18n()

const isHovered = ref(false)

const colorClasses = computed(() => {
  const colors = {
    blue: {
      gradient: 'from-blue-400/60 to-blue-600/60',
      border: 'border-blue-200/50 dark:border-blue-700/50',
      accent: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      gradient: 'from-green-400/60 to-green-600/60',
      border: 'border-green-200/50 dark:border-green-700/50',
      accent: 'text-green-600 dark:text-green-400'
    },
    purple: {
      gradient: 'from-purple-400/60 to-purple-600/60',
      border: 'border-purple-200/50 dark:border-purple-700/50',
      accent: 'text-purple-600 dark:text-purple-400'
    }
  }
  return colors[props.color] || colors.blue
})

const spot = computed(() => {
  return props.spots.find(s => s._id === props.flight.spotId)
})

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

const handleEdit = () => {
  emit('edit', props.flight)
}

const handleDelete = () => {
  emit('delete', props.flight)
}

const handleView = () => {
  emit('view', props.flight)
}
</script>

<template>
  <div 
    @click="handleView"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    class="group relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer">
    
    <!-- Glassmorphism background layers -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent"></div>
    
    <!-- Gradiente de color en la parte superior -->
    <div :class="`h-1 bg-gradient-to-r ${colorClasses.gradient} shadow-sm`"></div>
    
    <!-- Contenido principal -->
    <div class="relative z-10">
      <!-- Imagen principal -->
      <div class="relative">
        <div class="aspect-video w-full overflow-hidden">
          <!-- Prioridad 1: Imagen subida (posterUrl) -->
          <template v-if="flight.posterUrl">
            <img
              :src="flight.posterUrl"
              :alt="flight.title"
              class="w-full h-full object-cover"
            />
          </template>
          
          <!-- Prioridad 2: Video thumbnail de YouTube -->
          <template v-else-if="flight.videoUrl && getYouTubeThumbnail(flight.videoUrl)">
            <img
              :src="getYouTubeThumbnail(flight.videoUrl)"
              :alt="flight.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div class="w-12 h-12 bg-red-600/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </template>

          <!-- Placeholder si no hay imagen -->
          <template v-else>
            <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <div class="text-6xl opacity-50">✈️</div>
            </div>
          </template>
        </div>

        <!-- Título superpuesto en la imagen -->
        <div class="absolute top-4 left-4 right-4">
          <h3 class="text-lg font-bold text-white line-clamp-2" 
              style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6);">
            {{ flight.title || t('flights.untitled') }}
          </h3>
        </div>

        <!-- Overlay con gradiente para los iconos -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent h-16"></div>

        <!-- Iconos agrupados en la parte inferior -->
        <div class="absolute bottom-4 left-4 flex items-center space-x-2">
          <!-- Icono de visibilidad -->
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <span class="text-lg">{{ getVisibilityIcon(flight.visibility) }}</span>
          </div>

          <!-- Icono de spot -->
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <span class="text-lg" :class="spot ? 'opacity-100' : 'opacity-40'">📍</span>
          </div>

          <!-- Icono de destacado -->
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <span class="text-lg" :class="flight.featured ? 'text-yellow-400' : 'opacity-40'">⭐</span>
          </div>
        </div>
      </div>

      <!-- Botones de acción en la parte inferior -->
      <div 
        v-if="isAuthenticated"
        class="p-4 flex items-center justify-end mobile-buttons-visible"
        :class="{ 'opacity-100': isHovered, 'opacity-0 md:opacity-0': !isHovered }"
        style="transition: opacity 0.3s ease"
      >
        <div class="flex items-center space-x-2">
          <button
            @click.stop="handleEdit"
            class="p-2 rounded-lg backdrop-blur-sm bg-white/10 dark:bg-gray-800/10 hover:bg-green-50/20 dark:hover:bg-green-900/20 border border-white/20 dark:border-gray-600/20 transition-all duration-200 shadow-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            @click.stop="handleDelete"
            class="p-2 rounded-lg backdrop-blur-sm bg-white/10 dark:bg-gray-800/10 hover:bg-red-50/20 dark:hover:bg-red-900/20 border border-white/20 dark:border-gray-600/20 transition-all duration-200 shadow-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Indicador para usuarios no autenticados -->
      <div v-else class="p-4 border-t border-white/20 dark:border-gray-600/20">
        <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>{{ t('auth.loginToManage') }}</span>
        </div>
      </div>
    </div>

    <!-- Efecto de brillo glassmorphism -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none"></div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hacer los botones siempre visibles en móvil */
@media (max-width: 768px) {
  .mobile-buttons-visible {
    opacity: 1 !important;
  }
}
</style>