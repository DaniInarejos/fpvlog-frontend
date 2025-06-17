<template>
  <div class="dashboard">
    <AppHeader />
    <div class="clouds-bg"></div>
    
    <main class="dashboard-content">
      <!-- Pestañas para alternar entre tipos y marcas -->
      <div class="tabs">
        <button 
          @click="activeTab = 'types'" 
          :class="['tab-btn', { active: activeTab === 'types' }]"
        >
          Tipos de Drones
        </button>
        <button 
          @click="activeTab = 'brands'" 
          :class="['tab-btn', { active: activeTab === 'brands' }]"
        >
          Marcas de Drones
        </button>
      </div>
      
      <!-- Sección de Tipos de Drones -->
      <section v-if="activeTab === 'types'" class="drones-section">
        <div class="section-header">
          <h2>🛸 Tipos de Drones</h2>
          <button @click="openTypeModal()" class="btn btn-primary">
            + Agregar Tipo
          </button>
        </div>
        
        <div v-if="droneTypes.length === 0" class="no-drones">
          <p>No hay tipos de drones registrados</p>
        </div>
        
        <div v-else class="drones-grid">
          <div v-for="type in droneTypes" :key="type._id" class="drone-card">
            <div class="drone-header">
              <h4>{{ type.name }}</h4>
              <span class="drone-type category-badge" :class="`category-${type.category}`">
                {{ getCategoryLabel(type.category) }}
              </span>
            </div>
            <div class="drone-details">
              <p v-if="type.description">{{ type.description }}</p>
              <p><small>Creado: {{ formatDate(type.createdAt) }}</small></p>
            </div>
            <div class="drone-actions">
              <button @click="editType(type)" class="btn btn-outline btn-sm">
                Editar
              </button>
              <button @click="deleteType(type._id)" class="btn btn-danger btn-sm">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Sección de Marcas de Drones -->
      <section v-if="activeTab === 'brands'" class="drones-section">
        <div class="section-header">
          <h2>🏭 Marcas de Drones</h2>
          <button @click="openBrandModal()" class="btn btn-primary">
            + Agregar Marca
          </button>
        </div>
        
        <div v-if="droneBrands.length === 0" class="no-drones">
          <p>No hay marcas de drones registradas</p>
        </div>
        
        <div v-else class="drones-grid">
          <div v-for="brand in droneBrands" :key="brand._id" class="drone-card">
            <div class="drone-header">
              <h4>{{ brand.name }}</h4>
              <span v-if="brand.country" class="drone-type">{{ brand.country }}</span>
            </div>
            <div class="drone-details">
              <p v-if="brand.founded"><strong>Fundada:</strong> {{ brand.founded }}</p>
              <p v-if="brand.website">
                <strong>Web:</strong> 
                <a :href="brand.website" target="_blank" rel="noopener noreferrer">
                  {{ brand.website }}
                </a>
              </p>
              <p v-if="brand.description">{{ brand.description }}</p>
              <p><small>Creado: {{ formatDate(brand.createdAt) }}</small></p>
            </div>
            <div class="drone-actions">
              <button @click="editBrand(brand)" class="btn btn-outline btn-sm">
                Editar
              </button>
              <button @click="deleteBrand(brand._id)" class="btn btn-danger btn-sm">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Modales -->
    <DroneTypeModal
      v-if="showTypeModal"
      :editing-type="editingType"
      :loading="loading"
      :error="typeError"
      :success="typeSuccess"
      @close="closeTypeModal"
      @submit="saveType"
    />
    
    <DroneBrandModal
      v-if="showBrandModal"
      :editing-brand="editingBrand"
      :loading="loading"
      :error="brandError"
      :success="brandSuccess"
      @close="closeBrandModal"
      @submit="saveBrand"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { droneTypesAPI, droneBrandsAPI } from '@/services/api'
import DroneTypeModal from '@/components/DroneTypeModal.vue'
import DroneBrandModal from '@/components/DroneBrandModal.vue'
import AppHeader from '@/components/AppHeader.vue'

// Estado reactivo
const activeTab = ref('types')
const loading = ref(false)

// Datos
const droneTypes = ref([])
const droneBrands = ref([])

// Modales
const showTypeModal = ref(false)
const showBrandModal = ref(false)
const editingType = ref(null)
const editingBrand = ref(null)

// Estados de mensajes
const typeError = ref('')
const typeSuccess = ref('')
const brandError = ref('')
const brandSuccess = ref('')

// Funciones utilitarias
const getCategoryLabel = (category) => {
  const labels = {
    racing: 'Racing',
    freestyle: 'Freestyle',
    cinematic: 'Cinematic',
    commercial: 'Commercial',
    other: 'Otro'
  }
  return labels[category] || category
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Funciones para cargar datos
const loadDroneTypes = async () => {
  try {
    loading.value = true
    const response = await droneTypesAPI.getAll()
    droneTypes.value = response.data
  } catch (error) {
    console.error('Error cargando tipos de drones:', error)
    alert('Error al cargar los tipos de drones')
  } finally {
    loading.value = false
  }
}

const loadDroneBrands = async () => {
  try {
    loading.value = true
    const response = await droneBrandsAPI.getAll()
    droneBrands.value = response.data
  } catch (error) {
    console.error('Error cargando marcas de drones:', error)
    alert('Error al cargar las marcas de drones')
  } finally {
    loading.value = false
  }
}

// Funciones para tipos
const openTypeModal = () => {
  editingType.value = null
  typeError.value = ''
  typeSuccess.value = ''
  showTypeModal.value = true
}

const editType = (type) => {
  editingType.value = type
  typeError.value = ''
  typeSuccess.value = ''
  showTypeModal.value = true
}

const closeTypeModal = () => {
  showTypeModal.value = false
  editingType.value = null
  typeError.value = ''
  typeSuccess.value = ''
}

const saveType = async (typeData) => {
  try {
    loading.value = true
    typeError.value = ''
    typeSuccess.value = ''
    
    if (editingType.value) {
      await droneTypesAPI.update(editingType.value._id, typeData)
      typeSuccess.value = 'Tipo actualizado correctamente'
    } else {
      await droneTypesAPI.create(typeData)
      typeSuccess.value = 'Tipo creado correctamente'
    }
    
    await loadDroneTypes()
    
    // Cerrar modal después de un breve delay para mostrar el mensaje
    setTimeout(() => {
      closeTypeModal()
    }, 1500)
  } catch (error) {
    console.error('Error guardando tipo:', error)
    typeError.value = 'Error al guardar el tipo de drone'
  } finally {
    loading.value = false
  }
}

const deleteType = async (id) => {
  if (confirm('¿Estás seguro de eliminar este tipo de drone?')) {
    try {
      loading.value = true
      await droneTypesAPI.delete(id)
      await loadDroneTypes()
      // Mostrar mensaje de éxito temporal
      typeSuccess.value = 'Tipo eliminado correctamente'
      setTimeout(() => {
        typeSuccess.value = ''
      }, 3000)
    } catch (error) {
      console.error('Error eliminando tipo:', error)
      typeError.value = 'Error al eliminar el tipo de drone'
      setTimeout(() => {
        typeError.value = ''
      }, 3000)
    } finally {
      loading.value = false
    }
  }
}

// Funciones para marcas
const openBrandModal = () => {
  editingBrand.value = null
  brandError.value = ''
  brandSuccess.value = ''
  showBrandModal.value = true
}

const editBrand = (brand) => {
  editingBrand.value = brand
  brandError.value = ''
  brandSuccess.value = ''
  showBrandModal.value = true
}

const closeBrandModal = () => {
  showBrandModal.value = false
  editingBrand.value = null
  brandError.value = ''
  brandSuccess.value = ''
}

const saveBrand = async (brandData) => {
  try {
    loading.value = true
    brandError.value = ''
    brandSuccess.value = ''
    
    // Limpiar campos vacíos
    const cleanData = { ...brandData }
    if (!cleanData.founded) delete cleanData.founded
    if (!cleanData.website) delete cleanData.website
    if (!cleanData.country) delete cleanData.country
    if (!cleanData.description) delete cleanData.description
    
    if (editingBrand.value) {
      await droneBrandsAPI.update(editingBrand.value._id, cleanData)
      brandSuccess.value = 'Marca actualizada correctamente'
    } else {
      await droneBrandsAPI.create(cleanData)
      brandSuccess.value = 'Marca creada correctamente'
    }
    
    await loadDroneBrands()
    
    // Cerrar modal después de un breve delay para mostrar el mensaje
    setTimeout(() => {
      closeBrandModal()
    }, 1500)
  } catch (error) {
    console.error('Error guardando marca:', error)
    brandError.value = 'Error al guardar la marca de drone'
  } finally {
    loading.value = false
  }
}

const deleteBrand = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta marca de drone?')) {
    try {
      loading.value = true
      await droneBrandsAPI.delete(id)
      await loadDroneBrands()
      // Mostrar mensaje de éxito temporal
      brandSuccess.value = 'Marca eliminada correctamente'
      setTimeout(() => {
        brandSuccess.value = ''
      }, 3000)
    } catch (error) {
      console.error('Error eliminando marca:', error)
      brandError.value = 'Error al eliminar la marca de drone'
      setTimeout(() => {
        brandError.value = ''
      }, 3000)
    } finally {
      loading.value = false
    }
  }
}

// Cargar datos al montar
onMounted(() => {
  loadDroneTypes()
  loadDroneBrands()
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
@import '@/assets/styles/management-tabs.css';

/* Estilos específicos para categorías */
.category-badge {
  font-size: 0.8rem !important;
  padding: 0.3rem 0.8rem !important;
}

.category-racing {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
}

.category-freestyle {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
}

.category-cinematic {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
}

.category-commercial {
  background: linear-gradient(135deg, #10b981, #059669) !important;
}

.category-other {
  background: linear-gradient(135deg, #6b7280, #4b5563) !important;
}

.drone-details a {
  color: var(--sky-primary);
  text-decoration: none;
}

.drone-details a:hover {
  text-decoration: underline;
}
</style>