<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseMap from '../base/BaseMap.vue'
import aeronauticsService from '../../services/aeronauticsService'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const isCalculatingLegalStatus = ref(false)
const aeronauticalData = ref(null)

// Reglas de clasificación de zonas - ORDENADAS POR PRIORIDAD (MÁS RESTRICTIVA PRIMERO)
const ZONE_RULES = [
  // PROHIBICIONES EXPLÍCITAS (MÁXIMA PRIORIDAD) - ROJO
  { keywords: ['no permitido el vuelo', 'prohibido el vuelo', 'zona geográfica de uas prohibida'], style: 'red', priority: 1 },
  { keywords: ['danger', 'peligro', 'military', 'militar'], style: 'red', priority: 1 },
  { heightCheck: (h) => h === 0, style: 'red', priority: 1 },
  
  // RESTRICCIONES (PRIORIDAD MEDIA) - AMARILLO
  { keywords: ['req_authorization', 'tma', 'ctr', 'restricted'], style: 'yellow', priority: 2 },
  
  // REGLA POR DEFECTO (MENOR PRIORIDAD) - AMARILLO
  { keywords: [''], style: 'yellow', priority: 3 }
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
          
          // Inicializar con la menor restricción posible
          let zoneColor = 'yellow'
          let zonePriority = 999 // Prioridad más baja por defecto
          
          // Buscar la regla MÁS RESTRICTIVA que coincida
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
            
            // Si la regla coincide Y tiene mayor prioridad (número menor), aplicarla
            if (ruleMatches && rule.priority < zonePriority) {
              zoneColor = rule.style
              zonePriority = rule.priority
              
              // Si encontramos una regla de máxima prioridad (rojo), no seguir buscando
              if (rule.priority === 1) {
                break
              }
            }
          }
          
          detectedZones.push({ name, type, color: zoneColor, priority: zonePriority })
        }
      }
    } catch (error) {
      console.warn('Error procesando feature aeronáutico:', error)
    }
  })
  
  // Determinar el estado general - PREVALECE LA MÁS RESTRICTIVA
  // Orden de prioridad: PROHIBITED (rojo) > RESTRICTED (amarillo) > CLEAR (verde)
  let status = 'clear'
  let mostRestrictiveZone = null
  let highestPriority = 999 // Empezar con la prioridad más baja

  // Buscar la zona con la MAYOR prioridad (número MENOR)
  for (const zone of detectedZones) {
    if (zone.priority < highestPriority) {
      highestPriority = zone.priority
      mostRestrictiveZone = zone
      
      // Determinar el status basado en el color de la zona más restrictiva
      if (zone.color === 'red') {
        status = 'prohibited'
      } else if (zone.color === 'yellow') {
        status = 'restricted'
      }
    }
  }
  
  return { status, zones: detectedZones, mostRestrictiveZone }
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
  if (!props.modelValue.location?.coordinates || props.modelValue.location.coordinates.length !== 2) {
    updateField('legalStatus', 'WITHOUT_ANALIZED')
    isCalculatingLegalStatus.value = false
    return
  }
  
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
      const lat = props.modelValue.location.coordinates[1]
      const lng = props.modelValue.location.coordinates[0]
      const zoneInfo = detectAeronauticalZoneForCoordinates(lat, lng)
      
      // Actualizar el estado legal
      updateField('legalStatus', mapInternalStatusToLegalStatus(zoneInfo.status))
      
      // Guardar información de la zona más restrictiva
      mostRestrictiveZoneInfo.value = zoneInfo.mostRestrictiveZone
    } else {
      updateField('legalStatus', 'WITHOUT_ANALIZED')
      mostRestrictiveZoneInfo.value = null
    }
  } catch (error) {
    console.error('Error calculando legalStatus:', error)
    updateField('legalStatus', 'WITHOUT_ANALIZED')
  } finally {
    isCalculatingLegalStatus.value = false
  }
}

const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

// Variable para almacenar información de la zona más restrictiva
const mostRestrictiveZoneInfo = ref(null)

// Observar cambios en las coordenadas para recalcular legalStatus
watch(
  () => props.modelValue.location?.coordinates,
  (newCoordinates, oldCoordinates) => {
    if (newCoordinates && newCoordinates.length === 2) {
      // Verificar si las coordenadas realmente cambiaron
      const hasChanged = !oldCoordinates || 
        oldCoordinates.length !== 2 ||
        Math.abs(newCoordinates[0] - oldCoordinates[0]) > 0.000001 ||
        Math.abs(newCoordinates[1] - oldCoordinates[1]) > 0.000001
      
      if (hasChanged) {
        // Mostrar inmediatamente que se está calculando
        isCalculatingLegalStatus.value = true
        
        // Debounce reducido para mejor responsividad
        setTimeout(() => {
          calculateLegalStatus()
        }, 200)
      }
    }
  },
  { deep: true }
)

// Cargar datos aeronáuticos al montar el componente
onMounted(async () => {
  if (!aeronauticalData.value) {
    try {
      const response = await aeronauticsService.getAeronauticsData()
      if (response.success && response.data) {
        aeronauticalData.value = response.data
      }
    } catch (error) {
      console.error('Error loading aeronautical data:', error)
    }
  }
})
</script>

<template>
  <div class="space-y-8">

    <!-- Sección Ubicación -->
    <div class="group relative p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
      <!-- Glassmorphism background -->
      <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-white/20 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl"></div>
      
      <!-- Border with gradient -->
      <div class="absolute inset-0 rounded-3xl border border-gray-300/50 dark:border-gray-600/50 group-hover:border-green-400/60 transition-all duration-500"></div>
      
      <!-- Hover glow effect -->
      <div class="absolute -inset-1 rounded-3xl bg-gradient-to-r from-green-400/30 to-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
      
      <!-- Content -->
      <div class="relative z-20 space-y-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ t('spots.form.sections.location') }}
          </h3>
        </div>

        <!-- Mapa -->
        <div class="group/field relative p-4 rounded-xl bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
          <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                <svg class="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ t('spots.form.selectLocation') }}
                <span class="text-red-500 ml-1">*</span>
              </h4>
            </div>
            
            <BaseMap
              :model-value="modelValue.location"
              @update:model-value="updateField('location', $event)"
              :error="errors.location"
              :show-aeronautical-zones="true"
              class="w-full h-96 rounded-lg overflow-hidden"
            />
            
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {{ t('spots.form.locationHelp') }}
            </p>
          </div>
        </div>

        <!-- Indicador de estado legal -->
        <div v-if="modelValue.location?.coordinates && modelValue.location.coordinates.length === 2" class="group/status relative p-4 rounded-xl bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                <svg class="w-3 h-3 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ t('spots.form.legalStatus') }}
              </h4>
            </div>
            
            <div class="flex items-center space-x-3">
              <div v-if="isCalculatingLegalStatus" class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('spots.form.calculatingLegalStatus') }}</span>
              </div>
              <div v-else :class="[
                'inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border transition-all duration-300',
                modelValue.legalStatus === 'NORESTRICTIONS' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700' :
                modelValue.legalStatus === 'RESTRICTEDZONE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700' :
                modelValue.legalStatus === 'PROHIBITEDZONE' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700' :
                'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600'
              ]">
                <span class="mr-2 text-base">
                  {{ modelValue.legalStatus === 'NORESTRICTIONS' ? '✅' :
                     modelValue.legalStatus === 'RESTRICTEDZONE' ? '⚠️' :
                     modelValue.legalStatus === 'PROHIBITEDZONE' ? '🚫' : '❓' }}
                </span>
                <span>
                  {{ modelValue.legalStatus === 'NORESTRICTIONS' ? t('spots.legalStatus.noRestrictions') :
                     modelValue.legalStatus === 'RESTRICTEDZONE' ? t('spots.legalStatus.restrictedZone') :
                     modelValue.legalStatus === 'PROHIBITEDZONE' ? t('spots.legalStatus.prohibitedZone') : 
                     t('spots.legalStatus.notAnalyzed') }}
                </span>
              </div>
            </div>
            
            <!-- Descripción del estado legal -->
            <div class="mt-3 p-3 rounded-lg bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-600/50">
              <p class="text-xs text-gray-600 dark:text-gray-400">
                <span v-if="modelValue.legalStatus === 'NORESTRICTIONS'">
                  {{ t('spots.legalStatus.noRestrictionsDescription') }}
                </span>
                <span v-else-if="modelValue.legalStatus === 'RESTRICTEDZONE'">
                  {{ t('spots.legalStatus.restrictedZoneDescription') }}
                </span>
                <span v-else-if="modelValue.legalStatus === 'PROHIBITEDZONE'">
                  {{ t('spots.legalStatus.prohibitedZoneDescription') }}
                </span>
                <span v-else>
                  {{ t('spots.legalStatus.notAnalyzedDescription') }}
                </span>
              </p>
            </div>
            
            <!-- Información de la zona más restrictiva -->
            <div v-if="mostRestrictiveZoneInfo && !isCalculatingLegalStatus" class="mt-3 p-3 rounded-lg border transition-all duration-300" :class="[
              mostRestrictiveZoneInfo.color === 'red' ? 'bg-red-50/80 border-red-200/60 dark:bg-red-900/10 dark:border-red-700/50' :
              mostRestrictiveZoneInfo.color === 'yellow' ? 'bg-yellow-50/80 border-yellow-200/60 dark:bg-yellow-900/10 dark:border-yellow-700/50' :
              'bg-gray-50/80 border-gray-200/60 dark:bg-gray-800/50 dark:border-gray-600/50'
            ]">
              <div class="flex items-start gap-2">
                <div class="flex-shrink-0 mt-0.5">
                  <span class="text-sm">
                    {{ mostRestrictiveZoneInfo.color === 'red' ? '🚫' : mostRestrictiveZoneInfo.color === 'yellow' ? '⚠️' : 'ℹ️' }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-semibold mb-1" :class="[
                    mostRestrictiveZoneInfo.color === 'red' ? 'text-red-700 dark:text-red-300' :
                    mostRestrictiveZoneInfo.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
                    'text-gray-700 dark:text-gray-300'
                  ]">
                    Restricción más grave detectada:
                  </h5>
                  <p class="text-xs mb-1" :class="[
                    mostRestrictiveZoneInfo.color === 'red' ? 'text-red-600 dark:text-red-400' :
                    mostRestrictiveZoneInfo.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-gray-600 dark:text-gray-400'
                  ]">
                    <span class="font-medium">{{ mostRestrictiveZoneInfo.name }}</span>
                  </p>
                  <p class="text-xs" :class="[
                    mostRestrictiveZoneInfo.color === 'red' ? 'text-red-500 dark:text-red-500' :
                    mostRestrictiveZoneInfo.color === 'yellow' ? 'text-yellow-500 dark:text-yellow-500' :
                    'text-gray-500 dark:text-gray-500'
                  ]">
                    Tipo: {{ mostRestrictiveZoneInfo.type }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Glass reflection -->
      <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl opacity-60"></div>
    </div>
  </div>
</template>