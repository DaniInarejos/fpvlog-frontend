<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import spotService from '../services/spotService'

const { t } = useI18n()
const spots = ref([])
const map = ref(null)
const markers = ref([])
const uasLayers = ref([])

const initMap = () => {
  if (!window.google) {
    console.error('Google Maps no está cargado')
    return
  }

  map.value = new google.maps.Map(document.getElementById('spots-map'), {
    center: { lat: 40.416775, lng: -3.703790 }, 
    zoom: 6
  })

  // Añadir capa de zonas geográficas de UAS
  loadUASZones()
}

const loadUASZones = async () => {
  try {
    // Limpiar capas existentes
    uasLayers.value.forEach(layer => layer.setMap(null))
    uasLayers.value = []

    // Cargar zonas aeronáuticas
    const aeroLayer = new google.maps.KmlLayer({
      url: 'https://servais.enaire.es/einsignia/rest/services/Drones/ZGUAS_Aero.kmz',
      map: map.value,
      preserveViewport: true,
      suppressInfoWindows: false
    })
    uasLayers.value.push(aeroLayer)

    // Cargar zonas urbanas
    const urbanLayer = new google.maps.KmlLayer({
      url: 'https://servais.enaire.es/einsignia/rest/services/Drones/ZGUAS_Urbano.kmz',
      map: map.value,
      preserveViewport: true,
      suppressInfoWindows: false
    })
    uasLayers.value.push(urbanLayer)

    // Cargar zonas de infraestructuras
    const infraLayer = new google.maps.KmlLayer({
      url: 'https://servais.enaire.es/einsignia/rest/services/Drones/ZGUAS_Infraestructuras.kmz',
      map: map.value,
      preserveViewport: true,
      suppressInfoWindows: false
    })
    uasLayers.value.push(infraLayer)
  } catch (error) {
    console.error('Error al cargar las zonas UAS:', error)
  }
}

const loadSpots = async () => {
  try {
    const response = await spotService.getSpots()
    spots.value = response || []
    addMarkers()
  } catch (error) {
    console.error('Error al cargar los spots:', error)
  }
}

const addMarkers = () => {
  // Limpiar marcadores existentes
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []

  // Añadir nuevos marcadores
  spots.value.forEach(spot => {
    if (spot.location?.coordinates?.length === 2) {
      const marker = new google.maps.Marker({
        position: {
          lat: spot.location.coordinates[1],
          lng: spot.location.coordinates[0]
        },
        map: map.value,
        title: spot.name
      })

      // Crear ventana de información
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold text-lg">${spot.name}</h3>
            <p class="text-sm">${spot.description || ''}</p>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(map.value, marker)
      })

      markers.value.push(marker)
    }
  })
}

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
})</script>

<template>
  <div class="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
    <div class="mb-4 flex justify-end space-x-2">
      <div class="flex items-center space-x-2 text-sm">
        <div class="flex items-center">
          <div class="w-4 h-4 bg-red-500 opacity-50 mr-1"></div>
          <span>{{ t('message.spots.map.restrictedZone') }}</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-yellow-500 opacity-50 mr-1"></div>
          <span>{{ t('message.spots.map.limitedZone') }}</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-green-500 opacity-50 mr-1"></div>
          <span>{{ t('message.spots.map.allowedZone') }}</span>
        </div>
      </div>
    </div>
    <div
      id="spots-map"
      class="w-full h-[calc(100vh-6rem)] rounded-lg overflow-hidden ring-1 ring-gray-200/20 dark:ring-gray-700/20 shadow-lg"
    ></div>
  </div>
</template>
