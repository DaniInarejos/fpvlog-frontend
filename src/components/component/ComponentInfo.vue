<script setup>
import { defineProps, defineEmits } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  component: {
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

const componentIcons = {
  FRAME: '🧩',
  MOTOR: '⚙️',
  FC: '🧠',
  ESC: '🔌',
  VTX: '📡',
  CAMERA: '📷',
  ANTENNA: '📶',
  RECEIVER: '📥',
  BATTERY: '🔋',
  PROPS: '🪶',
  MOUNT: '🗜️',
  OTHER: '🧰'
}
</script>

<template>
  <BaseModal
    v-if="component && show"
    :show="show"
    :title="component.name || ''"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Información básica -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">{{ componentIcons[component.type] }}</span>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            <a 
              v-if="component.sourceUrl"
              :href="component.sourceUrl"
              target="_blank"
              class="hover:text-primary-600 transition-colors"
            >
              {{ component.name }}
            </a>
            <span v-else>{{ component.name }}</span>
          </h3>
        </div>

        <dl class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex justify-between sm:block">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('message.components.form.brand') }}</dt>
            <dd class="text-sm text-gray-900 dark:text-gray-100">{{ component.brand || '-' }}</dd>
          </div>
          <div class="flex justify-between sm:block">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('message.components.form.weight') }}</dt>
            <dd class="text-sm text-gray-900 dark:text-gray-100">{{ component.weightGrams ? `${component.weightGrams}g` : '-' }}</dd>
          </div>
          <div v-if="component.sourceUrl" class="flex justify-between sm:block">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('message.components.form.sourceUrl') }}</dt>
            <dd class="text-sm text-gray-900 dark:text-gray-100">
              <a 
                :href="component.sourceUrl" 
                target="_blank"
                class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {{ t('message.common.viewSource') }}
              </a>
            </dd>
          </div>
        </dl>

        <!-- Descripción -->
        <div v-if="component.description">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('message.components.form.description') }}</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ component.description }}</p>
        </div>
      </div>
    </div>
  </BaseModal>
</template>