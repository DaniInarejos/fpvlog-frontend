<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

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
  }
})

const emit = defineEmits(['update:modelValue'])
const map = ref(null)
const marker = ref(null)
const searchInput = ref(null)

const initMap = () => {
  if (!window.google) {
    console.error('Google Maps no está cargado')
    return
  }

  const mapElement = document.getElementById('map')
  map.value = new google.maps.Map(mapElement, {
    center: { lat: 40.416775, lng: -3.703790 },
    zoom: 10,
   
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
  })
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
      :placeholder="t('message.spots.form.searchLocation')"
      :class="{ 'border-red-500 focus:ring-red-500': error }"
    />
    <div 
      id="map" 
      class="w-full h-96 rounded-lg overflow-hidden ring-1 ring-gray-200/20 dark:ring-gray-700/20 shadow-lg"
    ></div>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>