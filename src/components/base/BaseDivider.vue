<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="flex items-center justify-center my-8 w-full max-w-2xl mx-auto">
    <div class="flex-grow h-[1px] bg-gray-200 max-w-[200px]"></div>
    <span class="px-6 text-sm font-medium text-gray-500">{{ title }}</span>
    <div class="flex-grow h-[1px] bg-gray-200 max-w-[200px]"></div>
  </div>
</template>