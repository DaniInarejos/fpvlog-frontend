<template>
  <div class="multi-select-container" ref="containerRef">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
    </label>
    
    <!-- Always visible selected items -->
    <div class="mb-3">
      <!-- Selected items display -->
      <div v-if="selectedItems.length > 0" class="mb-2 flex flex-wrap gap-2">
        <span 
          v-for="(item, index) in selectedItems" 
          :key="`${item._id}-${index}`"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
        >
          {{ getDisplayName(item) }}
          <button
            @click="removeItemAtIndex(index)"
            class="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            type="button"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </span>
      </div>
      
      <!-- Empty state message -->
      <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic py-2">
        No hay {{ label?.toLowerCase() || 'elementos' }} seleccionados
      </div>
    </div>

    <!-- Add button -->
    <div class="relative">
      <button
        @click="toggleDropdown"
        type="button"
        class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        :class="{
          'border-red-300 focus:ring-red-500': error
        }"
      >
        <svg class="-ml-1 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Agregar {{ label?.toLowerCase() || 'elemento' }}
      </button>

      <!-- Dropdown menu -->
      <div
        v-show="isOpen"
        ref="dropdownRef"
        class="absolute z-50 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm min-w-max"
        :class="{
          'bottom-full mb-1': dropdownDirection === 'up',
          'top-full mt-1': dropdownDirection === 'down'
        }"
      >
        <!-- Search input -->
        <div v-if="filterable" class="sticky top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-600">
          <input
            v-model="searchQuery"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            :placeholder="`Buscar ${label?.toLowerCase() || 'elementos'}...`"
            @click.stop
          >
        </div>

        <!-- Create new option -->
        <div v-if="canCreate && searchQuery && !filteredOptions.some(opt => getDisplayName(opt).toLowerCase().includes(searchQuery.toLowerCase()))" class="p-2 border-b border-gray-200 dark:border-gray-600">
          <button
            @click="createNewItem"
            type="button"
            class="w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md transition-colors"
          >
            + Crear "{{ searchQuery }}"
          </button>
        </div>

        <!-- Options list - Mostrar todos los elementos disponibles -->
        <div
          v-for="option in filteredOptions"
          :key="option._id"
          @click="addItem(option)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{
            'bg-blue-50 dark:bg-blue-900': getSelectedCount(option) > 0
          }"
        >
          <div class="flex justify-between items-center">
            <span class="block truncate text-gray-900 dark:text-gray-100">
              {{ getDisplayName(option) }}
            </span>
            <span v-if="getSelectedCount(option) > 0" class="text-xs bg-blue-500 text-white rounded-full px-2 py-1 ml-2">
              {{ getSelectedCount(option) }}
            </span>
          </div>
        </div>

        <div v-if="filteredOptions.length === 0" class="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
          No se encontraron elementos
        </div>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Seleccionar elementos'
  },
  error: {
    type: String,
    default: ''
  },
  filterable: {
    type: Boolean,
    default: false
  },
  canCreate: {
    type: Boolean,
    default: false
  },
  displayField: {
    type: String,
    default: 'name'
  },
  valueField: {
    type: String,
    default: '_id'
  }
})

const emit = defineEmits(['update:modelValue', 'create'])

const isOpen = ref(false)
const searchQuery = ref('')
const containerRef = ref(null)
const dropdownRef = ref(null)
const dropdownDirection = ref('down')

// Computed properties
const selectedItems = computed(() => {
  if (!props.modelValue || props.modelValue.length === 0) return []
  
  // Asegurar que modelValue sea un array
  const modelValueArray = Array.isArray(props.modelValue) ? props.modelValue : []
  
  // Mapear cada ID seleccionado a su objeto correspondiente
  return modelValueArray.map(selectedId => {
    return props.options.find(option => option[props.valueField] === selectedId)
  }).filter(Boolean) // Filtrar elementos undefined
})

// Mostrar todas las opciones disponibles (no filtrar por seleccionados)
const filteredOptions = computed(() => {
  let available = props.options
  
  // Apply search filter if needed
  if (props.filterable && searchQuery.value) {
    available = available.filter(option => 
      getDisplayName(option).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  return available
})

// Methods
const getDisplayName = (item) => {
  if (!item) return ''
  
  // Si el item tiene un array como primer elemento, mostrar el nombre del primer elemento
  if (Array.isArray(item[props.displayField]) && item[props.displayField].length > 0) {
    return item[props.displayField][0]
  }
  
  return item[props.displayField] || item.name || item.label || item.toString()
}

// Contar cuántas veces está seleccionado un elemento
const getSelectedCount = (option) => {
  if (!props.modelValue || props.modelValue.length === 0) return 0
  
  const modelValueArray = Array.isArray(props.modelValue) ? props.modelValue : []
  const optionValue = option[props.valueField]
  
  return modelValueArray.filter(id => id === optionValue).length
}

// Calcular la dirección del dropdown
const calculateDropdownDirection = () => {
  if (!containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const dropdownHeight = 240 // max-h-60 = 240px aproximadamente
  
  // Si no hay suficiente espacio abajo, abrir hacia arriba
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top
  
  if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
    dropdownDirection.value = 'up'
  } else {
    dropdownDirection.value = 'down'
  }
}

const addItem = (option) => {
  // Asegurar que modelValue sea un array
  const currentValue = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const optionValue = option[props.valueField]
  
  // Siempre agregar el elemento (permitir duplicados)
  currentValue.push(optionValue)
  emit('update:modelValue', currentValue)
  
  // Close dropdown after adding
  isOpen.value = false
  searchQuery.value = ''
}

// Remover elemento por índice específico
const removeItemAtIndex = (index) => {
  const currentValue = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  
  if (index >= 0 && index < currentValue.length) {
    currentValue.splice(index, 1)
    emit('update:modelValue', currentValue)
  }
}

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
    await nextTick()
    calculateDropdownDirection()
  }
}

const createNewItem = () => {
  emit('create', searchQuery.value)
  searchQuery.value = ''
  isOpen.value = false
}

const closeDropdown = (event) => {
  if (!event.target.closest('.multi-select-container')) {
    isOpen.value = false
  }
}

// Watch for changes in modelValue to ensure reactivity
watch(() => props.modelValue, (newValue) => {
  // Ensure the value is always an array
  if (newValue && !Array.isArray(newValue)) {
    console.warn('MultiSelect: modelValue should be an array, received:', typeof newValue, newValue)
    emit('update:modelValue', [])
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  document.addEventListener('click', closeDropdown)
  window.addEventListener('resize', calculateDropdownDirection)
  window.addEventListener('scroll', calculateDropdownDirection)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
  window.removeEventListener('resize', calculateDropdownDirection)
  window.removeEventListener('scroll', calculateDropdownDirection)
})
</script>