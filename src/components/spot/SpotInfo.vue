<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  spot: {
    type: Object,
    required: false,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const initializeMap = () => {
  if (!window.google || !props.spot?.location?.coordinates?.length === 2) return

  const mapId = `spot-info-map-${props.spot._id}`
  const map = new google.maps.Map(document.getElementById(mapId), {
    mapId: mapId,
    center: { 
      lat: props.spot.location.coordinates[1], 
      lng: props.spot.location.coordinates[0] 
    },
    zoom: 15,
    disableDefaultUI: true,
    draggable: false,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    styles: [{
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ color: '#242f3e' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }]
    }]
  })

  new google.maps.marker.AdvancedMarkerElement({
    map,
    position: { 
      lat: props.spot.location.coordinates[1], 
      lng: props.spot.location.coordinates[0] 
    }
  })
}

// Observar cambios en la prop show para inicializar el mapa cuando se abre el modal
const initMapWhenVisible = () => {
  if (props.show && props.spot) {
    // Pequeño retraso para asegurar que el DOM está listo
    setTimeout(initializeMap, 100)
  }
}

onMounted(() => {
  initMapWhenVisible()
})
</script>

<template>
  <BaseModal
    v-if="spot && show"
    :show="show"
    :title="spot.name || ''"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Mapa estático del spot -->
      <div v-if="spot.location?.coordinates?.length === 2" class="relative aspect-[4/3] overflow-hidden rounded-lg">
        <div class="w-full h-full" :id="`spot-info-map-${spot._id}`"></div>
      </div>

      <!-- Información básica -->
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('message.spots.details') }}</h3>
          <dl class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('message.spots.location') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ spot.location?.city }}, {{ spot.location?.country }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('message.spots.visibility') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">
                <span v-if="spot.visibility?.public">{{ t('message.spots.public') }}</span>
                <span v-else-if="spot.visibility?.visibleToFollowersOnly">{{ t('message.spots.followersOnly') }}</span>
                <span v-else>{{ t('message.spots.private') }}</span>
              </dd>
            </div>
          </dl>
        </div>

        <!-- Descripción -->
        <div v-if="spot.description">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('message.spots.description') }}</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ spot.description }}</p>
        </div>
      </div>
    </div>
  </BaseModal>
</template>