<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 2000
  },
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:show'])

watch(() => props.show, (newValue) => {
  if (newValue && props.duration > 0) {
    setTimeout(() => {
      emit('update:show', false)
    }, props.duration)
  }
})
</script>

<template>
  <Transition
    enter-active-class="transform transition-all duration-300 ease-out"
    enter-from-class="scale-95 opacity-0"
    enter-to-class="scale-100 opacity-100"
    leave-active-class="transform transition-all duration-300 ease-in"
    leave-from-class="scale-100 opacity-100"
    leave-to-class="scale-95 opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div class="px-8 py-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 text-lg font-medium transform transition-all duration-300 flex items-center space-x-3">
        <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>