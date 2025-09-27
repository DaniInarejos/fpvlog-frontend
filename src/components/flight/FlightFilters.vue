<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  selectedFilter: {
    type: String,
    default: 'ALL'
  },
  flights: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter-change'])
const { t } = useI18n()

// Función para obtener las clases de color glassmorphism por filtro
const getFilterColorClasses = (filterId) => {
  const colorMap = {
    ALL: {
      gradient: 'from-gray-400/20 to-gray-500/20',
      selectedBg: 'bg-gradient-to-r from-gray-100/10 to-gray-200/10',
      selectedRing: 'ring-gray-400/50',
      indicator: 'from-gray-400/60 to-gray-500/60',
      counter: 'from-gray-400/30 to-gray-500/30',
      hover: 'hover:from-gray-300/25 hover:to-gray-400/25'
    },
    PUBLIC: {
      gradient: 'from-green-400/20 to-green-500/20',
      selectedBg: 'bg-gradient-to-r from-green-100/10 to-green-200/10',
      selectedRing: 'ring-green-400/50',
      indicator: 'from-green-400/60 to-green-500/60',
      counter: 'from-green-400/30 to-green-500/30',
      hover: 'hover:from-green-300/25 hover:to-green-400/25'
    },
    FOLLOWERS: {
      gradient: 'from-blue-400/20 to-blue-500/20',
      selectedBg: 'bg-gradient-to-r from-blue-100/10 to-blue-200/10',
      selectedRing: 'ring-blue-400/50',
      indicator: 'from-blue-400/60 to-blue-500/60',
      counter: 'from-blue-400/30 to-blue-500/30',
      hover: 'hover:from-blue-300/25 hover:to-blue-400/25'
    },
    PRIVATE: {
      gradient: 'from-purple-400/20 to-purple-500/20',
      selectedBg: 'bg-gradient-to-r from-purple-100/10 to-purple-200/10',
      selectedRing: 'ring-purple-400/50',
      indicator: 'from-purple-400/60 to-purple-500/60',
      counter: 'from-purple-400/30 to-purple-500/30',
      hover: 'hover:from-purple-300/25 hover:to-purple-400/25'
    },
    WITH_VIDEO: {
      gradient: 'from-red-400/20 to-red-500/20',
      selectedBg: 'bg-gradient-to-r from-red-100/10 to-red-200/10',
      selectedRing: 'ring-red-400/50',
      indicator: 'from-red-400/60 to-red-500/60',
      counter: 'from-red-400/30 to-red-500/30',
      hover: 'hover:from-red-300/25 hover:to-red-400/25'
    },
    FAVORITES: {
      gradient: 'from-yellow-400/20 to-yellow-500/20',
      selectedBg: 'bg-gradient-to-r from-yellow-100/10 to-yellow-200/10',
      selectedRing: 'ring-yellow-400/50',
      indicator: 'from-yellow-400/60 to-yellow-500/60',
      counter: 'from-yellow-400/30 to-yellow-500/30',
      hover: 'hover:from-yellow-300/25 hover:to-yellow-400/25'
    }
  }
  return colorMap[filterId] || colorMap.ALL
}

const filters = [
  { 
    id: 'ALL', 
    label: t('flights.filters.all'), 
    icon: '📋'
  },
  { 
    id: 'PUBLIC', 
    label: t('flights.filters.public'), 
    icon: '🌍'
  },
  { 
    id: 'FOLLOWERS', 
    label: t('flights.filters.followers'), 
    icon: '👥'
  },
  { 
    id: 'PRIVATE', 
    label: t('flights.filters.private'), 
    icon: '🔒'
  },
  { 
    id: 'WITH_VIDEO', 
    label: t('flights.filters.withVideo'), 
    icon: '🎥'
  },
  { 
    id: 'FAVORITES', 
    label: t('flights.filters.favorites'), 
    icon: '⭐'
  }
]

const getFlightCount = (filterId) => {
  if (!props.flights || props.flights.length === 0) return 0
  
  switch (filterId) {
    case 'ALL':
      return props.flights.length
    case 'PUBLIC':
      return props.flights.filter(flight => 
        flight.visibility === 'PUBLIC' || flight.visibility === 'public'
      ).length
    case 'FOLLOWERS':
      return props.flights.filter(flight => 
        flight.visibility === 'FOLLOWERS' || flight.visibility === 'followers'
      ).length
    case 'PRIVATE':
      return props.flights.filter(flight => 
        flight.visibility === 'PRIVATE' || flight.visibility === 'private'
      ).length
    case 'WITH_VIDEO':
      return props.flights.filter(flight => 
        flight.videoUrl && flight.videoUrl.trim() !== ''
      ).length
    case 'FAVORITES':
      return props.flights.filter(flight => flight.favorite).length
    default:
      return 0
  }
}

const handleFilterChange = (filterId) => {
  emit('filter-change', filterId)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Contenedor principal con glassmorphism -->
    <div class="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-xl">
      <!-- Filtro principal con cards glassmorphism -->
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-2 sm:gap-3">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="handleFilterChange(filter.id)"
          :class="[
            'group relative overflow-hidden rounded-xl p-3 sm:p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm border',
            selectedFilter === filter.id 
              ? `${getFilterColorClasses(filter.id).selectedBg} ring-2 ring-offset-2 ring-offset-transparent ${getFilterColorClasses(filter.id).selectedRing} shadow-lg scale-105 border-white/40 dark:border-gray-600/40` 
              : `bg-white/20 dark:bg-gray-800/20 bg-gradient-to-r ${getFilterColorClasses(filter.id).hover} shadow-sm border-white/30 dark:border-gray-700/30`
          ]"
        >
          <!-- Fondo animado glassmorphism con color específico del filtro -->
          <div 
            v-if="selectedFilter === filter.id"
            :class="[
              'absolute inset-0 bg-gradient-to-r backdrop-blur-sm',
              getFilterColorClasses(filter.id).gradient
            ]"
          />
          
          <!-- Contenido -->
          <div class="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
            <!-- Icono con glassmorphism y color del filtro -->
            <div 
              :class="[
                'text-lg sm:text-xl lg:text-2xl transition-transform duration-300 backdrop-blur-sm rounded-lg p-1',
                selectedFilter === filter.id 
                  ? `bg-gradient-to-r ${getFilterColorClasses(filter.id).gradient} scale-110` 
                  : `bg-white/10 dark:bg-gray-900/10 group-hover:bg-gradient-to-r group-hover:${getFilterColorClasses(filter.id).gradient} group-hover:scale-110`
              ]"
            >
              {{ filter.icon }}
            </div>
            
            <!-- Label -->
            <div class="text-center">
              <div 
                :class="[
                  'text-xs font-medium transition-colors duration-300 leading-tight',
                  selectedFilter === filter.id 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                ]"
              >
                {{ filter.label }}
              </div>
              
              <!-- Contador con glassmorphism y color del filtro -->
              <div 
                :class="[
                  'text-xs font-bold mt-1 px-1.5 sm:px-2 py-0.5 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20',
                  selectedFilter === filter.id 
                    ? `bg-gradient-to-r ${getFilterColorClasses(filter.id).counter} text-white shadow-sm` 
                    : 'bg-white/30 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                ]"
              >
                {{ getFlightCount(filter.id) }}
              </div>
            </div>
          </div>

          <!-- Indicador de selección glassmorphism con color del filtro -->
          <div 
            v-if="selectedFilter === filter.id"
            :class="`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getFilterColorClasses(filter.id).indicator} rounded-b-xl shadow-sm`"
          />

          <!-- Efecto de brillo glassmorphism con tinte del color del filtro -->
          <div 
            :class="[
              'absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700 pointer-events-none',
              `from-transparent via-white/20 to-transparent`
            ]"
          ></div>
        </button>
      </div>
    </div>
  </div>
</template>