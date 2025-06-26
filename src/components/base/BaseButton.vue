<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

const buttonClasses = computed(() => ({
  'bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600': props.variant === 'primary',
  'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600': props.variant === 'secondary',
  'bg-red-600 text-white hover:bg-red-500': props.variant === 'danger',
  'bg-green-600 text-white hover:bg-green-500': props.variant === 'success',
  'px-3 py-1.5 text-sm': props.size === 'sm',
  'px-6 py-3 text-base': props.size === 'lg',
  'opacity-50 cursor-not-allowed': props.disabled || props.loading
}))
</script>

<template>
  <button
    :type="type"
    :class="[
      buttonClasses,
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300',
      'px-4 py-2 text-sm max-w-[200px]',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:translate-y-[-2px]',
      'backdrop-blur-sm',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400',
    ]"
    :disabled="disabled || loading"
  >
    <slot></slot>
  </button>
</template>
