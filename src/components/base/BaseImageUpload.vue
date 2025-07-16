<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UserAvatar from './UserAvatar.vue'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'xl',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'file-selected'])

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  emit('file-selected', file)
  
  // Create a temporary URL for preview
  const imageUrl = URL.createObjectURL(file)
  emit('update:modelValue', imageUrl)
}
</script>

<template>
  <div class="relative group">
    <UserAvatar
      :src="modelValue"
      :alt="alt"
      :size="size"
      class="mx-auto ring-4 ring-sky-500/30 transition-transform duration-300 group-hover:scale-105"
    />
    <label class="absolute bottom-0 left-1/2 -translate-x-1/2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
      <input
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileUpload"
      >
      {{ t('profile.uploadPhoto') }}
    </label>
  </div>
</template>