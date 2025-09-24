<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete', 'toggleFavorite', 'view'])
const { t } = useI18n()

const isHovered = ref(false)
const showActions = ref(false)

const formattedPrice = computed(() => {
  if (!props.item.price) return null
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(props.item.price)
})

const formattedDate = computed(() => {
  if (!props.item.purchaseDate) return null
  return new Date(props.item.purchaseDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const typeIcon = computed(() => {
  const icons = {
    DRONE: '🚁',
   RADIO: '🎮',
    GOGGLES: '🥽',
    BATTERY: '🔋',
    CHARGER: '🔌',
    OTHERS: '📦'
  }
  return icons[props.item.type] || '📋'
})
const typeColor = computed(() => {
  const colors = {
    DRONE: 'from-blue-500 to-blue-600',
    RADIO: 'from-green-500 to-green-600',
    GOGGLES: 'from-purple-500 to-purple-600',
    BATTERY: 'from-yellow-500 to-yellow-600',
    CHARGER: 'from-red-500 to-red-600',
    OTHERS: 'from-gray-500 to-gray-600'
  }
  return colors[props.item.type] || 'from-gray-500 to-gray-600'
})

const conditionColor = computed(() => {
  const colors = {
    NEW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    LIKE_NEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    GOOD: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    FAIR: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    POOR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[props.item.condition] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
})

const handleEdit = () => {
  emit('edit', props.item)
}

const handleDelete = () => {
  emit('delete', props.item)
}

const handleToggleFavorite = () => {
  emit('toggleFavorite', props.item)
}

const handleView = () => {
  emit('view', props.item)
}
</script>

<template>
  <div 
    class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleView"
  >
    <!-- Gradiente de tipo en la parte superior -->
    <div :class="`h-1 bg-gradient-to-r ${typeColor}`"></div>
    
    <!-- Contenido principal -->
    <div class="p-6">
      <!-- Header de la card -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center space-x-3">
          <!-- Icono del tipo -->
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-2xl shadow-inner">
            {{ typeIcon }}
          </div>
          
          <!-- Información básica -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {{ item.name }}
            </h3>
            <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{{ item.type ? t(`equipmentItems.types.${item.type.toLowerCase()}`) : '-' }}</span>
              <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span v-if="item.brand">{{ item.brand }}</span>
              <span v-if="item.model" class="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span v-if="item.model">{{ item.model }}</span>
            </div>
          </div>
        </div>

        <!-- Botón de favorito -->
        <button
          @click.stop="handleToggleFavorite"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{ 'text-yellow-500': item.favorite, 'text-gray-400': !item.favorite }"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      </div>

      <!-- Información adicional -->
      <div class="space-y-3 mb-4">
        <!-- Precio y condición -->
        <div class="flex items-center justify-between">
          <div v-if="formattedPrice" class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ formattedPrice }}</span>
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div v-if="item.condition" :class="`px-3 py-1 rounded-full text-xs font-medium ${conditionColor}`">
            {{ item.condition ? t(`equipmentItems.conditions.${item.condition.toLowerCase()}`) : '-' }}
          </div>
        </div>

        <!-- Fecha de compra -->
        <div v-if="formattedDate" class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Comprado el {{ formattedDate }}</span>
        </div>

        <!-- Número de serie -->
        <div v-if="item.serialNumber" class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span class="font-mono text-xs">{{ item.serialNumber }}</span>
        </div>

        <!-- Descripción -->
        <div v-if="item.notes" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {{ item.notes }}
        </div>
      </div>

      <!-- Acciones -->
      <div 
        v-if="isAuthenticated"
        class="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700"
        :class="{ 'opacity-100': isHovered || showActions, 'opacity-0': !isHovered && !showActions }"
        style="transition: opacity 0.3s ease"
      >
        <div class="flex items-center space-x-2">
          <BaseButton
            @click.stop="handleEdit"
            size="sm"
            variant="ghost"
            class="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </BaseButton>

          <BaseButton
            @click.stop="handleDelete"
            size="sm"
            variant="ghost"
            class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          </BaseButton>
        </div>
      </div>

      <!-- Indicador de carga para usuarios no autenticados -->
      <div v-else class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>{{ t('auth.loginToManage') }}</span>
        </div>
      </div>
    </div>

    <!-- Efecto de brillo en hover -->
    <div 
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none"
    ></div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
