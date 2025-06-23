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
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const sizeClasses = computed(() => ({
  'w-8 h-8': props.size === 'sm',
  'w-12 h-12': props.size === 'md',
  'w-16 h-16': props.size === 'lg',
  'w-24 h-24': props.size === 'xl'
}))

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
    return '/src/assets/images/placeholder.png'
  }
  return props.src
})
</script>

<template>
  <div
    :class="[sizeClasses, 'relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700']"
  >
    <img
      :src="imageSrc"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="handleImageError"
    />
    <div
      v-if="imageError && !props.src"
      class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium"
    >
      {{ initials }}
    </div>
  </div>
</template>