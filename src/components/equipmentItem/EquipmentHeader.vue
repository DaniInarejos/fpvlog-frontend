<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  equipmentItems: {
    type: Object,
    default: () => ({})
  },
  selectedType: {
    type: String,
    default: 'ALL'
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['create', 'login'])
const { t } = useI18n()

const typeStats = computed(() => {
  if (!Array.isArray(props.equipmentItems) || props.equipmentItems.length === 0) {
    return []
  }
  
  // Contar items por tipo
  const typeCounts = {}
  let totalCount = 0
  
  props.equipmentItems.forEach(item => {
    const type = item.type || 'OTHERS'
    typeCounts[type] = (typeCounts[type] || 0) + 1
    totalCount++
  })
  
  // Crear array de estadísticas
  const stats = []
  
  // Agregar total al principio
  stats.push({
    type: 'ALL',
    count: totalCount,
    icon: '📋',
    label: t('equipmentItems.types.all')
  })
  
  // Agregar estadísticas por tipo (solo los que tienen items)
  Object.entries(typeCounts).forEach(([type, count]) => {
    stats.push({
      type,
      count,
      icon: getTypeIcon(type),
      label: t(`equipmentItems.types.${type.toLowerCase()}`)
    })
  })
  
  return stats
})

const getTypeIcon = (type) => {
  const icons = {
    DRONE: '🚁',
    RADIO: '🎮',
    GOGGLES: '🥽',
    BATTERY: '🔋',
    CHARGER: '🔌',
    OTHERS: '📦'
  }
  return icons[type] || '📋'
}

const handleCreate = () => {
  if (props.isAuthenticated) {
    emit('create', props.selectedType)
  } else {
    emit('login')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header principal -->
    <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white">
      <!-- Patrón de fondo -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, white 2px, transparent 2px); background-size: 24px 24px;"></div>
      </div>
      
      <!-- Elementos flotantes animados -->
      <div class="absolute top-4 right-4 animate-bounce">
        <div class="w-3 h-3 bg-white rounded-full opacity-60"></div>
      </div>
      <div class="absolute top-12 right-12 animate-pulse">
        <div class="w-2 h-2 bg-blue-300 rounded-full"></div>
      </div>
      <div class="absolute bottom-8 right-8 animate-bounce" style="animation-delay: 1s;">
        <div class="w-4 h-4 bg-indigo-300 rounded-full opacity-40"></div>
      </div>

      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <!-- Título y descripción -->
        <div class="mb-6 lg:mb-0">
          <div class="flex items-center space-x-3 mb-2">
            <div class="text-4xl animate-pulse drop-shadow-lg">🛠️</div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-2xl backdrop-blur-sm">
              {{ t('equipmentItems.title') }}
            </h1>
          </div>
          <p class="text-blue-100 text-lg max-w-2xl drop-shadow-lg backdrop-blur-sm bg-white/5 rounded-lg px-4 py-2">
            {{ t('equipmentItems.description') }}
          </p>
        </div>

        <!-- Botón de acción -->
        <div class="flex flex-col items-end space-y-4">
          <BaseButton
            @click="handleCreate"
            class="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
          >
            <div class="flex items-center space-x-2">
              <span class="text-xl">{{ isAuthenticated ? '➕' : '🔐' }}</span>
              <span>
                {{ isAuthenticated 
                  ? (selectedType && selectedType !== 'ALL' 
                    ? t('equipmentItems.addItem', { type: t(`equipmentItems.types.${selectedType.toLowerCase()}`) })
                    : t('equipmentItems.addItem'))
                  : t('auth.loginToManage') }}
              </span>
            </div>
          </BaseButton>


        </div>
      </div>
    </div>

    <!-- Panel de estadísticas detalladas eliminado -->
  </div>
</template>
