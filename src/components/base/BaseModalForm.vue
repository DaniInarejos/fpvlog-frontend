<script setup>
import { defineProps, defineEmits } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'lg',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  saveText: {
    type: String,
    default: 'Guardar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  }
})

const emit = defineEmits(['close', 'save'])
</script>

<template>
  <BaseModal
    :show="show"
    :title="title"
    :show-accept-button="false"
    :show-cancel-button="false"
  >
    <template #default>
      <div class="space-y-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
        <slot></slot>
        
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <BaseButton
            variant="secondary"
            @click="emit('close')"
            :disabled="loading"
          >
            {{ cancelText }}
          </BaseButton>
          <BaseButton
            variant="primary"
            @click="emit('save')"
            :loading="loading"
          >
            {{ saveText }}
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
:deep(.sm\:max-w-lg) {
  max-width: 90%;
}

:deep(.sm\:p-6) {
  padding: 1.5rem;
}

:deep(.sm\:my-8) {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>