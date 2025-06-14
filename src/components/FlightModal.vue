<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ editingFlight ? 'Editar Vuelo' : 'Registrar Nuevo Vuelo' }}</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="$emit('submit')" class="modal-form">
        <div class="form-group">
          <label for="flight-title">Título del Vuelo:</label>
          <input
            id="flight-title"
            v-model="flightForm.title"
            type="text"
            required
            placeholder="Ej: Vuelo en el parque"
          />
        </div>
        
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
            placeholder="Ej: Parque Central, Madrid"
          />
        </div>
        
        <div class="form-group">
          <label for="flight-date">Fecha:</label>
          <input
            id="flight-date"
            v-model="flightForm.date"
            type="date"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="flight-duration">Duración (minutos):</label>
          <input
            id="flight-duration"
            v-model.number="flightForm.duration"
            type="number"
            min="1"
            placeholder="Ej: 15"
          />
        </div>
        
        <div class="form-group">
          <label for="flight-weather">Condiciones Meteorológicas:</label>
          <select id="flight-weather" v-model="flightForm.weather">
            <option value="">Selecciona condiciones</option>
            <option value="Soleado">Soleado</option>
            <option value="Nublado">Nublado</option>
            <option value="Parcialmente nublado">Parcialmente nublado</option>
            <option value="Viento ligero">Viento ligero</option>
            <option value="Viento fuerte">Viento fuerte</option>
            <option value="Lluvia ligera">Lluvia ligera</option>
          </select>
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
            {{ loading ? 'Guardando...' : (editingFlight ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  flightForm: {
    type: Object,
    required: true
  },
  editingFlight: {
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

defineEmits(['submit', 'close'])
</script>

<style scoped>
@import '../assets/styles/dashboard-modals.css';
@import '../assets/styles/dashboard-forms.css';
@import '../assets/styles/dashboard-buttons.css';
</style>