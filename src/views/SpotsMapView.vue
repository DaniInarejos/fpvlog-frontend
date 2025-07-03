<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import spotService from '../services/spotService'

const { t } = useI18n()
const spots = ref([])
const map = ref(null)
const markers = ref([])

const initMap = () => {
  if (!window.google) {
    console.error('Google Maps no está cargado')
    return
  }

  // Centrar el mapa en España
  map.value = new google.maps.Map(document.getElementById('spots-map'), {
    center: { lat: 40.416775, lng: -3.703790 }, // Centro de España
    zoom: 6, // Zoom para ver España completa
    styles: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#242f3e' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      }
    ]
  })
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
})
</script>

<template>
  <div class="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
    <div
      id="spots-map"
      class="w-full h-[calc(100vh-6rem)] rounded-lg overflow-hidden ring-1 ring-gray-200/20 dark:ring-gray-700/20 shadow-lg"
    ></div>
  </div>
</template>