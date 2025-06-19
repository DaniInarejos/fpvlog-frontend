<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ flight ? 'Editar Vuelo' : 'Registrar Nuevo Vuelo' }}</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="flight-drone">Drone Utilizado:</label>
          <select id="flight-drone" v-model="flightForm.droneId" required>
            <option value="">Selecciona un drone</option>
            <option v-for="drone in drones" :key="drone._id" :value="drone._id">
              {{ drone.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="flight-location">Ubicación:</label>
          <input
            id="flight-location"
            v-model="flightForm.location"
            type="text"
            required
            placeholder="Ej: Parque Central, Madrid"
          />
        </div>
        
        <div class="form-group">
          <label for="flight-duration">Duración (minutos):</label>
          <input
            id="flight-duration"
            v-model.number="flightForm.duration"
            type="number"
            min="1"
            required
            placeholder="Ej: 15"
          />
        </div>
        
        <div class="form-group">
          <label for="flight-distance">Distancia (km):</label>
          <input
            id="flight-distance"
            v-model.number="flightForm.distance"
            type="number"
            step="0.1"
            min="0"
            placeholder="Ej: 2.5"
          />
        </div>
        
        <div class="form-group">
          <label for="flight-max-speed">Velocidad Máxima (km/h):</label>
          <input
            id="flight-max-speed"
            v-model.number="flightForm.maxSpeed"
            type="number"
            min="0"
            placeholder="Ej: 45"
          />
        </div>
        
        <div class="form-group">
          <label for="flight-max-altitude">Altitud Máxima (metros):</label>
          <input
            id="flight-max-altitude"
            v-model.number="flightForm.maxAltitude"
            type="number"
            min="0"
            placeholder="Ej: 120"
          />
        </div>
        
        <div class="form-group">
          <label for="flight-weather">Condiciones Meteorológicas:</label>
          <input
            id="flight-weather"
            v-model="flightForm.weather"
            type="text"
            placeholder="Ej: Soleado, Nublado, Viento ligero"
          />
        </div>
        
        <div class="form-group">
          <label for="flight-notes">Notas:</label>
          <textarea
            id="flight-notes"
            v-model="flightForm.notes"
            placeholder="Notas adicionales sobre el vuelo"
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
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Guardando...' : (flight ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  flight: {
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
  },
  drones: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['submit', 'close'])

// Formulario reactivo
const flightForm = reactive({
  _id: null, // Agregar el _id aquí
  droneId: '',
  location: '',
  duration: null,
  distance: null,
  maxSpeed: null,
  maxAltitude: null,
  weather: '',
  notes: ''
})

// Llenar formulario cuando se edita
watch(() => props.flight, (newFlight) => {
  console.log('FlightModal watch triggered with:', newFlight) // Debug
  if (newFlight) {
    console.log('Setting form with _id:', newFlight._id) // Debug
    Object.assign(flightForm, {
      _id: newFlight._id,
      droneId: newFlight.droneId || '',
      location: newFlight.location || '',
      duration: newFlight.duration || null,
      distance: newFlight.distance || null,
      maxSpeed: newFlight.maxSpeed || null,
      maxAltitude: newFlight.maxAltitude || null,
      weather: newFlight.weather || '',
      notes: newFlight.notes || ''
    })
    console.log('Form after assignment:', flightForm) // Debug
  } else {
    // Limpiar formulario para nuevo vuelo
    Object.assign(flightForm, {
      _id: null,
      droneId: '',
      location: '',
      duration: null,
      distance: null,
      maxSpeed: null,
      maxAltitude: null,
      weather: '',
      notes: ''
    })
  }
}, { immediate: true })

const handleSubmit = () => {
  console.log('handleSubmit called, flightForm:', flightForm) // Debug
  
  // Filtrar campos vacíos pero preservar el _id si existe
  const cleanData = {}
  Object.keys(flightForm).forEach(key => {
    if (key === '_id' && flightForm[key]) {
      // Preservar _id para edición
      cleanData[key] = flightForm[key]
    } else if (key !== '_id' && flightForm[key] !== '' && flightForm[key] !== null && flightForm[key] !== undefined) {
      cleanData[key] = flightForm[key]
    }
  })
  
  console.log('cleanData to emit:', cleanData) // Debug
  emit('submit', cleanData)
}
</script>

<style scoped>
@import '../assets/styles/dashboard-modals.css';
@import '../assets/styles/dashboard-forms.css';
@import '../assets/styles/dashboard-buttons.css';
</style>