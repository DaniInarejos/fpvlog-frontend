<template>
  <div class="dashboard">
    <div class="clouds-bg"></div>
    <AppHeader />
    
    <main class="dashboard-content">
      <section class="flights-section">
        <div class="section-header">
          <h2>✈️ Gestión de Vuelos</h2>
          <button @click="showAddFlightModal = true" class="btn btn-primary">
            + Añadir Vuelo
          </button>
        </div>
        
        <!-- Estadísticas rápidas -->
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total de Vuelos</h3>
            <p class="stat-number">{{ flights.length }}</p>
          </div>
          <div class="stat-card">
            <h3>Tiempo Total</h3>
            <p class="stat-number">{{ totalFlightTime }} min</p>
          </div>
          <div class="stat-card">
            <h3>Promedio por Vuelo</h3>
            <p class="stat-number">{{ averageFlightTime }} min</p>
          </div>
        </div>
        
        <div v-if="flights.length === 0" class="no-flights">
          <p>No tienes vuelos registrados aún.</p>
          <button @click="showAddFlightModal = true" class="btn btn-outline">
            Registrar tu primer vuelo
          </button>
        </div>
        
        <div v-else class="flights-grid">
          <ItemCard
            v-for="flight in flights"
            :key="flight._id"
            :item="flight"
            :title="flight.title || flight.location"
            :subtitle="formatDate(flight.date)"
            :details="getFlightDetails(flight)"
            image-url="/vuelo.jpg"
            image-alt="Vuelo"
            @edit="editFlight"
            @delete="deleteFlight"
          />
        </div>
      </section>
    </main>
    
    <FlightModal
      v-if="showAddFlightModal"
      :flight="editingFlight"
      :drones="drones"
      :loading="loading"
      :error="error"
      :success="success"
      @submit="submitFlight"
      @close="closeModal"
    />
    
    <!-- Modal de confirmación -->
    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :type="confirmModal.type"
      :confirm-text="confirmModal.confirmText"
      :cancel-text="confirmModal.cancelText"
      @confirm="handleConfirm"
      @close="closeConfirmModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import ItemCard from '../components/ItemCard.vue'
import FlightModal from '../components/FlightModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import api from '../services/api.js'

const flights = ref([])
const drones = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showAddFlightModal = ref(false)
const editingFlight = ref(null)

const totalFlightTime = computed(() => {
  return flights.value.reduce((total, flight) => total + (flight.duration || 0), 0)
})

const averageFlightTime = computed(() => {
  if (flights.value.length === 0) return 0
  return Math.round(totalFlightTime.value / flights.value.length)
})

const loadFlights = async () => {
  try {
    const response = await api.get('/flights')
    flights.value = response.data
  } catch (error) {
    console.error('Error al cargar vuelos:', error)
  }
}

const loadDrones = async () => {
  try {
    const response = await api.get('/drones')
    drones.value = response.data
  } catch (error) {
    console.error('Error al cargar drones:', error)
  }
}

const editFlight = (flight) => {
  console.log('editFlight called with:', flight) // Debug: verificar que flight tiene _id
  editingFlight.value = flight
  showAddFlightModal.value = true
}

const submitFlight = async (flightData) => {
  console.log('submitFlight called with flightData:', flightData) // Debug: verificar que flightData tiene _id
  console.log('editingFlight.value:', editingFlight.value) // Debug: verificar editingFlight
  
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    if (flightData._id) {
     alert('Updating flight with ID:', flightData._id) // Debug: confirmar el _id
      const { _id, ...updateData } = flightData
      console.log('Update data:', updateData) // Debug: verificar datos de actualización
      await api.patch(`/flights/${_id}`, updateData)
      success.value = 'Vuelo actualizado correctamente'
    } else {
      console.log('Creating new flight') // Debug: confirmar creación
      await api.post('/flights', flightData)
      success.value = 'Vuelo añadido correctamente'
    }
    
    await loadFlights()
    
    setTimeout(() => {
      closeModal()
    }, 1500)
    
  } catch (err) {
    console.error('Error al guardar vuelo:', err)
    error.value = err.response?.data?.message || 'Error al guardar el vuelo'
  } finally {
    loading.value = false
  }
}

// Variables para el modal de confirmación
const showConfirmModal = ref(false)
const confirmModal = ref({
  title: '',
  message: '',
  type: 'warning',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  action: null,
  data: null
})

// Función actualizada para eliminar vuelo
const deleteFlight = async (flightId) => {
  confirmModal.value = {
    title: 'Eliminar Vuelo',
    message: '¿Estás seguro de que quieres eliminar este vuelo? Esta acción no se puede deshacer.',
    type: 'danger',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    action: 'deleteFlight',
    data: flightId
  }
  showConfirmModal.value = true
}

// Manejar confirmación
const handleConfirm = async () => {
  const { action, data } = confirmModal.value
  
  if (action === 'deleteFlight') {
    try {
      await api.delete(`/flights/${data}`)
      await loadFlights()
      // Mostrar mensaje de éxito si quieres
    } catch (error) {
      console.error('Error al eliminar vuelo:', error)
      // Aquí podrías mostrar otro modal de error en lugar de alert
    }
  }
  
  closeConfirmModal()
}

// Cerrar modal de confirmación
const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmModal.value = {
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    action: null,
    data: null
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getDroneName = (droneId) => {
  if (!droneId) return 'N/A'
  const drone = drones.value.find(d => d._id === droneId)
  return drone ? drone.name : 'Drone desconocido'
}

const getFlightDetails = (flight) => {
  const details = []
  details.push({ label: 'Duración', value: `${flight.duration || 0} min` })
  if (flight.droneId) details.push({ label: 'Drone', value: getDroneName(flight.droneId) })
  if (flight.distance) details.push({ label: 'Distancia', value: `${flight.distance} km` })
  if (flight.maxSpeed) details.push({ label: 'Vel. Máx', value: `${flight.maxSpeed} km/h` })
  if (flight.maxAltitude) details.push({ label: 'Alt. Máx', value: `${flight.maxAltitude} m` })
  if (flight.weather) details.push({ label: 'Clima', value: flight.weather })
  return details
}

const closeModal = () => {
  showAddFlightModal.value = false
  editingFlight.value = null
  error.value = ''
  success.value = ''
}

onMounted(async () => {
  await loadDrones()
  await loadFlights()
})
</script>

<style scoped>
@import '../assets/styles/dashboard-base.css';
@import '../assets/styles/dashboard-cards.css';
@import '../assets/styles/dashboard-buttons.css';
@import '../assets/styles/dashboard-stats.css';
</style>