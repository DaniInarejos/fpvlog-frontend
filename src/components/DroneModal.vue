<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ drone ? 'Editar Drone' : 'Añadir Nuevo Drone' }}</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="drone-name">Nombre del Drone:</label>
          <input
            id="drone-name"
            v-model="droneForm.name"
            type="text"
            required
            placeholder="Ej: Mi DJI Mini 2"
          />
        </div>
        
        <div class="form-group">
          <label for="drone-type">Tipo:</label>
          <input
            id="drone-type"
            v-model="droneForm.type"
            type="text"
            placeholder="Ej: Racing, Freestyle, Cinematic"
          />
        </div>
        
        <div class="form-group">
          <label for="drone-brand">Marca:</label>
          <input
            id="drone-brand"
            v-model="droneForm.brand"
            type="text"
            placeholder="Ej: DJI, Emax, etc."
          />
        </div>
        
        <div class="form-group">
          <label for="drone-model">Modelo:</label>
          <input
            id="drone-model"
            v-model="droneForm.model"
            type="text"
            placeholder="Ej: Mini 2, Tinyhawk, etc."
          />
        </div>
        
        <div class="form-group">
          <label for="drone-serial">Número de Serie:</label>
          <input
            id="drone-serial"
            v-model="droneForm.serialNumber"
            type="text"
            placeholder="Número de serie del drone"
          />
        </div>
        
        <div class="form-group">
          <label for="drone-weight">Peso (gramos):</label>
          <input
            id="drone-weight"
            v-model.number="droneForm.weight"
            type="number"
            min="1"
            placeholder="Ej: 250"
          />
        </div>
        
        <div class="form-group">
          <label for="drone-frame">Tamaño del Frame (mm):</label>
          <input
            id="drone-frame"
            v-model.number="droneForm.frameSize"
            type="number"
            min="1"
            placeholder="Ej: 250"
          />
        </div>
        
        <div class="form-group">
          <label for="drone-battery">Capacidad de Batería (mAh):</label>
          <input
            id="drone-battery"
            v-model.number="droneForm.batteryCapacity"
            type="number"
            min="1"
            placeholder="Ej: 1500"
          />
        </div>
        
        <div class="form-group">
          <label for="drone-flight-time">Tiempo de Vuelo (minutos):</label>
          <input
            id="drone-flight-time"
            v-model.number="droneForm.flightTime"
            type="number"
            min="1"
            placeholder="Ej: 8"
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-if="success" class="success-message">
          {{ success }}
        </div>
        
        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Guardando...' : (drone ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  drone: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  success: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'close'])

// Formulario reactivo
const droneForm = reactive({
  name: '',
  type: '',
  brand: '',
  model: '',
  serialNumber: '',
  weight: null,
  frameSize: null,
  batteryCapacity: null,
  flightTime: null
})

// Llenar formulario cuando se edita
watch(() => props.drone, (newDrone) => {
  if (newDrone) {
    Object.assign(droneForm, {
      name: newDrone.name || '',
      type: newDrone.type || '',
      brand: newDrone.brand || '',
      model: newDrone.model || '',
      serialNumber: newDrone.serialNumber || '',
      weight: newDrone.weight || null,
      frameSize: newDrone.frameSize || null,
      batteryCapacity: newDrone.batteryCapacity || null,
      flightTime: newDrone.flightTime || null
    })
  } else {
    // Limpiar formulario para nuevo drone
    Object.assign(droneForm, {
      name: '',
      type: '',
      brand: '',
      model: '',
      serialNumber: '',
      weight: null,
      frameSize: null,
      batteryCapacity: null,
      flightTime: null
    })
  }
}, { immediate: true })

const handleSubmit = () => {
  // Filtrar campos vacíos
  const cleanData = {}
  Object.keys(droneForm).forEach(key => {
    if (droneForm[key] !== '' && droneForm[key] !== null && droneForm[key] !== undefined) {
      cleanData[key] = droneForm[key]
    }
  })
  
  emit('submit', cleanData)
}

// Variables para manejar el doble clic
const clickCount = ref(0)
const clickTimer = ref(null)

const handleOverlayClick = () => {
  clickCount.value++
  
  if (clickCount.value === 1) {
    clickTimer.value = setTimeout(() => {
      clickCount.value = 0
    }, 300)
  } else if (clickCount.value === 2) {
    clearTimeout(clickTimer.value)
    clickCount.value = 0
    emit('close')
  }
}
</script>

<style scoped>
@import '../assets/styles/dashboard-modals.css';
@import '../assets/styles/dashboard-forms.css';
@import '../assets/styles/dashboard-buttons.css';
</style>