<template>
  <div class="dashboard">
    <div class="clouds-bg"></div>
    <AppHeader />
    
    <main class="dashboard-content">
      <section class="drones-section">
        <div class="section-header">
          <h2>🚁 Gestión de Drones</h2>
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
    </main>
    
    <DroneModal
      v-if="showAddDroneModal"
      :drone="editingDrone"
      :loading="loading"
      :error="error"
      :success="success"
      @submit="submitDrone"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import ItemCard from '../components/ItemCard.vue'
import DroneModal from '../components/DroneModal.vue'
import api from '../services/api.js'

const drones = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showAddDroneModal = ref(false)
const editingDrone = ref(null)

const loadDrones = async () => {
  try {
    const response = await api.get('/drones')
    drones.value = response.data
  } catch (error) {
    console.error('Error al cargar drones:', error)
  }
}

const submitDrone = async (droneData) => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    if (editingDrone.value) {
      await api.patch(`/drones/${editingDrone.value._id}`, droneData)
      success.value = 'Drone actualizado correctamente'
    } else {
      await api.post('/drones', droneData)
      success.value = 'Drone añadido correctamente'
    }
    
    await loadDrones()
    
    setTimeout(() => {
      closeModal()
    }, 1500)
    
  } catch (err) {
    console.error('Error al guardar drone:', err)
    error.value = err.response?.data?.message || 'Error al guardar el drone'
  } finally {
    loading.value = false
  }
}

const editDrone = (drone) => {
  editingDrone.value = drone
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

const getDroneDetails = (drone) => {
  const details = []
  if (drone.brand) details.push({ label: 'Marca', value: drone.brand })
  if (drone.model) details.push({ label: 'Modelo', value: drone.model })
  if (drone.weight) details.push({ label: 'Peso', value: `${drone.weight}g` })
  if (drone.frameSize) details.push({ label: 'Frame', value: `${drone.frameSize}mm` })
  return details
}

const closeModal = () => {
  showAddDroneModal.value = false
  editingDrone.value = null
  error.value = ''
  success.value = ''
}

onMounted(async () => {
  await loadDrones()
})
</script>

<style scoped>
@import '../assets/styles/dashboard-base.css';
@import '../assets/styles/dashboard-cards.css';
@import '../assets/styles/dashboard-buttons.css';
</style>