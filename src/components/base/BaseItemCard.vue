<script setup>
import { ref, computed } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showFavorite: {
    type: Boolean,
    default: true
  },
  clickable: {
    type: Boolean,
    default: true
  },
  hoverEffect: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['edit', 'delete', 'toggleFavorite', 'view', 'click'])

const isHovered = ref(false)

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.item)
    emit('view', props.item) // Mantener compatibilidad
  }
}

const handleEdit = () => {
  emit('edit', props.item)
}

const handleDelete = () => {
  emit('delete', props.item)
}

const handleToggleFavorite = () => {
  emit('toggleFavorite', props.item)
}
</script>

<template>
  <div 
    class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
    :class="{
      'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer': hoverEffect && clickable,
      'cursor-pointer': clickable && !hoverEffect
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleClick"
  >
    <!-- Slot para contenido personalizado del header (gradiente, indicadores, etc.) -->
    <slot name="header-indicator"></slot>
    
    <!-- Contenido principal -->
    <div class="p-6">
      <!-- Header de la card -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center space-x-3">
          <!-- Slot para icono personalizable -->
          <slot name="icon">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-2xl shadow-inner">
              📋
            </div>
          </slot>
          
          <!-- Información básica -->
          <div>
            <slot name="title">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {{ item.name || item.title || 'Sin título' }}
              </h3>
            </slot>
            <slot name="subtitle">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ item.type || item.category || '' }}
              </div>
            </slot>
          </div>
        </div>

        <!-- Botón de favorito -->
        <button
          v-if="showFavorite"
          @click.stop="handleToggleFavorite"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{ 'text-yellow-500': item.favorite, 'text-gray-400': !item.favorite }"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      </div>

      <!-- Slot para contenido personalizable -->
      <slot name="content">
        <div class="space-y-3 mb-4">
          <div v-if="item.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {{ item.description }}
          </div>
        </div>
      </slot>

      <!-- Acciones -->
      <div 
        v-if="isAuthenticated && showActions"
        class="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700"
        :class="{ 'opacity-100': isHovered, 'opacity-0': !isHovered }"
        style="transition: opacity 0.3s ease"
      >
        <div class="flex items-center space-x-2">
          <slot name="actions" :handleEdit="handleEdit" :handleDelete="handleDelete">
            <BaseButton
              @click.stop="handleEdit"
              size="sm"
              variant="ghost"
              class="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </BaseButton>

            <BaseButton
              @click.stop="handleDelete"
              size="sm"
              variant="ghost"
              class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </BaseButton>
          </slot>
        </div>
      </div>

      <!-- Indicador para usuarios no autenticados -->
      <div v-else-if="!isAuthenticated && showActions" class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <slot name="unauthenticated-message">
          <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Inicia sesión para gestionar</span>
          </div>
        </slot>
      </div>
    </div>

    <!-- Efecto de brillo en hover -->
    <div 
      v-if="hoverEffect"
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none"
    ></div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>