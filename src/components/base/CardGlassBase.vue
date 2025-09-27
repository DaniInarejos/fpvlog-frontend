<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  fallbackIcon: {
    type: String,
    default: '📋'
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  showEditButton: {
    type: Boolean,
    default: true
  },
  showDeleteButton: {
    type: Boolean,
    default: true
  },
  editButtonColor: {
    type: String,
    default: 'green'
  },
  deleteButtonColor: {
    type: String,
    default: 'red'
  },
  editIcon: {
    type: String,
    default: '✏️'
  },
  deleteIcon: {
    type: String,
    default: '🗑️'
  }
})

const emit = defineEmits(['edit', 'delete', 'view'])

const isHovered = ref(false)

const editButtonClasses = computed(() => {
  const colorMap = {
    green: 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20',
    blue: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    indigo: 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
  }
  return colorMap[props.editButtonColor] || colorMap.green
})

const deleteButtonClasses = computed(() => {
  const colorMap = {
    red: 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20',
    orange: 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20',
    pink: 'text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20'
  }
  return colorMap[props.deleteButtonColor] || colorMap.red
})

const handleEdit = (event) => {
  event.stopPropagation()
  emit('edit')
}

const handleDelete = (event) => {
  event.stopPropagation()
  emit('delete')
}

const handleView = () => {
  emit('view')
}
</script>

<template>
  <div 
    class="group relative backdrop-blur-md bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer mobile-buttons-visible"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleView"
  >
    <!-- Glassmorphism overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent"></div>
    
    <!-- Contenido principal -->
    <div class="relative z-10 h-full flex flex-col">
      <!-- Título superpuesto en la imagen -->
      <div class="absolute top-4 left-4 right-4 z-20">
        <h3 class="text-lg font-bold text-white drop-shadow-lg"
            style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5);">
          {{ title }}
        </h3>
        <div v-if="subtitle" class="text-sm text-white/90 drop-shadow-md"
             style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.6);">
          {{ subtitle }}
        </div>
      </div>

      <!-- Imagen principal o icono fallback -->
      <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <!-- Gradiente overlay para mejorar legibilidad del título -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></div>
        
        <!-- Imagen si está disponible -->
        <img 
          v-if="image" 
          :src="image" 
          :alt="title"
          class="w-full h-full object-cover"
          @error="$event.target.style.display = 'none'"
        />
        
        <!-- Icono fallback si no hay imagen -->
        <div v-else class="text-6xl opacity-60">
          {{ fallbackIcon }}
        </div>
      </div>

      <!-- Slot para iconos informativos personalizables -->
      <div class="absolute bottom-4 left-4 flex items-center space-x-2 z-20">
        <slot name="info-icons">
          <!-- Contenido por defecto si no se proporciona slot -->
        </slot>
      </div>

      <!-- Botones de acción (Editar y Eliminar) -->
      <div 
        v-if="isAuthenticated && (showEditButton || showDeleteButton)"
        class="absolute bottom-4 right-4 flex items-center space-x-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <!-- Botón Editar -->
        <button
          v-if="showEditButton"
          @click="handleEdit"
          :class="[
            'flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 transition-all duration-200 hover:scale-110',
            editButtonClasses
          ]"
          :title="$t ? $t('common.edit') : 'Editar'"
        >
          <span class="text-lg">{{ editIcon }}</span>
        </button>

        <!-- Botón Eliminar -->
        <button
          v-if="showDeleteButton"
          @click="handleDelete"
          :class="[
            'flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 transition-all duration-200 hover:scale-110',
            deleteButtonClasses
          ]"
          :title="$t ? $t('common.delete') : 'Eliminar'"
        >
          <span class="text-lg">{{ deleteIcon }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Asegurar que los botones sean visibles en móvil */
@media (max-width: 768px) {
  .mobile-buttons-visible .group .opacity-0 {
    opacity: 1 !important;
  }
}

/* Animaciones adicionales */
.group:hover .backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Efecto de brillo sutil */
.group::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.5s;
  z-index: 1;
}

.group:hover::before {
  left: 100%;
}
</style>