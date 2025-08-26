<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import StaticMap from '../base/StaticMap.vue'
import SpotInfo from './SpotInfo.vue'

const props = defineProps({
  spots: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['create', 'edit', 'delete'])
const { t } = useI18n()

const showSpotInfo = ref(false)
const selectedSpot = ref(null)

const handleShowSpotInfo = (spot) => {
  selectedSpot.value = spot
  showSpotInfo.value = true
}

const handleCloseSpotInfo = () => {
  showSpotInfo.value = false
  selectedSpot.value = null
}

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
      return { icon: '✅', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
    case 'restricted':
      return { icon: '⚠️', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' }
    case 'prohibited':
      return { icon: '🚫', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
    default:
      return { icon: '❓', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' }
  }
}

// Obtener el texto del estado aeronáutico
const getZoneStatusText = (status) => {
  switch (status) {
    case 'clear':
      return 'Sin restricciones'
    case 'restricted':
      return 'Zona restringida'
    case 'prohibited':
      return 'Zona prohibida'
    default:
      return 'Estado desconocido'
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {{ t('spots.title') }}
      </h1>
      <BaseButton
        variant="primary"
        @click="emit('create')"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </template>
        {{ t('spots.addSpot') }}
      </BaseButton>
    </div>

    <BaseAlert
      v-if="errors.fetch"
      type="error"
      :message="errors.fetch"
    />

    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="spots.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">
        {{ t('spots.noSpots') }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard
        v-for="spot in spots"
        :key="spot._id"
        class="overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0"
      >
        <StaticMap
          v-if="spot.location?.coordinates?.length === 2"
          :coordinates="spot.location.coordinates"
          :spot-id="spot._id"
        />
        <div v-else class="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            {{ t('spots.noLocation') }}
          </p>
        </div>

        <div class="p-4">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 
                class="text-lg font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                @click="handleShowSpotInfo(spot)"
              >
                {{ spot.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ spot.location.city }}, {{ spot.location.country }}
              </p>
              
              <!-- Indicador de estado aeronáutico -->
              <div class="mt-2">
                <div 
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
                    getZoneStatusIcon(getSpotZoneStatus(spot).status).bg,
                    getZoneStatusIcon(getSpotZoneStatus(spot).status).color,
                    getZoneStatusIcon(getSpotZoneStatus(spot).status).border
                  ]"
                >
                  <span class="mr-1">{{ getZoneStatusIcon(getSpotZoneStatus(spot).status).icon }}</span>
                  {{ getZoneStatusText(getSpotZoneStatus(spot).status) }}
                </div>
              </div>
            </div>
          </div>

          <p v-if="spot.description" class="text-gray-600 dark:text-gray-400 mb-4">
            {{ spot.description }}
          </p>

          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span v-if="spot.visibility.public">
              {{ t('spots.public') }}
            </span>
            <span v-else-if="spot.visibility.visibleToFollowersOnly">
              {{ t('spots.followersOnly') }}
            </span>
            <span v-else>
              {{ t('spots.private') }}
            </span>
          </div>
          
          <div class="flex gap-2">
            <BaseButton
              size="sm"
              variant="secondary"
              @click="emit('edit', spot)"
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </template>
              {{ t('common.edit') }}
            </BaseButton>
            <BaseButton
              size="sm"
              variant="danger"
              @click="emit('delete', spot)"
            >
              {{ t('common.delete') }}
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <SpotInfo
      :spot="selectedSpot"
      :show="showSpotInfo"
      @close="handleCloseSpotInfo"
    />
  </div>
</template>