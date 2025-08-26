<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import spotService from '../services/spotService'
import aeronauticsService from '../services/aeronauticsService'

const { t } = useI18n()

// Estado reactivo
const spots = ref([])
const map = ref(null)
const markers = ref([])
const aeronauticalLayers = ref([]) // Cambiado a array para múltiples capas
const currentInfoWindow = ref(null)
// Configuración
const CONFIG = {
  // Eliminamos AERONAUTICAL_SERVICE ya que ahora usamos el backend
  FALLBACK_KML: 'https://servais.enaire.es/einsignia/rest/services/Drones/ZGUAS_Aero.kmz',
  MAP_CENTER: { lat: 40.416775, lng: -3.703790 },
  MAP_ZOOM: 6
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
// Reglas de clasificación de zonas - ORDEN IMPORTANTE (de más específico a menos específico)
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
  
  // CÓDIGOS ESPECÍFICOS DE AERÓDROMOS - ROJO (solo códigos ICAO específicos)
  { keywords: ['levc aerodrome', 'lemd aerodrome'], style: 'red', label: 'Aeródromo Específico - Coordinación Obligatoria' },
  
  // ZONAS RESTRINGIDAS - AMARILLO (por defecto para REQ_AUTHORIZATION)
  { keywords: ['req_authorization'], style: 'yellow', label: 'Autorización Requerida' },
  { keywords: ['tma', 'ctr', 'restricted'], style: 'yellow', label: 'Espacio Aéreo Controlado' },
  
  // FALLBACK - AMARILLO
  { keywords: [''], style: 'yellow', label: 'Zona Restringida' }
]

// Inicializar mapa
const initMap = () => {
  if (!window.google) {
    console.error('Google Maps no está cargado')
    return
  }

  map.value = new google.maps.Map(document.getElementById('spots-map'), {
    center: CONFIG.MAP_CENTER,
    zoom: CONFIG.MAP_ZOOM,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    gestureHandling: 'greedy' // Permite desplazamiento sin Control
  })
  
  map.value.addListener('click', () => {
    if (currentInfoWindow.value) {
      currentInfoWindow.value.close()
      currentInfoWindow.value = null
    }
  })

  loadAeronauticalZones()
}
// Detectar zona aeronáutica en una posición específica
const detectAeronauticalZone = (lat, lng) => {
  const point = new google.maps.LatLng(lat, lng)
  let detectedZones = []
  
  // Revisar todas las capas aeronáuticas
  aeronauticalLayers.value.forEach(layer => {
    // Usar el método correcto para iterar sobre features de google.maps.Data
    layer.forEach(feature => {
      try {
        // Verificar si el punto está dentro de la geometría del feature
        const geometry = feature.getGeometry()
        
        // Verificar que la geometría sea un polígono antes de usar containsLocation
        if (geometry && (geometry.getType() === 'Polygon' || geometry.getType() === 'MultiPolygon')) {
          let isInside = false
          
          if (geometry.getType() === 'Polygon') {
            // Para polígonos simples - convertir MVCArray a array
            const paths = geometry.getAt(0) // Obtener el primer (y único) anillo
            const pathsArray = []
            for (let j = 0; j < paths.getLength(); j++) {
              const latLng = paths.getAt(j)
              pathsArray.push({ lat: latLng.lat(), lng: latLng.lng() })
            }
            const tempPolygon = new google.maps.Polygon({ paths: [pathsArray] })
            isInside = google.maps.geometry.poly.containsLocation(point, tempPolygon)
          } else if (geometry.getType() === 'MultiPolygon') {
            // Para multipolígonos, verificar cada polígono
            for (let i = 0; i < geometry.getLength(); i++) {
              const polygon = geometry.getAt(i)
              const paths = polygon.getAt(0) // Obtener el primer anillo de cada polígono
              const pathsArray = []
              for (let j = 0; j < paths.getLength(); j++) {
                const latLng = paths.getAt(j)
                pathsArray.push({ lat: latLng.lat(), lng: latLng.lng() })
              }
              const tempPolygon = new google.maps.Polygon({ paths: [pathsArray] })
              if (google.maps.geometry.poly.containsLocation(point, tempPolygon)) {
                isInside = true
                break
              }
            }
          }
          
          if (isInside) {
            const name = feature.getProperty('Name') || 'Zona sin nombre'
            const type = feature.getProperty('Type') || 'Sin tipo'
            const reasons = feature.getProperty('Reasons') || 'No especificado'
            const message = feature.getProperty('Message') || ''
            const upper = feature.getProperty('Upper') || 'No especificado'
            const lower = feature.getProperty('Lower') || 'No especificado'
            
            // Determinar el color de la zona usando las mismas reglas que getZoneStyle
            const zoneType = type.toLowerCase()
            const zoneName = name.toLowerCase()
            const zoneMessage = message.toLowerCase()
            const upperHeight = convertHeight(feature.getProperty('Upper'), feature.getProperty('UOM'))
            
            let zoneColor = 'yellow' // Por defecto amarillo
            let zoneLabel = 'Zona Restringida'
            
            // Aplicar reglas en orden para determinar el color
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
              label: zoneLabel
            })
          }
        }
      } catch (error) {
        console.warn('Error procesando feature aeronáutico:', error)
      }
    })
  })
    detectedZones.sort((a, b) => {
    if (a.color === 'red' && b.color !== 'red') return -1
    if (b.color === 'red' && a.color !== 'red') return 1
        return a.name.localeCompare(b.name)
  })
  return detectedZones
}
// Cargar zonas aeronáuticas
const loadAeronauticalZones = async () => {
  try {
    clearExistingLayers()
    
    // Usar el servicio del backend en lugar del endpoint directo
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
    // Si falla el backend, intentar con el fallback KML
    loadFallbackKML()
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

// Calcular área de un polígono usando fórmula del área del polígono
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
  // Filtrar zonas REQ_AUTHORIZATION
  const filteredFeatures = geoJsonData.features.filter(feature => {
    const zoneType = (feature.properties?.Type || feature.properties?.TIPO_ZONA || '').toUpperCase()
    const zoneName = (feature.properties?.Name || feature.properties?.NOMBRE || '').toUpperCase()
    return true
  })
  
  
  // Calcular área para cada feature filtrado y clasificar por tipo
  const featuresWithArea = filteredFeatures.map(feature => {
    const area = calculateGeometryArea(feature.geometry)
    const zoneType = (feature.properties?.Type || '').toLowerCase()
    const zoneName = (feature.properties?.Name || '').toLowerCase()
    const reasons = (feature.properties?.Reasons || '').toLowerCase()
    const message = (feature.properties?.Message || '').toLowerCase()
    const upper = convertHeight(feature.properties?.Upper, feature.properties?.UOM)

    
    // Determinar si es zona prohibida (roja) o restringida (amarilla) usando ZONE_RULES
    let isProhibited = false
    let matchedRule = null
    
    // Aplicar las mismas reglas que en getZoneStyle
    for (const rule of ZONE_RULES) {
      let ruleMatches = false
      
      // Verificar coincidencias por palabras clave
      if (rule.keywords && rule.keywords.some(keyword => 
        zoneType.includes(keyword) || zoneName.includes(keyword) || reasons.includes(keyword) || message.includes(keyword)
      )) {
        ruleMatches = true
      }
      
      // Verificar coincidencias por altura
      if (rule.heightCheck && !isNaN(upper) && rule.heightCheck(upper)) {
        ruleMatches = true
      }
      
      // Si la regla coincide, determinar si es prohibida (roja) o restringida (amarilla)
      if (ruleMatches) {
        isProhibited = rule.style === 'red'
        matchedRule = rule

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
    // Zonas restringidas (amarillas) - zIndex más bajo
    restricted_large: [],
    restricted_medium: [],
    restricted_small: [],
    // Zonas prohibidas (rojas) - zIndex más alto
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
  
  // Crear capas con zIndex apropiado: restringidas (1-3), prohibidas (4-6)
  const layerConfigs = [
    // Zonas restringidas (amarillas) - zIndex bajo
    { name: 'restricted_large', features: layers.restricted_large, zIndex: 1 },
    { name: 'restricted_medium', features: layers.restricted_medium, zIndex: 2 },
    { name: 'restricted_small', features: layers.restricted_small, zIndex: 3 },
    // Zonas prohibidas (rojas) - zIndex alto (siempre encima)
    { name: 'prohibited_large', features: layers.prohibited_large, zIndex: 4 },
    { name: 'prohibited_medium', features: layers.prohibited_medium, zIndex: 5 },
    { name: 'prohibited_small', features: layers.prohibited_small, zIndex: 6 }
  ]
  
  layerConfigs.forEach(config => {
    if (config.features.length > 0) {
      const dataLayer = new google.maps.Data()
      
      // Añadir features a la capa
      config.features.forEach(feature => {
        dataLayer.addGeoJson({
          type: 'FeatureCollection',
          features: [feature]
        })
      })
      
      // Aplicar estilo según el tipo y tamaño
      const sizeCategory = config.name.split('_')[1] // large, medium, small
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
  
  let baseStyle = 'red' // Por defecto
  
  // Aplicar reglas en orden para determinar el color base
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
  
  // Combinar color base con tamaño de zona
  const styleKey = `${baseStyle}_${zoneSize}`
  return ZONE_STYLES[styleKey] || ZONE_STYLES[`${baseStyle}_small`]
}

// Convertir altura a metros
const convertHeight = (height, uom) => {
  const numHeight = Number(height)
  if (isNaN(numHeight)) return NaN
  
  // Convertir de pies a metros si es necesario
  return uom?.toUpperCase() === 'FT' ? numHeight * 0.3048 : numHeight
}

// Mostrar información de zona
const showZoneInfo = (event) => {
  // Cerrar InfoWindow anterior si existe
  if (currentInfoWindow.value) {
    currentInfoWindow.value.close()
  }
  
  const feature = event.feature
  
  // Obtener todas las propiedades solicitadas
  const name = feature.getProperty('Name') || 'Sin nombre'
  const type = feature.getProperty('Type') || 'Sin tipo'
  const reasons = feature.getProperty('Reasons') || 'No especificado'
  const message = feature.getProperty('Message') || 'Sin mensaje'
  const lower = feature.getProperty('Lower') || 'No especificado'
  const lowerReference = feature.getProperty('LowerReference') || 'No especificado'
  const upper = feature.getProperty('Upper') || 'No especificado'
  const upperReference = feature.getProperty('UpperReference') || 'No especificado'
  const email = feature.getProperty('Email') || 'No disponible'
  const phone = feature.getProperty('Phone') || 'No disponible'
  const updateDateTime = feature.getProperty('UpdateDateTime') || 'No disponible'
  
  // Formatear fecha si está disponible
  const formatDateTime = (dateTime) => {
    if (!dateTime || dateTime === 'No disponible') return dateTime
    try {
      const date = new Date(dateTime)
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateTime
    }
  }
  
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div class="p-4 max-w-md">
        <h3 class="font-bold text-lg mb-3 text-blue-800 border-b pb-2">Información de Zona Aeronáutica</h3>
        <div class="space-y-2 text-sm">
          <div class="grid grid-cols-1 gap-2">
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
              <p><strong class="text-yellow-700">Referencia Inferior:</strong> <span class="text-yellow-900">${lowerReference}</span></p>
            </div>
            <div class="bg-red-50 p-2 rounded">
              <p><strong class="text-red-700">Límite Superior:</strong> <span class="text-red-900">${upper}</span></p>
              <p><strong class="text-red-700">Referencia Superior:</strong> <span class="text-red-900">${upperReference}</span></p>
            </div>
            ${email !== 'No disponible' || phone !== 'No disponible' ? `
            <div class="bg-green-50 p-2 rounded">
              <p><strong class="text-green-700">Contacto:</strong></p>
              ${email !== 'No disponible' ? `<p class="ml-2">📧 <span class="text-green-900">${email}</span></p>` : ''}
              ${phone !== 'No disponible' ? `<p class="ml-2">📞 <span class="text-green-900">${phone}</span></p>` : ''}
            </div>
            ` : ''}
            <div class="bg-gray-100 p-2 rounded text-xs">
              <p><strong class="text-gray-600">Última actualización:</strong> <span class="text-gray-800">${formatDateTime(updateDateTime)}</span></p>
            </div>
          </div>
        </div>
      </div>
    `,
    position: event.latLng,
    maxWidth: 400
  })
  
  // Guardar referencia al InfoWindow actual
  currentInfoWindow.value = infoWindow
  
  // Agregar listener para limpiar la referencia cuando se cierre
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

// Cargar KML como fallback
const loadFallbackKML = () => {
  try {
    
    const kmlLayer = new google.maps.KmlLayer({
      url: CONFIG.FALLBACK_KML,
      map: map.value,
      preserveViewport: true,
      suppressInfoWindows: false
    })
    
    aeronauticalLayer.value = kmlLayer
  } catch (error) {
    console.error('Error al cargar KML de fallback:', error)
  }
}

// Cargar spots
const loadSpots = async () => {
  try {
    const response = await spotService.getSpots()
    spots.value = response || []
    addMarkers()
  } catch (error) {
    console.error('Error al cargar los spots:', error)
  }
}

// Añadir marcadores de spots
const addMarkers = () => {
  // Limpiar marcadores existentes
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []

  // Crear nuevos marcadores
  spots.value.forEach(spot => {
    if (spot.location?.coordinates?.length === 2) {
      const marker = createSpotMarker(spot)
      markers.value.push(marker)
    }
  })
}

// Crear marcador de spot
const createSpotMarker = (spot) => {
  const marker = new google.maps.Marker({
    position: {
      lat: spot.location.coordinates[1],
      lng: spot.location.coordinates[0]
    },
    map: map.value,
    title: spot.name,
    icon: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#10b981" stroke="#059669" stroke-width="2"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(24, 24),
      anchor: new google.maps.Point(12, 24)
    }
  })

  marker.addListener('click', () => {
    // Cerrar InfoWindow anterior si existe
    if (currentInfoWindow.value) {
      currentInfoWindow.value.close()
    }
    
    // Detectar zonas aeronáuticas en la posición del spot
    const zones = detectAeronauticalZone(
      spot.location.coordinates[1], 
      spot.location.coordinates[0]
    )
    
    // Generar contenido de zonas
    let zoneContent = ''
    if (zones.length === 0) {
      zoneContent = `
        <div class="mt-3 p-2 bg-green-50 border border-green-200 rounded">
          <p class="text-green-800 font-medium text-sm">✅ Sin restricciones</p>
          <p class="text-green-600 text-xs">Esta ubicación no está dentro de ninguna zona aeronáutica restringida</p>
        </div>
      `
       } else {
      zoneContent = `
        <div class="mt-3">
          <h4 class="font-medium text-sm text-gray-800 mb-2">⚠️ Zonas Aeronáuticas Detectadas:</h4>
          ${zones.map(zone => {
            const bgColor = zone.color === 'red' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
            const textColor = zone.color === 'red' ? 'text-red-800' : 'text-yellow-800'
            const detailColor = zone.color === 'red' ? 'text-red-700' : 'text-yellow-700'
            const icon = zone.color === 'red' ? '🚫' : '⚠️'
            
            return `
            <div class="mb-2 p-2 ${bgColor} border rounded">
              <p class="font-medium ${textColor} text-sm">${icon} ${zone.name}</p>
              <p class="${textColor} text-xs font-medium">${zone.label}</p>
              <p class="${detailColor} text-xs"><strong>Tipo:</strong> ${zone.type}</p>
              <p class="${detailColor} text-xs"><strong>Razón:</strong> ${zone.reasons}</p>
              <p class="${detailColor} text-xs"><strong>Altitud:</strong> ${zone.lower} - ${zone.upper}</p>
            </div>
            `
          }).join('')}
        </div>
      `
    }
    
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-3 max-w-sm">
          <h3 class="font-bold text-lg text-gray-800">${spot.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${spot.description || 'Sin descripción'}</p>
          ${zoneContent}
        </div>
      `,
      maxWidth: 350
    })
    
    // Guardar referencia al InfoWindow actual
    currentInfoWindow.value = infoWindow
    
    // Agregar listener para limpiar la referencia cuando se cierre
    infoWindow.addListener('closeclick', () => {
      currentInfoWindow.value = null
    })
    
    infoWindow.open(map.value, marker)
  })

  return marker
}

// Inicialización
onMounted(() => {
  if (window.google) {
    initMap()
    loadSpots()
  } else {
    setTimeout(() => {
      initMap()
      loadSpots()
    }, 1000)
  }
})
</script>

<template>
  <div class="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
    <!-- Leyenda -->
    <div class="mb-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
        Leyenda de Zonas Aeronáuticas
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
        <div class="flex items-center">
          <div class="w-4 h-4 bg-yellow-500 opacity-60 mr-2 rounded border border-yellow-700"></div>
          <span class="text-gray-700 dark:text-gray-300">Zona restringida</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-red-600 opacity-60 mr-2 rounded border border-red-800"></div>
          <span class="text-gray-700 dark:text-gray-300">Zona Prohibida</span>
        </div>
      </div>
    </div>
    
    <!-- Mapa -->
    <div
      id="spots-map"
      class="w-full h-[calc(100vh-16rem)] rounded-lg overflow-hidden ring-1 ring-gray-200/20 dark:ring-gray-700/20 shadow-lg"
    ></div>
  </div>
</template>
