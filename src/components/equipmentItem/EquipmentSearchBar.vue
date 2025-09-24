<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  sortBy: {
    type: String,
    default: 'name'
  },
  sortOrder: {
    type: String,
    default: 'asc'
  },
  totalItems: {
    type: Number,
    default: 0
  },
  filteredItems: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'update:sortBy', 'update:sortOrder', 'clear'])
const { t } = useI18n()

const searchInput = ref(null)
const showSortOptions = ref(false)
const isSearchFocused = ref(false)

const searchValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const sortOptions = [
  { value: 'name', label: 'Nombre', icon: '🔤' },
  { value: 'type', label: 'Tipo', icon: '📂' },
  { value: 'brand', label: 'Marca', icon: '🏷️' },
  { value: 'price', label: 'Precio', icon: '💰' },
  { value: 'purchaseDate', label: 'Fecha de compra', icon: '📅' },
  { value: 'condition', label: 'Condición', icon: '⭐' }
]

const currentSortOption = computed(() => {
  return sortOptions.find(option => option.value === props.sortBy) || sortOptions[0]
})

const handleSortChange = (sortBy) => {
  if (props.sortBy === sortBy) {
    // Si es la misma columna, cambiar el orden
    emit('update:sortOrder', props.sortOrder === 'asc' ? 'desc' : 'asc')
  } else {
    // Si es una columna diferente, usar orden ascendente
    emit('update:sortBy', sortBy)
    emit('update:sortOrder', 'asc')
  }
  showSortOptions.value = false
}

const clearSearch = () => {
  searchValue.value = ''
  emit('clear')
  searchInput.value?.focus()
}

const focusSearch = () => {
  searchInput.value?.focus()
}

// Atajos de teclado
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    if (searchValue.value) {
      clearSearch()
    } else {
      searchInput.value?.blur()
    }
  }
}

// Auto-focus cuando se monta el componente
const mounted = () => {
  // Agregar listener global para Ctrl+K o Cmd+K
  const handleGlobalKeydown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      focusSearch()
    }
  }
  
  document.addEventListener('keydown', handleGlobalKeydown)
  
  // Cleanup
  return () => {
    document.removeEventListener('keydown', handleGlobalKeydown)
  }
}

// Llamar mounted cuando el componente se monta
import { onMounted, onUnmounted } from 'vue'
let cleanup = null

onMounted(() => {
  cleanup = mounted()
})

onUnmounted(() => {
  if (cleanup) cleanup()
})
</script>

<template>
  <div class="space-y-4">
    <!-- Barra de búsqueda principal -->
    <div class="relative">
      <div 
        class="relative flex items-center"
        :class="{
          'ring-2 ring-blue-500 ring-opacity-50': isSearchFocused,
          'shadow-lg': isSearchFocused
        }"
        style="transition: all 0.3s ease"
      >
        <!-- Icono de búsqueda -->
        <div class="absolute left-4 z-10">
          <svg 
            class="w-5 h-5 transition-colors duration-200"
            :class="isSearchFocused ? 'text-blue-500' : 'text-gray-400'"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Input de búsqueda -->
        <input
          ref="searchInput"
          v-model="searchValue"
          type="text"
          :placeholder="t('equipmentItems.search.placeholder')"
          class="w-full pl-12 pr-20 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
          @keydown="handleKeydown"
        />

        <!-- Botones de acción -->
        <div class="absolute right-2 flex items-center space-x-1">
          <!-- Botón de limpiar -->
          <button
            v-if="searchValue"
            @click="clearSearch"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :title="t('common.clear')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Indicador de atajo de teclado -->
          <div 
            v-if="!isSearchFocused && !searchValue"
            class="hidden sm:flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-500 dark:text-gray-400"
          >
            <span class="font-mono">⌘K</span>
          </div>
        </div>
      </div>

      <!-- Sugerencias de búsqueda (placeholder para futuras mejoras) -->
      <div 
        v-if="isSearchFocused && !searchValue"
        class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 p-4"
      >
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Sugerencias de búsqueda:</div>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="suggestion in ['DJI', 'FrSky', 'TBS', 'Fatshark']"
            :key="suggestion"
            @click="searchValue = suggestion"
            class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <!-- Barra de herramientas -->
    <div class="flex items-center justify-between">
      <!-- Información de resultados -->
      <div class="flex items-center space-x-4">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <span v-if="searchValue || filteredItems !== totalItems">
            {{ filteredItems }} de {{ totalItems }} elementos
          </span>
          <span v-else>
            {{ totalItems }} elementos
          </span>
        </div>

        <!-- Indicador de filtro activo -->
        <div 
          v-if="searchValue"
          class="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filtrado por: "{{ searchValue }}"</span>
          <button @click="clearSearch" class="ml-1 hover:text-blue-900 dark:hover:text-blue-100">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Controles de ordenamiento -->
      <div class="relative">
        <button
          @click="showSortOptions = !showSortOptions"
          class="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <span class="text-lg">{{ currentSortOption.icon }}</span>
          <span class="text-sm font-medium">{{ currentSortOption.label }}</span>
          <svg 
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': showSortOptions }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          <svg 
            class="w-4 h-4 ml-1"
            :class="props.sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-400'"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </button>

        <!-- Dropdown de opciones de ordenamiento -->
        <div 
          v-if="showSortOptions"
          class="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 py-2"
        >
          <button
            v-for="option in sortOptions"
            :key="option.value"
            @click="handleSortChange(option.value)"
            class="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :class="{
              'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300': props.sortBy === option.value
            }"
          >
            <span class="text-lg">{{ option.icon }}</span>
            <span class="text-sm">{{ option.label }}</span>
            <div class="flex-1"></div>
            <svg 
              v-if="props.sortBy === option.value"
              class="w-4 h-4"
              :class="props.sortOrder === 'asc' ? 'text-blue-500' : 'text-blue-500 rotate-180'"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay para cerrar dropdown -->
    <div 
      v-if="showSortOptions"
      class="fixed inset-0 z-10"
      @click="showSortOptions = false"
    ></div>
  </div>
</template>