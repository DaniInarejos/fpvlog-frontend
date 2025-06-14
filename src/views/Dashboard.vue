<template>
  <div class="dashboard">
    <div class="clouds-bg"></div>
    <header class="dashboard-header">
      <h1>Dashboard - FPV Log</h1>
      <div class="user-info">
        <span v-if="authStore.user">Bienvenido, {{ authStore.user.username }}</span>
        <button @click="$router.push('/profile')" class="btn btn-outline">
          Mi Perfil
        </button>
        <button @click="handleLogout" class="btn btn-secondary">
          Cerrar Sesión
        </button>
      </div>
    </header>
    
    <main class="dashboard-content">
      <!-- Sección de Estadísticas -->
      <section class="stats-section">
        <div class="section-header">
          <h2>📊 Estadísticas</h2>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total de Vuelos</h3>
            <p class="stat-number">{{ stats.totalFlights }}</p>
          </div>
          
          <div class="stat-card">
            <h3>Tiempo Total</h3>
            <p class="stat-number">{{ stats.totalTime }} min</p>
          </div>
          
          <div class="stat-card">
             <h3>Total de Drones</h3>
            <p class="stat-number">{{ drones.length }}</p>
          </div>
          
          <div class="stat-card">
            <h3>Último Vuelo</h3>
            <p class="stat-number">{{ stats.lastFlight }}</p>
          </div>
        </div>
      </section>
      
      <!-- Sección de Drones -->
      <section class="drones-section">
        <div class="section-header">
          <h2>🚁 Mis Drones</h2>
          <button @click="showAddDroneModal = true" class="btn btn-primary">
            + Añadir Drone
          </button>
        </div>
        
        <div v-if="drones.length === 0" class="no-drones">
          <p>No tienes drones registrados aún.</p>
          <button @click="showAddDroneModal = true" class="btn btn-outline">
            Añadir tu primer drone
          </button>
        </div>
        
        <div v-else class="drones-grid">
          <ItemCard
            v-for="drone in drones"
            :key="drone._id"
            :item="drone"
            :title="drone.name"
            :subtitle="drone.type"
            :details="getDroneDetails(drone)"
            image-url="/drone.png"
            image-alt="Drone"
            @edit="editDrone"
            @delete="deleteDrone"
          />
        </div>
      </section>
      
      <!-- Sección de Vuelos -->
      <section class="recent-flights">
        <div class="section-header">
          <h2>✈️ Mis Vuelos</h2>
          <button @click="showAddFlightModal = true" class="btn btn-primary">
            + Añadir Vuelo
          </button>
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
    
    <!-- Modal para Añadir/Editar Drone -->
    <div v-if="showAddDroneModal" class="modal-overlay" @click="closeModal('drone')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingDrone ? 'Editar Drone' : 'Añadir Nuevo Drone' }}</h3>
          <button @click="closeModal('drone')" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="submitDrone" class="drone-form">
          <div class="form-group">
            <label for="droneName">Nombre del Drone *</label>
            <input 
              id="droneName"
              v-model="droneForm.name" 
              type="text" 
              required 
              :disabled="loading"
              placeholder="Ej: Mi Drone FPV"
            >
          </div>
          
          <div class="form-group">
            <label for="droneType">Tipo *</label>
            <select 
              id="droneType"
              v-model="droneForm.type" 
              required 
              :disabled="loading"
            >
              <option value="">Seleccionar tipo</option>
              <option value="Racing">Racing</option>
              <option value="Freestyle">Freestyle</option>
              <option value="Cinematic">Cinematic</option>
              <option value="Micro">Micro</option>
              <option value="Whoops">Whoops</option>
              <option value="Long Range">Long Range</option>
              <option value="Other">Otro</option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="droneBrand">Marca</label>
              <input 
                id="droneBrand"
                v-model="droneForm.brand" 
                type="text" 
                :disabled="loading"
                placeholder="Ej: DJI, Emax, etc."
              >
            </div>
            
            <div class="form-group">
              <label for="droneModel">Modelo</label>
              <input 
                id="droneModel"
                v-model="droneForm.model" 
                type="text" 
                :disabled="loading"
                placeholder="Ej: Tinyhawk, Mavic, etc."
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="droneSerial">Número de Serie</label>
            <input 
              id="droneSerial"
              v-model="droneForm.serialNumber" 
              type="text" 
              :disabled="loading"
              placeholder="Número de serie del drone"
            >
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="droneWeight">Peso (gramos)</label>
              <input 
                id="droneWeight"
                v-model.number="droneForm.weight" 
                type="number" 
                :disabled="loading"
                placeholder="Peso en gramos"
                min="1"
              >
            </div>
            
            <div class="form-group">
              <label for="droneFrameSize">Tamaño del Frame (mm)</label>
              <input 
                id="droneFrameSize"
                v-model.number="droneForm.frameSize" 
                type="number" 
                :disabled="loading"
                placeholder="Ej: 250, 180, etc."
                min="1"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="droneNotes">Notas</label>
            <textarea 
              id="droneNotes"
              v-model="droneForm.notes" 
              :disabled="loading"
              placeholder="Notas adicionales sobre el drone..."
              rows="3"
            ></textarea>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div v-if="success" class="success-message">
            {{ success }}
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal('drone')" class="btn btn-secondary" :disabled="loading">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Guardando...' : (editingDrone ? 'Actualizar' : 'Añadir Drone') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal para Añadir/Editar Vuelo -->
    <div v-if="showAddFlightModal" class="modal-overlay" @click="closeModal('flight')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingFlight ? 'Editar Vuelo' : 'Añadir Nuevo Vuelo' }}</h3>
          <button @click="closeModal('flight')" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="submitFlight" class="flight-form">
          <div class="form-group">
            <label for="flightTitle">Título *</label>
            <input 
              id="flightTitle"
              v-model="flightForm.title" 
              type="text" 
              required 
              :disabled="loading"
              placeholder="Ej: Vuelo matutino en el parque"
            >
          </div>
          
          <div class="form-group">
            <label for="flightLocation">Ubicación *</label>
            <input 
              id="flightLocation"
              v-model="flightForm.location" 
              type="text" 
              required 
              :disabled="loading"
              placeholder="Ej: Parque Central"
            >
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="flightDate">Fecha *</label>
              <input 
                id="flightDate"
                v-model="flightForm.date" 
                type="date" 
                required 
                :disabled="loading"
              >
            </div>
            
            <div class="form-group">
              <label for="flightDuration">Duración (min) *</label>
              <input 
                id="flightDuration"
                v-model.number="flightForm.duration" 
                type="number" 
                required 
                :disabled="loading"
                placeholder="Duración en minutos"
                min="1"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="flightDrone">Drone *</label>
            <select 
              id="flightDrone"
              v-model="flightForm.droneId" 
              required
              :disabled="loading"
            >
              <option value="">Seleccionar drone</option>
              <option v-for="drone in drones" :key="drone._id" :value="drone._id">
                {{ drone.name }}
              </option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="flightWeather">Clima *</label>
              <select 
                id="flightWeather"
                v-model="flightForm.weather" 
                required
                :disabled="loading"
              >
                <option value="">Seleccionar clima</option>
                <option value="Soleado">Soleado</option>
                <option value="Nublado">Nublado</option>
                <option value="Lluvioso">Lluvioso</option>
                <option value="Ventoso">Ventoso</option>
                <option value="Nevado">Nevado</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="flightBatteries">Baterías Usadas *</label>
              <input 
                id="flightBatteries"
                v-model.number="flightForm.batteryUsed" 
                type="number" 
                required
                :disabled="loading"
                placeholder="Número de baterías"
                min="0"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="flightNotes">Notas</label>
            <textarea 
              id="flightNotes"
              v-model="flightForm.notes" 
              :disabled="loading"
              placeholder="Notas adicionales sobre el vuelo..."
              rows="3"
            ></textarea>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div v-if="success" class="success-message">
            {{ success }}
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal('flight')" class="btn btn-secondary" :disabled="loading">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Guardando...' : (editingFlight ? 'Actualizar' : 'Añadir Vuelo') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import ItemCard from '@/components/ItemCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref({
  totalFlights: 0,
  totalTime: 0,
  lastFlight: 'N/A'
})

const flights = ref([])
const drones = ref([])

// Variables para el modal de drones
const showAddDroneModal = ref(false)
const editingDrone = ref(null)

// Variables para el modal de vuelos
const showAddFlightModal = ref(false)
const editingFlight = ref(null)

const loading = ref(false)
const error = ref('')
const success = ref('')

const droneForm = ref({
  name: '',
  type: '',
  brand: '',
  model: '',
  serialNumber: '',
  weight: null,
  frameSize: null,
  notes: ''
})

const flightForm = ref({
  title: '',
  location: '',
  date: new Date().toISOString().split('T')[0],
  duration: null,
  droneId: '',
  weather: '',
  batteryUsed: null,
  notes: ''
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Funciones para drones
const loadDrones = async () => {
  try {
    const response = await api.get('/drones')
    drones.value = response.data
  } catch (error) {
    console.error('Error al cargar drones:', error)
  }
}

const submitDrone = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    // Limpiar campos vacíos
    const droneData = { ...droneForm.value }
    Object.keys(droneData).forEach(key => {
      if (droneData[key] === '' || droneData[key] === null) {
        delete droneData[key]
      }
    })
    
    if (editingDrone.value) {
      // Actualizar drone existente
      await api.patch(`/drones/${editingDrone.value._id}`, droneData)
      success.value = 'Drone actualizado correctamente'
    } else {
      // Crear nuevo drone
      await api.post('/drones', droneData)
      success.value = 'Drone añadido correctamente'
      // Solo cerrar automáticamente cuando se crea un nuevo drone
      setTimeout(() => {
        closeModal('drone')
      }, 1500)
    }
    
    await loadDrones()
    
  } catch (err) {
    console.error('Error al guardar drone:', err)
    error.value = err.response?.data?.message || 'Error al guardar el drone'
  } finally {
    loading.value = false
  }
}

const editDrone = (drone) => {
  editingDrone.value = drone
  droneForm.value = { ...drone }
  showAddDroneModal.value = true
}

const deleteDrone = async (droneId) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este drone?')) {
    return
  }
  
  try {
    await api.delete(`/drones/${droneId}`)
    await loadDrones()
  } catch (error) {
    console.error('Error al eliminar drone:', error)
    alert('Error al eliminar el drone')
  }
}

// Funciones para vuelos
const loadFlights = async () => {
  try {
    const response = await api.get('/flights')
    flights.value = response.data
    
    // Actualizar estadísticas
    if (flights.value.length > 0) {
      stats.value.totalFlights = flights.value.length
      stats.value.totalTime = flights.value.reduce((total, flight) => total + (flight.duration || 0), 0)
      
      // Encontrar el vuelo más reciente
      const sortedFlights = [...flights.value].sort((a, b) => new Date(b.date) - new Date(a.date))
      stats.value.lastFlight = sortedFlights[0] ? formatDate(sortedFlights[0].date) : 'N/A'
    }
  } catch (error) {
    console.error('Error al cargar vuelos:', error)
  }
}

const submitFlight = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    // Limpiar campos vacíos
    const flightData = { ...flightForm.value }
    Object.keys(flightData).forEach(key => {
      if (flightData[key] === '' || flightData[key] === null) {
        delete flightData[key]
      }
    })
    
    if (editingFlight.value) {
      // Actualizar vuelo existente
      await api.put(`/flights/${editingFlight.value.id}`, flightData)
      success.value = 'Vuelo actualizado correctamente'
    } else {
      // Crear nuevo vuelo
      await api.post('/flights', flightData)
      success.value = 'Vuelo añadido correctamente'
    }
    
    await loadFlights()
    
    setTimeout(() => {
      closeModal('flight')
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
  flightForm.value = { ...flight }
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

// Funciones auxiliares
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getDroneName = (droneId) => {
  if (!droneId) return 'N/A'
  const drone = drones.value.find(d => d.id === droneId)
  return drone ? drone.name : 'Drone desconocido'
}

// Funciones para formatear detalles
const getDroneDetails = (drone) => {
  const details = []
  if (drone.brand) details.push({ label: 'Marca', value: drone.brand })
  if (drone.model) details.push({ label: 'Modelo', value: drone.model })
  if (drone.weight) details.push({ label: 'Peso', value: `${drone.weight}g` })
  if (drone.frameSize) details.push({ label: 'Frame', value: `${drone.frameSize}mm` })
  return details
}

const getFlightDetails = (flight) => {
  const details = []
  details.push({ label: 'Duración', value: `${flight.duration} min` })
  if (flight.droneId) details.push({ label: 'Drone', value: getDroneName(flight.droneId) })
  if (flight.weather) details.push({ label: 'Clima', value: flight.weather })
  if (flight.batteryUsed) details.push({ label: 'Baterías', value: flight.batteryUsed })
  return details
}

const closeModal = (type) => {
  if (type === 'drone') {
    showAddDroneModal.value = false
    editingDrone.value = null
    droneForm.value = {
      name: '',
      type: '',
      brand: '',
      model: '',
      serialNumber: '',
      weight: null,
      frameSize: null,
      notes: ''
    }
  } else if (type === 'flight') {
    showAddFlightModal.value = false
    editingFlight.value = null
    flightForm.value = {
      title: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      duration: null,
      droneId: '',
      weather: '',
      batteryUsed: null,
      notes: ''
    }
  }
  
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
@import '../assets/styles/dashboard-header.css';
@import '../assets/styles/dashboard-stats.css';
@import '../assets/styles/dashboard-cards.css';
@import '../assets/styles/dashboard-modals.css';
@import '../assets/styles/dashboard-forms.css';
@import '../assets/styles/dashboard-buttons.css';
@import '../assets/styles/dashboard-responsive.css';
</style>