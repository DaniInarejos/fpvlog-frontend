<script setup>
import { computed } from 'vue'
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

// Función para obtener las clases de color glassmorphism por tipo
const getTypeColorClasses = (typeId) => {
  const colorMap = {
    ALL: {
      gradient: 'from-gray-400/20 to-gray-500/20',
      selectedBg: 'bg-gradient-to-r from-gray-100/10 to-gray-200/10',
      selectedRing: 'ring-gray-400/50',
      indicator: 'from-gray-400/60 to-gray-500/60',
      counter: 'from-gray-400/30 to-gray-500/30',
      hover: 'hover:from-gray-300/25 hover:to-gray-400/25'
    },
    DRONE: {
      gradient: 'from-blue-400/20 to-blue-500/20',
      selectedBg: 'bg-gradient-to-r from-blue-100/10 to-blue-200/10',
      selectedRing: 'ring-blue-400/50',
      indicator: 'from-blue-400/60 to-blue-500/60',
      counter: 'from-blue-400/30 to-blue-500/30',
      hover: 'hover:from-blue-300/25 hover:to-blue-400/25'
    },
    RADIO: {
      gradient: 'from-green-400/20 to-green-500/20',
      selectedBg: 'bg-gradient-to-r from-green-100/10 to-green-200/10',
      selectedRing: 'ring-green-400/50',
      indicator: 'from-green-400/60 to-green-500/60',
      counter: 'from-green-400/30 to-green-500/30',
      hover: 'hover:from-green-300/25 hover:to-green-400/25'
    },
    GOGGLES: {
      gradient: 'from-purple-400/20 to-purple-500/20',
      selectedBg: 'bg-gradient-to-r from-purple-100/10 to-purple-200/10',
      selectedRing: 'ring-purple-400/50',
      indicator: 'from-purple-400/60 to-purple-500/60',
      counter: 'from-purple-400/30 to-purple-500/30',
      hover: 'hover:from-purple-300/25 hover:to-purple-400/25'
    },
    BATTERY: {
      gradient: 'from-yellow-400/20 to-yellow-500/20',
      selectedBg: 'bg-gradient-to-r from-yellow-100/10 to-yellow-200/10',
      selectedRing: 'ring-yellow-400/50',
      indicator: 'from-yellow-400/60 to-yellow-500/60',
      counter: 'from-yellow-400/30 to-yellow-500/30',
      hover: 'hover:from-yellow-300/25 hover:to-yellow-400/25'
    },
    CHARGER: {
      gradient: 'from-red-400/20 to-red-500/20',
      selectedBg: 'bg-gradient-to-r from-red-100/10 to-red-200/10',
      selectedRing: 'ring-red-400/50',
      indicator: 'from-red-400/60 to-red-500/60',
      counter: 'from-red-400/30 to-red-500/30',
      hover: 'hover:from-red-300/25 hover:to-red-400/25'
    },
    OTHERS: {
      gradient: 'from-indigo-400/20 to-indigo-500/20',
      selectedBg: 'bg-gradient-to-r from-indigo-100/10 to-indigo-200/10',
      selectedRing: 'ring-indigo-400/50',
      indicator: 'from-indigo-400/60 to-indigo-500/60',
      counter: 'from-indigo-400/30 to-indigo-500/30',
      hover: 'hover:from-indigo-300/25 hover:to-indigo-400/25'
    }
  }
  return colorMap[typeId] || colorMap.ALL
}

const types = [
  { 
    id: 'ALL', 
    label: t('equipmentItems.types.all'), 
    icon: '📋'
  },
  { 
    id: 'DRONE', 
    label: t('equipmentItems.types.drone'), 
    icon: '🚁'
  },
  { 
    id: 'RADIO', 
    label: t('equipmentItems.types.radio'), 
    icon: '🎮'
  },
  { 
    id: 'GOGGLES', 
    label: t('equipmentItems.types.goggles'), 
    icon: '🥽'
  },
  { 
    id: 'BATTERY', 
    label: t('equipmentItems.types.battery'), 
    icon: '🔋'
  },
  { 
    id: 'CHARGER', 
    label: t('equipmentItems.types.charger'), 
    icon: '🔌'
  },
  { 
    id: 'OTHERS', 
    label: t('equipmentItems.types.others'), 
    icon: '📦'
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
  <div class="space-y-6">
    <!-- Contenedor principal con glassmorphism -->
    <div class="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-xl">
      <!-- Filtro principal con cards glassmorphism -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <button
          v-for="type in types"
          :key="type.id"
          @click="handleTypeChange(type.id)"
          :class="[
            'group relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm border',
            selectedType === type.id 
              ? `${getTypeColorClasses(type.id).selectedBg} ring-2 ring-offset-2 ring-offset-transparent ${getTypeColorClasses(type.id).selectedRing} shadow-lg scale-105 border-white/40 dark:border-gray-600/40` 
              : `bg-white/20 dark:bg-gray-800/20 bg-gradient-to-r ${getTypeColorClasses(type.id).hover} shadow-sm border-white/30 dark:border-gray-700/30`
          ]"
        >
          <!-- Fondo animado glassmorphism con color específico del tipo -->
          <div 
            v-if="selectedType === type.id"
            :class="[
              'absolute inset-0 bg-gradient-to-r backdrop-blur-sm',
              getTypeColorClasses(type.id).gradient
            ]"
          />
          
          <!-- Contenido -->
          <div class="relative z-10 flex flex-col items-center space-y-2">
            <!-- Icono con glassmorphism y color del tipo -->
            <div 
              :class="[
                'text-2xl transition-transform duration-300 backdrop-blur-sm rounded-lg p-1',
                selectedType === type.id 
                  ? `bg-gradient-to-r ${getTypeColorClasses(type.id).gradient} scale-110` 
                  : `bg-white/10 dark:bg-gray-900/10 group-hover:bg-gradient-to-r group-hover:${getTypeColorClasses(type.id).gradient} group-hover:scale-110`
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
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                ]"
              >
                {{ type.label }}
              </div>
              
              <!-- Contador con glassmorphism y color del tipo -->
              <div 
                :class="[
                  'text-xs font-bold mt-1 px-2 py-0.5 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20',
                  selectedType === type.id 
                    ? `bg-gradient-to-r ${getTypeColorClasses(type.id).counter} text-white shadow-sm` 
                    : 'bg-white/30 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                ]"
              >
                {{ getItemCount(type.id) }}
              </div>
            </div>
          </div>

          <!-- Indicador de selección glassmorphism con color del tipo -->
          <div 
            v-if="selectedType === type.id"
            :class="`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getTypeColorClasses(type.id).indicator} rounded-b-xl shadow-sm`"
          />

          <!-- Efecto de brillo glassmorphism con tinte del color del tipo -->
          <div 
            :class="[
              'absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700 pointer-events-none',
              `from-transparent via-white/20 to-transparent`
            ]"
          ></div>
        </button>
      </div>
    </div>
  </div>
</template>