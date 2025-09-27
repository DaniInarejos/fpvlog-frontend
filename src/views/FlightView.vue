<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useGlobalLoginModal } from '../composables/useGlobalLoginModal'
import BaseModal from '../components/base/BaseModal.vue'
import LoginModal from '../components/common/LoginModal.vue'
import flightService from '../services/flightService'
import droneService from '../services/droneService'
import spotService from '../services/spotService'
import FlightPageHeader from '../components/flight/FlightPageHeader.vue'
import FlightFilters from '../components/flight/FlightFilters.vue'
import FlightList from '../components/flight/FlightList.vue'
import FlightForm from '../components/flight/FlightForm.vue'
import FlightInfo from '../components/flight/FlightInfo.vue'
import DroneInfo from '../components/drone/DroneInfo.vue'
import SpotInfo from '../components/spot/SpotInfo.vue'

const userStore = useUserStore()
const { t } = useI18n()
const router = useRouter()
const { showLoginModal, openLoginModal, closeLoginModal, handleLoginSuccess } = useGlobalLoginModal()

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
const selectedFilter = ref('ALL')

const isAuthenticated = computed(() => userStore.isAuthenticated)

const handleLogin = () => {
  router.push('/login')
}

const handleCreateFlight = () => {
  if (!isAuthenticated.value) {
    handleLogin()
    return
  }
  
  selectedFlight.value = null
  showForm.value = true
}

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
  if (!userStore.isAuthenticated) {
    openLoginModal()
    return
  }
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

const handleFilterChange = (filter) => {
  selectedFilter.value = filter
}

onMounted(() => {
  // Cargar datos independientemente del estado de autenticación
  // Si no está autenticado, mostrará la interfaz de login manual
  fetchFlights()
  fetchDrones()
  fetchSpots()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <FlightPageHeader
      :title="t('flights.title')"
      :description="t('flights.description')"
      :is-authenticated="isAuthenticated"
      color="purple"
      @create="handleCreateFlight"
      @login="handleLogin"
    />

    <!-- Filtros y búsqueda -->
    <div class="mb-6 space-y-4 mt-8">
      <!-- Filtro de tipos -->
      <FlightFilters
        :selected-filter="selectedFilter"
        :flights="flights"
        @filter-change="handleFilterChange"
      />
    </div>

    <!-- Lista de vuelos -->
    <div v-if="isAuthenticated" class="space-y-4">
      <FlightList
        :flights="flights"
        :drones="drones"
        :spots="spots"
        :active-filter="selectedFilter"
        :is-authenticated="isAuthenticated"
        @edit="handleEdit"
        @delete="openDeleteModal"
        @view="handleShowFlightInfo"
        @show-drone-info="handleShowDroneInfo"
        @show-spot-info="handleShowSpotInfo"
      />
    </div>

    <!-- Estado no autenticado con glassmorphism -->
    <div v-else class="text-center py-12">
      <div class="backdrop-blur-md bg-white/20 dark:bg-gray-900/20 rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl">
        <div class="text-6xl mb-4">🔐</div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {{ t('auth.loginRequired') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ t('flights.loginDescription') }}
        </p>
        <button
          @click="handleLogin"
          class="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors backdrop-blur-sm border border-purple-500/30 shadow-lg"
        >
          <span class="mr-2">🔐</span>
          {{ t('auth.login') }}
        </button>
      </div>
    </div>

    <!-- Modal para formulario -->
    <Teleport to="body">
      <BaseModal
        v-if="showForm"
        :show="showForm"
        :title="selectedFlight ? t('flights.editFlight') : t('flights.addFlight')"
        :show-accept-button="false"
        :show-cancel-button="false"
        :show-close-button="true"
        :require-double-click="true"
        size="full"
        @close="handleClose"
      >
        <FlightForm
          :flight="selectedFlight"
          :drones="drones"
          :spots="spots"
          @close="handleClose"
          @saved="handleSaved"
        />
      </BaseModal>
    </Teleport>

    <!-- Modal de confirmación de eliminación -->
    <BaseModal
      :show="showDeleteModal"
      :title="t('flights.delete.title')"
      :show-warning-icon="true"
      :show-delete-button="true"
      :show-accept-button="false"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    >
      <p class="text-sm text-gray-500">
        {{ t('flights.delete.confirmation', { title: flightToDelete?.title || t('flights.untitled') }) }}
      </p>
    </BaseModal>

    <!-- Modales de información -->
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
    
    <!-- Modal de Login Global -->
    <LoginModal
      :show="showLoginModal"
      @close="closeLoginModal"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>
