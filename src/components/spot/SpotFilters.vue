<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FilterGlassBase from '../base/FilterGlassBase.vue'

const props = defineProps({
  selectedFilter: {
    type: String,
    default: 'ALL'
  }
})

const emit = defineEmits(['filter-change'])

const { t } = useI18n()

const filters = [
  { 
    id: 'ALL', 
    label: t('spots.filters.all'), 
    icon: '🗺️',
    colorScheme: 'gray'
  },
  { 
    id: 'NORESTRICTIONS', 
    label: t('spots.legalStatus.noRestrictions'), 
    icon: '✅',
    colorScheme: 'green'
  },
  { 
    id: 'RESTRICTEDZONE', 
    label: t('spots.legalStatus.restrictedZone'), 
    icon: '⚠️',
    colorScheme: 'orange'
  },
  { 
    id: 'PROHIBITEDZONE', 
    label: t('spots.legalStatus.prohibitedZone'), 
    icon: '🚫',
    colorScheme: 'red'
  },
  { 
    id: 'WITHOUT_ANALIZED', 
    label: t('spots.legalStatus.withoutAnalyzed'), 
    icon: '❓',
    colorScheme: 'slate'
  },
  { 
    id: 'FAVORITES', 
    label: t('spots.favorites.favorites'), 
    icon: '⭐',
    colorScheme: 'amber'
  }
]

const handleFilterChange = (filterId) => {
  emit('filter-change', filterId)
}
</script>

<template>
  <FilterGlassBase
    :filters="filters"
    :selected-filter="selectedFilter"
    :show-counter="false"
    grid-cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
    @filter-change="handleFilterChange"
  />
</template>