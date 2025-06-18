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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import ItemCard from '../components/ItemCard.vue'
import FlightModal from '../components/FlightModal.vue'
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

const submitFlight = async (flightData) => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    if (editingFlight.value) {
      await api.put(`/flights/${editingFlight.value._id}`, flightData)
      success.value = 'Vuelo actualizado correctamente'
    } else {
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

const editFlight = (flight) => {
  editingFlight.value = flight
  showAddFlightModal.value = true
}

const deleteFlight = async (flightId) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este vuelo?')) {
    return
  }
  
  try {
    await api.delete(`/flights/${flightId}`)
    await loadFlights()
  } catch (error) {
    console.error('Error al eliminar vuelo:', error)
    alert('Error al eliminar el vuelo')
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
  if (flight.weather) details.push({ label: 'Clima', value: flight.weather })
  if (flight.batteryUsed) details.push({ label: 'Baterías', value: flight.batteryUsed })
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