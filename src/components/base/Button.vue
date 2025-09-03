<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
      'rounded-xl px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
      variant === 'primary' && 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg',
      variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:opacity-90 shadow-lg',
      variant === 'ghost' && 'bg-transparent text-foreground hover:bg-card/60',
      variant === 'outline' && 'bg-transparent text-foreground border border-border hover:bg-card/60',
      size === 'sm' && 'px-3 py-1.5 text-sm',
      size === 'lg' && 'px-6 py-3 text-lg',
      disabled && 'opacity-60 pointer-events-none',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>