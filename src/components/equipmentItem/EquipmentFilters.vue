<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEquipmentItemStore } from '../../stores/equipmentItem'
import FilterGlassBase from '../base/FilterGlassBase.vue'

const props = defineProps({
  selectedType: {
    type: String,
    default: 'ALL'
  }
})

const emit = defineEmits(['type-change'])
const { t } = useI18n()
const equipmentItemStore = useEquipmentItemStore()

const types = [
  { 
    id: 'ALL', 
    label: t('equipmentItems.types.all'), 
    icon: '📋',
    colorScheme: 'gray'
  },
  { 
    id: 'DRONE', 
    label: t('equipmentItems.types.drone'), 
    icon: '🚁',
    colorScheme: 'blue'
  },
  { 
    id: 'RADIO', 
    label: t('equipmentItems.types.radio'), 
    icon: '🎮',
    colorScheme: 'green'
  },
  { 
    id: 'GOGGLES', 
    label: t('equipmentItems.types.goggles'), 
    icon: '🥽',
    colorScheme: 'purple'
  },
  { 
    id: 'BATTERY', 
    label: t('equipmentItems.types.battery'), 
    icon: '🔋',
    colorScheme: 'yellow'
  },
  { 
    id: 'CHARGER', 
    label: t('equipmentItems.types.charger'), 
    icon: '🔌',
    colorScheme: 'red'
  },
  { 
    id: 'OTHERS', 
    label: t('equipmentItems.types.others'), 
    icon: '📦',
    colorScheme: 'indigo'
  }
]

const getItemCount = (typeId) => {
  if (!equipmentItemStore.stats) return 0
  
  if (typeId === 'ALL') {
    return equipmentItemStore.stats.total || 0
  }
  
  return equipmentItemStore.stats.byType[typeId] || 0
}

const handleTypeChange = (typeId) => {
  emit('type-change', typeId)
}
</script>

<template>
  <FilterGlassBase
    :filters="types"
    :selected-filter="selectedType"
    :show-counter="true"
    :get-item-count="getItemCount"
    grid-cols="grid-cols-2 md:grid-cols-4 lg:grid-cols-7"
    @filter-change="handleTypeChange"
  />
</template>