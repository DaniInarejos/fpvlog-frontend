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
  'btn-primary': props.variant === 'primary',
  'btn-secondary': props.variant === 'secondary',
  'btn-danger': props.variant === 'danger',
  'btn-success': props.variant === 'success',
  'btn-sm': props.size === 'sm',
  'btn-lg': props.size === 'lg',
  'opacity-50 cursor-not-allowed': props.disabled || props.loading
}))
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200',
      'text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-95 active:shadow-inner',
      'touch-manipulation select-none',
      'focus:ring-primary-500 dark:focus:ring-primary-400'
    ]"
    :disabled="disabled || loading"
  >
    <slot></slot>
  </button>
</template>