<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content confirm-modal" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button @click="$emit('close')" class="close-btn">✕</button>
      </div>
      
      <div class="confirm-content">
        <div class="confirm-icon">
          <span v-if="type === 'danger'">⚠️</span>
          <span v-else-if="type === 'warning'">⚠️</span>
          <span v-else>❓</span>
        </div>
        <p class="confirm-message">{{ message }}</p>
      </div>
      
      <div class="confirm-actions">
        <button @click="$emit('close')" class="btn btn-secondary">
          {{ cancelText }}
        </button>
        <button @click="$emit('confirm')" class="btn" :class="buttonClass">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmar acción'
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'warning', // 'warning', 'danger', 'info'
    validator: (value) => ['warning', 'danger', 'info'].includes(value)
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  }
})

const emit = defineEmits(['confirm', 'close'])

const buttonClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'btn-danger'
    case 'warning':
      return 'btn-warning'
    default:
      return 'btn-primary'
  }
})

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<style scoped>
@import '@/assets/styles/dashboard-modals.css';
@import '@/assets/styles/dashboard-buttons.css';

.confirm-modal {
  max-width: 450px;
  width: 90%;
}

.confirm-content {
  padding: 2rem;
  text-align: center;
}

.confirm-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.confirm-message {
  color: var(--sky-text);
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  justify-content: center;
}

.confirm-actions .btn {
  min-width: 120px;
}

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ff5252, #e53935);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #ffa726, #ff9800);
  color: white;
}

.btn-warning:hover {
  background: linear-gradient(135deg, #ff9800, #f57c00);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 167, 38, 0.4);
}
</style>