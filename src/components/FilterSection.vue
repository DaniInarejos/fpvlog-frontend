<template>
  <div class="modern-filter-container">
    <!-- Header del filtro -->
    <div class="filter-header">
      <div class="filter-title">
        <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
        </svg>
        <span>Filtros</span>
      </div>
      <button 
        v-if="hasActiveFilters" 
        @click="clearAllFilters" 
        class="clear-filters-btn"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Limpiar
      </button>
    </div>
    
    <!-- Contenedor principal de filtros -->
    <div class="filter-content">
      <!-- Barra de búsqueda principal -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            :value="searchTerm"
            @input="$emit('update:searchTerm', $event.target.value)"
            type="text" 
            :placeholder="searchPlaceholder"
            class="modern-search-input"
          >
          <button 
            v-if="searchTerm" 
            @click="$emit('update:searchTerm', '')"
            class="clear-search-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Filtros avanzados -->
      <div class="advanced-filters" v-if="filters.length > 0">
        <div class="filter-chips-container">
          <div 
            v-for="filter in filters" 
            :key="filter.key"
            class="filter-chip"
            :class="{ 'active': filter.value }"
          >
            <label class="filter-label">{{ filter.placeholder }}</label>
            <select 
              :value="filter.value"
              @change="$emit('update:filter', filter.key, $event.target.value)"
              class="modern-filter-select"
            >
              <option value="">Todos</option>
              <option 
                v-for="option in filter.options" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <div class="filter-chip-indicator"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Indicador de resultados -->
    <div class="results-indicator" v-if="resultCount !== undefined">
      <span class="results-text">
        {{ resultCount }} {{ resultCount === 1 ? 'resultado' : 'resultados' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  searchTerm: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: 'Buscar...'
  },
  filters: {
    type: Array,
    default: () => []
  },
  resultCount: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['update:searchTerm', 'update:filter', 'clear-all'])

const hasActiveFilters = computed(() => {
  return props.searchTerm || props.filters.some(filter => filter.value)
})

const clearAllFilters = () => {
  emit('update:searchTerm', '')
  props.filters.forEach(filter => {
    emit('update:filter', filter.key, '')
  })
  emit('clear-all')
}
</script>

<style scoped>
@import '../assets/styles/modern-filter.css';
</style>