<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  coordinates: {
    type: Array,
    required: true,
    validator: (value) => value.length === 2
  },
  spotId: {
    type: String,
    required: true
  }
})

const mapId = ref(`static-map-${props.spotId}`)

onMounted(() => {
  // Wait for Google Maps to be loaded
  const initializeMap = () => {
    if (!window.google) {
      setTimeout(initializeMap, 100)
      return
    }

    const map = new google.maps.Map(document.getElementById(mapId.value), {
      mapId: mapId.value,
      center: { lat: props.coordinates[1], lng: props.coordinates[0] },
      zoom: 15,
      disableDefaultUI: true,
      draggable: false,
      zoomControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: true
    })

    new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat: props.coordinates[1], lng: props.coordinates[0] }
    })
  }

  initializeMap()
})
</script>

<template>
  <div :id="mapId" class="w-full h-48 rounded-t-lg overflow-hidden"></div>
</template>