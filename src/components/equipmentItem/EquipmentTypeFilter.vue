<script setup>
import { useI18n } from 'vue-i18n'
import { useEquipmentItemStore } from '../../stores/equipmentItem'

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
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'
  },
  { 
    id: 'DRONE', 
    label: t('equipmentItems.types.drone'), 
    icon: '🚁',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800'
  },
  { 
    id: 'RADIO', 
    label: t('equipmentItems.types.radio'), 
    icon: '🎮',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800'
  },
  { 
    id: 'GOGGLES', 
    label: t('equipmentItems.types.goggles'), 
    icon: '🥽',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800'
  },
  { 
    id: 'BATTERY', 
    label: t('equipmentItems.types.battery'), 
    icon: '🔋',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800'
  },
  { 
    id: 'CHARGER', 
    label: t('equipmentItems.types.charger'), 
    icon: '🔌',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800'
  },
  { 
    id: 'OTHERS', 
    label: t('equipmentItems.types.others'), 
    icon: '📦',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800'
  }
]

const getItemCount = (typeId) => {
  // Obtener contadores reales del store
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
  <div class="space-y-6">
    <!-- Filtro principal con cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      <button
        v-for="type in types"
        :key="type.id"
        @click="handleTypeChange(type.id)"
        :class="[
          'group relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg',
          selectedType === type.id 
            ? `${type.bgColor} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-blue-500 shadow-lg scale-105` 
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700'
        ]"
      >
        <!-- Fondo animado -->
        <div 
          v-if="selectedType === type.id"
          :class="[
            'absolute inset-0 bg-gradient-to-r opacity-10',
            type.color
          ]"
        />
        
        <!-- Contenido -->
        <div class="relative z-10 flex flex-col items-center space-y-2">
          <!-- Icono -->
          <div 
            :class="[
              'text-2xl transition-transform duration-300',
              selectedType === type.id ? 'scale-110' : 'group-hover:scale-110'
            ]"
          >
            {{ type.icon }}
          </div>
          
          <!-- Label -->
          <div class="text-center">
            <div 
              :class="[
                'text-xs font-medium transition-colors duration-300',
                selectedType === type.id 
                  ? 'text-gray-900 dark:text-gray-100' 
                  : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'
              ]"
            >
              {{ type.label }}
            </div>
            
            <!-- Contador -->
            <div 
              :class="[
                'text-xs font-bold mt-1 px-2 py-0.5 rounded-full transition-all duration-300',
                selectedType === type.id 
                  ? `bg-gradient-to-r ${type.color} text-white shadow-sm` 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              ]"
            >
              {{ getItemCount(type.id) }}
            </div>
          </div>
        </div>

        <!-- Indicador de selección -->
        <div 
          v-if="selectedType === type.id"
          class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-b-xl"
        />
      </button>
    </div>

    <!-- Estadísticas rápidas eliminadas -->
    <!-- <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ selectedType === 'ALL' ? t('equipmentItems.types.all') : types.find(t => t.id === selectedType)?.label }}
          </span>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ getItemCount(selectedType) }} {{ getItemCount(selectedType) === 1 ? 'elemento' : 'elementos' }}
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-xs text-gray-500 dark:text-gray-400">Actualizado</span>
      </div>
    </div> -->
  </div>
</template>