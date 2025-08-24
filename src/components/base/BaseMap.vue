<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import aeronauticsService from '../../services/aeronauticsService'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      type: 'Point',
      coordinates: [],
      address: '',
      city: '',
      country: '',
      placeId: ''
    })
  },
  error: {
    type: String,
    default: ''
  },
  showAeronauticalZones: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const map = ref(null)
const marker = ref(null)
const searchInput = ref(null)
const aeronauticalLayers = ref([])
const currentInfoWindow = ref(null)

// Configuración
const CONFIG = {
  MAP_CENTER: { lat: 40.416775, lng: -3.703790 },
  MAP_ZOOM: 10
}

// Estilos de zonas por tamaño
const ZONE_STYLES = {
  // Estilos para zonas grandes (muy claros y transparentes)
  yellow_large: {
    fillColor: '#fef3c7',
    fillOpacity: 0.15,
    strokeColor: '#f59e0b',
    strokeWeight: 1,
    strokeOpacity: 0.3
  },
  red_large: {
    fillColor: '#fecaca',
    fillOpacity: 0.15,
    strokeColor: '#ef4444',
    strokeWeight: 1,
    strokeOpacity: 0.3
  },
  // Estilos para zonas medianas (transparencia media)
  yellow_medium: {
    fillColor: '#fde68a',
    fillOpacity: 0.25,
    strokeColor: '#f59e0b',
    strokeWeight: 1.5,
    strokeOpacity: 0.5
  },
  red_medium: {
    fillColor: '#fca5a5',
    fillOpacity: 0.25,
    strokeColor: '#ef4444',
    strokeWeight: 1.5,
    strokeOpacity: 0.5
  },
  // Estilos para zonas pequeñas (más visibles)
  yellow_small: {
    fillColor: '#eab308',
    fillOpacity: 0.4,
    strokeColor: '#ca8a04',
    strokeWeight: 2,
    strokeOpacity: 0.8
  },
  red_small: {
    fillColor: '#dc2626',
    fillOpacity: 0.4,
    strokeColor: '#991b1b',
    strokeWeight: 2,
    strokeOpacity: 0.8
  }
}

// Reglas de clasificación de zonas
const ZONE_RULES = [
  // PROHIBICIONES EXPLÍCITAS (MÁXIMA PRIORIDAD) - ROJO
  { keywords: ['no permitido el vuelo', 'no permitida el vuelo', 'no permitido el vuelo a drones'], style: 'red', label: 'PROHIBIDO - No Permitido el Vuelo' },
  { keywords: ['prohibido el vuelo', 'prohibida el vuelo', 'vuelo prohibido'], style: 'red', label: 'PROHIBIDO - Vuelo Prohibido' },
  { keywords: ['zonas geográfica de uas prohibida', 'zona geográfica de uas prohibida'], style: 'red', label: 'PROHIBIDO - Zona UAS Prohibida' },
  { keywords: ['excepto coordinación con el aeródromo', 'excepto coordinacion con el aerodromo'], style: 'red', label: 'PROHIBIDO - Solo con Coordinación Aeródromo' },
  
  // ZONAS CRÍTICAS - ROJO (más específicas)
  { keywords: ['danger', 'peligro', 'peligrosa'], style: 'red', label: 'Zona Peligrosa - PROHIBIDO' },
  { keywords: ['military', 'militar'], style: 'red', label: 'Zona Militar - PROHIBIDO' },
  { keywords: ['rvf', 'photographic'], style: 'red', label: 'Vuelo Fotográfico - PROHIBIDO' },
  { heightCheck: (h) => h === 0, style: 'red', label: 'Altura 0m - PROHIBIDO' },
  { keywords: ['no fly', 'no-fly'], style: 'red', label: 'No Fly Zone - PROHIBIDO' },
  
  // CÓDIGOS ESPECÍFICOS DE AERÓDROMOS - ROJO
  { keywords: ['levc aerodrome', 'lemd aerodrome'], style: 'red', label: 'Aeródromo Específico - Coordinación Obligatoria' },
  
  // ZONAS RESTRINGIDAS - AMARILLO
  { keywords: ['req_authorization'], style: 'yellow', label: 'Autorización Requerida' },
  { keywords: ['tma', 'ctr', 'restricted'], style: 'yellow', label: 'Espacio Aéreo Controlado' },
  
  // FALLBACK - AMARILLO
  { keywords: [''], style: 'yellow', label: 'Zona Restringida' }
]

const initMap = () => {
  if (!window.google) {
    console.error('Google Maps no está cargado')
    return
  }

  const mapElement = document.getElementById('map')
  map.value = new google.maps.Map(mapElement, {
    center: CONFIG.MAP_CENTER,
    zoom: CONFIG.MAP_ZOOM,
  })

  // Configurar el marcador si hay una ubicación existente
  if (props.modelValue?.coordinates?.length === 2) {
    const position = {
      lat: props.modelValue.coordinates[1],
      lng: props.modelValue.coordinates[0]
    }
    setMarker(position)
    map.value.setCenter(position)
  }

  // Configurar el buscador de lugares
  const searchBox = new google.maps.places.SearchBox(searchInput.value)

  map.value.addListener('bounds_changed', () => {
    searchBox.setBounds(map.value.getBounds())
  })

  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces()
    if (places.length === 0) return

    const place = places[0]
    if (!place.geometry) return

    const position = place.geometry.location
    setMarker(position)
    map.value.setCenter(position)
    updateLocation(place, position)
  })

  map.value.addListener('click', (event) => {
    setMarker(event.latLng)
    updateLocationFromLatLng(event.latLng)
    
    // Cerrar InfoWindow si está abierto
    if (currentInfoWindow.value) {
      currentInfoWindow.value.close()
      currentInfoWindow.value = null
    }
  })

  // Cargar zonas aeronáuticas si está habilitado
  if (props.showAeronauticalZones) {
    loadAeronauticalZones()
  }
}

const setMarker = (position) => {
  if (marker.value) marker.value.setMap(null)
  marker.value = new google.maps.Marker({
    position,
    map: map.value,
    draggable: true,
    animation: google.maps.Animation.DROP
  })

  marker.value.addListener('dragend', () => {
    updateLocationFromLatLng(marker.value.getPosition())
  })
}

const updateLocation = (place, position) => {
  emit('update:modelValue', {
    type: 'Point',
    coordinates: [position.lng(), position.lat()],
    address: place.formatted_address,
    city: place.address_components.find(c => c.types.includes('locality'))?.long_name || '',
    country: place.address_components.find(c => c.types.includes('country'))?.long_name || '',
    placeId: place.place_id
  })
}

const updateLocationFromLatLng = async (latLng) => {
  const geocoder = new google.maps.Geocoder()
  try {
    const result = await geocoder.geocode({ location: latLng })
    if (result.results[0]) {
      updateLocation(result.results[0], latLng)
    }
  } catch (error) {
    console.error('Error en geocoding:', error)
  }
}

// Cargar zonas aeronáuticas
const loadAeronauticalZones = async () => {
  try {
    clearExistingLayers()
    
    const response = await aeronauticsService.getAeronauticsData()
    
    if (!response.success) {
      throw new Error(response.error || 'Error obteniendo datos aeronáuticos')
    }
    
    const geoJsonData = response.data
    
    if (geoJsonData?.features?.length > 0) {
      createLayeredDataLayers(geoJsonData)
    } else {
      console.warn('No se encontraron zonas aeronáuticas')
    }
  } catch (error) {
    console.error('Error cargando zonas aeronáuticas:', error)
  }
}

// Calcular área aproximada de una geometría
const calculateGeometryArea = (geometry) => {
  if (!geometry || !geometry.coordinates) return 0
  
  try {
    if (geometry.type === 'Polygon') {
      return calculatePolygonArea(geometry.coordinates[0])
    } else if (geometry.type === 'MultiPolygon') {
      return geometry.coordinates.reduce((total, polygon) => {
        return total + calculatePolygonArea(polygon[0])
      }, 0)
    }
  } catch (error) {
    console.warn('Error calculando área:', error)
  }
  
  return 0
}

// Calcular área de un polígono
const calculatePolygonArea = (coordinates) => {
  if (!coordinates || coordinates.length < 3) return 0
  
  let area = 0
  const n = coordinates.length
  
  for (let i = 0; i < n - 1; i++) {
    const j = (i + 1) % n
    area += coordinates[i][0] * coordinates[j][1]
    area -= coordinates[j][0] * coordinates[i][1]
  }
  
  return Math.abs(area) / 2
}

// Crear capas de datos ordenadas por tamaño y tipo de restricción
const createLayeredDataLayers = (geoJsonData) => {
  const filteredFeatures = geoJsonData.features.filter(feature => {
    return true // Mostrar todas las zonas
  })
  
  // Calcular área para cada feature y clasificar por tipo
  const featuresWithArea = filteredFeatures.map(feature => {
    const area = calculateGeometryArea(feature.geometry)
    const zoneType = (feature.properties?.Type || '').toLowerCase()
    const zoneName = (feature.properties?.Name || '').toLowerCase()
    const reasons = (feature.properties?.Reasons || '').toLowerCase()
    const message = (feature.properties?.Message || '').toLowerCase()
    const upper = convertHeight(feature.properties?.Upper, feature.properties?.UOM)

    // Determinar si es zona prohibida (roja) o restringida (amarilla)
    let isProhibited = false
    
    for (const rule of ZONE_RULES) {
      let ruleMatches = false
      
      if (rule.keywords && rule.keywords.some(keyword => 
        zoneType.includes(keyword) || zoneName.includes(keyword) || reasons.includes(keyword) || message.includes(keyword)
      )) {
        ruleMatches = true
      }
      
      if (rule.heightCheck && !isNaN(upper) && rule.heightCheck(upper)) {
        ruleMatches = true
      }
      
      if (ruleMatches) {
        isProhibited = rule.style === 'red'
        break
      }
    }

    return {
      ...feature,
      area,
      isProhibited
    }
  })
  
  // Ordenar por área (más grandes primero)
  featuresWithArea.sort((a, b) => b.area - a.area)
  
  // Crear capas separadas por tipo y tamaño
  const layers = {
    restricted_large: [],
    restricted_medium: [],
    restricted_small: [],
    prohibited_large: [],
    prohibited_medium: [],
    prohibited_small: []
  }
  
  // Clasificar features por tipo y tamaño
  featuresWithArea.forEach(feature => {
    const sizeCategory = feature.area > 0.1 ? 'large' : (feature.area > 0.01 ? 'medium' : 'small')
    const typeCategory = feature.isProhibited ? 'prohibited' : 'restricted'
    const layerKey = `${typeCategory}_${sizeCategory}`
    
    layers[layerKey].push(feature)
  })
  
  // Crear capas con zIndex apropiado
  const layerConfigs = [
    { name: 'restricted_large', features: layers.restricted_large, zIndex: 1 },
    { name: 'restricted_medium', features: layers.restricted_medium, zIndex: 2 },
    { name: 'restricted_small', features: layers.restricted_small, zIndex: 3 },
    { name: 'prohibited_large', features: layers.prohibited_large, zIndex: 4 },
    { name: 'prohibited_medium', features: layers.prohibited_medium, zIndex: 5 },
    { name: 'prohibited_small', features: layers.prohibited_small, zIndex: 6 }
  ]
  
  layerConfigs.forEach(config => {
    if (config.features.length > 0) {
      const dataLayer = new google.maps.Data()
      
      config.features.forEach(feature => {
        dataLayer.addGeoJson({
          type: 'FeatureCollection',
          features: [feature]
        })
      })
      
      const sizeCategory = config.name.split('_')[1]
      dataLayer.setStyle(feature => {
        const style = getZoneStyle(feature, sizeCategory)
        return {
          ...style,
          zIndex: config.zIndex
        }
      })
      
      dataLayer.addListener('click', showZoneInfo)
      dataLayer.setMap(map.value)
      
      aeronauticalLayers.value.push(dataLayer)
    }
  })
}

// Determinar estilo de zona según tipo y tamaño
const getZoneStyle = (feature, zoneSize = 'small') => {
  const zoneType = (feature.getProperty('Type') || '').toLowerCase()
  const zoneName = (feature.getProperty('Name') || '').toLowerCase()
  const zoneMessage = (feature.getProperty('Message') || '').toLowerCase()
  const upper = convertHeight(feature.getProperty('Upper'), feature.getProperty('UOM'))
  
  let baseStyle = 'yellow' // Por defecto
  
  for (const rule of ZONE_RULES) {
    if (rule.keywords && rule.keywords.some(keyword => 
      zoneType.includes(keyword) || zoneName.includes(keyword) || zoneMessage.includes(keyword)
    )) {
      baseStyle = rule.style
      break
    }
    
    if (rule.heightCheck && !isNaN(upper) && rule.heightCheck(upper)) {
      baseStyle = rule.style
      break
    }
  }
  
  const styleKey = `${baseStyle}_${zoneSize}`
  return ZONE_STYLES[styleKey] || ZONE_STYLES[`${baseStyle}_small`]
}

// Convertir altura a metros
const convertHeight = (height, uom) => {
  const numHeight = Number(height)
  if (isNaN(numHeight)) return NaN
  
  return uom?.toUpperCase() === 'FT' ? numHeight * 0.3048 : numHeight
}

// Mostrar información de zona
const showZoneInfo = (event) => {
  if (currentInfoWindow.value) {
    currentInfoWindow.value.close()
  }
  
  const feature = event.feature
  
  const name = feature.getProperty('Name') || 'Sin nombre'
  const type = feature.getProperty('Type') || 'Sin tipo'
  const reasons = feature.getProperty('Reasons') || 'No especificado'
  const message = feature.getProperty('Message') || 'Sin mensaje'
  const lower = feature.getProperty('Lower') || 'No especificado'
  const upper = feature.getProperty('Upper') || 'No especificado'
  
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div class="p-4 max-w-md">
        <h3 class="font-bold text-lg mb-3 text-blue-800 border-b pb-2">Información de Zona Aeronáutica</h3>
        <div class="space-y-2 text-sm">
          <div class="bg-gray-50 p-2 rounded">
            <p><strong class="text-gray-700">Nombre:</strong> <span class="text-gray-900">${name}</span></p>
          </div>
          <div class="bg-gray-50 p-2 rounded">
            <p><strong class="text-gray-700">Tipo:</strong> <span class="text-gray-900">${type}</span></p>
          </div>
          <div class="bg-gray-50 p-2 rounded">
            <p><strong class="text-gray-700">Razones:</strong> <span class="text-gray-900">${reasons}</span></p>
          </div>
          ${message !== 'Sin mensaje' ? `
          <div class="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
            <p><strong class="text-blue-700">Mensaje:</strong> <span class="text-blue-900">${message}</span></p>
          </div>
          ` : ''}
          <div class="bg-yellow-50 p-2 rounded">
            <p><strong class="text-yellow-700">Límite Inferior:</strong> <span class="text-yellow-900">${lower}</span></p>
            <p><strong class="text-yellow-700">Límite Superior:</strong> <span class="text-yellow-900">${upper}</span></p>
          </div>
        </div>
      </div>
    `,
    position: event.latLng,
    maxWidth: 400
  })
  
  currentInfoWindow.value = infoWindow
  
  infoWindow.addListener('closeclick', () => {
    currentInfoWindow.value = null
  })
  
  infoWindow.open(map.value)
}

// Limpiar capas existentes
const clearExistingLayers = () => {
  aeronauticalLayers.value.forEach(layer => {
    if (layer) {
      layer.setMap(null)
    }
  })
  aeronauticalLayers.value = []
}

onMounted(() => {
  if (window.google) {
    initMap()
  } else {
    setTimeout(initMap, 1000)
  }
})
</script>

<template>
  <div class="space-y-2">
    <input
      ref="searchInput"
      type="text"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
      :placeholder="t('spots.form.searchLocation')"
      :class="{ 'border-red-500 focus:ring-red-500': error }"
    />
    <div 
      id="map" 
      class="w-full h-96 rounded-lg overflow-hidden ring-1 ring-gray-200/20 dark:ring-gray-700/20 shadow-lg"
    ></div>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>