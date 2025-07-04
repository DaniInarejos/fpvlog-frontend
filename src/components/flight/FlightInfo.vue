<script setup>
import { defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '../base/BaseModal.vue'

const { t } = useI18n()

const props = defineProps({
  flight: {
    type: Object,
    required: false,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDuration = (duration) => {
  if (!duration) return ''
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
</script>

<template>
  <BaseModal
    v-if="flight && show"
    :show="show"
    :title="flight.title || ''"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Imagen del vuelo -->
      <div v-if="flight.image" class="relative aspect-[4/3] overflow-hidden rounded-lg">
        <img
          :src="flight.image"
          :alt="flight.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Información básica -->
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('message.flights.details.drone') }}</h3>
          <dl class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('message.flights.details.date') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(flight.date) }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('message.flights.details.location') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ flight.location }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('message.flights.details.duration') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ formatDuration(flight.duration) }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('message.flights.details.batteryUsed') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ flight.batteryUsed }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('message.flights.details.weather') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ flight.weather || t('message.flights.details.notSpecified') }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('message.flights.details.likes') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ flight.likesCount || 0 }}</dd>
            </div>
          </dl>
        </div>

        <!-- Notas -->
        <div v-if="flight.notes">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('message.flights.details.notes') }}</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ flight.notes }}</p>
        </div>


      </div>
    </div>
  </BaseModal>
</template>