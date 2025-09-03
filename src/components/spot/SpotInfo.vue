<script setup>
import { defineProps, defineEmits, watch, onMounted, ref } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import { useI18n } from 'vue-i18n'
import aeronauticsService from '../../services/aeronauticsService'

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

// Estado para zonas aeronáuticas
const aeronauticalZones = ref([])
const aeronauticalLayers = ref([])
const currentInfoWindow = ref(null)
const isLoadingZones = ref(false)

// Reglas de clasificación de zonas
const ZONE_RULES = [
  { keywords: ['no permitido el vuelo', 'no permitida el vuelo', 'no permitido el vuelo a drones'], style: 'red', label: 'PROHIBIDO - No Permitido el Vuelo' },
  { keywords: ['prohibido el vuelo', 'prohibida el vuelo', 'vuelo prohibido'], style: 'red', label: 'PROHIBIDO - Vuelo Prohibido' },
  { keywords: ['zonas geográfica de uas prohibida', 'zona geográfica de uas prohibida'], style: 'red', label: 'PROHIBIDO - Zona UAS Prohibida' },
  { keywords: ['excepto coordinación con el aeródromo', 'excepto coordinacion con el aerodromo'], style: 'red', label: 'PROHIBIDO - Solo con Coordinación Aeródromo' },
  { keywords: ['danger', 'peligro', 'peligrosa'], style: 'red', label: 'Zona Peligrosa - PROHIBIDO' },
  { keywords: ['military', 'militar'], style: 'red', label: 'Zona Militar - PROHIBIDO' },
  { keywords: ['rvf', 'photographic'], style: 'red', label: 'Vuelo Fotográfico - PROHIBIDO' },
  { heightCheck: (h) => h === 0, style: 'red', label: 'Altura 0m - PROHIBIDO' },
  { keywords: ['no fly', 'no-fly'], style: 'red', label: 'No Fly Zone - PROHIBIDO' },
  { keywords: ['levc aerodrome', 'lemd aerodrome'], style: 'red', label: 'Aeródromo Específico - Coordinación Obligatoria' },
  { keywords: ['req_authorization'], style: 'yellow', label: 'Autorización Requerida' },
  { keywords: ['tma', 'ctr', 'restricted'], style: 'yellow', label: 'Espacio Aéreo Controlado' },
  { keywords: [''], style: 'yellow', label: 'Zona Restringida' }
]

const handleClose = () => {
  emit('close')
}

// Convertir altura a metros
const convertHeight = (height, uom) => {
  const numHeight = Number(height)
  if (isNaN(numHeight)) return NaN
  return uom?.toUpperCase() === 'FT' ? numHeight * 0.3048 : numHeight
}

// Detectar zona aeronáutica
const detectAeronauticalZone = (lat, lng, geoJsonData) => {
  // Verificar que Google Maps y la librería de geometría estén disponibles
  if (!window.google || !window.google.maps || !window.google.maps.geometry || !window.google.maps.geometry.poly) {
    console.warn('Google Maps geometry library no está disponible')
    return []
  }
  
  const point = new google.maps.LatLng(lat, lng)
  let detectedZones = []
  
  if (!geoJsonData?.features) return detectedZones
  
  geoJsonData.features.forEach(feature => {
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
          const reasons = feature.properties?.Reasons || 'No especificado'
          const message = feature.properties?.Message || ''
          const upper = feature.properties?.Upper || 'No especificado'
          const lower = feature.properties?.Lower || 'No especificado'
          
          // Determinar el color de la zona
          const zoneType = type.toLowerCase()
          const zoneName = name.toLowerCase()
          const zoneMessage = message.toLowerCase()
          const upperHeight = convertHeight(feature.properties?.Upper, feature.properties?.UOM)
          
          let zoneColor = 'yellow'
          let zoneLabel = 'Zona Restringida'
          
          for (const rule of ZONE_RULES) {
            let ruleMatches = false
            
            if (rule.keywords && rule.keywords.some(keyword => 
              zoneType.includes(keyword) || zoneName.includes(keyword) || zoneMessage.includes(keyword)
            )) {
              ruleMatches = true
            }
            
            if (rule.heightCheck && !isNaN(upperHeight) && rule.heightCheck(upperHeight)) {
              ruleMatches = true
            }
            
            if (ruleMatches) {
              zoneColor = rule.style
              zoneLabel = rule.label
              break
            }
          }
          
          detectedZones.push({
            name,
            type,
            reasons,
            upper,
            lower,
            color: zoneColor,
            label: zoneLabel,
            message
          })
        }
      }
    } catch (error) {
      console.warn('Error procesando feature aeronáutico:', error)
    }
  })
  
  return detectedZones
}

// Estado para controlar los reintentos
const retryCount = ref(0)
const maxRetries = 2

// Cargar información aeronáutica para el spot
const loadAeronauticalInfo = async () => {
  if (!props.spot?.location?.coordinates?.length === 2) return
  
  // Verificar que Google Maps esté completamente cargado
  if (!window.google || !window.google.maps || !window.google.maps.geometry) {
    if (retryCount.value < maxRetries) {
      console.warn(`Google Maps no está completamente cargado, reintentando... (${retryCount.value + 1}/${maxRetries})`)
      retryCount.value++
      setTimeout(loadAeronauticalInfo, 1000)
    } else {
      console.error('Google Maps no se pudo cargar después de', maxRetries, 'intentos. Funcionalidad aeronáutica deshabilitada.')
      retryCount.value = 0 // Reset para futuros intentos
    }
    return
  }
  
  // Reset del contador si Google Maps está disponible
  retryCount.value = 0
  
  isLoadingZones.value = true
  try {
    const response = await aeronauticsService.getAeronauticsData()
    
    if (response.success && response.data) {
      const zones = detectAeronauticalZone(
        props.spot.location.coordinates[1],
        props.spot.location.coordinates[0],
        response.data
      )
      aeronauticalZones.value = zones
    }
  } catch (error) {
    console.error('Error cargando información aeronáutica:', error)
  } finally {
    isLoadingZones.value = false
  }
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
  })

  new google.maps.marker.AdvancedMarkerElement({
    map,
    position: { 
      lat: props.spot.location.coordinates[1], 
      lng: props.spot.location.coordinates[0] 
    }
  })
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    initMapWhenVisible()
    loadAeronauticalInfo()
  }
})

const initMapWhenVisible = () => {
  if (props.show && props.spot) {
    setTimeout(initializeMap, 100)
  }
}

onMounted(() => {
  initMapWhenVisible()
  if (props.show) {
    loadAeronauticalInfo()
  }
})
</script>

<template>
  <BaseModal
    v-if="spot && show"
    :show="show"
    :title="spot.name || ''"
    :show-cancel-button="false"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Mapa estático del spot -->
      <div v-if="spot.location?.coordinates?.length === 2" class="relative aspect-[4/3] overflow-hidden rounded-lg">
        <div class="w-full h-full" :id="`spot-info-map-${spot._id}`"></div>
      </div>

      <!-- Información aeronáutica -->
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Información Aeronáutica</h3>
          
          <div v-if="isLoadingZones" class="flex items-center justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span class="ml-2 text-sm text-gray-600">Cargando información aeronáutica...</span>
          </div>
          
          <div v-else-if="aeronauticalZones.length === 0" class="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <p class="text-green-800 font-medium text-sm">✅ Sin restricciones aeronáuticas detectadas</p>
            </div>
            <p class="text-green-700 text-xs mt-1 ml-7">Esta ubicación no presenta restricciones conocidas para vuelo de drones.</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="(zone, index) in aeronauticalZones" 
              :key="index"
              :class="[
                'p-3 rounded-lg border',
                zone.color === 'red' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-yellow-50 border-yellow-200'
              ]"
            >
              <div class="flex items-start">
                <div 
                  :class="[
                    'w-3 h-3 rounded-full mr-3 mt-1 flex-shrink-0',
                    zone.color === 'red' ? 'bg-red-500' : 'bg-yellow-500'
                  ]"
                ></div>
                <div class="flex-1">
                  <h4 :class="[
                    'font-medium text-sm',
                    zone.color === 'red' ? 'text-red-800' : 'text-yellow-800'
                  ]">
                    {{ zone.name }}
                  </h4>
                  <p :class="[
                    'text-xs mt-1',
                    zone.color === 'red' ? 'text-red-700' : 'text-yellow-700'
                  ]">
                    <strong>Tipo:</strong> {{ zone.type }}
                  </p>
                  <p :class="[
                    'text-xs mt-1',
                    zone.color === 'red' ? 'text-red-700' : 'text-yellow-700'
                  ]">
                    <strong>Razones:</strong> {{ zone.reasons }}
                  </p>
                  <div class="mt-2 text-xs">
                    <span :class="[
                      'inline-block px-2 py-1 rounded text-xs font-medium',
                      zone.color === 'red' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    ]">
                      {{ zone.label }}
                    </span>
                  </div>
                  <div class="mt-2 text-xs space-y-1">
                    <p :class="zone.color === 'red' ? 'text-red-600' : 'text-yellow-600'">
                      <strong>Límites:</strong> {{ zone.lower }} - {{ zone.upper }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información básica -->
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('spots.details') }}</h3>
          <dl class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('spots.location') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ spot.location?.city }}, {{ spot.location?.country }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('spots.visibility') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">
                <span v-if="spot.visibility?.public">{{ t('spots.public') }}</span>
                <span v-else-if="spot.visibility?.visibleToFollowersOnly">{{ t('spots.followersOnly') }}</span>
                <span v-else>{{ t('spots.private') }}</span>
              </dd>
            </div>
          </dl>
        </div>

        <!-- Descripción -->
        <div v-if="spot.description">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('spots.description') }}</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ spot.description }}</p>
        </div>
      </div>
    </div>
  </BaseModal>
</template>