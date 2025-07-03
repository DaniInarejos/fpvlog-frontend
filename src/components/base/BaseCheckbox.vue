<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: true
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex items-center">
    <input
      type="checkbox"
      :checked="modelValue"
      @input="$emit('update:modelValue', $event.target.checked)"
      class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
    />
    <span class="ml-2">{{ label }}</span>
    <span v-if="error" class="text-red-500 text-sm ml-2">{{ error }}</span>
  </div>
</template>