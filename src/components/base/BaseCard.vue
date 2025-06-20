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
  'hover:shadow-lg transition-shadow duration-300': props.hover
}))
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md" :class="cardClasses">
    <slot />
  </div>
</template>