<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CardGlassBase from '../base/CardGlassBase.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BaseModal from '../base/BaseModal.vue'

const props = defineProps({
  equipmentItems: {
    type: Object,
    required: true
  },
  selectedType: {
    type: String,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['create', 'delete', 'edit', 'showInfo', 'toggleFavorite'])
const { t } = useI18n()
const showTypeSelector = ref(false)

const equipmentTypes = [
  { _id: 'DRONE', name: t('equipmentItems.types.drone') },
  { _id: 'RADIO', name: t('equipmentItems.types.radio') },
  { _id: 'GOGGLES', name: t('equipmentItems.types.goggles') },
  { _id: 'BATTERY', name: t('equipmentItems.types.battery') },
  { _id: 'CHARGER', name: t('equipmentItems.types.charger') },
  { _id: 'OTHERS', name: t('equipmentItems.types.others') }
]

const typeIcons = {
  DRONE: '🚁',
  RADIO: '🎮',
  GOGGLES: '🥽',
  BATTERY: '🔋',
  CHARGER: '🔌',
  OTHERS: '📋'
}

// Función para obtener las clases de color glassmorphism por tipo
const getTypeColorClasses = (typeId) => {
  const colorMap = {
    DRONE: {
      gradient: 'from-blue-400/20 to-blue-500/20',
      selectedBg: 'bg-gradient-to-r from-blue-100/10 to-blue-200/10',
      selectedRing: 'ring-blue-400/50',
      indicator: 'from-blue-400/60 to-blue-500/60',
      counter: 'from-blue-400/30 to-blue-500/30',
      hover: 'hover:from-blue-300/25 hover:to-blue-400/25',
      border: 'border-blue-400/30',
      text: 'text-blue-700 dark:text-blue-300'
    },
    RADIO: {
      gradient: 'from-green-400/20 to-green-500/20',
      selectedBg: 'bg-gradient-to-r from-green-100/10 to-green-200/10',
      selectedRing: 'ring-green-400/50',
      indicator: 'from-green-400/60 to-green-500/60',
      counter: 'from-green-400/30 to-green-500/30',
      hover: 'hover:from-green-300/25 hover:to-green-400/25',
      border: 'border-green-400/30',
      text: 'text-green-700 dark:text-green-300'
    },
    GOGGLES: {
      gradient: 'from-purple-400/20 to-purple-500/20',
      selectedBg: 'bg-gradient-to-r from-purple-100/10 to-purple-200/10',
      selectedRing: 'ring-purple-400/50',
      indicator: 'from-purple-400/60 to-purple-500/60',
      counter: 'from-purple-400/30 to-purple-500/30',
      hover: 'hover:from-purple-300/25 hover:to-purple-400/25',
      border: 'border-purple-400/30',
      text: 'text-purple-700 dark:text-purple-300'
    },
    BATTERY: {
      gradient: 'from-yellow-400/20 to-yellow-500/20',
      selectedBg: 'bg-gradient-to-r from-yellow-100/10 to-yellow-200/10',
      selectedRing: 'ring-yellow-400/50',
      indicator: 'from-yellow-400/60 to-yellow-500/60',
      counter: 'from-yellow-400/30 to-yellow-500/30',
      hover: 'hover:from-yellow-300/25 hover:to-yellow-400/25',
      border: 'border-yellow-400/30',
      text: 'text-yellow-700 dark:text-yellow-300'
    },
    CHARGER: {
      gradient: 'from-red-400/20 to-red-500/20',
      selectedBg: 'bg-gradient-to-r from-red-100/10 to-red-200/10',
      selectedRing: 'ring-red-400/50',
      indicator: 'from-red-400/60 to-red-500/60',
      counter: 'from-red-400/30 to-red-500/30',
      hover: 'hover:from-red-300/25 hover:to-red-400/25',
      border: 'border-red-400/30',
      text: 'text-red-700 dark:text-red-300'
    },
    OTHERS: {
      gradient: 'from-indigo-400/20 to-indigo-500/20',
      selectedBg: 'bg-gradient-to-r from-indigo-100/10 to-indigo-200/10',
      selectedRing: 'ring-indigo-400/50',
      indicator: 'from-indigo-400/60 to-indigo-500/60',
      counter: 'from-indigo-400/30 to-indigo-500/30',
      hover: 'hover:from-indigo-300/25 hover:to-indigo-400/25',
      border: 'border-indigo-400/30',
      text: 'text-indigo-700 dark:text-indigo-300'
    }
  }
  return colorMap[typeId] || colorMap.OTHERS
}

const conditionColors = {
  NEW: 'text-green-600',
  USED: 'text-yellow-600',
  REFURBISHED: 'text-blue-600'
}

const filteredEquipmentItems = computed(() => {
  if (!props.equipmentItems) return []
  
  if (!props.selectedType || props.selectedType === 'ALL') {
    // Si no hay tipo seleccionado o es 'ALL', mostrar todos los items
    return Object.entries(props.equipmentItems).reduce((acc, [type, items]) => {
      return acc.concat(Array.isArray(items) ? items.map(item => ({ ...item, type })) : [])
    }, [])
  }
  // Si hay un tipo específico seleccionado, mostrar solo esos items
  return Array.isArray(props.equipmentItems[props.selectedType]) ? props.equipmentItems[props.selectedType] : []
})

const handleTypeSelect = (typeId) => {
  emit('create', typeId)
  showTypeSelector.value = false
}

const formatPrice = (price, currency) => {
  if (!price) return '-'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency || 'EUR'
  }).format(price)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES')
}
</script>

<template>
  <div>
    <BaseAlert
      v-if="errors.fetch"
      type="error"
      :message="errors.fetch"
      class="mb-6"
    />

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">{{ t('common.loading') }}</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredEquipmentItems.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📦</div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {{ selectedType && selectedType !== 'ALL' 
          ? t('equipmentItems.noItemsOfType') 
          : t('equipmentItems.noItems') }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ t('equipmentItems.addFirstDescription') }}
      </p>
      <BaseButton
        @click="selectedType && selectedType !== 'ALL' ? emit('create', selectedType) : showTypeSelector = true"
        class="mx-auto"
      >
        {{ selectedType && selectedType !== 'ALL' 
          ? t('equipmentItems.addFirst', { type: t(`equipmentItems.types.${selectedType.toLowerCase()}`) })
          : t('equipmentItems.addItem') }}
      </BaseButton>
    </div>

    <!-- Equipment items grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardGlassBase
        v-for="item in filteredEquipmentItems"
        :key="item._id"
        :title="item.name"
        :subtitle="item.type ? t(`equipmentItems.types.${item.type.toLowerCase()}`) : '-'"
        :image="item.image"
        :fallback-icon="typeIcons[item.type] || '📋'"
        :is-authenticated="true"
        edit-icon="✏️"
        delete-icon="🗑️"
        edit-button-color="green"
        delete-button-color="red"
        @edit="emit('edit', item)"
        @delete="emit('delete', item)"
        @view="emit('showInfo', item)"
      >
        <template #info-icons>
          <!-- Icono de condición -->
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <div :class="[
              'w-3 h-3 rounded-full',
              item.condition === 'NEW' ? 'bg-green-500' : 
              item.condition === 'USED' ? 'bg-yellow-500' : 
              item.condition === 'REFURBISHED' ? 'bg-blue-500' : 'bg-gray-500'
            ]"></div>
          </div>

          <!-- Icono de precio -->
          <div v-if="item.price" class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <span class="text-sm font-bold text-green-600">€</span>
          </div>

          <!-- Icono de favorito -->
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <button
              @click.stop="emit('toggleFavorite', item._id)"
              :class="[
                'transition-colors',
                item.favorite 
                  ? 'text-yellow-400' 
                  : 'text-gray-400 opacity-60'
              ]"
              :title="item.favorite ? t('equipmentItems.removeFavorite') : t('equipmentItems.addFavorite')"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          </div>

          <!-- Icono de enlace externo si tiene sourceUrl -->
          <div v-if="item.sourceUrl" class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <a
              :href="item.sourceUrl"
              target="_blank"
              @click.stop
              class="text-blue-400 hover:text-blue-300 transition-colors"
              :title="t('equipmentItems.viewProduct')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </template>
      </CardGlassBase>
    </div>

    <!-- Modal selector de tipo -->
    <BaseModal
      :show="showTypeSelector"
      :title="t('equipmentItems.selectType')"
      @close="showTypeSelector = false"
    >
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="type in equipmentTypes"
          :key="type._id"
          @click="handleTypeSelect(type._id)"
          :class="[
            'group relative flex items-center gap-3 p-4 rounded-xl transition-all duration-300 backdrop-blur-sm',
            'border shadow-lg transform hover:scale-105 hover:shadow-xl',
            `bg-gradient-to-r ${getTypeColorClasses(type._id).gradient}`,
            `${getTypeColorClasses(type._id).border}`,
            `${getTypeColorClasses(type._id).hover}`,
            `${getTypeColorClasses(type._id).text}`
          ]"
        >
          <!-- Efecto de brillo en hover -->
          <div :class="[
            'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            `bg-gradient-to-r ${getTypeColorClasses(type._id).indicator}`
          ]"></div>
          
          <!-- Contenido del botón -->
          <div class="relative z-10 flex items-center gap-3">
            <span class="text-2xl filter drop-shadow-sm">{{ typeIcons[type._id] }}</span>
            <span class="text-sm font-semibold">{{ type.name }}</span>
          </div>
        </button>
      </div>
    </BaseModal>
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
