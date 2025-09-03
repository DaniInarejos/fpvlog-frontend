<template>
  <div :class="[
    'bg-card border border-border rounded-2xl shadow-lg/20 transition-all duration-200',
    padding && 'p-4',
    hover && 'hover:shadow-lg hover:border-primary/20'
  ]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  padding: {
    type: Boolean,
    default: true
  },
  hover: {
    type: Boolean,
    default: false
  }
})
</script>