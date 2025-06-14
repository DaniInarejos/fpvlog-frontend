<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ editingDrone ? 'Editar Drone' : 'Añadir Nuevo Drone' }}</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="$emit('submit')" class="modal-form">
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
          <select id="drone-type" v-model="droneForm.type" required>
            <option value="">Selecciona un tipo</option>
            <option value="Racing">Racing</option>
            <option value="Freestyle">Freestyle</option>
            <option value="Cinematic">Cinematic</option>
            <option value="Photography">Photography</option>
            <option value="Other">Otro</option>
          </select>
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
          <label for="drone-description">Descripción:</label>
          <textarea
            id="drone-description"
            v-model="droneForm.description"
            placeholder="Descripción opcional del drone"
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
            {{ loading ? 'Guardando...' : (editingDrone ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  droneForm: {
    type: Object,
    required: true
  },
  editingDrone: {
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

// Variables para manejar el doble clic
const clickCount = ref(0)
const clickTimer = ref(null)

const handleOverlayClick = () => {
  clickCount.value++
  
  if (clickCount.value === 1) {
    clickTimer.value = setTimeout(() => {
      clickCount.value = 0
    }, 300) // 300ms para detectar doble clic
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