<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
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
      <BaseCard
        v-for="item in filteredEquipmentItems"
        :key="item._id"
        class="relative overflow-hidden hover:shadow-lg transition-shadow duration-200"
      >
        <div class="p-4">
          <!-- Header con icono y botón de favorito -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ typeIcons[item.type] }}</span>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ item.type ? t(`equipmentItems.types.${item.type.toLowerCase()}`) : '-' }}
                </p>
              </div>
            </div>

            <!-- Botón de favorito -->
            <button
              @click="emit('toggleFavorite', item._id)"
              :class="[
                'p-1 rounded-full transition-colors',
                item.favorite 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : 'text-gray-400 hover:text-yellow-500'
              ]"
              :title="item.favorite ? t('equipmentItems.removeFavorite') : t('equipmentItems.addFavorite')"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          </div>

          <!-- Información del item -->
          <div class="space-y-2 mb-4">
            <div v-if="item.brand || item.model" class="flex items-center gap-2 text-sm">
              <span class="text-gray-500 dark:text-gray-400">{{ t('equipmentItems.form.brand') }}:</span>
              <span class="text-gray-900 dark:text-gray-100">
                {{ [item.brand, item.model].filter(Boolean).join(' ') }}
              </span>
            </div>

            <div v-if="item.price" class="flex items-center gap-2 text-sm">
              <span class="text-gray-500 dark:text-gray-400">{{ t('equipmentItems.form.price') }}:</span>
              <span class="text-gray-900 dark:text-gray-100 font-medium">
                {{ formatPrice(item.price, item.currency) }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <span class="text-gray-500 dark:text-gray-400">{{ t('equipmentItems.form.condition') }}:</span>
              <span :class="conditionColors[item.condition]">
                {{ item.condition ? t(`equipmentItems.conditions.${item.condition.toLowerCase()}`) : '-' }}
              </span>
            </div>

            <div v-if="item.purchaseDate" class="flex items-center gap-2 text-sm">
              <span class="text-gray-500 dark:text-gray-400">{{ t('equipmentItems.form.purchaseDate') }}:</span>
              <span class="text-gray-900 dark:text-gray-100">
                {{ formatDate(item.purchaseDate) }}
              </span>
            </div>
          </div>

          <!-- Descripción -->
          <div v-if="item.notes" class="mb-4">
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {{ item.notes }}
            </p>
          </div>

          <!-- Enlaces y acciones -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <a
                v-if="item.sourceUrl"
                :href="item.sourceUrl"
                target="_blank"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {{ t('equipmentItems.viewProduct') }}
              </a>
            </div>

            <div class="flex items-center gap-1">
              <BaseButton
                variant="ghost"
                size="sm"
                @click="emit('showInfo', item)"
                :title="t('common.viewDetails')"
              >
                👁️
              </BaseButton>
              
              <BaseButton
                variant="ghost"
                size="sm"
                @click="emit('edit', item)"
                :title="t('common.edit')"
              >
                ✏️
              </BaseButton>
              
              <BaseButton
                variant="ghost"
                size="sm"
                @click="emit('delete', item)"
                :title="t('common.delete')"
                class="text-red-600 hover:text-red-700"
              >
                🗑️
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseCard>
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
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span class="text-2xl">{{ typeIcons[type._id] }}</span>
          <span class="text-sm font-medium">{{ type.name }}</span>
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
