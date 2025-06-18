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
        
        <!-- Filtro moderno -->
        <FilterSection
          v-model:search-term="searchTerm"
          search-placeholder="Buscar drones por nombre o modelo..."
          :filters="droneFilters"
          :result-count="filteredDrones.length"
          @update:filter="updateFilter"
          @clear-all="clearAllFilters"
        />
        
        <div v-if="filteredDrones.length === 0" class="no-drones">
          <p v-if="drones.length === 0">No tienes drones registrados aún.</p>
          <p v-else>No se encontraron drones con los filtros aplicados.</p>
          <button @click="showAddDroneModal = true" class="btn btn-outline">
            {{ drones.length === 0 ? 'Añadir tu primer drone' : 'Añadir nuevo drone' }}
          </button>
        </div>
        
        <div v-else class="drones-grid">
          <ItemCard
            v-for="drone in filteredDrones"
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
import { ref, computed, onMounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import ItemCard from '../components/ItemCard.vue'
import FilterSection from '../components/FilterSection.vue'
import DroneModal from '../components/DroneModal.vue'
import api from '../services/api.js'

const drones = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showAddDroneModal = ref(false)
const editingDrone = ref(null)
const searchTerm = ref('')
const filterType = ref('')
const filterBrand = ref('')

const uniqueBrands = computed(() => {
  const brands = drones.value.map(drone => drone.brand).filter(Boolean)
  return [...new Set(brands)].sort()
})

const droneFilters = computed(() => [
  {
    key: 'type',
    value: filterType.value,
    placeholder: 'Todos los tipos',
    options: [
      { value: 'Racing', label: 'Racing' },
      { value: 'Freestyle', label: 'Freestyle' },
      { value: 'Cinematic', label: 'Cinematic' },
      { value: 'Micro', label: 'Micro' }
    ]
  },
  {
    key: 'brand',
    value: filterBrand.value,
    placeholder: 'Todas las marcas',
    options: uniqueBrands.value.map(brand => ({ value: brand, label: brand }))
  }
])

const filteredDrones = computed(() => {
  return drones.value.filter(drone => {
    const matchesSearch = drone.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         drone.model?.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesType = !filterType.value || drone.type === filterType.value
    const matchesBrand = !filterBrand.value || drone.brand === filterBrand.value
    
    return matchesSearch && matchesType && matchesBrand
  })
})

const updateFilter = (key, value) => {
  if (key === 'type') {
    filterType.value = value
  } else if (key === 'brand') {
    filterBrand.value = value
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

const clearAllFilters = () => {
  searchTerm.value = ''
  filterType.value = ''
  filterBrand.value = ''
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