<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'normal',
    validator: (value) => ['none', 'normal', 'large'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => ({
  'p-0': props.padding === 'none',
  'p-4': props.padding === 'normal',
  'p-6': props.padding === 'large',
  'hover:scale-[1.02] hover:shadow-2xl': props.hover
}))
</script>

<template>
  <div
    class="backdrop-blur-md bg-blue-50/80 dark:bg-gray-800/30 rounded-lg shadow-xl border border-blue-200/30 dark:border-gray-700/20 overflow-hidden transition-all duration-300 hover:bg-blue-50/90 hover:border-blue-300/40"
    :class="cardClasses"
  >
    <slot></slot>
  </div>
</template>