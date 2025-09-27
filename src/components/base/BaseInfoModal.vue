<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'large',
    validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
  }
})

const emit = defineEmits(['close'])
const { t } = useI18n()

const modalSizeClasses = computed(() => {
  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'max-w-7xl'
  }
  return sizes[props.size] || sizes.large
})

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="handleOverlayClick"
    >
      <!-- Overlay con glassmorphism -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <!-- Contenedor del modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="show"
            class="relative w-full transform overflow-hidden rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl transition-all border border-white/20 dark:border-gray-700/30"
            :class="modalSizeClasses"
          >
            <!-- Header del modal -->
            <div class="relative px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div class="flex items-center justify-between">
                <slot name="header" :item="item">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {{ title || item?.name || 'Información' }}
                  </h3>
                </slot>
                
                <!-- Botón de cerrar -->
                <button
                  @click="handleClose"
                  class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Contenido del modal -->
            <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
              <slot name="content" :item="item">
                <div class="space-y-6">
                  <!-- Contenido por defecto -->
                  <div v-if="item" class="text-gray-600 dark:text-gray-400">
                    <pre class="whitespace-pre-wrap">{{ JSON.stringify(item, null, 2) }}</pre>
                  </div>
                  <div v-else class="text-center text-gray-500 dark:text-gray-400">
                    No hay información disponible
                  </div>
                </div>
              </slot>
            </div>

            <!-- Footer del modal (opcional) -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
              <slot name="footer" :item="item" :close="handleClose"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>