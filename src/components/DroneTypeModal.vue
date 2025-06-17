<template>
  <div class="modal-overlay management-modal" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ editingType ? 'Editar Tipo' : 'Nuevo Tipo de Drone' }}</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="$emit('submit', typeForm)" class="modal-form">
        <div class="form-group">
          <label for="type-name">Nombre del Tipo: *</label>
          <input
            id="type-name"
            v-model="typeForm.name"
            type="text"
            required
            placeholder="Ej: Racing FPV"
            maxlength="100"
          />
        </div>
        
        <div class="form-group">
          <label for="type-category">Categoría: *</label>
          <select id="type-category" v-model="typeForm.category" required>
            <option value="">Seleccionar categoría</option>
            <option value="racing">Racing</option>
            <option value="freestyle">Freestyle</option>
            <option value="cinematic">Cinematic</option>
            <option value="commercial">Commercial</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="type-description">Descripción:</label>
          <textarea
            id="type-description"
            v-model="typeForm.description"
            rows="3"
            placeholder="Descripción del tipo de drone..."
            maxlength="500"
          ></textarea>
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-if="success" class="success-message">
          {{ success }}
        </div>
        
        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Guardando...' : (editingType ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  editingType: {
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

const emit = defineEmits(['close', 'submit'])

const typeForm = ref({
  name: '',
  category: '',
  description: ''
})

// Observar cambios en editingType para llenar el formulario
watch(() => props.editingType, (newType) => {
  if (newType) {
    typeForm.value = {
      name: newType.name || '',
      category: newType.category || '',
      description: newType.description || ''
    }
  } else {
    typeForm.value = { name: '', category: '', description: '' }
  }
}, { immediate: true })

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>