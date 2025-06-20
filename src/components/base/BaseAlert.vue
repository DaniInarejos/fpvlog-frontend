<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const alertClasses = computed(() => ({
  'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200': props.type === 'info',
  'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200': props.type === 'success',
  'bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': props.type === 'warning',
  'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200': props.type === 'error'
}))
</script>

<template>
  <div
    class="rounded-lg p-4 mb-4 flex items-center justify-between"
    :class="alertClasses"
    role="alert"
  >
    <div class="flex items-center">
      <slot />
    </div>
    <button
      v-if="dismissible"
      @click="emit('close')"
      class="ml-4 text-current hover:opacity-75 focus:outline-none"
      aria-label="Cerrar"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>