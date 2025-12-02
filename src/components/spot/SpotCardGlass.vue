<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CardGlassBase from '../base/CardGlassBase.vue'
import StaticMap from '../base/StaticMap.vue'

const props = defineProps({
  spot: {
    type: Object,
    required: true
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'green'
  }
})

const emit = defineEmits(['edit', 'delete', 'toggle-favorite', 'view', 'show-info'])

const { t } = useI18n()

// Título del spot
const title = computed(() => props.spot.name || t('spots.spot'))

// Subtítulo con ubicación
const subtitle = computed(() => {
  if (props.spot.location?.city && props.spot.location?.country) {
    return `${props.spot.location.city}, ${props.spot.location.country}`
  }
  return t('spots.noLocation')
})

// Icono de fallback
const fallbackIcon = computed(() => '📍')

// Mapear legalStatus del endpoint a estados internos
const mapLegalStatusToInternalStatus = (legalStatus) => {
  switch (legalStatus) {
    case 'NORESTRICTIONS':
      return 'clear'
    case 'RESTRICTEDZONE':
      return 'restricted'
    case 'PROHIBITEDZONE':
      return 'prohibited'
    case 'WITHOUT_ANALIZED':
    default:
      return 'unknown'
  }
}

// Obtener el estado aeronáutico de un spot usando legalStatus
const getSpotZoneStatus = (spot) => {
  const status = mapLegalStatusToInternalStatus(spot.legalStatus)
  return { status, zones: [] }
}

// Obtener el icono y color para el estado aeronáutico
const getZoneStatusIcon = (status) => {
  switch (status) {
    case 'clear':
      return { icon: '✅', color: 'bg-green-100 text-green-700 border border-green-300' }
    case 'restricted':
      return { icon: '⚠️', color: 'bg-yellow-100 text-yellow-700 border border-yellow-300' }
    case 'prohibited':
      return { icon: '🚫', color: 'bg-red-100 text-red-700 border border-red-300' }
    default:
      return { icon: '❓', color: 'bg-gray-100 text-gray-700 border border-gray-300' }
  }
}

// Estado del spot
const spotStatus = computed(() => {
  const status = getSpotZoneStatus(props.spot).status
  return getZoneStatusIcon(status)
})

// Verificar si el spot es favorito
const isFavorite = computed(() => props.spot.isFavorite || false)

// Handlers para las acciones
const handleEdit = () => {
  emit('edit', props.spot)
}

const handleDelete = () => {
  emit('delete', props.spot)
}

const handleToggleFavorite = () => {
  emit('toggle-favorite', props.spot)
}

const handleView = () => {
  emit('view', props.spot)
}

const handleShowInfo = () => {
  emit('show-info', props.spot)
}

const handleMapClick = () => {
  handleView()
}
</script>

<template>
  <CardGlassBase
    :title="title"
    :subtitle="subtitle"
    :fallback-icon="fallbackIcon"
    :is-authenticated="isAuthenticated"
    :show-edit-button="isAuthenticated"
    :show-delete-button="isAuthenticated"
    :edit-icon="'✏️'"
    :delete-icon="'🗑️'"
    :edit-button-color="color"
    :delete-button-color="'red'"
    @edit="handleEdit"
    @delete="handleDelete"
    @view="handleView"
    @click="handleShowInfo"
  >
    <!-- Slot de imagen personalizado con StaticMap -->
    <template #image>
      <StaticMap 
        v-if="spot.location?.coordinates?.length === 2" 
        :coordinates="spot.location.coordinates" 
        :spot-id="spot._id" 
        :show-aeronautical-zones="true"
        :disable-interaction="true"
        @click="handleMapClick"
      />
      <div v-else class="text-6xl opacity-60">
        {{ fallbackIcon }}
      </div>
    </template>

    <!-- Iconos informativos -->
    <template #info-icons>
      <!-- Estado aeronáutico -->
      <div 
        class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shadow-sm"
        :class="spotStatus.color"
        :title="spotStatus.icon === '✅' ? 'Sin restricciones' : 
               spotStatus.icon === '⚠️' ? 'Zona restringida' : 
               spotStatus.icon === '🚫' ? 'Zona prohibida' : 'Estado desconocido'"
      >
        {{ spotStatus.icon }}
      </div>

      <!-- Favorito -->
      <button
        v-if="isAuthenticated"
        @click.stop="handleToggleFavorite"
        class="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
        :class="isFavorite ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900'"
        :title="isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
      >
        ⭐
      </button>

      <!-- Visibilidad -->
      <div 
        class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm shadow-lg"
        :title="spot.visibility?.public ? 'Público' : 
               spot.visibility?.visibleToFollowersOnly ? 'Solo seguidores' : 'Privado'"
      >
        {{ spot.visibility?.public ? '🌍' : 
           spot.visibility?.visibleToFollowersOnly ? '👥' : '🔒' }}
      </div>
    </template>
  </CardGlassBase>
</template>