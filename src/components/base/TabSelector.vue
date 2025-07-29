<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (value) => value.every(tab => typeof tab.id === 'string' && typeof tab.label === 'string')
  },
  activeTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['tab-change'])

const handleTabChange = (tabId) => {
  emit('tab-change', tabId)
}
</script>

<template>
  <div class="relative w-full">
    <!-- Container con padding y mejor espaciado -->
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Scroll horizontal para móviles -->
      <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div class="flex space-x-1 sm:space-x-2 border-b border-gray-200 dark:border-gray-700 min-w-max">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="handleTabChange(tab.id)"
            :class="[
              'relative px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap transition-all duration-200 ease-in-out rounded-t-lg',
              activeTab === tab.id
                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
            ]"
          >
            <!-- Indicador activo mejorado -->
            <span class="relative z-10">{{ tab.label }}</span>
            <div 
              v-if="activeTab === tab.id" 
              class="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 rounded-t-full"
            ></div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Línea de separación con mejor espaciado -->
    <div class="mt-0 border-b border-gray-100 dark:border-gray-800"></div>
  </div>
</template>

<style scoped>
/* Mejoras en el scrollbar para móviles */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

/* Animación suave para el indicador activo */
@keyframes slideIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.border-blue-600 {
  animation: slideIn 0.2s ease-out;
}
</style>