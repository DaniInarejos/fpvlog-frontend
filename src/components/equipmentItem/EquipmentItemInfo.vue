<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  equipmentItem: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'edit', 'delete'])
const { t } = useI18n()

const typeIcons = {
  DRONE: '🚁',
  RADIO: '📡',
  GOGGLES: '🥽',
  BATTERY: '🔋',
  CHARGER: '🔌',
  OTHERS: '📋'
}

const conditionColors = {
  NEW: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  USED: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  REFURBISHED: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
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
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('es-ES')
}

const warrantyStatus = computed(() => {
  if (!props.equipmentItem?.warrantyExpiration) return null
  
  const now = new Date()
  const expiration = new Date(props.equipmentItem.warrantyExpiration)
  const daysLeft = Math.ceil((expiration - now) / (1000 * 60 * 60 * 24))
  
  if (daysLeft < 0) {
    return { status: 'expired', text: t('equipmentItems.warranty.expired'), class: 'text-red-600' }
  } else if (daysLeft <= 30) {
    return { status: 'expiring', text: t('equipmentItems.warranty.expiringSoon', { days: daysLeft }), class: 'text-yellow-600' }
  } else {
    return { status: 'valid', text: t('equipmentItems.warranty.valid', { days: daysLeft }), class: 'text-green-600' }
  }
})
</script>

<template>
  <BaseModal
    :show="show"
    :title="equipmentItem?.name || t('equipmentItems.itemDetails')"
    size="lg"
    @close="emit('close')"
  >
    <div v-if="equipmentItem" class="space-y-6">
      <!-- Header con icono y categoría -->
      <div class="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <span class="text-4xl">{{ typeIcons[equipmentItem.type] }}</span>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ equipmentItem.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t(`equipmentItems.types.${equipmentItem.type.toLowerCase()}`) }}
            </p>
          </div>
        </div>
        
        <!-- Estado de favorito -->
        <div v-if="equipmentItem.favorite" class="ml-auto">
          <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            ⭐ {{ t('equipmentItems.favorite') }}
          </span>
        </div>
      </div>

      <!-- Información básica -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Columna izquierda -->
        <div class="space-y-4">
          <div v-if="equipmentItem.brand || equipmentItem.model">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('equipmentItems.form.brandModel') }}
            </h3>
            <p class="mt-1 text-gray-900 dark:text-gray-100">
              {{ [equipmentItem.brand, equipmentItem.model].filter(Boolean).join(' ') }}
            </p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('equipmentItems.form.condition') }}
            </h3>
            <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-1', conditionColors[equipmentItem.condition]]">
              {{ t(`equipmentItems.conditions.${equipmentItem.condition.toLowerCase()}`) }}
            </span>
          </div>

          <div v-if="equipmentItem.price">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('equipmentItems.form.price') }}
            </h3>
            <p class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ formatPrice(equipmentItem.price, equipmentItem.currency) }}
            </p>
          </div>

          <div v-if="equipmentItem.purchaseDate">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('equipmentItems.form.purchaseDate') }}
            </h3>
            <p class="mt-1 text-gray-900 dark:text-gray-100">
              {{ formatDate(equipmentItem.purchaseDate) }}
            </p>
          </div>
        </div>

        <!-- Columna derecha -->
        <div class="space-y-4">
          <div v-if="equipmentItem.serialNumber">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('equipmentItems.form.serialNumber') }}
            </h3>
            <p class="mt-1 text-gray-900 dark:text-gray-100 font-mono text-sm">
              {{ equipmentItem.serialNumber }}
            </p>
          </div>

          <div v-if="equipmentItem.warrantyExpiration">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('equipmentItems.form.warranty') }}
            </h3>
            <div class="mt-1">
              <p class="text-gray-900 dark:text-gray-100">
                {{ formatDate(equipmentItem.warrantyExpiration) }}
              </p>
              <p v-if="warrantyStatus" :class="['text-sm mt-1', warrantyStatus.class]">
                {{ warrantyStatus.text }}
              </p>
            </div>
          </div>

          <div v-if="equipmentItem.location">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('equipmentItems.form.location') }}
            </h3>
            <p class="mt-1 text-gray-900 dark:text-gray-100">
              {{ equipmentItem.location }}
            </p>
          </div>

          <div v-if="equipmentItem.sourceUrl">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('equipmentItems.form.sourceUrl') }}
            </h3>
            <a
              :href="equipmentItem.sourceUrl"
              target="_blank"
              class="mt-1 inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm"
            >
              {{ t('equipmentItems.viewProduct') }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Descripción -->
      <div v-if="equipmentItem.description">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          {{ t('equipmentItems.form.description') }}
        </h3>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p class="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
            {{ equipmentItem.description }}
          </p>
        </div>
      </div>

      <!-- Notas -->
      <div v-if="equipmentItem.notes">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          {{ t('equipmentItems.form.notes') }}
        </h3>
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p class="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
            {{ equipmentItem.notes }}
          </p>
        </div>
      </div>

      <!-- Metadatos -->
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div>
            <span class="font-medium">{{ t('common.createdAt') }}:</span>
            {{ formatDateTime(equipmentItem.createdAt) }}
          </div>
          <div v-if="equipmentItem.updatedAt !== equipmentItem.createdAt">
            <span class="font-medium">{{ t('common.updatedAt') }}:</span>
            {{ formatDateTime(equipmentItem.updatedAt) }}
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <BaseButton
          variant="outline"
          @click="emit('edit', equipmentItem)"
        >
          {{ t('common.edit') }}
        </BaseButton>
        
        <BaseButton
          variant="outline"
          @click="emit('delete', equipmentItem)"
          class="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
        >
          {{ t('common.delete') }}
        </BaseButton>
        
        <BaseButton
          @click="emit('close')"
        >
          {{ t('common.close') }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>