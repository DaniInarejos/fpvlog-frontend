<template>
  <div class="modal-overlay management-modal" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ editingBrand ? 'Editar Marca' : 'Nueva Marca de Drone' }}</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="$emit('submit', brandForm)" class="modal-form">
        <div class="form-group">
          <label for="brand-name">Nombre de la Marca: *</label>
          <input
            id="brand-name"
            v-model="brandForm.name"
            type="text"
            required
            placeholder="Ej: DJI, Emax, BetaFPV"
            maxlength="100"
          />
        </div>
        
        <div class="form-group">
          <label for="brand-country">País de Origen:</label>
          <input
            id="brand-country"
            v-model="brandForm.country"
            type="text"
            placeholder="Ej: China, Estados Unidos"
            maxlength="100"
          />
        </div>
        
        <div class="form-group">
          <label for="brand-founded">Año de Fundación:</label>
          <input
            id="brand-founded"
            v-model.number="brandForm.founded"
            type="number"
            :min="1900"
            :max="currentYear"
            placeholder="Ej: 2006"
          />
        </div>
        
        <div class="form-group">
          <label for="brand-website">Sitio Web:</label>
          <input
            id="brand-website"
            v-model="brandForm.website"
            type="url"
            placeholder="https://ejemplo.com"
          />
        </div>
        
        <div class="form-group">
          <label for="brand-description">Descripción:</label>
          <textarea
            id="brand-description"
            v-model="brandForm.description"
            rows="3"
            placeholder="Información sobre la marca..."
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
            {{ loading ? 'Guardando...' : (editingBrand ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  editingBrand: {
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

const currentYear = computed(() => new Date().getFullYear())

const brandForm = ref({
  name: '',
  country: '',
  founded: null,
  website: '',
  description: ''
})

// Observar cambios en editingBrand para llenar el formulario
watch(() => props.editingBrand, (newBrand) => {
  if (newBrand) {
    brandForm.value = {
      name: newBrand.name || '',
      country: newBrand.country || '',
      founded: newBrand.founded || null,
      website: newBrand.website || '',
      description: newBrand.description || ''
    }
  } else {
    brandForm.value = {
      name: '',
      country: '',
      founded: null,
      website: '',
      description: ''
    }
  }
}, { immediate: true })

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>