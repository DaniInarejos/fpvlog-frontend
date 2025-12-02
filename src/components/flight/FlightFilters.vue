<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FilterGlassBase from '../base/FilterGlassBase.vue'

const props = defineProps({
  selectedFilter: {
    type: String,
    default: 'ALL'
  },
  flights: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter-change'])
const { t } = useI18n()

const filters = [
  { 
    id: 'ALL', 
    label: t('flights.filters.all'), 
    icon: '📋',
    colorScheme: 'gray'
  },
  { 
    id: 'PUBLIC', 
    label: t('flights.filters.public'), 
    icon: '🌍',
    colorScheme: 'green'
  },
  { 
    id: 'FOLLOWERS', 
    label: t('flights.filters.followers'), 
    icon: '👥',
    colorScheme: 'blue'
  },
  { 
    id: 'PRIVATE', 
    label: t('flights.filters.private'), 
    icon: '🔒',
    colorScheme: 'purple'
  },
  { 
    id: 'WITH_VIDEO', 
    label: t('flights.filters.withVideo'), 
    icon: '🎥',
    colorScheme: 'red'
  },
  { 
    id: 'FAVORITES', 
    label: t('flights.filters.favorites'), 
    icon: '⭐',
    colorScheme: 'yellow'
  }
]

const getFlightCount = (filterId) => {
  if (!props.flights || props.flights.length === 0) return 0
  
  switch (filterId) {
    case 'ALL':
      return props.flights.length
    case 'PUBLIC':
      return props.flights.filter(flight => 
        flight.visibility === 'PUBLIC' || flight.visibility === 'public'
      ).length
    case 'FOLLOWERS':
      return props.flights.filter(flight => 
        flight.visibility === 'FOLLOWERS' || flight.visibility === 'followers'
      ).length
    case 'PRIVATE':
      return props.flights.filter(flight => 
        flight.visibility === 'PRIVATE' || flight.visibility === 'private'
      ).length
    case 'WITH_VIDEO':
      return props.flights.filter(flight => 
        flight.videoUrl && flight.videoUrl.trim() !== ''
      ).length
    case 'FAVORITES':
      return props.flights.filter(flight => flight.favorite).length
    default:
      return 0
  }
}

const handleFilterChange = (filterId) => {
  emit('filter-change', filterId)
}
</script>

<template>
  <FilterGlassBase
    :filters="filters"
    :selected-filter="selectedFilter"
    :show-counter="true"
    :get-item-count="getFlightCount"
    grid-cols="grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6"
    @filter-change="handleFilterChange"
  />
</template>