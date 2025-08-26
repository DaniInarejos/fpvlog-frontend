<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../stores/user'
import spotService from '../../services/spotService'
import aeronauticsService from '../../services/aeronauticsService'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BaseCard from '../base/BaseCard.vue'
import BaseDivider from '../base/BaseDivider.vue'
import BaseMap from '../base/BaseMap.vue'

const props = defineProps({
  spot: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])
const { t } = useI18n()
const userStore = useUserStore()

const form = ref({
  name: props.spot?.name || '',
  description: props.spot?.description || '',
  location: props.spot?.location || {
    type: 'Point',
    coordinates: [],
    address: '',
    city: '',
    country: '',
    placeId: ''
  },
  visibility: props.spot?.visibility || {
    public: true,
    visibleToFollowersOnly: false
  },
  legalStatus: props.spot?.legalStatus || 'WITHOUT_ANALIZED'
})

const errors = ref({})
const isLoading = ref(false)
const isCalculatingLegalStatus = ref(false)
const aeronauticalData = ref(null)

// Reglas de clasificación de zonas (reutilizadas de SpotList original)
const ZONE_RULES = [
  { keywords: ['no permitido el vuelo', 'prohibido el vuelo', 'zona geográfica de uas prohibida'], style: 'red' },
  { keywords: ['danger', 'peligro', 'military', 'militar'], style: 'red' },
  { heightCheck: (h) => h === 0, style: 'red' },
  { keywords: ['req_authorization', 'tma', 'ctr', 'restricted'], style: 'yellow' },
  { keywords: [''], style: 'yellow' }
]

// Convertir altura a metros
const convertHeight = (height, uom) => {
  const numHeight = Number(height)
  if (isNaN(numHeight)) return NaN
  return uom?.toUpperCase() === 'FT' ? numHeight * 0.3048 : numHeight
}

// Detectar zona aeronáutica para las coordenadas del spot
const detectAeronauticalZoneForCoordinates = (lat, lng) => {
  if (!aeronauticalData.value?.features || !window.google?.maps?.geometry) {
    return { status: 'unknown', zones: [] }
  }
  
  const point = new google.maps.LatLng(lat, lng)
  let detectedZones = []
  
  aeronauticalData.value.features.forEach(feature => {
    try {
      const geometry = feature.geometry
      
      if (geometry && (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon')) {
        let isInside = false
        
        if (geometry.type === 'Polygon') {
          const coordinates = geometry.coordinates[0]
          const pathsArray = coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }))
          const tempPolygon = new google.maps.Polygon({ paths: [pathsArray] })
          isInside = google.maps.geometry.poly.containsLocation(point, tempPolygon)
        } else if (geometry.type === 'MultiPolygon') {
          for (let i = 0; i < geometry.coordinates.length; i++) {
            const coordinates = geometry.coordinates[i][0]
            const pathsArray = coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }))
            const tempPolygon = new google.maps.Polygon({ paths: [pathsArray] })
            if (google.maps.geometry.poly.containsLocation(point, tempPolygon)) {
              isInside = true
              break
            }
          }
        }
        
        if (isInside) {
          const name = feature.properties?.Name || 'Zona sin nombre'
          const type = feature.properties?.Type || 'Sin tipo'
          const zoneType = type.toLowerCase()
          const zoneName = name.toLowerCase()
          const upperHeight = convertHeight(feature.properties?.Upper, feature.properties?.UOM)
          
          let zoneColor = 'yellow'
          
          for (const rule of ZONE_RULES) {
            let ruleMatches = false
            
            if (rule.keywords && rule.keywords.some(keyword => 
              zoneType.includes(keyword) || zoneName.includes(keyword)
            )) {
              ruleMatches = true
            }
            
            if (rule.heightCheck && !isNaN(upperHeight) && rule.heightCheck(upperHeight)) {
              ruleMatches = true
            }
            
            if (ruleMatches) {
              zoneColor = rule.style
              break
            }
          }
          
          detectedZones.push({ name, type, color: zoneColor })
        }
      }
    } catch (error) {
      console.warn('Error procesando feature aeronáutico:', error)
    }
  })
  
  // Determinar el estado general
  const hasRedZones = detectedZones.some(zone => zone.color === 'red')
  const hasYellowZones = detectedZones.some(zone => zone.color === 'yellow')
  
  let status = 'clear'
  if (hasRedZones) status = 'prohibited'
  else if (hasYellowZones) status = 'restricted'
  
  return { status, zones: detectedZones }
}

// Mapear estado interno a legalStatus del API
const mapInternalStatusToLegalStatus = (internalStatus) => {
  switch (internalStatus) {
    case 'clear':
      return 'NORESTRICTIONS'
    case 'restricted':
      return 'RESTRICTEDZONE'
    case 'prohibited':
      return 'PROHIBITEDZONE'
    default:
      return 'WITHOUT_ANALIZED'
  }
}

// Calcular legalStatus basado en las coordenadas
const calculateLegalStatus = async () => {
  if (!form.value.location.coordinates || form.value.location.coordinates.length !== 2) {
    form.value.legalStatus = 'WITHOUT_ANALIZED'
    return
  }
  
  isCalculatingLegalStatus.value = true
  
  try {
    // Cargar datos aeronáuticos si no están disponibles
    if (!aeronauticalData.value) {
      const response = await aeronauticsService.getAeronauticsData()
      if (response.success && response.data) {
        aeronauticalData.value = response.data
      }
    }
    
    // Esperar a que Google Maps esté disponible
    if (!window.google?.maps?.geometry) {
      // Intentar esperar un poco para que se cargue Google Maps
      await new Promise(resolve => {
        const checkGoogleMaps = () => {
          if (window.google?.maps?.geometry) {
            resolve()
          } else {
            setTimeout(checkGoogleMaps, 100)
          }
        }
        checkGoogleMaps()
        // Timeout después de 5 segundos
        setTimeout(() => resolve(), 5000)
      })
    }
    
    if (aeronauticalData.value && window.google?.maps?.geometry) {
      const lat = form.value.location.coordinates[1]
      const lng = form.value.location.coordinates[0]
      const zoneInfo = detectAeronauticalZoneForCoordinates(lat, lng)
      form.value.legalStatus = mapInternalStatusToLegalStatus(zoneInfo.status)
    } else {
      form.value.legalStatus = 'WITHOUT_ANALIZED'
    }
  } catch (error) {
    console.error('Error calculando legalStatus:', error)
    form.value.legalStatus = 'WITHOUT_ANALIZED'
  } finally {
    isCalculatingLegalStatus.value = false
  }
}

// Observar cambios en las coordenadas para recalcular legalStatus
watch(
  () => form.value.location.coordinates,
  (newCoordinates) => {
    if (newCoordinates && newCoordinates.length === 2) {
      // Debounce para evitar cálculos excesivos
      setTimeout(() => {
        calculateLegalStatus()
      }, 500)
    }
  },
  { deep: true }
)

const handleSubmit = async () => {
  isLoading.value = true
  errors.value = {}

  try {
    // Asegurar que legalStatus esté calculado antes de enviar
    if (form.value.location.coordinates && form.value.location.coordinates.length === 2) {
      await calculateLegalStatus()
    }
    
    if (props.spot) {
      await spotService.updateSpot(props.spot._id, form.value)
    } else {
      const spotData = {
        ...form.value,
        submittedBy: userStore.user._id
      }
      await spotService.createSpot(spotData)
    }
    emit('saved')
  } catch (error) {
    errors.value = error.response?.data?.errors || { general: error.message }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <BaseCard class="p-6">
    <h2 class="text-xl font-semibold mb-4">
      {{ props.spot ? t('spots.editSpot') : t('spots.addSpot') }}
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <BaseAlert
        v-if="errors.general"
        type="error"
        :message="errors.general"
      />

      <BaseDivider title="Información Básica" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="form.name"
          :label="t('spots.form.name')"
          :error="errors.name"
          required
        />

        <BaseInput
          v-model="form.description"
          :label="t('spots.form.description')"
          :error="errors.description"
          type="textarea"
        />
      </div>

      <BaseDivider title="Ubicación" />

      <div class="space-y-2">
        <BaseMap
          v-model="form.location"
          :error="errors.location"
          :show-aeronautical-zones="true"
        />
        
        <!-- Indicador de estado legal -->
        <div v-if="form.location.coordinates && form.location.coordinates.length === 2" class="mt-3">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Estado Legal:</span>
            <div v-if="isCalculatingLegalStatus" class="flex items-center space-x-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              <span class="text-sm text-gray-500">Calculando...</span>
            </div>
            <div v-else :class="[
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
              form.legalStatus === 'NORESTRICTIONS' ? 'bg-green-50 text-green-600 border-green-200' :
              form.legalStatus === 'RESTRICTEDZONE' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
              form.legalStatus === 'PROHIBITEDZONE' ? 'bg-red-50 text-red-600 border-red-200' :
              'bg-gray-50 text-gray-600 border-gray-200'
            ]">
              <span class="mr-1">
                {{ form.legalStatus === 'NORESTRICTIONS' ? '✅' :
                   form.legalStatus === 'RESTRICTEDZONE' ? '⚠️' :
                   form.legalStatus === 'PROHIBITEDZONE' ? '🚫' : '❓' }}
              </span>
              {{ form.legalStatus === 'NORESTRICTIONS' ? 'Sin restricciones' :
                 form.legalStatus === 'RESTRICTEDZONE' ? 'Zona restringida' :
                 form.legalStatus === 'PROHIBITEDZONE' ? 'Zona prohibida' : 'Sin analizar' }}
            </div>
          </div>
        </div>
      </div>

    <!--  <BaseDivider title="Privacidad" />

      <div class="space-y-3">
        <BaseCheckbox
          v-model="form.visibility.public"
          :label="t('spots.form.public')"
        />
        <BaseCheckbox
          v-model="form.visibility.visibleToFollowersOnly"
          :label="t('spots.form.visibleToFollowersOnly')"
        />
      </div>
    -->
      <div class="flex justify-end space-x-4 mt-6">
        <BaseButton
          type="button"
          variant="secondary"
          @click="emit('close')"
        >
          {{ t('common.cancel') }}
        </BaseButton>
        <BaseButton
          type="submit"
          :loading="isLoading || isCalculatingLegalStatus"
          :disabled="isCalculatingLegalStatus"
        >
          {{ props.spot ? t('common.save') : t('spots.form.create') }}
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>