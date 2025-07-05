<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import BaseModal from '../components/base/BaseModal.vue'
import flightService from '../services/flightService'
import droneService from '../services/droneService'
import spotService from '../services/spotService'
import FlightList from '../components/flight/FlightList.vue'
import FlightForm from '../components/flight/FlightForm.vue'
import FlightInfo from '../components/flight/FlightInfo.vue'
import DroneInfo from '../components/drone/DroneInfo.vue'
import SpotInfo from '../components/spot/SpotInfo.vue'

const userStore = useUserStore()
const { t } = useI18n()
const flights = ref([])
const drones = ref([])
const spots = ref([])
const isLoading = ref(false)
const showForm = ref(false)
const selectedFlight = ref(null)
const showDeleteModal = ref(false)
const flightToDelete = ref(null)
const errors = ref({})
const showFlightInfo = ref(false)
const selectedFlightInfo = ref(null)
const showDroneInfo = ref(false)
const selectedDroneInfo = ref(null)
const showSpotInfo = ref(false)
const selectedSpotInfo = ref(null)

const handleShowFlightInfo = (flight) => {
  selectedFlightInfo.value = flight
  showFlightInfo.value = true
}

const handleCloseFlightInfo = () => {
  showFlightInfo.value = false
  selectedFlightInfo.value = null
}

const handleShowDroneInfo = (droneId) => {
  const drone = drones.value.find(d => d._id === droneId)
  if (drone) {
    selectedDroneInfo.value = drone
    showDroneInfo.value = true
  }
}

const handleCloseDroneInfo = () => {
  showDroneInfo.value = false
  selectedDroneInfo.value = null
}

const handleShowSpotInfo = (spotId) => {
  const spot = spots.value.find(s => s._id === spotId)
  if (spot) {
    selectedSpotInfo.value = spot
    showSpotInfo.value = true
  }
}

const handleCloseSpotInfo = () => {
  showSpotInfo.value = false
  selectedSpotInfo.value = null
}

const fetchDrones = async () => {
  try {
    drones.value = await droneService.getUserDrones(userStore.user._id)
  } catch (error) {
    errors.value.drones = 'Error cargando drones'
  }
}

const fetchSpots = async () => {
  try {
    spots.value = await spotService.getUserSpots(userStore.user._id)
  } catch (error) {
    errors.value.spots = 'Error cargando spots'
  }
}

const fetchFlights = async () => {
  isLoading.value = true
  try {
    flights.value = await flightService.getUserFlights(userStore.user._id)
  } catch (error) {
    errors.value.fetch = error.message
  } finally {
    isLoading.value = false
  }
}

const openDeleteModal = (flight) => {
  flightToDelete.value = flight
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!flightToDelete.value) return
  
  isLoading.value = true
  try {
    await flightService.deleteFlight(flightToDelete.value._id)
    await fetchFlights()
    showDeleteModal.value = false
    flightToDelete.value = null
  } catch (error) {
    errors.value.delete = error.message
  } finally {
    isLoading.value = false
  }
}

const handleEdit = (flight) => {
  selectedFlight.value = flight
  showForm.value = true
}

const handleClose = () => {
  showForm.value = false
  selectedFlight.value = null
}

const handleSaved = async () => {
  showForm.value = false
  selectedFlight.value = null
  await fetchFlights()
}

onMounted(() => {
  fetchFlights()
  fetchDrones()
  fetchSpots()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!showForm">
      <FlightList
        :flights="flights"
        :drones="drones"
        :spots="spots"
        :is-loading="isLoading"
        :errors="errors"
        @edit="handleEdit"
        @create="showForm = true"
        @delete="openDeleteModal"
        @showFlightInfo="handleShowFlightInfo"
        @showDroneInfo="handleShowDroneInfo"
        @showSpotInfo="handleShowSpotInfo"
      />
    </div>

    <div v-else>
      <FlightForm
        :flight="selectedFlight"
        :drones="drones"
        :spots="spots"
        @close="handleClose"
        @saved="handleSaved"
      />
    </div>

    <BaseModal
      :show="showDeleteModal"
      :title="t('message.flights.delete.title')"
      :show-warning-icon="true"
      :show-delete-button="true"
      :show-accept-button="false"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    >
      <p class="text-sm text-gray-500">
        {{ t('message.flights.delete.confirmation', { title: flightToDelete?.title }) }}
      </p>
    </BaseModal>
    <FlightInfo
      :flight="selectedFlightInfo"
      :spots="spots"
      :show="showFlightInfo"
      @close="handleCloseFlightInfo"
    />
    <DroneInfo
      :drone="selectedDroneInfo"
      :show="showDroneInfo"
      @close="handleCloseDroneInfo"
    />
    <SpotInfo
      :spot="selectedSpotInfo"
      :show="showSpotInfo"
      @close="handleCloseSpotInfo"
    />
  </div>
</template>
