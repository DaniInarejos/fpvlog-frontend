<script setup>
import { ref, computed } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Seleccionar'
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  filterable: {
    type: Boolean,
    default: false
  },
  canCreate: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'create'])

const searchQuery = ref('')
const showDropdown = ref(false)

const filteredOptions = computed(() => {
  if (!searchQuery.value || !props.filterable) return props.options
  
  return props.options.filter(option => 
    option.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleInput = (event) => {
  if (props.filterable) {
    searchQuery.value = event.target.value
  } else {
    emit('update:modelValue', event.target.value)
  }
}

const selectOption = (value) => {
  emit('update:modelValue', value)
  searchQuery.value = ''
  showDropdown.value = false
}

const handleCreateNew = () => {
  emit('create', searchQuery.value)
  searchQuery.value = ''
  showDropdown.value = false
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}
</script>

<template>
  <div class="form-group relative">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    
    <div class="relative">
      <template v-if="filterable">
        <input
          type="text"
          :value="searchQuery"
          @input="handleInput"
          @focus="showDropdown = true"
          class="input w-full pr-8"
          :class="{ 'border-red-500': error }"
          :placeholder="placeholder"
        />
        <button
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2"
          @click="toggleDropdown"
        >
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <div v-if="showDropdown" class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          <template v-if="filteredOptions.length > 0">
            <button
              v-for="option in filteredOptions"
              :key="option._id"
              type="button"
              class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="selectOption(option._id)"
            >
              {{ option.name }}
            </button>
          </template>
          <div v-else-if="canCreate" class="p-4">
            <p class="text-sm text-gray-500 mb-2">No se encontraron resultados</p>
            <BaseButton
              variant="primary"
              size="sm"
              class="w-full"
              @click="handleCreateNew"
            >
              Crear "{{ searchQuery }}"
            </BaseButton>
          </div>
        </div>
      </template>
      
      <select
        v-else
        :value="modelValue"
        @input="handleInput"
        class="input"
        :class="{ 'border-red-500': error }"
        :required="required"
        :multiple="multiple"
      >
        <option value="" disabled selected>{{ placeholder }}</option>
        <option v-for="option in options" :key="option._id" :value="option._id">
          {{ option.name }}
        </option>
      </select>
    </div>
    
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white;
}
</style>