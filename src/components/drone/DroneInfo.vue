<script setup>
import { defineProps, defineEmits } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  drone: {
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
</script>

<template>
  <BaseModal
    v-if="drone && show"
    :show="show"
    :title="drone.name || ''"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Imagen del drone -->
      <div class="relative aspect-[4/3] overflow-hidden rounded-lg">
        <img
          :src="drone.image || '/images/placeholder.png'"
          :alt="drone.name || ''"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Información básica -->
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900">{{ t('drones.description') }}</h3>
          <dl class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500">{{ t('drones.form.brand') }}</dt>
              <dd class="text-sm text-gray-900">{{ drone.brand?.name || '-' }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500">{{ t('drones.form.model') }}</dt>
              <dd class="text-sm text-gray-900">{{ drone.model || '-' }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500">{{ t('drones.form.weight') }}</dt>
              <dd class="text-sm text-gray-900">{{ drone.weight ? `${drone.weight}g` : '-' }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500">{{ t('drones.form.frame') }}</dt>
              <dd class="text-sm text-gray-900">{{ drone.frameSize ? `${drone.frameSize}mm` : '-' }}</dd>
            </div>
          </dl>
        </div>

        <!-- Descripción -->
        <div v-if="drone.description">
          <h3 class="text-lg font-medium text-gray-900">{{ t('drones.description') }}</h3>
          <p class="mt-2 text-sm text-gray-500">{{ drone.description }}</p>
        </div>

        <!-- Estadísticas -->
        <div class="flex items-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {{ drone.likesCount || 0 }} {{ t('common.likes') }}
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>