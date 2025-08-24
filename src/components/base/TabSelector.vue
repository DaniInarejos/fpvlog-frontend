<script setup>
import { defineProps, defineEmits, ref, onMounted, nextTick } from 'vue'

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

const tabsContainer = ref(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(false)
const scrollAmount = 200

const handleTabChange = (tabId) => {
  emit('tab-change', tabId)
}

const scrollLeft = () => {
  if (tabsContainer.value) {
    tabsContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (tabsContainer.value) {
    tabsContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

const updateArrowVisibility = () => {
  if (!tabsContainer.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = tabsContainer.value
  
  showLeftArrow.value = scrollLeft > 0
  showRightArrow.value = scrollLeft < scrollWidth - clientWidth - 1
}

const handleScroll = () => {
  updateArrowVisibility()
}

onMounted(async () => {
  await nextTick()
  updateArrowVisibility()
  
  if (tabsContainer.value) {
    tabsContainer.value.addEventListener('scroll', handleScroll)
  }
  
  // Actualizar visibilidad cuando cambie el tamaño de ventana
  window.addEventListener('resize', updateArrowVisibility)
})
</script>

<template>
  <div class="relative w-full">
    <!-- Container con padding y mejor espaciado -->
    <div class="px-4 sm:px-6 lg:px-8 relative">
      <!-- Flecha izquierda -->
      <button
        v-show="showLeftArrow"
        @click="scrollLeft"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-xl"
        aria-label="Scroll left"
      >
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <!-- Flecha derecha -->
      <button
        v-show="showRightArrow"
        @click="scrollRight"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-xl"
        aria-label="Scroll right"
      >
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <!-- Container de tabs con scroll oculto -->
      <div 
        ref="tabsContainer"
        class="overflow-x-auto scrollbar-hide mx-8"
        :class="{ 'mx-0': !showLeftArrow && !showRightArrow }"
      >
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
/* Ocultar scrollbar completamente */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
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

/* Gradientes para indicar más contenido */
.scroll-gradient-left {
  background: linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
}

.scroll-gradient-right {
  background: linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
}

.dark .scroll-gradient-left {
  background: linear-gradient(to right, rgba(31,41,55,1) 0%, rgba(31,41,55,0) 100%);
}

.dark .scroll-gradient-right {
  background: linear-gradient(to left, rgba(31,41,55,1) 0%, rgba(31,41,55,0) 100%);
}
</style>