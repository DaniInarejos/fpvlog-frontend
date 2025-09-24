<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

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

const emit = defineEmits(['close'])
const { t } = useI18n()

const typeIcons = {
  DRONE: '🚁',
  RADIO: '🎮',
  GOGGLES: '🥽',
  BATTERY: '🔋',
  CHARGER: '🔌',
  OTHERS: '📋'
}

const conditionColors = {
  NEW: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  USED: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  REFURBISHED: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
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
  <!-- Overlay -->
  <Teleport to="body">
    <div
      v-if="show && equipmentItem"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="emit('close')"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <!-- Modal -->
      <div class="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <!-- Glass container -->
        <div class="bg-gradient-to-br from-white/95 via-white/90 to-white/80 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
          
          <!-- Close button -->
          <button
            @click="emit('close')"
            class="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Content -->
          <div class="flex flex-col lg:flex-row max-h-[90vh] overflow-hidden">
            
            <!-- Image section -->
            <div class="lg:w-1/2 relative">
              <div v-if="equipmentItem.image" class="h-64 lg:h-full">
                <img
                  :src="equipmentItem.image"
                  :alt="equipmentItem.name"
                  class="w-full h-full object-cover"
                />
                <!-- Gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/10"></div>
              </div>
              <div v-else class="h-64 lg:h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div class="text-center">
                  <span class="text-8xl mb-4 block opacity-50">{{ typeIcons[equipmentItem.type] }}</span>
                  <p class="text-gray-500 dark:text-gray-400 text-lg">{{ t('equipmentItems.noImage') }}</p>
                </div>
              </div>
            </div>

            <!-- Info section -->
            <div class="lg:w-1/2 p-8 overflow-y-auto">
              
              <!-- Header -->
              <div class="mb-8">
                <div class="flex items-start gap-4 mb-4">
                  <span class="text-5xl">{{ typeIcons[equipmentItem.type] }}</span>
                  <div class="flex-1">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {{ equipmentItem.name }}
                    </h1>
                    <div class="flex items-center gap-3">
                      <span class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {{ equipmentItem.type ? t(`equipmentItems.types.${equipmentItem.type.toLowerCase()}`) : '-' }}
                      </span>
                      <span v-if="equipmentItem.favorite" class="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 flex items-center gap-1">
                        ⭐ {{ t('equipmentItems.favorite') }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Condition badge -->
                <div v-if="equipmentItem.condition" class="inline-flex">
                  <span :class="[
                    'px-4 py-2 rounded-xl text-sm font-semibold border',
                    conditionColors[equipmentItem.condition]
                  ]">
                    {{ equipmentItem.condition ? t(`equipmentItems.conditions.${equipmentItem.condition.toLowerCase()}`) : '-' }}
                  </span>
                </div>
              </div>

              <!-- Details grid -->
              <div class="space-y-6">
                
                <!-- Basic info -->
                <div v-if="equipmentItem.brand || equipmentItem.model" class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {{ t('equipmentItems.form.brandModel') }}
                  </h3>
                  <p class="text-xl text-gray-700 dark:text-gray-300">
                    {{ [equipmentItem.brand, equipmentItem.model].filter(Boolean).join(' ') }}
                  </p>
                </div>

                <!-- Price -->
                <div v-if="equipmentItem.price" class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    {{ t('equipmentItems.form.price') }}
                  </h3>
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                    {{ formatPrice(equipmentItem.price, equipmentItem.currency) }}
                  </p>
                </div>

                <!-- Purchase date -->
                <div v-if="equipmentItem.purchaseDate" class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                    {{ t('equipmentItems.form.purchaseDate') }}
                  </h3>
                  <p class="text-lg text-gray-700 dark:text-gray-300">
                    {{ formatDate(equipmentItem.purchaseDate) }}
                  </p>
                </div>

                <!-- Serial number -->
                <div v-if="equipmentItem.serialNumber" class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
                    {{ t('equipmentItems.form.serialNumber') }}
                  </h3>
                  <p class="text-lg font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {{ equipmentItem.serialNumber }}
                  </p>
                </div>

                <!-- Warranty -->
                <div v-if="equipmentItem.warrantyExpiration" class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                    {{ t('equipmentItems.form.warranty') }}
                  </h3>
                  <div v-if="warrantyStatus">
                    <p :class="['text-lg font-semibold', warrantyStatus.class]">
                      {{ warrantyStatus.text }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {{ formatDate(equipmentItem.warrantyExpiration) }}
                    </p>
                  </div>
                </div>

                <!-- Description -->
                <div v-if="equipmentItem.notes" class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    {{ t('equipmentItems.form.notes') }}
                  </h3>
                  <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {{ equipmentItem.notes }}
                  </p>
                </div>

                <!-- Product link -->
                <div v-if="equipmentItem.productLink" class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span class="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    {{ t('equipmentItems.form.productLink') }}
                  </h3>
                  <a
                    :href="equipmentItem.productLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <span>{{ t('equipmentItems.viewProduct') }}</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <!-- Metadata -->
                <div class="bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl p-6 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/20">
                  <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    {{ t('equipmentItems.metadata') }}
                  </h3>
                  <div class="grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div class="flex justify-between">
                      <span>{{ t('common.createdAt') }}:</span>
                      <span>{{ formatDateTime(equipmentItem.createdAt) }}</span>
                    </div>
                    <div v-if="equipmentItem.updatedAt !== equipmentItem.createdAt" class="flex justify-between">
                      <span>{{ t('common.updatedAt') }}:</span>
                      <span>{{ formatDateTime(equipmentItem.updatedAt) }}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
