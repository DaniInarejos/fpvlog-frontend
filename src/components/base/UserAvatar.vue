<script setup>
import { computed, ref } from 'vue'

const imageError = ref(false)

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Usuario' // Valor por defecto para alt
  },
  size: {
    type: [String, Number], // Permitir números también
    default: 'md',
    validator: (value) => {
      if (typeof value === 'number') return true
      return ['sm', 'md', 'lg', 'xl'].includes(value)
    }
  }
})

const sizeClasses = computed(() => {
  if (typeof props.size === 'number') {
    return { [`w-${props.size} h-${props.size}`]: true }
  }
  return {
    'w-8 h-8': props.size === 'sm',
    'w-12 h-12': props.size === 'md',
    'w-16 h-16': props.size === 'lg',
    'w-24 h-24': props.size === 'xl'
  }
})

const initials = computed(() => {
  return props.alt
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const handleImageError = () => {
  imageError.value = true
}

const imageSrc = computed(() => {
  if (!props.src || imageError.value) {
    return '/assets/placeholder.png' // Imagen por defecto
  }
  return props.src
})
</script>

<template>
  <div
    :class="[sizeClasses, 'relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700']">
    <img
      :src="imageSrc"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="handleImageError"
    />
    <div
      v-if="imageError || !props.src"
      class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800"
    >
      {{ initials }}
    </div>
  </div>
</template>